'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import type { SimpleProduct, VariableProduct } from '@/lib/graphql/generated';
import { getProductPrice, getProductStockStatus } from '@/lib/graphql/types';
import { XIcon, ExternalLinkIcon, PackageIcon, DollarSignIcon } from '@/lib/icons';
import { useRegion } from '@/store/regionStore';
import { convertWooCommercePriceNumeric } from '@/lib/utils/currency';
import AddToCartButton from '@/components/cart/AddToCartButton';
import type { CartItem } from '@/store';

type Product = SimpleProduct | VariableProduct;

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  locale: string;
}

/**
 * Quick View Modal for product preview
 *
 * Features:
 * - Backdrop blur with BAPI gradient overlay
 * - Product image, name, price, stock status
 * - Short description
 * - Add to cart button
 * - Link to full product page
 * - ESC key and click outside to close
 * - Smooth animations
 */
export default function QuickViewModal({ product, onClose, locale }: QuickViewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const region = useRegion();
  const price = getProductPrice(product, region.currency);
  const stockStatus = getProductStockStatus(product);
  const inStock = stockStatus === 'IN_STOCK';
  const isSimple = product.__typename === 'SimpleProduct';
  const sku = isSimple ? (product as SimpleProduct).sku : null;

  // ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Focus trap: Keep focus within modal
  useEffect(() => {
    if (!modalRef.current) return;

    // Focus close button on open
    closeButtonRef.current?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      // Get all focusable elements in modal
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: Moving backwards
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Moving forwards
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, []);

  // Get image URL
  const imageUrl = product.image?.sourceUrl || '/images/placeholder.png';
  const imageAlt = product.image?.altText || product.name || 'Product image';

  // Prepare cart item data
  const cartItem: Omit<CartItem, 'quantity'> = useMemo(() => {
    // Use WooCommerce price utility for proper parsing (handles commas, ranges, etc.)
    // product.price is the raw WooCommerce price (e.g., "$49.99" or "$1,234.56")
    const rawPrice = isSimple ? (product as SimpleProduct).price : product.price;
    const numericPrice = convertWooCommercePriceNumeric(rawPrice, region.currency);

    // Get part number if available
    const partNumber = isSimple ? (product as SimpleProduct).partNumber : null;

    return {
      id: product.id,
      databaseId: product.databaseId || 0,
      name: product.name || '',
      slug: product.slug || '',
      price: price || '',
      numericPrice,
      image: product.image?.sourceUrl
        ? {
            sourceUrl: product.image.sourceUrl,
            altText: product.image.altText || product.name || '',
          }
        : null,
      partNumber: partNumber || undefined,
    };
  }, [product, price, isSimple, region.currency]);

  return (
    <div
      className="fixed inset-0 z-modal flex animate-[fade-in_200ms_ease-out] items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop with BAPI gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-primary-800/30 to-accent-900/20 backdrop-blur-sm" />

      {/* Modal Content - Full screen on mobile, centered modal on desktop */}
      <div
        ref={modalRef}
        className="relative h-full max-h-full w-full animate-[scale-in_300ms_ease-out] overflow-y-auto bg-white sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl sm:shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Larger touch target on mobile */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-4 top-4 z-10 min-h-[44px] min-w-[44px] rounded-full bg-white/90 p-2.5 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50 sm:p-2"
          aria-label="Close quick view"
          title="Close quick view (or press ESC)"
        >
          <XIcon className="h-5 w-5 text-neutral-700" />
        </button>

        <div className="grid gap-6 p-6 sm:gap-8 sm:p-8 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100" />
            )}
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className={`object-contain transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Product Name */}
            <h2 id="quick-view-title" className="mb-3 text-2xl font-bold text-neutral-900">
              {product.name}
            </h2>

            {/* SKU and Stock Status */}
            <div className="mb-4 flex items-center gap-3">
              {sku && (
                <div className="flex items-center gap-1.5 text-sm text-neutral-700">
                  <PackageIcon className="h-4 w-4" />
                  <span>SKU: {sku}</span>
                </div>
              )}
              {inStock ? (
                <span className="border-success-200 inline-flex items-center rounded-full border bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Price */}
            {price && (
              <div className="mb-6 flex items-baseline gap-2">
                <DollarSignIcon className="h-5 w-5 text-primary-500" />
                <span className="text-3xl font-bold text-primary-600">{price}</span>
              </div>
            )}

            {/* Short Description */}
            {product.shortDescription && (
              <div
                className="mb-6 line-clamp-4 text-neutral-700"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            )}

            {/* Product Type Badge */}
            {isSimple && (
              <div className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5">
                <span className="text-xs font-medium text-primary-700">Simple Product</span>
              </div>
            )}

            {/* Actions - Larger touch targets on mobile */}
            <div className="mt-auto space-y-3">
              {/* Add to Cart Button */}
              <AddToCartButton
                product={cartItem}
                quantity={1}
                disabled={!inStock || !price}
                className="min-h-[48px] w-full sm:min-h-[44px]"
                showCartOnAdd={true}
                ariaLabel={
                  !price
                    ? 'Price unavailable - cannot add to cart'
                    : inStock
                      ? `Add ${product.name} to cart`
                      : 'Out of stock - cannot add to cart'
                }
              />

              {/* View Full Details Link */}
              <Link
                href={`/product/${product.slug}`}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary-50 px-6 py-3 font-semibold text-primary-600 transition-all duration-200 hover:bg-primary-100 sm:min-h-[44px]"
                onClick={onClose}
                title="View complete product details"
              >
                View Full Details
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
