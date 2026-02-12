export default function ProductCardSkeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-lg border border-neutral-200 bg-white"
      role="status"
      aria-label="Loading product information"
    >
      <span className="sr-only">Loading...</span>

      {/* Image */}
      <div className="aspect-square bg-neutral-200"></div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3 h-4 w-3/4 rounded bg-neutral-200"></div>
        <div className="mb-4 h-3 w-1/2 rounded bg-neutral-200"></div>

        {/* Price and button */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded bg-neutral-200"></div>
          <div className="h-9 w-24 rounded bg-neutral-200"></div>
        </div>
      </div>
    </div>
  );
}
