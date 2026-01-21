import { getProductPrice } from '@/lib/graphql';
import Image from 'next/image';
import type { GetProductBySlugQuery } from '@/lib/graphql';
import { sanitizeWordPressContent } from '@/lib/sanitizeDescription';

type ProductHeroProps = {
  product: NonNullable<GetProductBySlugQuery['product']>;
};

export function ProductHeroFast({ product }: ProductHeroProps) {
  const price = getProductPrice(product);
  
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name || 'Product image'}
              fill
              className="object-contain p-8"
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>
        
        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
          
          {price && (
            <div className="text-3xl font-bold text-primary-600 mb-6">
              {price}
            </div>
          )}
          
          {product.shortDescription && (
            <div 
              className="prose prose-sm max-w-none mb-6 text-gray-600"
              dangerouslySetInnerHTML={{ __html: sanitizeWordPressContent(product.shortDescription) }}
            />
          )}
          
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
