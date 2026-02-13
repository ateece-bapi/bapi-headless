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
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-neutral-900">{t('cartPage.items.title')} ({items.length})</h2>
        <button
          onClick={onClearCart}
          disabled={isUpdating}
          className="flex items-center gap-2 text-sm font-medium text-error-600 transition-colors hover:text-error-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear cart"
        >
          <Trash2 className="h-4 w-4" />
          {t('cartPage.items.clearCart')}
        </button>
      </div>

      {/* Items List */}
      <div className="divide-y divide-neutral-200">
        {items.map((item) => {
          const product = item.product.node;
          const variation = item.variation?.node;
          const displayProduct = variation || product;
          const image = displayProduct.image || product.image;
          const isOnSale =
            displayProduct.salePrice && displayProduct.regularPrice !== displayProduct.salePrice;

          return (
            <div
              key={item.key}
              className="flex flex-col gap-4 p-6 transition-colors hover:bg-neutral-50 sm:flex-row"
            >
              {/* Product Image */}
              <Link
                href={`/${locale}/product/${product.slug}`}
                className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 transition-opacity hover:opacity-80 sm:h-32 sm:w-32"
              >
                {image ? (
                  <Image
                    src={image.sourceUrl}
                    alt={image.altText || product.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-400">
                    {t('cartPage.items.noImage')}
                  </div>
                )}
              </Link>

              {/* Product Details */}
              <div className="min-w-0 flex-1">
                <Link href={`/${locale}/product/${product.slug}`} className="group block">
                  <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary-500">
                    {product.name}
                  </h3>
                </Link>

                {/* Variation Details */}
                {variation && <p className="mt-1 text-sm text-neutral-600">{variation.name}</p>}

                {/* Stock Status */}
                <div className="mt-2">
                  {displayProduct.stockStatus === 'IN_STOCK' ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-success-600">
                      <span className="h-2 w-2 rounded-full bg-success-600"></span>
                      {t('cartPage.stock.inStock')}
                      {displayProduct.stockQuantity && (
                        <span className="text-neutral-500">
                          ({t('cartPage.stock.available', { count: displayProduct.stockQuantity })})
                        </span>
                      )}
                    </span>
                  ) : displayProduct.stockStatus === 'OUT_OF_STOCK' ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-error-600">
                      <span className="h-2 w-2 rounded-full bg-error-600"></span>
                      {t('cartPage.stock.outOfStock')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-warning-600">
                      <span className="h-2 w-2 rounded-full bg-warning-600"></span>
                      {t('cartPage.stock.onBackorder')}
                    </span>
                  )}
                </div>

                {/* Quantity and Remove - Mobile */}
                <div className="mt-4 flex items-center gap-4 sm:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                      disabled={isUpdating || item.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100 font-semibold text-neutral-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:bg-neutral-100"
                      aria-label={t('cartPage.quantity.decrease')}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-base font-bold text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                      disabled={isUpdating}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100 font-semibold text-neutral-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:bg-neutral-100"
                      aria-label={t('cartPage.quantity.increase')}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.key)}
                    disabled={isUpdating}
                    className="ml-auto font-medium text-error-600 transition-colors hover:text-error-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Price and Quantity - Desktop */}
              <div className="hidden flex-col items-end gap-4 sm:flex">
                {/* Price */}
                <div className="text-right">
                  <div className="text-xl font-bold text-neutral-900">{item.total}</div>
                  {isOnSale && displayProduct.regularPrice && (
                    <div className="text-sm text-neutral-500 line-through">
                      {displayProduct.regularPrice}
                    </div>
                  )}
                  {item.quantity > 1 && (
                    <div className="text-sm text-neutral-500">{t('cartPage.items.priceEach', { price: displayProduct.price })}</div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100 font-semibold text-neutral-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:bg-neutral-100"
                    aria-label={t('cartPage.quantity.decrease')}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-base font-bold text-neutral-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                    disabled={isUpdating}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100 font-semibold text-neutral-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:bg-neutral-100"
                    aria-label={t('cartPage.quantity.increase')}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveItem(item.key)}
                  disabled={isUpdating}
                  className="flex items-center gap-1 font-medium text-error-600 transition-colors hover:text-error-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  {t('cartPage.items.remove')}
                </button>
              </div>

              {/* Price - Mobile */}
              <div className="text-right sm:hidden">
                <div className="text-xl font-bold text-neutral-900">{item.total}</div>
                {isOnSale && displayProduct.regularPrice && (
                  <div className="text-sm text-neutral-500 line-through">
                    {displayProduct.regularPrice}
                  </div>
                )}
                {item.quantity > 1 && (
                  <div className="text-sm text-neutral-500">{t('cartPage.items.priceEach', { price: displayProduct.price })}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
