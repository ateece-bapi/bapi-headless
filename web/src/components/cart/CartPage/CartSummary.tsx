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
import { useTranslations } from 'next-intl';
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

export default function CartSummary({ cart, onApplyCoupon, isUpdating }: CartSummaryProps) {
  const t = useTranslations();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      showToast('warning', t('cartPage.toasts.enterCode'), t('cartPage.toasts.enterCodeMessage'));
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

      showToast('success', t('cartPage.toasts.couponApplied'), t('cartPage.toasts.couponAppliedMessage', { code: couponCode }));
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

      showToast('success', t('cartPage.toasts.couponRemoved'), t('cartPage.toasts.couponRemovedMessage', { code }));
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
    <div className="sticky top-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-neutral-900">{t('cartPage.summary.title')}</h2>
      </div>

      <div className="space-y-6 p-6">
        {/* Coupon Code */}
        <div>
          <label htmlFor="coupon" className="mb-2 block text-sm font-medium text-neutral-700">
            {t('cartPage.coupon.label')}
          </label>
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              id="coupon"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={t('cartPage.coupon.placeholder')}
              disabled={isApplying || isUpdating}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isApplying || isUpdating || !couponCode.trim()}
              className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Tag className="h-4 w-4" />
              {isApplying ? t('cartPage.coupon.applying') : t('cartPage.coupon.apply')}
            </button>
          </form>
        </div>

        {/* Applied Coupons */}
        {cart.appliedCoupons && cart.appliedCoupons.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">{t('cartPage.coupon.appliedCoupons')}</p>
            {cart.appliedCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="border-success-200 flex items-center justify-between rounded-lg border bg-success-50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-success-600" />
                  <span className="text-success-900 font-mono text-sm font-medium">
                    {coupon.code}
                  </span>
                  <span className="text-sm text-success-700">-{coupon.discountAmount}</span>
                </div>
                <button
                  onClick={() => handleRemoveCoupon(coupon.code)}
                  disabled={isUpdating}
                  className="text-success-600 transition-colors hover:text-success-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={t('cartPage.coupon.remove')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Totals Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>{t('cartPage.summary.subtotal')}</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-success-600">
              <span>{t('cartPage.summary.discount')}</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-neutral-600">
            <span>{t('cartPage.summary.shipping')}</span>
            <span className="font-medium">
              {shipping > 0 ? `$${shipping.toFixed(2)}` : t('cartPage.summary.calculatedAtCheckout')}
            </span>
          </div>

          <div className="flex justify-between text-neutral-600">
            <span>{t('cartPage.summary.tax')}</span>
            <span className="font-medium">
              {tax > 0 ? `$${tax.toFixed(2)}` : t('cartPage.summary.calculatedAtCheckout')}
            </span>
          </div>

          <div className="border-t border-neutral-200 pt-3">
            <div className="flex justify-between text-lg font-bold text-neutral-900">
              <span>{t('cartPage.summary.total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isUpdating}
          className="btn-bapi-accent flex w-full items-center justify-center gap-2 rounded-xl py-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('cartPage.summary.proceedToCheckout')}
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Security Badges */}
        <div className="border-t border-neutral-200 pt-4">
          <p className="mb-3 text-center text-xs text-neutral-500">{t('cartPage.summary.secureCheckout')}</p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-2xl">🔒</div>
            <div className="text-center text-xs text-neutral-500">{t('cartPage.summary.sslEncrypted')}</div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
          <p className="mb-1 text-sm font-medium text-primary-900">
            {t('cartPage.shipping.freeShipping')}
          </p>
          <p className="text-xs text-primary-700">{t('cartPage.shipping.standardShipping')}</p>
        </div>
      </div>
    </div>
  );
}
