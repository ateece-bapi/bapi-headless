'use client';

/**
 * Checkout Summary Component
 *
 * Displays order summary in checkout sidebar:
 * - Cart items with images and prices
 * - Subtotal, tax, shipping, total
 * - Sticky positioning on desktop
 */

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ShoppingCart } from 'lucide-react';

interface CheckoutSummaryProps {
  cart: any;
}

export default function CheckoutSummary({ cart }: CheckoutSummaryProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('checkoutPage.summary');

  if (!cart) {
    return null;
  }

  const parsePrice = (price: string | undefined): number => {
    if (!price) return 0;
    return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
  };

  const subtotal = parsePrice(cart.subtotal);
  const tax = parsePrice(cart.tax || cart.totalTax);
  const shipping = parsePrice(cart.shipping || cart.shippingTotal);
  const discount = parsePrice(cart.discountTotal);
  const total = parsePrice(cart.total);

  return (
    <div className="sticky top-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-6 py-4">
        <ShoppingCart className="h-5 w-5 text-neutral-600" />
        <h2 className="text-lg font-semibold text-neutral-900">{t('title')}</h2>
      </div>

      <div className="space-y-6 p-6">
        {/* Cart Items */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
            {t('items', { count: cart.contents?.itemCount || 0 })}
          </h3>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {cart.contents?.nodes?.map((item: any) => {
              const product = item.product.node;
              const variation = item.variation?.node;
              const displayProduct = variation || product;
              const image = displayProduct.image || product.image;

              return (
                <div key={item.key} className="flex gap-3">
                  {/* Product Image */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {image ? (
                      <Image
                        src={image.sourceUrl}
                        alt={image.altText || product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        {t('noImage')}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-2 text-sm font-medium text-neutral-900">
                      {product.name}
                    </h4>
                    {variation && (
                      <p className="mt-0.5 text-xs text-neutral-600">{variation.name}</p>
                    )}
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-neutral-500">
                        {t('qty')}: {item.quantity}
                      </span>
                      <span className="text-sm font-semibold text-neutral-900">{item.total}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Cart Link */}
          <Link
            href={`/${locale}/cart`}
            className="text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
          >
            {t('editCart')}
          </Link>
        </div>

        {/* Totals */}
        <div className="space-y-3 border-t border-neutral-200 pt-4">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>{t('subtotal')}</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-success-600">
              <span>{t('discount')}</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-neutral-600">
            <span>{t('shipping')}</span>
            <span className="font-medium">
              {shipping > 0 ? `$${shipping.toFixed(2)}` : t('calculatedAtCheckout')}
            </span>
          </div>

          <div className="flex justify-between text-sm text-neutral-600">
            <span>{t('tax')}</span>
            <span className="font-medium">
              {tax > 0 ? `$${tax.toFixed(2)}` : t('calculatedAtCheckout')}
            </span>
          </div>

          <div className="border-t border-neutral-200 pt-3">
            <div className="flex justify-between text-lg font-bold text-neutral-900">
              <span>{t('total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
            <span className="text-xl">🔒</span>
            <span>{t('secureCheckout')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
