export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden animate-pulse">
      {/* Image */}
      <div className="aspect-square bg-neutral-200"></div>
      
      {/* Content */}
      <div className="p-4">
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-neutral-200 rounded w-1/2 mb-4"></div>
        
        {/* Price and button */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-neutral-200 rounded w-20"></div>
          <div className="h-9 bg-neutral-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
