/**
 * ProductGallerySkeleton
 * 
 * Loading skeleton for ProductGallery component
 * Shown while ProductGallery is being lazy-loaded
 */
export function ProductGallerySkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto" role="status" aria-label="Loading product gallery">
      <span className="sr-only">Loading product images...</span>
      
      {/* Main image skeleton */}
      <div className="aspect-square bg-neutral-100 rounded-2xl mb-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-neutral-300 border-t-primary-500 rounded-full animate-spin" />
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      
      {/* Thumbnail skeleton */}
      <div className="flex gap-2 justify-center">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-16 h-16 bg-neutral-100 rounded-lg animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}
