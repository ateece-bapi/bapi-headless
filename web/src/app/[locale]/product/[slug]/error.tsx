'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import logger from '@/lib/logger';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error with all details
    logger.error('[ProductError] Product page error boundary triggered', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    });

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Product page error:', error);
    }
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-neutral-900">Product Error</h1>

        <p className="mb-8 text-lg text-neutral-600">
          We encountered an error loading this product page.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
            <h2 className="mb-2 text-sm font-semibold text-red-800">Development Error Details:</h2>
            <pre className="overflow-auto text-xs text-red-700">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </div>
        )}

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-lg bg-primary-500 px-6 py-3 text-white transition-colors hover:bg-primary-600"
          >
            Try Again
          </button>

          <Link
            href="/products"
            className="rounded-lg bg-neutral-100 px-6 py-3 text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            Browse Products
          </Link>
        </div>

        {error.digest && <p className="mt-8 text-sm text-neutral-500">Error ID: {error.digest}</p>}
      </div>
    </div>
  );
}
