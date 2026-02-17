'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SimpleProduct, VariableProduct } from '@/lib/graphql/generated';
import { getProductPrice, getProductStockStatus } from '@/lib/graphql/types';
import { X, ExternalLink, Package, DollarSign } from 'lucide-react';
import { useRegion } from '@/store/regionStore';

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
  
  // Get current region for currency conversion
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

  // Get image URL
  const imageUrl = product.image?.sourceUrl || '/images/placeholder.png';
  const imageAlt = product.image?.altText || product.name || 'Product image';

  return (
    <div
      className="z-modal fixed inset-0 flex animate-[fade-in_200ms_ease-out] items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop with BAPI gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-primary-800/30 to-accent-900/20 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative max-h-[90vh] w-full max-w-4xl animate-[scale-in_300ms_ease-out] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
          aria-label="Close quick view"
        >
          <X className="h-5 w-5 text-neutral-700" />
        </button>

        <div className="grid gap-8 p-8 md:grid-cols-2">
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
                <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                  <Package className="h-4 w-4" />
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
                <DollarSign className="h-5 w-5 text-primary-500" />
                <span className="text-3xl font-bold text-primary-600">{price}</span>
              </div>
            )}

            {/* Short Description */}
            {product.shortDescription && (
              <div
                className="mb-6 line-clamp-4 text-neutral-600"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            )}

            {/* Product Type Badge */}
            {isSimple && (
              <div className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5">
                <span className="text-xs font-medium text-primary-700">Simple Product</span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-3">
              {/* Add to Cart Button */}
              <button
                className="bg-bapi-accent-gradient w-full rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!inStock}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* View Full Details Link */}
              <Link
                href={`/${locale}/product/${product.slug}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-50 px-6 py-3 font-semibold text-primary-600 transition-all duration-200 hover:bg-primary-100"
                onClick={onClose}
              >
                View Full Details
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
