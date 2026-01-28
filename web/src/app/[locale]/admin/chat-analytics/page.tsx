import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import ChatAnalyticsDashboard from './ChatAnalyticsDashboard';

/**
 * Admin Dashboard for Chat Analytics
 * 
 * Shows conversation metrics, popular products, user feedback, and recent chats.
 * 
 * TODO: Implement proper admin role checking (currently only checks authentication)
 */
export default async function ChatAnalyticsPage() {
  const { userId } = await auth();

  // Require authentication
  if (!userId) {
    redirect('/sign-in?redirect_url=/admin/chat-analytics');
  }

  // TODO: Add admin role check
  // const user = await clerkClient.users.getUser(userId);
  // const isAdmin = user.publicMetadata.role === 'admin';
  // if (!isAdmin) {
  //   return <div>Unauthorized</div>;
  // }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900">
            AI Chat Analytics
          </h1>
          <p className="text-neutral-600 mt-2">
            Monitor chatbot performance, user engagement, and product recommendations
          </p>
          <p className="text-sm text-amber-600 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-block">
            ⚠️ Note: Admin role checking not yet implemented. All authenticated users can access.
          </p>
        </div>

        {/* Dashboard */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
            </div>
          }
        >
          <ChatAnalyticsDashboard />
        </Suspense>
      </div>
    </div>
  );
}
