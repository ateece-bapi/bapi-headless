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
      <div className="max-w-2xl mx-auto text-center">
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
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          Product Error
        </h1>
        
        <p className="text-lg text-neutral-600 mb-8">
          We encountered an error loading this product page.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h2 className="text-sm font-semibold text-red-800 mb-2">
              Development Error Details:
            </h2>
            <pre className="text-xs text-red-700 overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
          
          <Link
            href="/products"
            className="px-6 py-3 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Browse Products
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-8 text-sm text-neutral-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
