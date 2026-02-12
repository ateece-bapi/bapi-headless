/**
 * Loading skeleton for product grid
 * Displays while products are being filtered or loaded
 */

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border-2 border-neutral-200 bg-white">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200" />

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title */}
        <div className="mb-3 h-6 w-3/4 rounded-lg bg-neutral-200" />

        {/* Description */}
        <div className="mb-4 space-y-2">
          <div className="h-4 w-full rounded bg-neutral-100" />
          <div className="h-4 w-5/6 rounded bg-neutral-100" />
        </div>

        {/* Price */}
        <div className="mb-4 h-8 w-1/3 rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-100" />

        {/* Button */}
        <div className="h-10 w-full rounded-lg bg-neutral-200" />
      </div>
    </div>
  );
}
