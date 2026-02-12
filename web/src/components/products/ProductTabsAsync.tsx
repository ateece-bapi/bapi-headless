import { getProductDetailsDeferred } from '@/lib/graphql';
import logger from '@/lib/logger';

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
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button className="border-b-2 border-primary-600 pb-4 font-semibold text-primary-600">
              Description
            </button>
            <button className="pb-4 text-gray-500 hover:text-gray-700">Specifications</button>
            <button className="pb-4 text-gray-500 hover:text-gray-700">Documentation</button>
          </nav>
        </div>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    );
  } catch (error) {
    logger.error('[ProductTabsAsync] Error fetching product details', error);
    return null;
  }
}

export function ProductTabsSkeleton() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-8">
      <div className="mb-6 flex gap-8">
        <div className="h-10 w-32 rounded bg-gray-200" />
        <div className="h-10 w-32 rounded bg-gray-200" />
        <div className="h-10 w-32 rounded bg-gray-200" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>
    </div>
  );
}
