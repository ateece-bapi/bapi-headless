import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { requireAdmin } from '@/lib/auth/server';
import {
  getChatMetrics,
  getRecentConversations,
  getNegativeFeedbackConversations,
} from '@/lib/chat/analytics';

/**
 * API endpoint for admin dashboard - chat analytics
 * Requires admin role (administrator or shop_manager)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'metrics';

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
        return NextResponse.json({ error: 'Invalid view parameter' }, { status: 400 });
    }
  } catch (error) {
    // Handle authorization errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (errorMessage.includes('Forbidden')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    logger.error('Analytics API Error', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
