export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-16 animate-pulse text-center">
          <div className="mx-auto mb-4 h-12 w-64 rounded-lg bg-neutral-200"></div>
          <div className="mx-auto h-6 w-96 rounded-lg bg-neutral-200"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="block animate-pulse overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
            >
              {/* Image skeleton */}
              <div className="aspect-4/3 relative w-full bg-neutral-200"></div>

              {/* Content skeleton */}
              <div className="space-y-3 p-5">
                <div className="h-8 w-3/4 rounded bg-neutral-200"></div>
                <div className="h-4 w-1/2 rounded bg-neutral-200"></div>
                <div className="space-y-2">
                  <div className="h-3 rounded bg-neutral-200"></div>
                  <div className="h-3 w-5/6 rounded bg-neutral-200"></div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-6 w-20 rounded bg-neutral-200"></div>
                  <div className="h-9 w-24 rounded bg-neutral-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
