export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-64 bg-gray-200 rounded mb-8" />
      
      {/* Product hero skeleton */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="aspect-square bg-gray-200 rounded-2xl" />
        
        {/* Details skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-8 bg-gray-300 rounded w-32" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-12 bg-primary-200 rounded w-40" />
        </div>
      </div>
      
      {/* Tabs skeleton */}
      <div className="mt-12">
        <div className="flex gap-4 mb-4">
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
