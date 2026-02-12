import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UserProfileClient from './UserProfileClient';

export default async function SettingsPage() {
  const { user } = await getServerAuth();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">Account Settings</h1>
          <p className="mt-2 text-neutral-600">
            Manage your profile, security, and account preferences
          </p>
        </div>
      </section>

      {/* Settings Content */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            {/* Clerk UserProfile Component (dynamically loaded) */}
            <UserProfileClient />
          </div>

          {/* Help Section */}
          <div className="mt-8 rounded-lg border border-primary-200 bg-primary-50 p-6">
            <h3 className="mb-2 font-bold text-primary-900">Need Help?</h3>
            <p className="mb-4 text-sm text-primary-800">
              If you&apos;re having trouble with your account settings, our support team is here to
              help.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/support"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Contact Support
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center justify-center rounded-lg border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-white"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
