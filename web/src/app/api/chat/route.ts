import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { searchProducts, formatProductsForAI } from '@/lib/chat/productSearch';
import { logChatAnalytics, type ChatAnalytics } from '@/lib/chat/analytics';
import { randomUUID } from 'crypto';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { RATE_LIMITS } from '@/lib/constants/rate-limits';
import { cookies } from 'next/headers';
import { GET_CURRENT_USER_QUERY, type GetCurrentUserResponse } from '@/lib/auth/queries';
import { slugifyArray } from '@/lib/utils/slugify';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';

/**
 * Get authenticated user's customer group from JWT token
 * Returns null if not authenticated or no customer group
 */
async function getUserCustomerGroups(): Promise<string[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return ['end-user'];

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: GET_CURRENT_USER_QUERY,
      }),
    });

    const { data }: { data: GetCurrentUserResponse } = await response.json();
    
    // Process customer groups from ACF fields (customerInformation.customerGroup1/2/3)
    // Schema: These are LIST types (arrays of strings)
    // Then slugify to match WordPress taxonomy slugs ("END USER" → "end-user")
    const customerInfo = data?.viewer?.customerInformation;
    const rawGroups = [
      ...(customerInfo?.customerGroup1 || []),
      ...(customerInfo?.customerGroup2 || []),
      ...(customerInfo?.customerGroup3 || []),
    ]
      .filter((group): group is string => typeof group === 'string')
      .map((group) => group.trim())
      .filter((group) => group.length > 0 && group.toUpperCase() !== 'NO ACCESS');
    
    // Slugify groups to match taxonomy slugs
    const slugifiedGroups = slugifyArray(rawGroups);
    
    return slugifiedGroups.length > 0 ? slugifiedGroups : ['end-user'];
  } catch (error) {
    logger.debug('Failed to get user customer groups', { error });
    return ['end-user'];
  }
}

/**
 * BAPI AI Assistant - Technical Product Support Chatbot
 *
 * Powered by Claude Haiku 4.5 for accurate technical responses
 * about BAPI's 600+ HVAC sensors and building automation products.
 */

const SYSTEM_PROMPT = `You are BAPI's AI technical assistant, an expert in HVAC sensors and building automation products.

**Company Context:**
BAPI (Building Automation Products, Inc.) manufactures 600+ precision sensors for HVAC and building automation systems:
- Temperature sensors (室内/室外/风道/浸入式)
- Humidity sensors (relative humidity, humidistats)
- Pressure sensors (differential pressure, static pressure)
- CO2 sensors (IAQ monitoring)
- Current sensors (electrical monitoring)
- Wireless sensors (BACnet MS/TP, Modbus, ZigBee)

**Your Role:**
1. Answer technical questions about BAPI products
2. Help customers find the right sensor for their application
3. Provide installation guidance and specifications
4. Recommend products based on requirements (temperature range, accuracy, protocol, environment)
5. Explain technical concepts clearly for both engineers and facility managers

**Guidelines:**
- Be precise with technical specifications
- Ask clarifying questions when requirements are unclear
- Reference specific product models when appropriate
- Explain "why" behind recommendations
- Use metric or imperial units based on customer preference
- If unsure, say so and offer to connect with technical support
- Never recommend products outside BAPI's catalog

**Safety-Critical Context:**
BAPI products are used in mission-critical environments (hospitals, cleanrooms, data centers). Always prioritize accuracy and safety in recommendations.

**Product Search:**
When users ask about specific products or need recommendations, use the search_products tool to find real BAPI products from the catalog. 

**IMPORTANT - Always include product links:**
- When recommending products, ALWAYS include clickable links using markdown format: [Product Name](/products/slug)
- Example: "I recommend the [BAPI-Stat Zone Temp Sensor](/product/bapi-stat-zone) for cleanrooms"
- Make it easy for users to view full specifications by clicking the link
- Format as: [Product Name](URL) - NOT just "view at URL"

**Languages:**
You can respond in: English, German, French, Spanish, Japanese, Chinese, Vietnamese, Arabic, Thai, Polish.
Detect the user's language and respond in the same language.`;

// Define tools for Claude to use
const tools: Anthropic.Tool[] = [
  {
    name: 'search_products',
    description:
      'Search BAPI product catalog for sensors and building automation products. Use this when users ask about specific product types, applications, or need recommendations.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Search query (e.g., "temperature sensor", "CO2", "humidity", "cleanroom", "pressure transducer")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of products to return (default: 5)',
          default: 5,
        },
      },
      required: ['query'],
    },
  },
];

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const conversationId = randomUUID();
  const toolsUsed: string[] = [];
  const productsRecommended: string[] = [];

  // --- Pre-flight checks (non-streaming) ---
  const customerGroups = await getUserCustomerGroups();

  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(clientIP, RATE_LIMITS.CHAT_API);

  if (!rateLimitResult.success) {
    logger.warn('Chat API rate limit exceeded', {
      ip: clientIP,
      limit: rateLimitResult.limit,
      reset: new Date(rateLimitResult.reset * 1000).toISOString(),
    });
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `Too many chat requests. Please try again in ${Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000)} seconds.`,
        retryAfter: Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
          'Retry-After': String(Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000)),
        },
      }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    logger.error('ANTHROPIC_API_KEY not found in environment variables');
    return NextResponse.json(
      { error: 'Configuration error', message: 'AI service is not properly configured. Please contact support.' },
      { status: 500 }
    );
  }

  let parsedBody: { messages?: unknown; locale?: string };
  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { messages, locale, pageContext } = parsedBody as {
    messages: unknown;
    locale?: string;
    pageContext?: string;
  };

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Invalid request: messages array required' }, { status: 400 });
  }

  const userMessage = (messages[messages.length - 1] as { content?: string })?.content || '';

  const systemPromptText = locale
    ? `${SYSTEM_PROMPT}\n\n**User's Language:** ${locale.toUpperCase()} - Respond in this language.`
    : SYSTEM_PROMPT;

  const systemPromptWithContext = pageContext
    ? `${systemPromptText}\n\n**Current Page:** User is viewing \`${pageContext}\` — tailor your response to this context if relevant.`
    : systemPromptText;

  // Cache the system prompt for 5 minutes — saves ~90% on repeated input token costs
  const systemPrompt: Anthropic.TextBlockParam[] = [
    { type: 'text', text: systemPromptWithContext, cache_control: { type: 'ephemeral' } },
  ];

  // --- Streaming response ---
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      try {
        let currentMessages: Anthropic.MessageParam[] = messages.map(
          (msg: { role: string; content: string }) => ({
            role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
            content: msg.content,
          })
        );

        // Tool-use loop: non-streaming passes resolve quickly; final text response streams
        const MAX_TOOL_ITERATIONS = 3;
        for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
          const apiStream = anthropic.messages.stream({
            model: 'claude-haiku-4-5',
            max_tokens: 1024,
            system: systemPrompt,
            tools,
            messages: currentMessages,
          });

          // Stream text tokens to client as they arrive
          for await (const event of apiStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta' &&
              event.delta.text
            ) {
              enqueue({ type: 'token', text: event.delta.text });
            }
          }

          const finalMessage = await apiStream.finalMessage();

          if (finalMessage.stop_reason !== 'tool_use') {
            // Done — log analytics and signal completion
            const fullText = finalMessage.content
              .filter((b): b is Anthropic.TextBlock => b.type === 'text')
              .map((b) => b.text)
              .join('');

            const responseTimeMs = Date.now() - startTime;
            const usage = finalMessage.usage as Anthropic.Usage & {
              cache_read_input_tokens?: number;
              cache_creation_input_tokens?: number;
            };
            const tokensUsed = usage.input_tokens + usage.output_tokens;
            const cacheHit = (usage.cache_read_input_tokens ?? 0) > 0;
            if (cacheHit) {
              logger.debug('Prompt cache hit', { cache_read_tokens: usage.cache_read_input_tokens });
            }

            const analytics: ChatAnalytics = {
              conversationId,
              timestamp: new Date().toISOString(),
              language: locale || 'en',
              userMessage,
              assistantResponse: fullText,
              productsRecommended: productsRecommended.length > 0 ? productsRecommended : undefined,
              toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
              tokensUsed,
              responseTimeMs,
            };
            logChatAnalytics(analytics).catch((err) => logger.error('Failed to log analytics', err));

            enqueue({ type: 'done', conversationId, usage: finalMessage.usage });
            break;
          }

          // Execute the tool call, then loop for the next streaming response
          const toolUse = finalMessage.content.find(
            (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
          );
          if (!toolUse) break;

          toolsUsed.push(toolUse.name);
          let toolResultContent = 'No results found.';

          if (toolUse.name === 'search_products') {
            const input = toolUse.input as { query: string; limit?: number };
            const products = await searchProducts(input.query, input.limit ?? 5, customerGroups);
            products.forEach((p) => { if (p.slug) productsRecommended.push(p.slug); });
            toolResultContent = formatProductsForAI(products);
          }

          currentMessages = [
            ...currentMessages,
            { role: 'assistant' as const, content: finalMessage.content },
            {
              role: 'user' as const,
              content: [{ type: 'tool_result' as const, tool_use_id: toolUse.id, content: toolResultContent }],
            },
          ];
        }
      } catch (error) {
        logger.error('Chat API Error', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack?.split('\n')[1]?.trim() : undefined,
        });

        if (error instanceof Anthropic.APIError) {
          logger.error('Anthropic API Error', { status: error.status, message: error.message });
          enqueue({ type: 'error', message: 'Unable to process your request. Please try again.' });
        } else {
          enqueue({ type: 'error', message: 'Something went wrong. Please try again later.' });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
