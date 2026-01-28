import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function QuotesLoading() {
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
            Quote Requests
          </h1>
        </div>
      </section>

      {/* Loading Skeletons */}
      <section className="w-full py-12">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-7 bg-neutral-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-neutral-200 rounded w-36 animate-pulse"></div>
            </div>
            
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-neutral-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-neutral-200 rounded-full w-24"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="h-9 bg-neutral-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
