import { getProductDetailsDeferred } from '@/lib/graphql';

type ProductTabsAsyncProps = {
  productId: string;
};

export async function ProductTabsAsync({ productId }: ProductTabsAsyncProps) {
  try {
    // Fetch only deferred details (description, tags, etc.)
    const data = await getProductDetailsDeferred(productId);
    const product = data.product;
    
    if (!product?.description) return null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button className="pb-4 border-b-2 border-primary-600 font-semibold text-primary-600">
            Description
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-700">
            Specifications
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-700">
            Documentation
          </button>
        </nav>
      </div>
      
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    </div>
  );
  } catch (error) {
    console.error('[ProductTabsAsync] Error fetching product details:', error);
    return null;
  }
}

export function ProductTabsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="flex gap-8 mb-6">
        <div className="h-10 w-32 bg-gray-200 rounded" />
        <div className="h-10 w-32 bg-gray-200 rounded" />
        <div className="h-10 w-32 bg-gray-200 rounded" />
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}
