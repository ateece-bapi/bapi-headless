import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OrderCardSkeleton } from '@/components/skeletons';

export default function OrdersLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full bg-linear-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold">Order History</h1>
          <p className="text-white/90 mt-2">
            View and track all your orders
          </p>
        </div>
      </section>

      {/* Loading Skeletons */}
      <section className="w-full py-12">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="space-y-6">
            <div className="h-7 bg-neutral-200 rounded w-32 animate-pulse"></div>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}
