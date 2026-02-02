/**
 * Loading skeleton for product grid
 * Displays while products are being filtered or loaded
 */

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200" />

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title */}
        <div className="h-6 bg-neutral-200 rounded-lg mb-3 w-3/4" />
        
        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-neutral-100 rounded w-full" />
          <div className="h-4 bg-neutral-100 rounded w-5/6" />
        </div>

        {/* Price */}
        <div className="h-8 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg mb-4 w-1/3" />

        {/* Button */}
        <div className="h-10 bg-neutral-200 rounded-lg w-full" />
      </div>
    </div>
  );
}
