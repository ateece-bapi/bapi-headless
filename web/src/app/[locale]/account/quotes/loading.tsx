import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function QuotesLoading() {
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
          <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">Quote Requests</h1>
        </div>
      </section>

      {/* Loading Skeletons */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-7 w-32 animate-pulse rounded bg-neutral-200"></div>
              <div className="h-10 w-36 animate-pulse rounded bg-neutral-200"></div>
            </div>

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-neutral-200 bg-white p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 h-6 w-48 rounded bg-neutral-200"></div>
                    <div className="h-4 w-32 rounded bg-neutral-200"></div>
                  </div>
                  <div className="h-6 w-24 rounded-full bg-neutral-200"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-neutral-200"></div>
                  <div className="h-4 w-3/4 rounded bg-neutral-200"></div>
                </div>
                <div className="mt-4 border-t border-neutral-200 pt-4">
                  <div className="h-9 w-32 rounded bg-neutral-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
