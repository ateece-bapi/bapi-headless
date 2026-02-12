import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import logger from '@/lib/logger';
import { sendChatHandoffNotification } from '@/lib/email';
import { requireAdmin } from '@/lib/auth/server';

/**
 * Chat Human Handoff API
 *
 * Handles requests to connect users with BAPI team members when AI can't help.
 * Stores handoff requests and sends notifications to appropriate team members.
 */

interface HandoffRequest {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  topic: 'technical' | 'sales' | 'quote' | 'other';
  message: string;
  conversationContext?: string; // Optional chat history summary
  language: string;
  status: 'pending' | 'contacted' | 'resolved';
}

const HANDOFF_FILE = path.join(process.cwd(), 'data', 'chat-handoffs.json');

/**
 * Ensures handoff data file exists
 */
async function ensureHandoffFile() {
  try {
    await fs.mkdir(path.dirname(HANDOFF_FILE), { recursive: true });
    try {
      await fs.access(HANDOFF_FILE);
    } catch {
      await fs.writeFile(HANDOFF_FILE, JSON.stringify({ handoffs: [] }, null, 2));
    }
  } catch (error) {
    logger.error('Failed to ensure handoff file', error);
  }
}

/**
 * Reads all handoff requests
 */
async function readHandoffs(): Promise<HandoffRequest[]> {
  try {
    await ensureHandoffFile();
    const content = await fs.readFile(HANDOFF_FILE, 'utf8');
    const data = JSON.parse(content);
    return data.handoffs || [];
  } catch (error) {
    logger.error('Failed to read handoffs', error);
    return [];
  }
}

/**
 * Writes handoff requests
 */
async function writeHandoffs(handoffs: HandoffRequest[]): Promise<void> {
  try {
    await ensureHandoffFile();
    await fs.writeFile(HANDOFF_FILE, JSON.stringify({ handoffs }, null, 2), 'utf8');
  } catch (error) {
    logger.error('Failed to write handoffs', error);
    throw error;
  }
}

/**
 * Sends email notification to appropriate team member
 */
async function notifyTeam(handoff: HandoffRequest, testRecipient?: string): Promise<void> {
  try {
    // Determine urgency based on topic
    const urgency =
      handoff.topic === 'sales' || handoff.topic === 'quote'
        ? 'high'
        : handoff.topic === 'technical'
          ? 'medium'
          : 'low';

    // Parse conversation context into chat messages
    // Expecting format like: "User: Hello\nAssistant: Hi there\n..." or JSON array
    let chatMessages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }> =
      [];

    if (handoff.conversationContext) {
      try {
        // Try parsing as JSON first
        const parsed = JSON.parse(handoff.conversationContext);
        if (Array.isArray(parsed)) {
          chatMessages = parsed.map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: msg.timestamp || new Date().toISOString(),
          }));
        }
      } catch {
        // Fall back to plain text parsing
        const lines = handoff.conversationContext.split('\n').filter((line) => line.trim());
        const now = new Date();
        chatMessages = lines.map((line, index) => {
          const match = line.match(/^(User|Assistant|AI):\s*(.+)$/);
          if (match) {
            return {
              role: (match[1].toLowerCase() === 'user' ? 'user' : 'assistant') as
                | 'user'
                | 'assistant',
              content: match[2],
              timestamp: new Date(now.getTime() - (lines.length - index) * 60000).toISOString(),
            };
          }
          return {
            role: 'user' as const,
            content: line,
            timestamp: new Date(now.getTime() - (lines.length - index) * 60000).toISOString(),
          };
        });
      }
    }

    // Send email notification
    const result = await sendChatHandoffNotification({
      recipientEmail: testRecipient || getTeamEmail(handoff.topic),
      customerName: handoff.name,
      customerEmail: handoff.email,
      customerPhone: handoff.phone,
      requestedTopic: handoff.topic,
      urgency,
      chatTranscript: chatMessages,
    });

    if (result.success) {
      logger.info('Chat handoff email sent', {
        handoffId: handoff.id,
        messageId: result.messageId,
        to: getTeamEmail(handoff.topic),
        topic: handoff.topic,
      });
    } else {
      logger.error('Chat handoff email failed', {
        handoffId: handoff.id,
        error: result.error,
      });
    }
  } catch (error) {
    logger.error('Failed to send handoff notification', error);
    // Don't throw - we don't want email failure to block handoff storage
  }
}

/**
 * Gets appropriate team email based on topic
 */
function getTeamEmail(topic: string): string {
  switch (topic) {
    case 'technical':
      return 'support@bapihvac.com';
    case 'sales':
      return 'sales@bapihvac.com';
    case 'quote':
      return 'sales@bapihvac.com';
    default:
      return 'info@bapihvac.com';
  }
}

/**
 * POST - Submit handoff request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, topic, message, conversationContext, language, _testRecipient } =
      body;

    // Validation
    if (!name || !email || !topic || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, topic, message' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Create handoff request
    const handoff: HandoffRequest = {
      id: `handoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      topic: topic as HandoffRequest['topic'],
      message: message.trim(),
      conversationContext: conversationContext?.trim(),
      language: language || 'en',
      status: 'pending',
    };

    // Save handoff
    const handoffs = await readHandoffs();
    handoffs.push(handoff);
    await writeHandoffs(handoffs);

    // Send notification to team (use test recipient if provided)
    await notifyTeam(handoff, _testRecipient);

    return NextResponse.json({
      success: true,
      handoffId: handoff.id,
      message: 'Your request has been submitted. A team member will contact you within 24 hours.',
    });
  } catch (error) {
    logger.error('Handoff API Error', error);
    return NextResponse.json({ error: 'Failed to submit handoff request' }, { status: 500 });
  }
}

/**
 * GET - Retrieve handoff requests (admin only)
 * Requires admin role (administrator or shop_manager)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    const handoffs = await readHandoffs();

    // Sort by timestamp (newest first)
    const sorted = handoffs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ handoffs: sorted });
  } catch (error) {
    // Handle authorization errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (errorMessage.includes('Forbidden')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    logger.error('Handoff GET Error', error);
    return NextResponse.json({ error: 'Failed to retrieve handoffs' }, { status: 500 });
  }
}
