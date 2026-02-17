'use client';

import React from 'react';
import { Briefcase, Heart } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { useRegion } from '@/store/regionStore';
import { convertWooCommercePrice } from '@/lib/utils/currency';

interface ProductSummaryCardProps {
  product: any;
  variation?: any;
  useCart?: any;
  useCartDrawer?: any;
  isLoadingVariation?: boolean; // New prop for loading state
}

export default function ProductSummaryCard({
  product,
  variation,
  useCart,
  useCartDrawer,
  isLoadingVariation = false,
}: ProductSummaryCardProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [isFavorited, setIsFavorited] = React.useState(false);
  const region = useRegion();

  // Check if this is a variable product
  const isVariableProduct = product.attributes && product.attributes.length > 0;

  // Use variation data if available, fallback to product data
  const rawPrice = variation?.price || product.price || '0';
  
  // Convert price to selected currency
  const displayPrice = convertWooCommercePrice(rawPrice, region.currency);
  
  const displayPartNumber =
    variation?.partNumber || variation?.sku || product.partNumber || product.sku || 'N/A';
  const displayStockStatus = variation?.stockStatus || product.stockStatus;

  const price = parseFloat(displayPrice.replace(/[^0-9.-]+/g, '') || '0');
  const multiplier = parseFloat(product.multiplier || '1');
  const calculated = isNaN(price * multiplier * quantity)
    ? '0.00'
    : (price * multiplier * quantity).toFixed(2);
  const isOutOfStock =
    displayStockStatus !== 'IN_STOCK' ||
    (typeof product.stockQuantity === 'number' && product.stockQuantity < 1);

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
    variation?.attributes?.nodes?.reduce((acc: Record<string, string>, attr: any) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {}) || undefined;

  // For variable products, require a variation selection
  if (isVariableProduct && !variation) {
    return (
      <aside className="mb-8 w-full rounded-xl border border-neutral-200 bg-white p-6 shadow md:sticky md:top-4 md:mb-0">
        <h2 className="mb-4 text-xl font-bold text-neutral-900">Product Summary</h2>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
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
          <p className="mb-2 font-medium text-neutral-600">Configure Product</p>
          <p className="text-sm text-neutral-500">
            Select your specifications below to see pricing and part number
          </p>
        </div>
      </aside>
    );
  }

  if (!displayPrice || displayPrice.trim() === '' || displayPrice === '0') {
    return (
      <aside className="mb-8 w-full rounded-xl border border-neutral-200 bg-white p-6 shadow md:mb-0 md:w-80">
        {/* Only fallback <p> for missing price, no other children */}
        <p className="mb-4 text-primary-500"> </p>
      </aside>
    );
  }

  return (
    <aside className="mb-8 w-full rounded-xl border border-neutral-200 bg-white p-6 shadow md:sticky md:top-4 md:mb-0">
      <h2 className="mb-4 text-xl font-bold text-neutral-900">Product Summary</h2>

      {/* Configuration Complete Indicator */}
      {isVariableProduct && variation && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-green-600">
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
          {/* Stock Status Skeleton */}
          <div className="h-10 w-32 rounded-lg bg-neutral-200"></div>

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
          {/* Stock Status Badge - Prominent Position */}
          {displayStockStatus && (
            <div
              className={`mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                displayStockStatus === 'IN_STOCK'
                  ? 'border border-green-200 bg-green-100 text-green-800'
                  : displayStockStatus === 'ON_BACKORDER'
                    ? 'border border-yellow-200 bg-yellow-100 text-yellow-800'
                    : 'border border-red-200 bg-red-100 text-red-800'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  displayStockStatus === 'IN_STOCK'
                    ? 'bg-green-600'
                    : displayStockStatus === 'ON_BACKORDER'
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                }`}
              ></span>
              {displayStockStatus === 'IN_STOCK'
                ? '✓ In Stock'
                : displayStockStatus === 'ON_BACKORDER'
                  ? 'On Backorder'
                  : 'Out of Stock'}
            </div>
          )}

          {/* Part Number - Styled with monospace */}
          <div className="mb-4">
            <div className="mb-1 text-xs uppercase tracking-wide text-neutral-500">Part Number</div>
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
                  {displayPrice.replace(/[\d.,]/g, '')}{calculated}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-neutral-600">Multiplier</div>
                <div className="text-xl font-bold text-neutral-700">
                  {product.multiplier || '1.0'}
                </div>
              </div>
            </div>
            <div className="border-t border-primary-200 pt-2 text-xs text-neutral-600">
              List Price: <span className="font-semibold">{displayPrice}</span> × Qty:{' '}
              <span className="font-semibold">{quantity}</span> × Multiplier:{' '}
              <span className="font-semibold">{product.multiplier || '1.0'}</span>
            </div>
          </div>

          {/* Quantity Input - With Stepper Buttons */}
          <div className="mb-6">
            <label
              htmlFor="quantity"
              className="mb-2 block text-xs uppercase tracking-wide text-neutral-500"
            >
              Quantity
            </label>
            <div className="flex items-center overflow-hidden rounded-lg border border-neutral-300 shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="min-h-[44px] min-w-[44px] bg-neutral-100 px-5 py-4 font-bold text-neutral-700 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="min-h-[44px] flex-1 border-0 bg-white py-4 text-center text-lg font-semibold text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 999, q + 1))}
                className="min-h-[44px] min-w-[44px] bg-neutral-100 px-5 py-4 font-bold text-neutral-700 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            {typeof product.stockQuantity === 'number' && (
              <div className="mt-2 flex items-center gap-1 text-xs text-neutral-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {product.stockQuantity} units available
              </div>
            )}
          </div>

          {/* Add to Cart - Primary CTA Above Fold */}
          <AddToCartButton
            product={{
              ...product,
              id: summaryId,
              name: summaryName,
              slug: summarySlug,
              price: displayPrice,
              image: summaryImage,
              variationId,
              variationName,
              variationSku,
              partNumber,
              selectedAttributes,
            }}
            quantity={quantity}
            className="mb-4 w-full px-6 py-4 text-lg font-bold shadow-lg transition-all hover:shadow-xl"
            disabled={isOutOfStock}
            useCart={typeof useCart === 'function' ? useCart : undefined}
            useCartDrawer={typeof useCartDrawer === 'function' ? useCartDrawer : undefined}
          />

          {/* Secondary Actions */}
          <div className="flex gap-2">
            <button
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
              title="Add to Job Estimate"
            >
              <Briefcase className="h-4 w-4" />
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
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isFavorited ? 'Favorited' : 'Favorite'}</span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
