'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Package, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import type { SimpleProduct, VariableProduct } from '@/lib/graphql/generated';
import { getProductPrice, getProductStockStatus } from '@/lib/graphql/types';
import { useRegion } from '@/store/regionStore';

type Product = SimpleProduct | VariableProduct;

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClose: () => void;
  locale: string;
}

/**
 * Product Comparison Modal
 *
 * Features:
 * - Side-by-side comparison table
 * - Compare up to 3 products
 * - Images, prices, SKUs, stock status
 * - Specs comparison (if available)
 * - Remove products from comparison
 * - ESC key to close
 */
export default function ProductComparison({
  products,
  onRemove,
  onClose,
  locale,
}: ProductComparisonProps) {
  const region = useRegion();

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

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className="z-modal fixed inset-0 flex animate-[fade-in_200ms_ease-out] items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-primary-800/30 to-accent-900/20 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative max-h-[90vh] w-full max-w-6xl animate-[scale-in_300ms_ease-out] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 rounded-t-2xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 id="comparison-title" className="text-xl font-bold text-white">
              Compare Products ({products.length})
            </h2>
            <button
              onClick={onClose}
              className="rounded-full bg-white/20 p-2 transition-all duration-200 hover:bg-white/30"
              aria-label="Close comparison"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 border-neutral-200 p-4 text-left font-semibold text-neutral-700">
                  Feature
                </th>
                {products.map((product) => (
                  <th key={product.id} className="min-w-[250px] border-b-2 border-neutral-200 p-4">
                    <div className="relative">
                      {/* Remove Button */}
                      <button
                        onClick={() => onRemove(product.id)}
                        className="absolute -right-2 -top-2 rounded-full bg-error-500 p-1.5 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-error-600"
                        aria-label={`Remove ${product.name} from comparison`}
                      >
                        <X className="h-4 w-4" />
                      </button>

                      {/* Product Image */}
                      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-neutral-50">
                        <Image
                          src={product.image?.sourceUrl || '/images/placeholder.png'}
                          alt={product.image?.altText || product.name || 'Product'}
                          fill
                          className="object-contain"
                          sizes="250px"
                        />
                      </div>

                      {/* Product Name */}
                      <Link
                        href={`/${locale}/product/${product.slug}`}
                        className="line-clamp-2 font-semibold text-neutral-900 transition-colors hover:text-primary-600"
                        onClick={onClose}
                      >
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price Row */}
              <tr className="transition-colors hover:bg-neutral-50">
                <td className="border-b border-neutral-200 p-4 font-medium text-neutral-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary-500" />
                    Price
                  </div>
                </td>
                {products.map((product) => {
                  const price = getProductPrice(product, region.currency);
                  return (
                    <td key={product.id} className="border-b border-neutral-200 p-4 text-center">
                      <span className="text-xl font-bold text-primary-600">{price || 'N/A'}</span>
                    </td>
                  );
                })}
              </tr>

              {/* SKU Row */}
              <tr className="transition-colors hover:bg-neutral-50">
                <td className="border-b border-neutral-200 p-4 font-medium text-neutral-700">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary-500" />
                    SKU
                  </div>
                </td>
                {products.map((product) => {
                  const sku =
                    product.__typename === 'SimpleProduct' ? (product as SimpleProduct).sku : null;
                  return (
                    <td
                      key={product.id}
                      className="border-b border-neutral-200 p-4 text-center text-neutral-600"
                    >
                      {sku || 'N/A'}
                    </td>
                  );
                })}
              </tr>

              {/* Stock Status Row */}
              <tr className="transition-colors hover:bg-neutral-50">
                <td className="border-b border-neutral-200 p-4 font-medium text-neutral-700">
                  Stock Status
                </td>
                {products.map((product) => {
                  const stockStatus = getProductStockStatus(product);
                  const inStock = stockStatus === 'IN_STOCK';
                  return (
                    <td key={product.id} className="border-b border-neutral-200 p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                          inStock
                            ? 'border-success-200 border bg-success-50 text-success-700'
                            : 'border border-neutral-200 bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {inStock ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            In Stock
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            Out of Stock
                          </>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Product Type Row */}
              <tr className="transition-colors hover:bg-neutral-50">
                <td className="border-b border-neutral-200 p-4 font-medium text-neutral-700">
                  Product Type
                </td>
                {products.map((product) => (
                  <td
                    key={product.id}
                    className="border-b border-neutral-200 p-4 text-center text-neutral-600"
                  >
                    {product.__typename === 'SimpleProduct' ? 'Simple Product' : 'Variable Product'}
                  </td>
                ))}
              </tr>

              {/* Short Description Row */}
              <tr className="transition-colors hover:bg-neutral-50">
                <td className="p-4 font-medium text-neutral-700">Description</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-sm text-neutral-600">
                    {product.shortDescription ? (
                      <div
                        className="line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                      />
                    ) : (
                      'No description available'
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 rounded-b-2xl border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-neutral-200 bg-white px-6 py-2.5 font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
