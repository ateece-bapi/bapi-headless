export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs skeleton */}
        <div className="flex gap-2 mb-6 animate-pulse">
          <div className="h-4 w-16 bg-neutral-200 rounded"></div>
          <div className="h-4 w-4 bg-neutral-200 rounded"></div>
          <div className="h-4 w-24 bg-neutral-200 rounded"></div>
          <div className="h-4 w-4 bg-neutral-200 rounded"></div>
          <div className="h-4 w-32 bg-neutral-200 rounded"></div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 animate-pulse">
          {/* Images skeleton */}
          <div className="lg:col-span-1">
            <div className="w-full h-[420px] rounded mb-4 bg-neutral-200"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded bg-neutral-200"></div>
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="h-10 bg-neutral-200 rounded w-3/4 mb-3"></div>
              <div className="h-6 bg-neutral-200 rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-200 rounded w-4/5"></div>
              </div>
            </div>

            {/* Price and stock */}
            <div className="flex items-center gap-4">
              <div className="h-8 bg-neutral-200 rounded w-24"></div>
              <div className="h-6 bg-neutral-200 rounded w-20"></div>
            </div>

            {/* Add to cart button */}
            <div className="h-12 bg-neutral-200 rounded w-40"></div>

            {/* Tabs skeleton */}
            <div className="pt-8">
              <div className="flex gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-neutral-200 rounded w-32"></div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-11/12"></div>
                <div className="h-4 bg-neutral-200 rounded w-10/12"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-9/12"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="mt-16">
          <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square rounded bg-neutral-200"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
