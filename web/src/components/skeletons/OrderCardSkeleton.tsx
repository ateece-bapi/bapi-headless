export default function OrderCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-neutral-200 bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 h-5 w-32 rounded bg-neutral-200"></div>
          <div className="h-4 w-24 rounded bg-neutral-200"></div>
        </div>
        <div className="h-6 w-20 rounded-full bg-neutral-200"></div>
      </div>

      {/* Product Items */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded bg-neutral-200"></div>
          <div className="flex-1">
            <div className="mb-2 h-4 w-3/4 rounded bg-neutral-200"></div>
            <div className="h-3 w-20 rounded bg-neutral-200"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded bg-neutral-200"></div>
          <div className="flex-1">
            <div className="mb-2 h-4 w-2/3 rounded bg-neutral-200"></div>
            <div className="h-3 w-20 rounded bg-neutral-200"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
        <div className="h-5 w-24 rounded bg-neutral-200"></div>
        <div className="h-9 w-32 rounded bg-neutral-200"></div>
      </div>
    </div>
  );
}
