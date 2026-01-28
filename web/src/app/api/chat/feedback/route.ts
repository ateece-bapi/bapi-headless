import { NextRequest, NextResponse } from 'next/server';
import { updateChatFeedback } from '@/lib/chat/analytics';

/**
 * API endpoint for submitting chat feedback (thumbs up/down)
 */
export async function POST(request: NextRequest) {
  try {
    const { conversationId, feedback, comment } = await request.json();

    if (!conversationId || !feedback) {
      return NextResponse.json(
        { error: 'conversationId and feedback are required' },
        { status: 400 }
      );
    }

    if (feedback !== 'positive' && feedback !== 'negative') {
      return NextResponse.json(
        { error: 'feedback must be "positive" or "negative"' },
        { status: 400 }
      );
    }

    await updateChatFeedback(conversationId, feedback, comment);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
