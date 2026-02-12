export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 h-4 w-64 rounded bg-gray-200" />

      {/* Product hero skeleton */}
      <div className="grid gap-12 md:grid-cols-2">
        {/* Image skeleton */}
        <div className="aspect-square rounded-2xl bg-gray-200" />

        {/* Details skeleton */}
        <div className="space-y-4">
          <div className="h-10 w-3/4 rounded bg-gray-200" />
          <div className="h-8 w-32 rounded bg-gray-300" />
          <div className="h-24 rounded bg-gray-200" />
          <div className="h-12 w-40 rounded bg-primary-200" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-12">
        <div className="mb-4 flex gap-4">
          <div className="h-10 w-32 rounded bg-gray-200" />
          <div className="h-10 w-32 rounded bg-gray-200" />
          <div className="h-10 w-32 rounded bg-gray-200" />
        </div>
        <div className="h-64 rounded bg-gray-200" />
      </div>
    </div>
  );
}
