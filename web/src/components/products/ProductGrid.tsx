import Link from 'next/link';
import Image from 'next/image';
import type {
  GetProductsWithFiltersQuery,
  SimpleProduct,
  VariableProduct,
} from '@/lib/graphql/generated';
import { getProductPrice } from '@/lib/graphql/types';

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

interface ProductGridProps {
  products: Product[];
  locale: string;
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 text-lg mb-4">No products found</p>
        <p className="text-neutral-500 text-sm">
          Try adjusting your filters or browse all products
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  locale: string;
}

function ProductCard({ product, locale }: ProductCardProps) {
  const isSimpleProduct = product.__typename === 'SimpleProduct';
  const isVariableProduct = product.__typename === 'VariableProduct';

  // Get product image
  const image =
    (product as SimpleProduct | VariableProduct).featuredImage?.node ||
    (product as SimpleProduct | VariableProduct).image;

  // Get product price
  const price = getProductPrice(product as SimpleProduct | VariableProduct);

  // Get stock status
  const stockStatus = isSimpleProduct
    ? (product as SimpleProduct).stockStatus
    : isVariableProduct
      ? (product as VariableProduct).stockStatus
      : null;

  const isInStock = stockStatus === 'IN_STOCK';
  const isOnSale =
    (isSimpleProduct && (product as SimpleProduct).onSale) ||
    (isVariableProduct && (product as VariableProduct).onSale);

  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className="group bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-normal overflow-hidden flex flex-col"
    >
      {/* Product Image */}
      <div className="aspect-square relative bg-neutral-50">
        {image?.sourceUrl ? (
          <Image
            src={image.sourceUrl}
            alt={image.altText || product.name || 'Product'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-normal"
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOnSale && (
            <span className="bg-accent-500 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full">
              Sale
            </span>
          )}
          {isInStock && (
            <span className="bg-success-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-neutral-900 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Short Description */}
        {isSimpleProduct && (product as SimpleProduct).shortDescription && (
          <p
            className="text-sm text-neutral-600 mb-3 line-clamp-2 flex-1"
            dangerouslySetInnerHTML={{
              __html: (product as SimpleProduct).shortDescription || '',
            }}
          />
        )}

        {/* Price */}
        <div className="mt-auto">
          {price ? (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-bold text-primary-500">{price}</span>
              {isOnSale &&
                (isSimpleProduct
                  ? (product as SimpleProduct).regularPrice
                  : isVariableProduct
                    ? (product as VariableProduct).regularPrice
                    : null) && (
                  <span className="text-sm text-neutral-500 line-through">
                    {isSimpleProduct
                      ? (product as SimpleProduct).regularPrice
                      : (product as VariableProduct).regularPrice}
                  </span>
                )}
            </div>
          ) : (
            <div className="mb-3 text-neutral-500 text-sm">Price available on request</div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-500 font-medium group-hover:translate-x-1 transition-transform">
              View Details →
            </span>
            {isSimpleProduct && (product as SimpleProduct).sku && (
              <span className="text-neutral-400 text-xs">
                SKU: {(product as SimpleProduct).sku}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
