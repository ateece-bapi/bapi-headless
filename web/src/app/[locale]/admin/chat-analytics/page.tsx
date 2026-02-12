import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerAuth } from '@/lib/auth/server';
import { isAdmin } from '@/lib/auth/roles';
import ChatAnalyticsDashboard from './ChatAnalyticsDashboard';

/**
 * Admin Dashboard for Chat Analytics
 *
 * Shows conversation metrics, popular products, user feedback, and recent chats.
 * Requires administrator or shop_manager role.
 */
export default async function ChatAnalyticsPage() {
  const { userId, user } = await getServerAuth();

  // Require authentication
  if (!userId) {
    redirect('/sign-in?redirect_url=/admin/chat-analytics');
  }

  // Require admin role
  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-900">Access Denied</h1>
            <p className="mb-4 text-red-700">
              You do not have permission to access this page. Admin privileges are required.
            </p>
            <p className="text-sm text-red-600">
              Current role: {user?.roles?.join(', ') || 'No roles assigned'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900">AI Chat Analytics</h1>
          <p className="mt-2 text-neutral-600">
            Monitor chatbot performance, user engagement, and product recommendations
          </p>
        </div>

        {/* Dashboard */}
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
            </div>
          }
        >
          <ChatAnalyticsDashboard />
        </Suspense>
      </div>
    </div>
  );
}
