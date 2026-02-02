'use client';

/**
 * CartItems Component
 * 
 * Displays list of cart items with:
 * - Product image, name, price
 * - Quantity selector
 * - Remove button
 * - Stock status
 * - Variation details (if applicable)
 * - Clear cart button
 */

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, X } from 'lucide-react';

interface CartItem {
  key: string;
  quantity: number;
  subtotal: string;
  total: string;
  tax: string;
  product: {
    node: {
      id: string;
      databaseId: number;
      name: string;
      slug: string;
      price: string;
      regularPrice?: string;
      salePrice?: string;
      stockStatus: string;
      stockQuantity?: number;
      image?: {
        sourceUrl: string;
        altText?: string;
      };
    };
  };
  variation?: {
    node: {
      id: string;
      databaseId: number;
      name: string;
      price: string;
      regularPrice?: string;
      salePrice?: string;
      stockStatus: string;
      stockQuantity?: number;
      image?: {
        sourceUrl: string;
        altText?: string;
      };
    };
  };
}

interface CartItemsProps {
  items: CartItem[];
  isUpdating: boolean;
  onUpdateQuantity: (itemKey: string, newQuantity: number) => void;
  onRemoveItem: (itemKey: string) => void;
  onClearCart: () => void;
}

export default function CartItems({
  items,
  isUpdating,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartItemsProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
        <h2 className="text-lg font-semibold text-neutral-900">
          Cart Items ({items.length})
        </h2>
        <button
          onClick={onClearCart}
          disabled={isUpdating}
          className="flex items-center gap-2 text-sm text-error-600 hover:text-error-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Clear cart"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      {/* Items List */}
      <div className="divide-y divide-neutral-200">
        {items.map((item) => {
          const product = item.product.node;
          const variation = item.variation?.node;
          const displayProduct = variation || product;
          const image = displayProduct.image || product.image;
          const isOnSale = displayProduct.salePrice && 
            displayProduct.regularPrice !== displayProduct.salePrice;
          
          return (
            <div
              key={item.key}
              className="p-6 flex flex-col sm:flex-row gap-4 hover:bg-neutral-50 transition-colors"
            >
              {/* Product Image */}
              <Link
                href={`/en/product/${product.slug}`}
                className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-neutral-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
              >
                {image ? (
                  <Image
                    src={image.sourceUrl}
                    alt={image.altText || product.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    No Image
                  </div>
                )}
              </Link>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/en/product/${product.slug}`}
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-500 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Variation Details */}
                {variation && (
                  <p className="text-sm text-neutral-600 mt-1">
                    {variation.name}
                  </p>
                )}

                {/* Stock Status */}
                <div className="mt-2">
                  {displayProduct.stockStatus === 'IN_STOCK' ? (
                    <span className="inline-flex items-center gap-1 text-sm text-success-600 font-medium">
                      <span className="w-2 h-2 bg-success-600 rounded-full"></span>
                      In Stock
                      {displayProduct.stockQuantity && (
                        <span className="text-neutral-500">
                          ({displayProduct.stockQuantity} available)
                        </span>
                      )}
                    </span>
                  ) : displayProduct.stockStatus === 'OUT_OF_STOCK' ? (
                    <span className="inline-flex items-center gap-1 text-sm text-error-600 font-medium">
                      <span className="w-2 h-2 bg-error-600 rounded-full"></span>
                      Out of Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-warning-600 font-medium">
                      <span className="w-2 h-2 bg-warning-600 rounded-full"></span>
                      On Backorder
                    </span>
                  )}
                </div>

                {/* Quantity and Remove - Mobile */}
                <div className="flex items-center gap-4 mt-4 sm:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                      disabled={isUpdating || item.quantity <= 1}
                      className="w-9 h-9 flex items-center justify-center bg-neutral-100 hover:bg-primary-50 border border-neutral-300 hover:border-primary-300 rounded-lg text-neutral-700 hover:text-primary-600 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 disabled:hover:border-neutral-300 active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-neutral-900 text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                      disabled={isUpdating}
                      className="w-9 h-9 flex items-center justify-center bg-neutral-100 hover:bg-primary-50 border border-neutral-300 hover:border-primary-300 rounded-lg text-neutral-700 hover:text-primary-600 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 disabled:hover:border-neutral-300 active:scale-95"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onRemoveItem(item.key)}
                    disabled={isUpdating}
                    className="ml-auto text-error-600 hover:text-error-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Price and Quantity - Desktop */}
              <div className="hidden sm:flex flex-col items-end gap-4">
                {/* Price */}
                <div className="text-right">
                  <div className="text-xl font-bold text-neutral-900">
                    {item.total}
                  </div>
                  {isOnSale && displayProduct.regularPrice && (
                    <div className="text-sm text-neutral-500 line-through">
                      {displayProduct.regularPrice}
                    </div>
                  )}
                  {item.quantity > 1 && (
                    <div className="text-sm text-neutral-500">
                      {displayProduct.price} each
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center bg-neutral-100 hover:bg-primary-50 border border-neutral-300 hover:border-primary-300 rounded-lg text-neutral-700 hover:text-primary-600 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 disabled:hover:border-neutral-300 active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-neutral-900 text-base">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                    disabled={isUpdating}
                    className="w-9 h-9 flex items-center justify-center bg-neutral-100 hover:bg-primary-50 border border-neutral-300 hover:border-primary-300 rounded-lg text-neutral-700 hover:text-primary-600 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-100 disabled:hover:border-neutral-300 active:scale-95"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveItem(item.key)}
                  disabled={isUpdating}
                  className="text-error-600 hover:text-error-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              </div>

              {/* Price - Mobile */}
              <div className="sm:hidden text-right">
                <div className="text-xl font-bold text-neutral-900">
                  {item.total}
                </div>
                {isOnSale && displayProduct.regularPrice && (
                  <div className="text-sm text-neutral-500 line-through">
                    {displayProduct.regularPrice}
                  </div>
                )}
                {item.quantity > 1 && (
                  <div className="text-sm text-neutral-500">
                    {displayProduct.price} each
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
