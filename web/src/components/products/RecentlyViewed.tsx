'use client';

import { useRecentlyViewed } from '@/store/recentlyViewed';
import Link from 'next/link';
import Image from 'next/image';
import { X, History, Trash2 } from 'lucide-react';

interface RecentlyViewedProps {
  /** Current product ID to exclude from display */
  excludeProductId?: string;
  /** Maximum number of products to display (default: 5) */
  maxDisplay?: number;
  /** Show clear all button (default: true) */
  showClearButton?: boolean;
  /** Compact mode for sidebars (default: false) */
  compact?: boolean;
}

/**
 * Recently Viewed Products Component
 *
 * Displays a list of recently viewed products with images and prices.
 * Automatically excludes the current product from the list.
 *
 * Features:
 * - Shows up to 5 recent products (configurable)
 * - Responsive grid layout
 * - Remove individual products
 * - Clear all history
 * - Empty state with icon
 * - Hover effects and transitions
 * - Compact mode for sidebars
 *
 * @example
 * ```tsx
 * // Product detail page
 * <RecentlyViewed excludeProductId={currentProduct.id} />
 *
 * // Sidebar
 * <RecentlyViewed compact maxDisplay={3} />
 *
 * // Without clear button
 * <RecentlyViewed showClearButton={false} />
 * ```
 */
export default function RecentlyViewed({
  excludeProductId,
  maxDisplay = 5,
  showClearButton = true,
  compact = false,
}: RecentlyViewedProps) {
  const { products, clearHistory, removeProduct, getProductsExcluding } = useRecentlyViewed();

  // Get products to display (excluding current if provided)
  const displayProducts = excludeProductId ? getProductsExcluding(excludeProductId) : products;

  // Limit to maxDisplay
  const limitedProducts = displayProducts.slice(0, maxDisplay);

  // Don't render if no products
  if (limitedProducts.length === 0) {
    return (
      <div className="py-12 text-center">
        <History className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
        <p className="text-lg text-neutral-600">No recently viewed products</p>
        <p className="mt-2 text-sm text-neutral-500">Products you view will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with clear button */}
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-neutral-900 ${compact ? 'text-lg' : 'text-2xl'}`}>
          Recently Viewed
        </h2>
        {showClearButton && products.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-error-500"
            aria-label="Clear viewing history"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Products grid */}
      <div
        className={`grid gap-4 ${
          compact ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        }`}
      >
        {limitedProducts.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all duration-300 hover:shadow-lg"
          >
            {/* Remove button */}
            <button
              onClick={() => removeProduct(product.id)}
              className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 opacity-0 shadow-md transition-opacity hover:bg-error-50 hover:text-error-500 group-hover:opacity-100"
              aria-label={`Remove ${product.name} from history`}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Product link */}
            <Link href={`/en/product/${product.slug}`} className="block">
              {/* Product image */}
              <div
                className={`relative bg-neutral-50 ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}
              >
                {product.image?.sourceUrl ? (
                  <Image
                    src={product.image.sourceUrl}
                    alt={product.image.altText || product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes={
                      compact
                        ? '100px'
                        : '(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw'
                    }
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className={`p-3 ${compact ? 'space-y-1' : 'space-y-2'}`}>
                <h3
                  className={`line-clamp-2 font-semibold text-neutral-900 transition-colors group-hover:text-primary-500 ${
                    compact ? 'text-sm' : 'text-base'
                  }`}
                >
                  {product.name}
                </h3>
                <p className={`font-bold text-primary-500 ${compact ? 'text-sm' : 'text-lg'}`}>
                  {product.price}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Show more indicator */}
      {displayProducts.length > maxDisplay && (
        <p className="text-center text-sm text-neutral-500">
          +{displayProducts.length - maxDisplay} more in your history
        </p>
      )}
    </div>
  );
}
