'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, PackageIcon } from '@/lib/icons';
import { useAuth } from '@/hooks/useAuth';
import { filterProductsByCustomerGroup } from '@/lib/utils/filterProductsByCustomerGroup';

interface RelatedProductsClientProps {
  products: any[];
  translations: {
    title: string;
    subtitle: string;
    viewProduct: string;
  };
}

/**
 * Client component for related products with customer group filtering
 * Receives products from server, filters based on user's customer group
 */
export function RelatedProductsClient({ products, translations }: RelatedProductsClientProps) {
  const { user } = useAuth();

  // Apply customer group filtering
  const filteredProducts = filterProductsByCustomerGroup(products, user?.customerGroup);

  // Don't render if no products after filtering
  if (filteredProducts.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
              <PackageIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">{translations.title}</h2>
              <p className="mt-1 text-neutral-700">{translations.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.slice(0, 5).map((product: any) => (
            <Link
              key={product.id}
              href={`/en/product/${product.slug}`}
              className="group relative overflow-hidden rounded-xl border-2 border-neutral-200 bg-white transition-all duration-300 hover:border-primary-500 hover:shadow-xl"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/2] overflow-hidden bg-neutral-50">
                {product.image?.sourceUrl ? (
                  <Image
                    src={product.image.sourceUrl}
                    alt={product.name || 'Product'}
                    fill
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-110"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <PackageIcon className="h-16 w-16 text-neutral-300" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent pb-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <span>View Details</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
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
                    {translations.viewProduct}
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
