import { getProductRelated } from '@/lib/graphql';
import { getTranslations } from 'next-intl/server';
import logger from '@/lib/logger';
import { RelatedProductsClient } from './RelatedProductsClient';

type RelatedProductsAsyncProps = {
  productId: string;
};

export async function RelatedProductsAsync({ productId }: RelatedProductsAsyncProps) {
  const t = await getTranslations();
  try {
    // Fetch only related products
    const data = await getProductRelated(productId);
    const relatedProducts = data.product?.related?.nodes || [];

    if (relatedProducts.length === 0) return null;

    return (
      <RelatedProductsClient
        products={relatedProducts}
        translations={{
          title: t('productPage.related.title'),
          subtitle: 'Products frequently purchased together',
          viewProduct: t('productPage.related.viewProduct'),
        }}
      />
    );
  } catch (error) {
    logger.error('[RelatedProductsAsync] Error fetching related products', error);
    return null; // Silently fail during build
  }
}

export function RelatedProductsSkeleton() {
  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-16">
      <div className="container mx-auto animate-pulse px-4">
        {/* Header Skeleton */}
        <div className="mb-10 flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-neutral-200" />
          <div>
            <div className="mb-2 h-8 w-48 rounded bg-neutral-200" />
            <div className="h-4 w-64 rounded bg-neutral-200" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-xl border-2 border-neutral-200 bg-white">
              <div className="aspect-[3/2] rounded-t-xl bg-neutral-100" />
              <div className="space-y-3 p-3">
                <div className="h-4 w-full rounded bg-neutral-200" />
                <div className="h-4 w-3/4 rounded bg-neutral-200" />
                <div className="h-6 w-24 rounded bg-neutral-200" />
                <div className="h-10 rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
