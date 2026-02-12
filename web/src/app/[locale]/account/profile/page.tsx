import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, User as UserIcon, AtSign } from 'lucide-react';

export default async function ProfilePage() {
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
          <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">Profile</h1>
        </div>
      </section>

      {/* Profile Content */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12">
              <div className="flex items-center gap-6">
                {/* Avatar with first letter of name */}
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white/20 shadow-lg backdrop-blur-sm">
                  <span className="text-4xl font-bold text-white">
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-white">
                  <h2 className="mb-1 text-2xl font-bold lg:text-3xl">
                    {user.displayName || user.username}
                  </h2>
                  <p className="text-primary-100">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6 p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Display Name */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                    <UserIcon className="h-5 w-5 text-primary-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-neutral-700">Display Name</p>
                    <p className="text-base text-neutral-900">
                      {user.displayName || user.username}
                    </p>
                  </div>
                </div>

                {/* Username */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-50">
                    <AtSign className="h-5 w-5 text-accent-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-neutral-700">Username</p>
                    <p className="text-base text-neutral-900">{user.username}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50">
                    <Mail className="h-5 w-5 text-green-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-neutral-700">Email Address</p>
                    <p className="text-base text-neutral-900">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 border-t border-neutral-200 pt-6">
                <h3 className="mb-4 text-lg font-bold text-neutral-900">Account Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">User ID:</span>
                    <span className="font-mono text-xs text-neutral-900">{user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Username:</span>
                    <span className="text-neutral-900">{user.username || 'Not set'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row">
                <Link
                  href="/account/settings"
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-bold text-white shadow-sm transition-all duration-300 hover:bg-primary-700 hover:shadow-md"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/account"
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition-all duration-300 hover:border-primary-600 hover:bg-white hover:text-primary-600"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
