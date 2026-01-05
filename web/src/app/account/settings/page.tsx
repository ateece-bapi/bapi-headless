import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { UserProfile } from '@clerk/nextjs';

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full bg-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">
            Account Settings
          </h1>
          <p className="text-neutral-600 mt-2">
            Manage your profile, security, and account preferences
          </p>
        </div>
      </section>

      {/* Settings Content */}
      <section className="w-full py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Clerk UserProfile Component */}
            <UserProfile
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none border-0',
                  navbar: 'bg-neutral-50',
                  navbarButton: 'text-neutral-700 hover:bg-white hover:text-primary-600',
                  navbarButtonActive: 'bg-white text-primary-600 font-semibold',
                  pageScrollBox: 'p-6 lg:p-8',
                  profileSectionPrimaryButton: 'bg-primary-600 hover:bg-primary-700 text-white',
                  formButtonPrimary: 'bg-primary-600 hover:bg-primary-700',
                  formFieldInput: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
                  identityPreviewEditButton: 'text-primary-600 hover:text-primary-700',
                  badge: 'bg-primary-100 text-primary-700',
                },
              }}
            />
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="font-bold text-primary-900 mb-2">Need Help?</h3>
            <p className="text-sm text-primary-800 mb-4">
              If you're having trouble with your account settings, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/support"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center justify-center px-4 py-2 border border-primary-300 text-primary-700 hover:bg-white font-semibold text-sm rounded-lg transition-colors"
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
