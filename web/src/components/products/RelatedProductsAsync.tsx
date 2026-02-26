import { getProductRelated } from '@/lib/graphql';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import logger from '@/lib/logger';
import { ArrowRight, Package } from 'lucide-react';

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
      <section className="bg-gradient-to-b from-white to-neutral-50 py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-neutral-900">
                  {t('productPage.related.title')}
                </h2>
                <p className="mt-1 text-neutral-600">Products frequently purchased together</p>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((product: any) => (
              <Link
                key={product.id}
                href={`/en/product/${product.slug}`}
                className="group relative overflow-hidden rounded-xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:border-primary-500 hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-50">
                  {product.image?.sourceUrl ? (
                    <Image
                      src={product.image.sourceUrl}
                      alt={product.name || 'Product'}
                      fill
                      className="object-contain p-6 transition-transform duration-300 group-hover:scale-110"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-16 w-16 text-neutral-300" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent pb-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span>View Details</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="mb-2 line-clamp-2 min-h-[3rem] text-base font-bold text-neutral-900 transition-colors group-hover:text-primary-700">
                    {product.name}
                  </h3>

                  {/* Price */}
                  {product.price && (
                    <div className="mb-3 text-lg font-bold text-primary-700">{product.price}</div>
                  )}

                  {/* View Button */}
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-neutral-100 px-4 py-2.5 transition-colors group-hover:bg-primary-500">
                    <span className="text-sm font-semibold text-neutral-700 transition-colors group-hover:text-white">
                      {t('productPage.related.viewProduct')}
                    </span>
                    <ArrowRight className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border-2 border-neutral-200 bg-white">
              <div className="aspect-square rounded-t-xl bg-neutral-100" />
              <div className="space-y-3 p-5">
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
