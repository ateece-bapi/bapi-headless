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
      <div className="grid gap-12 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
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
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{product.name}</h1>

          {price && <div className="mb-6 text-3xl font-bold text-primary-600">{price}</div>}

          {product.shortDescription && (
            <div
              className="prose prose-sm mb-6 max-w-none text-gray-600"
              dangerouslySetInnerHTML={{
                __html: sanitizeWordPressContent(product.shortDescription),
              }}
            />
          )}

          <div className="flex gap-4">
            <button className="rounded-lg bg-primary-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-700">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
