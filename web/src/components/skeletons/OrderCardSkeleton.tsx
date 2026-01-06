export default function OrderCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-neutral-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-24"></div>
        </div>
        <div className="h-6 bg-neutral-200 rounded-full w-20"></div>
      </div>

      {/* Product Items */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neutral-200 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-neutral-200 rounded w-20"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neutral-200 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-neutral-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-neutral-200 rounded w-20"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="h-5 bg-neutral-200 rounded w-24"></div>
        <div className="h-9 bg-neutral-200 rounded w-32"></div>
      </div>
    </div>
  );
}
