'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BriefcaseIcon, HeartIcon } from '@/lib/icons';
import { Link } from '@/lib/navigation';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { useRegion } from '@/store/regionStore';
import { useCart, useCartDrawer } from '@/store';
import type { ProductAttribute, ProductVariation } from '@/types/variations';
import {
  convertWooCommercePrice,
  convertWooCommercePriceNumeric,
  formatPrice,
} from '@/lib/utils/currency';

interface Product {
  id?: string;
  databaseId?: number;
  name?: string;
  slug?: string;
  price?: string | null;
  regularPrice?: string | null;
  partNumber?: string | null;
  sku?: string | null;
  multiplier?: string | null;
  stockQuantity?: number | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  attributes?: ProductAttribute[];
  variations?: ProductVariation[];
}

interface ProductSummaryCardProps {
  product: Product;
  variation?: ProductVariation | null;
  useCart?: typeof useCart;
  useCartDrawer?: typeof useCartDrawer;
  isLoadingVariation?: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

/**
 * Product Summary Card Component
 * 
 * Displays product pricing, configuration status, and add-to-cart functionality
 * for both simple and variable products. For variable products without a selected
 * variation, shows a CTA to scroll to the configurator section.
 * 
 * @param {ProductSummaryCardProps} props - Component props
 * @param {Product} props.product - Product data including pricing and attributes
 * @param {ProductVariation} [props.variation] - Selected variation for variable products
 * @param {Function} [props.useCart] - Optional cart store hook for testing
 * @param {Function} [props.useCartDrawer] - Optional cart drawer hook for testing
 * @param {boolean} [props.isLoadingVariation=false] - Loading state for variation changes
 * @param {number} [props.quantity] - External quantity control
 * @param {Function} [props.onQuantityChange] - External quantity change handler
 * 
 * @returns {JSX.Element} Sticky product summary card
 * 
 * @example
 * ```tsx
 * <ProductSummaryCard
 *   product={product}
 *   variation={selectedVariation}
 *   quantity={quantity}
 *   onQuantityChange={setQuantity}
 * />
 * ```
 */
export default function ProductSummaryCard({
  product,
  variation,
  useCart,
  useCartDrawer,
  isLoadingVariation = false,
  quantity: externalQuantity,
  onQuantityChange: externalOnQuantityChange,
}: ProductSummaryCardProps) {
  const t = useTranslations('productPage.summary');
  const [internalQuantity, setInternalQuantity] = React.useState(1);
  const [isFavorited, setIsFavorited] = React.useState(false);
  
  // Use external quantity if provided, otherwise use internal state
  const quantity = externalQuantity !== undefined ? externalQuantity : internalQuantity;
  const setQuantity = externalOnQuantityChange || setInternalQuantity;
  const region = useRegion();

  // Check if this is a variable product
  const isVariableProduct = product.attributes && product.attributes.length > 0;

  // Use variation data if available, fallback to product data
  const rawPrice = variation?.price || product.price || '0';

  // Convert price to selected currency
  const displayPrice = convertWooCommercePrice(rawPrice, region.currency);
  const numericPrice = convertWooCommercePriceNumeric(rawPrice, region.currency);

  const displayPartNumber =
    variation?.partNumber || variation?.sku || product.partNumber || product.sku || 'N/A';

  const multiplier = parseFloat(product.multiplier || '1');
  const calculatedAmount = numericPrice * multiplier * quantity;
  const calculated = isNaN(calculatedAmount) ? '0.00' : calculatedAmount.toFixed(2);

  const summaryId = variation?.id || product.id || product.partNumber || product.sku || '';
  const summaryName =
    variation?.name || product.name || product.partNumber || product.sku || 'Product';
  const summarySlug = product.slug || product.partNumber || product.sku || '';
  const summaryImage = variation?.image || product.image || null;
  const variationId = variation?.databaseId || undefined;
  const variationName = variation?.name || undefined;
  const variationSku = variation?.sku || undefined;
  const partNumber = variation?.partNumber || product.partNumber || undefined;

  // Build selectedAttributes from variation.attributes if available
  const selectedAttributes =
    variation?.attributes?.nodes?.reduce((acc: Record<string, string>, attr: ProductVariation['attributes']['nodes'][number]) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {}) || undefined;

  // Check if price is missing/zero (before formatting)
  const hasNoPrice = !rawPrice || rawPrice === '0' || rawPrice === '' || numericPrice === 0;

  // For variable products, require a variation selection OR show configure if no price
  if (isVariableProduct && (!variation || hasNoPrice)) {
    const scrollToConfigurator = () => {
      const configurator = document.querySelector('[data-product-configurator]');
      if (configurator) {
        // Get the element's position and calculate offset for sticky headers
        const elementPosition = configurator.getBoundingClientRect().top + window.scrollY;
        const offset = 180; // Account for sticky nav + generous breathing room
        const targetPosition = elementPosition - offset;
        
        // Respect prefers-reduced-motion for accessibility
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        const focusFirstInput = () => {
          const firstInput = configurator.querySelector('button, select, input');
          if (firstInput instanceof HTMLElement) {
            firstInput.focus({ preventScroll: true });
          }
        };

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });

        // Focus first interactive element for accessibility after scrolling completes
        if (prefersReducedMotion) {
          // Instant scroll - focus immediately
          focusFirstInput();
        } else {
          const supportsScrollEnd = 'onscrollend' in window;
          
          if (supportsScrollEnd) {
            // Modern browsers - use scrollend event
            const handleScrollEnd = () => {
              focusFirstInput();
            };
            window.addEventListener('scrollend', handleScrollEnd, { once: true });
          } else {
            // Fallback for older browsers - detect when scroll settles
            let attempts = 0;
            const maxAttempts = 60; // ~1 second at 60fps
            
            function focusWhenScrollSettles() {
              const isAtTarget = Math.abs(window.scrollY - targetPosition) <= 2;

              if (isAtTarget || attempts >= maxAttempts) {
                focusFirstInput();
                return;
              }

              attempts += 1;
              window.requestAnimationFrame(focusWhenScrollSettles);
            }
            
            window.requestAnimationFrame(focusWhenScrollSettles);
          }
        }
      }
    };

    return (
      <aside className="mb-8 w-full rounded-xl border border-neutral-200 bg-white p-6 shadow md:sticky md:top-4 md:mb-0">
        <h2 className="mb-4 text-xl font-bold text-neutral-900">Product Summary</h2>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 animate-pulse">
            <svg
              className="h-8 w-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="mb-3 font-medium text-neutral-700">{t('configureProduct')}</p>
          <p className="mb-4 text-sm text-neutral-700">
            {t('selectSpecifications')}
          </p>
          
          {/* Smooth Scroll CTA Button - BAPI Yellow Gradient */}
          <button
            onClick={scrollToConfigurator}
            className="group relative inline-flex items-center gap-2 rounded-lg bg-bapi-accent-gradient px-6 py-3 font-semibold text-neutral-900 shadow-lg transition-all duration-200 hover:bg-bapi-accent-gradient-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
            aria-label={t('scrollToCtaAriaLabel')}
          >
            <span>{t('scrollToCta')}</span>
            <svg 
              className="h-5 w-5 transition-transform group-hover:translate-y-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </button>
        </div>
      </aside>
    );
  }

  // For simple (non-variable) products with missing/zero price, show contact sales message
  // Variable products without prices are handled above (they need configuration)
  if (!isVariableProduct && hasNoPrice) {
    return (
      <aside className="mb-8 w-full rounded-xl border border-neutral-200 bg-white p-6 shadow md:sticky md:top-4 md:mb-0">
        <h2 className="mb-4 text-xl font-bold text-neutral-900">Product Summary</h2>
        
        {/* Part Number - Always show if available */}
        {displayPartNumber && displayPartNumber !== 'N/A' && (
          <div className="mb-4">
            <div className="mb-1 text-xs uppercase tracking-wide text-neutral-700">Part Number</div>
            <code className="inline-block rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 font-mono text-sm font-semibold text-neutral-900">
              {displayPartNumber}
            </code>
          </div>
        )}
        
        {/* Price Unavailable Message */}
        <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-neutral-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">Price Not Available</span>
          </div>
          <p className="text-sm text-neutral-700">
            Contact our sales team for pricing and availability information.
          </p>
        </div>
        
        {/* Contact Sales CTA */}
        <Link
          href="/contact"
          className="block w-full rounded-xl bg-primary-600 px-6 py-4 text-center text-lg font-bold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Contact Sales
        </Link>
      </aside>
    );
  }

  return (
    <aside className="mb-8 w-full rounded-xl border border-neutral-200 bg-white p-6 shadow md:sticky md:top-4 md:mb-0">
      <h2 className="mb-4 text-xl font-bold text-neutral-900">Product Summary</h2>

      {/* Configuration Complete Indicator */}
      {isVariableProduct && variation && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-green-800">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold">Configuration Complete</span>
        </div>
      )}

      {/* Loading State Overlay */}
      {isLoadingVariation && (
        <div className="animate-pulse space-y-4">
          {/* Part Number Skeleton */}
          <div>
            <div className="mb-2 h-3 w-24 rounded bg-neutral-200"></div>
            <div className="h-10 w-48 rounded-lg bg-neutral-200"></div>
          </div>

          {/* Price Skeleton */}
          <div className="space-y-3 rounded-xl bg-neutral-100 p-4">
            <div className="flex justify-between">
              <div>
                <div className="mb-2 h-3 w-16 rounded bg-neutral-200"></div>
                <div className="h-10 w-32 rounded bg-neutral-200"></div>
              </div>
              <div>
                <div className="mb-2 h-3 w-16 rounded bg-neutral-200"></div>
                <div className="h-8 w-16 rounded bg-neutral-200"></div>
              </div>
            </div>
            <div className="h-3 w-full rounded bg-neutral-200"></div>
          </div>

          {/* Quantity Skeleton */}
          <div>
            <div className="mb-2 h-3 w-20 rounded bg-neutral-200"></div>
            <div className="h-12 rounded-lg bg-neutral-200"></div>
          </div>

          {/* Button Skeleton */}
          <div className="h-14 rounded-xl bg-neutral-200"></div>
        </div>
      )}

      {/* Actual Content - Hidden when loading */}
      {!isLoadingVariation && (
        <>
          {/* Part Number - Styled with monospace */}
          <div className="mb-4">
            <div className="mb-1 text-xs uppercase tracking-wide text-neutral-700">Part Number</div>
            <code className="inline-block rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 font-mono text-sm font-semibold text-neutral-900">
              {displayPartNumber}
            </code>
          </div>

          {/* Price Hierarchy - Improved Visual Weight */}
          <div className="mb-6 rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100 p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  Your Price
                </div>
                <div className="text-4xl font-bold text-primary-600">
                  {formatPrice(parseFloat(calculated), region.currency)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-neutral-700">Multiplier</div>
                <div className="text-xl font-bold text-neutral-700">
                  {product.multiplier || '1.0'}
                </div>
              </div>
            </div>
            <div className="border-t border-primary-200 pt-2 text-xs text-neutral-700">
              List Price: <span className="font-semibold">{displayPrice}</span> × Qty:{' '}
              <span className="font-semibold">{quantity}</span> × Multiplier:{' '}
              <span className="font-semibold">{product.multiplier || '1.0'}</span>
            </div>
          </div>

          {/* Quantity Input - With Stepper Buttons */}
          <div className="mb-6">
            <label
              htmlFor="quantity"
              className="mb-2 block text-xs uppercase tracking-wide text-neutral-700"
            >
              Quantity
            </label>
            <div className="flex items-center overflow-hidden rounded-lg border border-neutral-300 shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="min-h-11 min-w-11 bg-neutral-100 px-5 py-4 font-bold text-neutral-700 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                id="quantity"
                min={1}
                max={product.stockQuantity || 999}
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setQuantity(isNaN(val) ? 1 : Math.max(1, val));
                }}
                className="min-h-11 flex-1 border-0 bg-white py-4 text-center text-lg font-semibold text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stockQuantity || 999, quantity + 1))}
                className="min-h-11 min-w-11 bg-neutral-100 px-5 py-4 font-bold text-neutral-700 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart - Primary CTA Above Fold */}
          <AddToCartButton
            product={{
              id: summaryId,
              databaseId: variation?.databaseId || product.databaseId || 0,
              name: summaryName,
              slug: summarySlug,
              price: displayPrice,
              numericPrice,
              image: summaryImage?.sourceUrl ? {
                sourceUrl: summaryImage.sourceUrl,
                altText: summaryImage.altText ?? undefined,
              } : null,
              variationId,
              variationName,
              variationSku,
              partNumber,
              selectedAttributes,
            }}
            quantity={quantity}
            className="mb-4 w-full px-6 py-4 text-lg font-bold shadow-lg transition-all hover:shadow-xl"
            useCart={typeof useCart === 'function' ? useCart : undefined}
            useCartDrawer={typeof useCartDrawer === 'function' ? useCartDrawer : undefined}
          />

          {/* Secondary Actions */}
          <div className="flex gap-2">
            <button
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
              title="Add to Job Estimate"
            >
              <BriefcaseIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Job Estimate</span>
            </button>
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow transition focus:outline-none focus:ring-4 ${
                isFavorited
                  ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50'
                  : 'border-2 border-neutral-300 bg-white text-neutral-700 hover:border-red-400 hover:text-red-500 focus:ring-neutral-300/50'
              }`}
              title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <HeartIcon className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isFavorited ? 'Favorited' : 'Favorite'}</span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
