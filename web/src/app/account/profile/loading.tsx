import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full bg-linear-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold">Profile</h1>
          <p className="text-white/90 mt-2">
            Manage your account information
          </p>
        </div>
      </section>

      {/* Loading Skeleton */}
      <section className="w-full py-12">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 animate-pulse">
              {/* Avatar */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-neutral-200 rounded-full"></div>
              </div>
              
              {/* Fields */}
              <div className="space-y-6">
                <div>
                  <div className="h-4 bg-neutral-200 rounded w-20 mb-2"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
                <div>
                  <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
                <div>
                  <div className="h-4 bg-neutral-200 rounded w-32 mb-2"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
                <div>
                  <div className="h-4 bg-neutral-200 rounded w-28 mb-2"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
