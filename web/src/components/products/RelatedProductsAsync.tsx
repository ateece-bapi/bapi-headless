import { getProductRelated } from '@/lib/graphql';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package } from 'lucide-react';

type RelatedProductsAsyncProps = {
  productId: string;
};

export async function RelatedProductsAsync({ productId }: RelatedProductsAsyncProps) {
  try {
    // Fetch only related products
    const data = await getProductRelated(productId);
    const relatedProducts = data.product?.related?.nodes || [];
    
    if (relatedProducts.length === 0) return null;
  
  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Related Products</h2>
              <p className="text-neutral-600 mt-1">Products frequently purchased together</p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.slice(0, 4).map((product: any) => (
            <Link 
              key={product.id} 
              href={`/en/product/${product.slug}`}
              className="
                group relative bg-white rounded-xl border-2 border-neutral-200 
                hover:border-primary-500 hover:shadow-xl
                transition-all duration-300 overflow-hidden
              "
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                {product.image?.sourceUrl ? (
                  <Image
                    src={product.image.sourceUrl}
                    alt={product.name || 'Product'}
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-neutral-300" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="
                  absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  flex items-end justify-center pb-6
                ">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span>View Details</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-base text-neutral-900 group-hover:text-primary-700 transition-colors line-clamp-2 mb-2 min-h-[3rem]">
                  {product.name}
                </h3>
                
                {/* Price */}
                {product.price && (
                  <div className="text-lg font-bold text-primary-700 mb-3">
                    {product.price}
                  </div>
                )}

                {/* View Button */}
                <div className="
                  flex items-center justify-between gap-2 px-4 py-2.5 
                  bg-neutral-100 group-hover:bg-primary-500 
                  rounded-lg transition-colors
                ">
                  <span className="font-semibold text-sm text-neutral-700 group-hover:text-white transition-colors">
                    View Product
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
  } catch (error) {
    console.error('[RelatedProductsAsync] Error fetching related products:', error);
    return null; // Silently fail during build
  }
}

export function RelatedProductsSkeleton() {
  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-16">
      <div className="container mx-auto px-4 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-neutral-200 rounded-xl" />
          <div>
            <div className="h-8 w-48 bg-neutral-200 rounded mb-2" />
            <div className="h-4 w-64 bg-neutral-200 rounded" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border-2 border-neutral-200">
              <div className="aspect-square bg-neutral-100 rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-6 bg-neutral-200 rounded w-24" />
                <div className="h-10 bg-neutral-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
