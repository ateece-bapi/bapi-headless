import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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
    console.error('Failed to ensure handoff file:', error);
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
    console.error('Failed to read handoffs:', error);
    return [];
  }
}

/**
 * Writes handoff requests
 */
async function writeHandoffs(handoffs: HandoffRequest[]): Promise<void> {
  try {
    await ensureHandoffFile();
    await fs.writeFile(
      HANDOFF_FILE,
      JSON.stringify({ handoffs }, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Failed to write handoffs:', error);
    throw error;
  }
}

/**
 * Sends email notification to appropriate team member
 * TODO: Implement actual email sending (SMTP/SES)
 */
async function notifyTeam(handoff: HandoffRequest): Promise<void> {
  // TODO: Implement email notification
  // For now, just log
  console.log('Handoff notification:', {
    to: getTeamEmail(handoff.topic),
    subject: `Chat Handoff: ${handoff.topic}`,
    from: handoff.email,
    name: handoff.name,
  });
  
  // Future: Use existing email service
  // await sendEmail({
  //   to: getTeamEmail(handoff.topic),
  //   subject: `Chat Handoff Request - ${handoff.topic}`,
  //   html: generateHandoffEmail(handoff),
  // });
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
    const { name, email, phone, topic, message, conversationContext, language } = body;

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
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
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

    // Send notification to team
    await notifyTeam(handoff);

    return NextResponse.json({
      success: true,
      handoffId: handoff.id,
      message: 'Your request has been submitted. A team member will contact you within 24 hours.',
    });
  } catch (error) {
    console.error('Handoff API Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit handoff request' },
      { status: 500 }
    );
  }
}

/**
 * GET - Retrieve handoff requests (admin only)
 * TODO: Add authentication
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add auth check
    // const { userId } = auth();
    // if (!userId || !isAdmin(userId)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const handoffs = await readHandoffs();
    
    // Sort by timestamp (newest first)
    const sorted = handoffs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ handoffs: sorted });
  } catch (error) {
    console.error('Handoff GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve handoffs' },
      { status: 500 }
    );
  }
}
