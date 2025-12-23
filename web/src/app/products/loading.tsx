export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-16 animate-pulse">
          <div className="h-12 w-64 bg-neutral-200 rounded-lg mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-neutral-200 rounded-lg mx-auto"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="block rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden animate-pulse"
            >
              {/* Image skeleton */}
              <div className="relative w-full aspect-4/3 bg-neutral-200"></div>
              
              {/* Content skeleton */}
              <div className="p-5 space-y-3">
                <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-200 rounded"></div>
                  <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-6 bg-neutral-200 rounded w-20"></div>
                  <div className="h-9 bg-neutral-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
