'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import logger from '@/lib/logger';
export default function QuotesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Quotes Page Error', error);
  }, [error]);

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

      {/* Error Content */}
      <section className="w-full py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl border border-red-200 bg-white p-12 text-center shadow-sm">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-10 w-10 text-red-600" strokeWidth={2} />
                </div>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-neutral-900">Unable to Load Quotes</h2>

              <p className="mb-2 text-neutral-600">
                We couldn&apos;t retrieve your quote requests. This might be a temporary issue.
              </p>

              {process.env.NODE_ENV === 'development' && (
                <details className="mb-6 mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                    Error details (development only)
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-neutral-50 p-4 text-xs text-red-600">
                    {error.message}
                  </pre>
                </details>
              )}

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-700 hover:shadow-lg"
                >
                  <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                  Try Again
                </button>

                <Link
                  href="/account"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                  Back to Dashboard
                </Link>
              </div>

              <p className="mt-8 text-sm text-neutral-500">
                If this problem persists, please{' '}
                <Link
                  href="/company/contact"
                  className="font-semibold text-primary-600 hover:text-primary-700"
                >
                  contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
