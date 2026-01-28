import { DashboardCardSkeleton } from '@/components/skeletons';

export default function AccountLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section Skeleton */}
      <section className="w-full bg-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
          <div className="max-w-3xl">
            <div className="h-12 bg-neutral-200 rounded w-80 mb-4 animate-pulse"></div>
            <div className="h-7 bg-neutral-200 rounded w-96 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Dashboard Grid Skeletons */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
