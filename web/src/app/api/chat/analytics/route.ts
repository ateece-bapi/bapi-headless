import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import {
  getChatMetrics,
  getRecentConversations,
  getNegativeFeedbackConversations,
} from '@/lib/chat/analytics';

/**
 * API endpoint for admin dashboard - chat analytics
 * 
 * TODO: Add authentication check for production
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'metrics';

    // TODO: Add auth check
    // const { userId } = auth();
    // if (!userId || !isAdmin(userId)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    switch (view) {
      case 'metrics': {
        const metrics = await getChatMetrics();
        return NextResponse.json(metrics);
      }

      case 'recent': {
        const limit = parseInt(searchParams.get('limit') || '50');
        const conversations = await getRecentConversations(limit);
        return NextResponse.json({ conversations });
      }

      case 'negative-feedback': {
        const conversations = await getNegativeFeedbackConversations();
        return NextResponse.json({ conversations });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid view parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    logger.error('Analytics API Error', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
