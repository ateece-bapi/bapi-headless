'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Eye, Square, CheckSquare } from 'lucide-react';
import type {
  GetProductsWithFiltersQuery,
  SimpleProduct,
  VariableProduct,
} from '@/lib/graphql/generated';
import { getProductPrice } from '@/lib/graphql/types';
import QuickViewModal from './QuickViewModal';
import { useProductComparison } from '@/hooks/useProductComparison';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useRegion } from '@/store/regionStore';

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

interface ProductGridProps {
  products: Product[];
  locale: string;
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { isInComparison, addToComparison, removeFromComparison, canAddMore } =
    useProductComparison();

  if (products.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <div className="mx-auto max-w-md">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-accent-100">
            <svg
              className="h-10 w-10 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <h3 className="mb-3 text-2xl font-bold text-neutral-900">No Products Found</h3>
          <p className="mb-6 leading-relaxed text-neutral-600">
            We couldn&apos;t find any products matching your current filters. Try adjusting your
            selection or browse all products.
          </p>

          {/* Helpful suggestions */}
          <div className="rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 p-6 text-left">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-neutral-900">
              <svg
                className="h-5 w-5 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Try these suggestions:
            </h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-500">•</span>
                <span>Remove some filters to see more products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-500">•</span>
                <span>Try different filter combinations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-500">•</span>
                <span>Browse other categories that might have what you need</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-500">•</span>
                <span>Contact our sales team for specialized product recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            onQuickView={() => setQuickViewProduct(product)}
            isInComparison={isInComparison(product.id)}
            onToggleComparison={() => {
              if (isInComparison(product.id)) {
                removeFromComparison(product.id);
              } else if (canAddMore) {
                addToComparison(product as any);
              }
            }}
            canAddToComparison={canAddMore || isInComparison(product.id)}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct as any}
          onClose={() => setQuickViewProduct(null)}
          locale={locale}
        />
      )}
    </>
  );
}

interface ProductCardProps {
  product: Product;
  locale: string;
  onQuickView: () => void;
  isInComparison: boolean;
  onToggleComparison: () => void;
  canAddToComparison: boolean;
}

function ProductCard({
  product,
  locale,
  onQuickView,
  isInComparison,
  onToggleComparison,
  canAddToComparison,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, isVisible } = useIntersectionObserver<HTMLAnchorElement>({
    threshold: 0.1,
    rootMargin: '100px',
    freezeOnceVisible: true,
  });

  // Get current region for currency conversion
  const region = useRegion();

  const isSimpleProduct = product.__typename === 'SimpleProduct';
  const isVariableProduct = product.__typename === 'VariableProduct';

  // Get product image
  const image =
    (product as SimpleProduct | VariableProduct).featuredImage?.node ||
    (product as SimpleProduct | VariableProduct).image;

  // Get product price with currency conversion
  const price = getProductPrice(product as SimpleProduct | VariableProduct, region.currency);

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
      ref={ref}
      href={`/${locale}/product/${product.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border-2 border-neutral-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-500 hover:shadow-2xl ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDuration: '500ms' }}
    >
      {/* Subtle gradient accent on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-50/0 to-accent-50/0 transition-all duration-300 group-hover:from-primary-50/30 group-hover:to-accent-50/20" />

      {/* Quick View & Comparison Buttons */}
      <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* Comparison Checkbox */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (canAddToComparison) {
              onToggleComparison();
            }
          }}
          className={`rounded-lg p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:border-2 focus-visible:border-primary-600 focus-visible:ring-4 focus-visible:ring-primary-500/50 ${
            canAddToComparison
              ? 'cursor-pointer bg-white/90 hover:bg-white'
              : 'cursor-not-allowed bg-neutral-100/90 opacity-50'
          }`}
          aria-label={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
          disabled={!canAddToComparison}
        >
          {isInComparison ? (
            <CheckSquare className="h-5 w-5 text-primary-600" />
          ) : (
            <Square className="h-5 w-5 text-neutral-600" />
          )}
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView();
          }}
          className="rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white focus:outline-none focus-visible:border-2 focus-visible:border-primary-600 focus-visible:ring-4 focus-visible:ring-primary-500/50"
          aria-label="Quick view"
        >
          <Eye className="h-5 w-5 text-primary-600" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
        {image?.sourceUrl ? (
          <>
            {/* Loading shimmer effect */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200" />
            )}

            <Image
              src={image.sourceUrl}
              alt={image.altText || product.name || 'Product'}
              fill
              className={`object-contain p-4 transition-all duration-500 ease-out group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200">
                <svg
                  className="h-8 w-8 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}

        {/* Badges with BAPI gradients */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {isOnSale && (
            <span className="bg-bapi-accent-gradient animate-[fade-in_0.3s_ease-out] rounded-full px-3 py-1.5 text-xs font-bold text-neutral-900 shadow-md">
              Sale
            </span>
          )}
          {isInStock && (
            <span className="rounded-full bg-gradient-to-r from-success-600 to-success-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="relative z-10 flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-primary-600">
          {product.name}
        </h3>

        {/* Short Description */}
        {isSimpleProduct && (product as SimpleProduct).shortDescription && (
          <div
            className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600"
            dangerouslySetInnerHTML={{
              __html: (product as SimpleProduct).shortDescription || '',
            }}
          />
        )}

        {/* Price */}
        <div className="mt-auto border-t border-neutral-100 pt-3">
          {price ? (
            <div className="mb-4 flex items-baseline gap-2">
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-2xl font-bold text-transparent">
                {price}
              </span>
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
            <div className="mb-4 text-sm font-medium text-neutral-600">Contact for Pricing</div>
          )}

          {/* CTA Button with BAPI gradient */}
          <div className="flex items-center justify-between">
            <span className="bg-bapi-primary-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
              View Details
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
            {isSimpleProduct && (product as SimpleProduct).sku && (
              <span className="font-mono text-xs text-neutral-400">
                {(product as SimpleProduct).sku}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
