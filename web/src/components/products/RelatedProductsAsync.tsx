import { getProductBySlug } from '@/lib/graphql';
import Link from 'next/link';
import Image from 'next/image';

type RelatedProductsAsyncProps = {
  slug: string;
};

export async function RelatedProductsAsync({ slug }: RelatedProductsAsyncProps) {
  // Re-fetch product (will be cached)
  const data = await getProductBySlug(slug);
  const relatedProducts = (data.product as any)?.relatedProducts || [];
  
  if (relatedProducts.length === 0) return null;
  
  return (
    <section className="container mx-auto px-4 py-12 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.slice(0, 4).map((product: any) => (
          <Link 
            key={product.id} 
            href={`/products/${product.slug}`}
            className="block group bg-white rounded-xl p-4 hover:shadow-lg transition-shadow"
          >
            {product.image && (
              <div className="relative aspect-square mb-3">
                <Image
                  src={product.image.sourceUrl}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </div>
            )}
            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-primary-600">
              {product.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <section className="container mx-auto px-4 py-12 bg-gray-50 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4">
            <div className="aspect-square bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}
