'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import logger from '@/lib/logger';

/**
 * Products page error boundary - handles errors loading product catalog
 * Logs to monitoring and provides user recovery options with support contact
 *
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - The error that was thrown
 * @param {() => void} props.reset - Function to retry loading products
 * @returns {JSX.Element} Products error UI with retry and contact options
 */
export default function ProductsErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    logger.error('products.error_boundary', {
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-neutral-900">Unable to load products</h2>

        <p className="mb-6 text-base text-neutral-600">
          We&apos;re having trouble loading our product catalog. This could be a temporary issue
          with our systems.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Retry loading
          </button>

          <Link
            href="/"
            className="rounded-lg border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-900 transition-colors hover:border-primary-500 hover:bg-primary-50"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-8 rounded-lg border-l-4 border-primary-500 bg-primary-50 p-4 text-left text-sm">
          <p className="mb-1 font-semibold text-primary-900">Need help right away?</p>
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
