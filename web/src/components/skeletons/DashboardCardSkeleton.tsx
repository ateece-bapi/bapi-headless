export default function DashboardCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-neutral-200 bg-white p-6 transition-shadow duration-200 hover:shadow-lg">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-neutral-200"></div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 h-5 w-32 rounded bg-neutral-200"></div>
          <div className="mb-2 h-4 w-full rounded bg-neutral-200"></div>
          <div className="h-4 w-3/4 rounded bg-neutral-200"></div>
        </div>
      </div>
    </div>
  );
}
