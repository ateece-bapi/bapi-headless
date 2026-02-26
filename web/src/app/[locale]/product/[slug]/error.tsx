'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import logger from '@/lib/logger';

/**
 * Product page error boundary - handles errors during product page rendering
 * Logs to monitoring and provides navigation options
 *
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - The error that was thrown
 * @param {() => void} props.reset - Function to retry loading the product page
 * @returns {JSX.Element} Product error UI with navigation options
 */
export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    logger.error('product.error_boundary', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
          <svg
            className="h-10 w-10 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-neutral-900">Unable to load product</h2>

        <p className="mb-6 text-base text-neutral-600">
          We couldn&apos;t load this product. It may have been removed or there could be a temporary
          issue.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Try again
          </button>

          <Link
            href="/products"
            className="rounded-lg border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-900 transition-colors hover:border-primary-500 hover:bg-primary-50"
          >
            Browse products
          </Link>
        </div>

        <div className="mt-8 rounded-lg border-l-4 border-primary-500 bg-primary-50 p-4 text-left text-sm">
          <p className="mb-1 font-semibold text-primary-900">Need help?</p>
          <p className="text-primary-700">
            Contact our team:{' '}
            <a href="tel:6087354800" className="underline hover:text-primary-800">
              (608) 735-4800
            </a>{' '}
            or{' '}
            <a href="mailto:sales@bapihvac.com" className="underline hover:text-primary-800">
              sales@bapihvac.com
            </a>
          </p>
        </div>

        {error.digest && <p className="mt-6 text-xs text-neutral-400">Error ID: {error.digest}</p>}
      </div>
    </div>
  );
}
