'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
              <svg
                className="h-8 w-8 text-primary-600"
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

            <h2 className="mb-3 text-2xl font-bold text-neutral-900">Critical Error</h2>

            <p className="mb-6 text-base text-neutral-700">
              A critical error occurred in the application. Please refresh the page or contact
              support if the issue persists.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={reset}
                className="error-btn-primary rounded-lg px-6 py-3 font-semibold"
              >
                Try again
              </button>

              <a href="/" className="error-btn-secondary rounded-lg border px-6 py-3 font-semibold">
                Go to homepage
              </a>
            </div>

            {error.digest && (
              <p className="mt-6 text-xs text-neutral-400">Error ID: {error.digest}</p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
