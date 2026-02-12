import { DashboardCardSkeleton } from '@/components/skeletons';

export default function AccountLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section Skeleton */}
      <section className="w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
          <div className="max-w-3xl">
            <div className="mb-4 h-12 w-80 animate-pulse rounded bg-neutral-200"></div>
            <div className="h-7 w-96 animate-pulse rounded bg-neutral-200"></div>
          </div>
        </div>
      </section>

      {/* Dashboard Grid Skeletons */}
      <section className="w-full py-12 lg:py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}
