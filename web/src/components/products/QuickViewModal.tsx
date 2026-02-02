'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/graphql/types';
import { getProductPrice, getProductStockStatus, isSimpleProduct } from '@/lib/graphql/types';
import { X, ExternalLink, Package, DollarSign } from 'lucide-react';

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
  const price = getProductPrice(product);
  const stockStatus = getProductStockStatus(product);
  const inStock = stockStatus === 'IN_STOCK';

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
      className="fixed inset-0 z-modal flex items-center justify-center p-4 animate-[fade-in_200ms_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop with BAPI gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-primary-800/30 to-accent-900/20 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-[scale-in_300ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5 text-neutral-700" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Left: Product Image */}
          <div className="relative aspect-square bg-neutral-50 rounded-xl overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-[shimmer_2s_ease-in-out_infinite]" />
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
            <h2 id="quick-view-title" className="text-2xl font-bold text-neutral-900 mb-3">
              {product.name}
            </h2>

            {/* SKU and Stock Status */}
            <div className="flex items-center gap-3 mb-4">
              {product.sku && (
                <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                  <Package className="w-4 h-4" />
                  <span>SKU: {product.sku}</span>
                </div>
              )}
              {inStock ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-50 text-success-700 border border-success-200">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Price */}
            {price && (
              <div className="flex items-baseline gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-primary-500" />
                <span className="text-3xl font-bold text-primary-600">
                  {price}
                </span>
              </div>
            )}

            {/* Short Description */}
            {product.shortDescription && (
              <div
                className="text-neutral-600 mb-6 line-clamp-4"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            )}

            {/* Product Type Badge */}
            {isSimpleProduct(product) && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 border border-primary-200 w-fit mb-6">
                <span className="text-xs font-medium text-primary-700">
                  Simple Product
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-3">
              {/* Add to Cart Button */}
              <button
                className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-bapi-accent-gradient hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inStock}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* View Full Details Link */}
              <Link
                href={`/${locale}/products/${product.slug}`}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all duration-200"
                onClick={onClose}
              >
                View Full Details
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
