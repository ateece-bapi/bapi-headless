import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Calendar, Shield } from 'lucide-react';

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const emailAddress = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  );

  const createdDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
            Profile
          </h1>
        </div>
      </section>

      {/* Profile Content */}
      <section className="w-full py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-linear-to-r from-primary-600 to-primary-700 px-8 py-12">
              <div className="flex items-center gap-6">
                {user.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt={user.firstName || 'User'}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                )}
                <div className="text-white">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-1">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-primary-100">
                    {emailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-700 mb-1">
                      Email Address
                    </p>
                    <p className="text-base text-neutral-900">
                      {emailAddress?.emailAddress}
                    </p>
                    {emailAddress?.verification?.status === 'verified' && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                        <Shield className="w-3 h-3" strokeWidth={2.5} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-accent-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-700 mb-1">
                      Member Since
                    </p>
                    <p className="text-base text-neutral-900">{createdDate}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t border-neutral-200 pt-6 mt-6">
                <h3 className="font-bold text-lg text-neutral-900 mb-4">
                  Account Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">User ID:</span>
                    <span className="text-neutral-900 font-mono text-xs">
                      {user.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Username:</span>
                    <span className="text-neutral-900">
                      {user.username || 'Not set'}
                    </span>
                  </div>
                  {typeof user.publicMetadata?.role === 'string' ? (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Role:</span>
                      <span className="text-neutral-900 font-semibold capitalize">
                        {user.publicMetadata.role}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-neutral-200 pt-6 mt-6 flex flex-col sm:flex-row gap-4">
                <a
                  href="/account/settings"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Edit Profile
                </a>
                <a
                  href="/account/settings#security"
                  className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 hover:border-primary-600 hover:bg-white hover:text-primary-600 font-semibold rounded-lg transition-all duration-300"
                >
                  Security Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
