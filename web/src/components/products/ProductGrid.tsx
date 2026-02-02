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

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

interface ProductGridProps {
  products: Product[];
  locale: string;
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const {
    isInComparison,
    addToComparison,
    removeFromComparison,
    canAddMore,
  } = useProductComparison();

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary-500"
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
          
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">
            No Products Found
          </h3>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            We couldn't find any products matching your current filters. Try adjusting your
            selection or browse all products.
          </p>
          
          {/* Helpful suggestions */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 text-left">
            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-500"
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
                <span className="text-primary-500 mt-0.5">•</span>
                <span>Remove some filters to see more products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                <span>Try different filter combinations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                <span>Browse other categories that might have what you need</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      ref={ref}
      href={`/${locale}/product/${product.slug}`}
      className={`group bg-white rounded-xl border-2 border-neutral-200 hover:border-primary-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden flex flex-col relative ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDuration: '500ms' }}
    >
      {/* Subtle gradient accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-accent-50/0 group-hover:from-primary-50/30 group-hover:to-accent-50/20 transition-all duration-300 pointer-events-none" />
      
      {/* Quick View & Comparison Buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Comparison Checkbox */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (canAddToComparison) {
              onToggleComparison();
            }
          }}
          className={`p-2 rounded-lg backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50 focus-visible:border-2 focus-visible:border-primary-600 ${
            canAddToComparison
              ? 'bg-white/90 hover:bg-white cursor-pointer'
              : 'bg-neutral-100/90 cursor-not-allowed opacity-50'
          }`}
          aria-label={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
          disabled={!canAddToComparison}
        >
          {isInComparison ? (
            <CheckSquare className="w-5 h-5 text-primary-600" />
          ) : (
            <Square className="w-5 h-5 text-neutral-600" />
          )}
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView();
          }}
          className="p-2 rounded-lg bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50 focus-visible:border-2 focus-visible:border-primary-600"
          aria-label="Quick view"
        >
          <Eye className="w-5 h-5 text-primary-600" />
        </button>
      </div>
      
      {/* Product Image */}
      <div className="aspect-square relative bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
        {image?.sourceUrl ? (
          <>
            {/* Loading shimmer effect */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-[shimmer_2s_ease-in-out_infinite]" />
            )}
            
            <Image
              src={image.sourceUrl}
              alt={image.altText || product.name || 'Product'}
              fill
              className={`object-contain p-4 group-hover:scale-110 transition-all duration-500 ease-out ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-neutral-200 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-neutral-400"
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
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isOnSale && (
            <span className="bg-bapi-accent-gradient text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md animate-[fade-in_0.3s_ease-out]">
              Sale
            </span>
          )}
          {isInStock && (
            <span className="bg-gradient-to-r from-success-600 to-success-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col relative z-10">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Short Description */}
        {isSimpleProduct && (product as SimpleProduct).shortDescription && (
          <div
            className="text-sm text-neutral-600 mb-4 line-clamp-2 flex-1 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: (product as SimpleProduct).shortDescription || '',
            }}
          />
        )}

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-neutral-100">
          {price ? (
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
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
            <div className="mb-4 text-neutral-600 text-sm font-medium">
              Contact for Pricing
            </div>
          )}

          {/* CTA Button with BAPI gradient */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-bapi-primary-gradient px-4 py-2 rounded-lg group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              View Details
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
              <span className="text-neutral-400 text-xs font-mono">
                {(product as SimpleProduct).sku}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
