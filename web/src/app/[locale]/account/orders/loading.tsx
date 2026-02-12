import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OrderCardSkeleton } from '@/components/skeletons';

export default function OrdersLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-linear-to-r w-full from-primary-600 to-primary-700 text-white">
        <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 font-semibold text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold lg:text-4xl">Order History</h1>
          <p className="mt-2 text-white/90">View and track all your orders</p>
        </div>
      </section>

      {/* Loading Skeletons */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="space-y-6">
            <div className="h-7 w-32 animate-pulse rounded bg-neutral-200"></div>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}
