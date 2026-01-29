'use client';

/**
 * CartSummary Component
 * 
 * Displays cart totals and checkout options:
 * - Subtotal, tax, shipping, discounts
 * - Coupon code application
 * - Applied coupons list
 * - Proceed to Checkout button
 * - Order summary breakdown
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, X, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';

interface CartSummaryProps {
  cart: {
    subtotal: string;
    total: string;
    contentsTax: string;
    shippingTotal: string;
    shippingTax: string;
    totalTax: string;
    discountTotal: string;
    discountTax: string;
    appliedCoupons?: Array<{
      code: string;
      discountAmount: string;
    }>;
  };
  onApplyCoupon: () => void;
  isUpdating: boolean;
}

export default function CartSummary({
  cart,
  onApplyCoupon,
  isUpdating,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      showToast('warning', 'Enter Code', 'Please enter a coupon code');
      return;
    }

    try {
      setIsApplying(true);
      const response = await fetch('/api/cart/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply coupon');
      }

      showToast('success', 'Coupon Applied', `Coupon "${couponCode}" applied successfully`);
      setCouponCode('');
      onApplyCoupon();
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('cart.apply_coupon_failed', error, { couponCode });
      showToast('error', title, message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = async (code: string) => {
    try {
      const response = await fetch('/api/cart/remove-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove coupon');
      }

      showToast('success', 'Coupon Removed', `Coupon "${code}" removed`);
      onApplyCoupon();
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('cart.remove_coupon_failed', error, { code });
      showToast('error', title, message);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  // Parse prices (remove currency symbols, convert to number)
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
      <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
        <h2 className="text-lg font-semibold text-neutral-900">
          Order Summary
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Coupon Code */}
        <div>
          <label htmlFor="coupon" className="block text-sm font-medium text-neutral-700 mb-2">
            Have a coupon code?
          </label>
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              id="coupon"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter code"
              disabled={isApplying || isUpdating}
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isApplying || isUpdating || !couponCode.trim()}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          </form>
        </div>

        {/* Applied Coupons */}
        {cart.appliedCoupons && cart.appliedCoupons.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">Applied Coupons:</p>
            {cart.appliedCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="flex items-center justify-between px-3 py-2 bg-success-50 border border-success-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-success-600" />
                  <span className="font-mono text-sm font-medium text-success-900">
                    {coupon.code}
                  </span>
                  <span className="text-sm text-success-700">
                    -{coupon.discountAmount}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveCoupon(coupon.code)}
                  disabled={isUpdating}
                  className="text-success-600 hover:text-success-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Totals Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-success-600">
              <span>Discount</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span className="font-medium">
              {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Calculated at checkout'}
            </span>
          </div>

          <div className="flex justify-between text-neutral-600">
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

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isUpdating}
          className="w-full btn-bapi-accent py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Proceed to Checkout
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Security Badges */}
        <div className="pt-4 border-t border-neutral-200">
          <p className="text-xs text-center text-neutral-500 mb-3">
            Secure Checkout
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-2xl">🔒</div>
            <div className="text-xs text-neutral-500 text-center">
              256-bit SSL encrypted
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-900 font-medium mb-1">
            ✓ Free shipping on orders over $500
          </p>
          <p className="text-xs text-primary-700">
            Standard shipping: 3-5 business days
          </p>
        </div>
      </div>
    </div>
  );
}
