'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';import logger from '@/lib/logger';
export default function FavoritesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Favorites Page Error', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full bg-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">
            Saved Products
          </h1>
        </div>
      </section>

      {/* Error Content */}
      <section className="w-full py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-600" strokeWidth={2} />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                Unable to Load Favorites
              </h2>
              
              <p className="text-neutral-600 mb-2">
                We couldn&apos;t retrieve your saved products. This might be a temporary issue.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 mb-6 text-left">
                  <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700">
                    Error details (development only)
                  </summary>
                  <pre className="mt-2 p-4 bg-neutral-50 rounded text-xs overflow-auto text-red-600">
                    {error.message}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
                  Try Again
                </button>
                
                <Link
                  href="/account"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                  Back to Dashboard
                </Link>
              </div>

              <p className="text-sm text-neutral-500 mt-8">
                If this problem persists, please{' '}
                <Link href="/company/contact" className="text-primary-600 hover:text-primary-700 font-semibold">
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
