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
import { ShoppingCart } from 'lucide-react';

interface CheckoutSummaryProps {
  cart: any;
}

export default function CheckoutSummary({ cart }: CheckoutSummaryProps) {
  if (!cart) {
    return null;
  }

  const parsePrice = (price: string): number => {
    return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
  };

  const subtotal = parsePrice(cart.subtotal);
  const tax = parsePrice(cart.totalTax);
  const shipping = parsePrice(cart.shippingTotal);
  const discount = parsePrice(cart.discountTotal);
  const total = parsePrice(cart.total);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden sticky top-4">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-neutral-600" />
        <h2 className="text-lg font-semibold text-neutral-900">
          Order Summary
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
            Items ({cart.contents?.itemCount || 0})
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cart.contents?.nodes?.map((item: any) => {
              const product = item.product.node;
              const variation = item.variation?.node;
              const displayProduct = variation || product;
              const image = displayProduct.image || product.image;

              return (
                <div key={item.key} className="flex gap-3">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                    {image ? (
                      <Image
                        src={image.sourceUrl}
                        alt={image.altText || product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-neutral-900 line-clamp-2">
                      {product.name}
                    </h4>
                    {variation && (
                      <p className="text-xs text-neutral-600 mt-0.5">
                        {variation.name}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-neutral-500">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {item.total}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Cart Link */}
          <Link
            href="/cart"
            className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            ← Edit Cart
          </Link>
        </div>

        {/* Totals */}
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-success-600">
              <span>Discount</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-neutral-600">
            <span>Shipping</span>
            <span className="font-medium">
              {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Calculated at checkout'}
            </span>
          </div>

          <div className="flex justify-between text-sm text-neutral-600">
            <span>Tax</span>
            <span className="font-medium">
              {tax > 0 ? `$${tax.toFixed(2)}` : 'Calculated at checkout'}
            </span>
          </div>

          <div className="pt-3 border-t border-neutral-200">
            <div className="flex justify-between text-lg font-bold text-neutral-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
            <span className="text-xl">🔒</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
