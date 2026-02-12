/**
 * ProductGallerySkeleton
 *
 * Loading skeleton for ProductGallery component
 * Shown while ProductGallery is being lazy-loaded
 */
export function ProductGallerySkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl" role="status" aria-label="Loading product gallery">
      <span className="sr-only">Loading product images...</span>

      {/* Main image skeleton */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-neutral-300 border-t-primary-500" />
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {/* Thumbnail skeleton */}
      <div className="flex justify-center gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 w-16 animate-pulse rounded-lg bg-neutral-100"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}
