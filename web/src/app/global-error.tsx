'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Global error boundary - catches unhandled errors throughout the application
 * Logs to Sentry and provides user recovery options
 * 
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - The error that was thrown
 * @param {() => void} props.reset - Function to attempt recovery by re-rendering the error boundary
 * @returns {JSX.Element} Error UI with recovery options
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to Sentry for all unhandled errors
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error-50">
              <svg
                className="h-8 w-8 text-error-600"
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

            <h2 className="mb-3 text-2xl font-bold text-neutral-900">
              Application Error
            </h2>

            <p className="mb-6 text-base text-neutral-600">
              A critical error occurred. Our team has been notified and is working on a fix.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={reset}
                className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Try again
              </button>

              <Link
                href="/"
                className="rounded-lg border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-900 transition-colors hover:border-primary-500 hover:bg-primary-50"
              >
                Go to homepage
              </Link>
            </div>

            {error.digest && (
              <p className="mt-6 text-xs text-neutral-400">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}