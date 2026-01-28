import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * BAPI AI Assistant - Technical Product Support Chatbot
 * 
 * Powered by Claude 3.5 Sonnet for accurate technical responses
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

**Languages:**
You can respond in: English, German, French, Spanish, Japanese, Chinese, Vietnamese, Arabic.
Detect the user's language and respond in the same language.`;

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not found in environment variables');
      return NextResponse.json(
        {
          error: 'Configuration error',
          message: 'AI service is not properly configured. Please contact support.',
        },
        { status: 500 }
      );
    }

    const { messages, locale } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    // Add locale hint to system prompt if provided
    const systemPrompt = locale
      ? `${SYSTEM_PROMPT}\n\n**User's Language:** ${locale.toUpperCase()} - Respond in this language.`
      : SYSTEM_PROMPT;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    });

    // Extract text response
    const assistantMessage = response.content.find((block) => block.type === 'text');
    const text = assistantMessage?.type === 'text' ? assistantMessage.text : '';

    return NextResponse.json({
      message: text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);

    // Handle Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: 'AI service error',
          message: 'Unable to process your request. Please try again.',
          details: error.message,
        },
        { status: error.status || 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.',
      },
      { status: 500 }
    );
  }
}
