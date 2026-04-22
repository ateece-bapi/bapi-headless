'use client';

import { useState } from 'react';
import { sanitizeWordPressContent } from '@/lib/sanitizeDescription';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { SearchIcon, ArrowLeftIcon } from '@/lib/icons';
import { useAuth } from '@/hooks/useAuth';
import { filterProductsByCustomerGroup } from '@/lib/utils/filterProductsByCustomerGroup';

interface Product {
  id: string;
  databaseId?: number | null;
  name?: string | null;
  slug?: string | null;
  sku?: string | null;
  partNumber?: string | null;
  price?: string | null;
  shortDescription?: string | null;
  customerGroup1?: string | null;
  customerGroup2?: string | null;
  customerGroup3?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  productCategories?: {
    nodes?: Array<{
      name?: string | null;
      slug?: string | null;
    }> | null;
  } | null;
}

interface SearchResultsProps {
  products: Product[];
  query: string;
  locale: string;
  translations: {
    backToProducts: string;
    title: string;
    resultsCount: string;
    resultsCountPlural: string;
    noResultsTitle: string;
    noResultsDescription: string;
    browseButton: string;
    contactButton: string;
  };
}

/**
 * Client component for search results with customer group filtering
 * Receives products from server, filters based on user's customer group
 */
export default function SearchResults({
  products,
  query,
  locale,
  translations: t,
}: SearchResultsProps) {
  const { user } = useAuth();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Debug: Log customer group filtering
  console.log('[SearchResults] Debug:', {
    productCount: products.length,
    userGroups: user?.customerGroups || ['END USER'],
    sampleProduct: products[0] ? {
      name: products[0].name,
      customerGroup1: products[0].customerGroup1,
      customerGroup2: products[0].customerGroup2,
      customerGroup3: products[0].customerGroup3,
    } : null,
  });

  // Filter products by customer group (B2B access control)
  const filteredProducts = filterProductsByCustomerGroup(products, user?.customerGroups || ['END USER']);

  const handleImageError = (productId: string) => {
    setFailedImages((prev) => new Set(prev).add(productId));
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="mb-4 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t.backToProducts}
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-neutral-900 lg:text-4xl">
            {t.title}
          </h1>
          <p className="text-lg text-neutral-700">
            {filteredProducts.length === 1
              ? t.resultsCount.replace('{count}', String(filteredProducts.length)).replace('{query}', query)
              : t.resultsCountPlural.replace('{count}', String(filteredProducts.length)).replace('{query}', query)}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
            <SearchIcon className="mx-auto mb-6 h-16 w-16 text-neutral-300" />
            <h2 className="mb-3 text-2xl font-bold text-neutral-900">{t.noResultsTitle}</h2>
            <p className="mb-6 text-neutral-700">{t.noResultsDescription.replace('{query}', query)}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-600"
              >
                {t.browseButton}
              </Link>
              <Link
                href="/company/contact-us"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary-500 px-6 py-3 font-semibold text-primary-600 transition-all hover:bg-primary-50"
              >
                {t.contactButton}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => {
              const category = product.productCategories?.nodes?.[0];

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-primary-500 hover:shadow-lg"
                >
                  {product.image?.sourceUrl && !failedImages.has(product.id) && (
                    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-neutral-50">
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.image.altText || product.name || 'Product image'}
                        fill
                        priority={index < 6}
                        loading={index < 6 ? undefined : 'lazy'}
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => handleImageError(product.id)}
                      />
                    </div>
                  )}

                  {category && (
                    <span className="mb-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                      {category.name}
                    </span>
                  )}

                  <h3 className="mb-2 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                    {product.name}
                  </h3>

                  {/* SKU / Part Number Badge */}
                  {(product.partNumber || product.sku) && (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                        {product.partNumber || product.sku}
                      </span>
                    </div>
                  )}

                  {product.shortDescription && (
                    <div
                      className="mb-3 line-clamp-2 text-sm text-neutral-700"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeWordPressContent(product.shortDescription),
                      }}
                    />
                  )}

                  {product.price && (
                    <div className="mt-4 text-xl font-bold text-primary-600">{product.price}</div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
