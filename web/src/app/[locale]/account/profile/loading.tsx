import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-linear-to-r w-full from-primary-600 to-primary-700 text-white">
        <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 font-semibold text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold lg:text-4xl">Profile</h1>
          <p className="mt-2 text-white/90">Manage your account information</p>
        </div>
      </section>

      {/* Loading Skeleton */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-2xl">
            <div className="animate-pulse rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
              {/* Avatar */}
              <div className="mb-8 flex justify-center">
                <div className="h-24 w-24 rounded-full bg-neutral-200"></div>
              </div>

              {/* Fields */}
              <div className="space-y-6">
                <div>
                  <div className="mb-2 h-4 w-20 rounded bg-neutral-200"></div>
                  <div className="h-10 rounded bg-neutral-200"></div>
                </div>
                <div>
                  <div className="mb-2 h-4 w-24 rounded bg-neutral-200"></div>
                  <div className="h-10 rounded bg-neutral-200"></div>
                </div>
                <div>
                  <div className="mb-2 h-4 w-32 rounded bg-neutral-200"></div>
                  <div className="h-10 rounded bg-neutral-200"></div>
                </div>
                <div>
                  <div className="mb-2 h-4 w-28 rounded bg-neutral-200"></div>
                  <div className="h-10 rounded bg-neutral-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
