'use client';

/**
 * Review Step Component
 *
 * Step 3 of checkout: Review order and place order
 * - Display shipping address
 * - Display payment method
 * - Order notes field
 * - Terms and conditions checkbox
 * - Place Order button
 */

import { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, FileText, Loader2 } from 'lucide-react';
import type { CheckoutData } from '../CheckoutPageClient';
import { useToast } from '@/components/ui/Toast';

interface ReviewStepProps {
  data: CheckoutData;
  onBack: () => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

export default function ReviewStep({ data, onBack, onPlaceOrder, isProcessing }: ReviewStepProps) {
  const { showToast } = useToast();
  const [orderNotes, setOrderNotes] = useState(data.orderNotes || '');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { shippingAddress, billingAddress, paymentMethod } = data;

  const handlePlaceOrder = () => {
    if (!acceptedTerms) {
      showToast('warning', 'Accept Terms', 'Please accept the terms and conditions to continue');
      return;
    }

    onPlaceOrder();
  };

  return (
    <div className="space-y-8">
      {/* Review Header */}
      <div>
        <h2 className="mb-2 text-2xl font-bold text-neutral-900">Review Your Order</h2>
        <p className="text-neutral-600">Please review your information before placing your order</p>
      </div>

      {/* Shipping Address */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
        <div className="mb-4 flex items-start gap-3">
          <MapPin className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-neutral-900">Shipping Address</h3>
          </div>
          <button
            onClick={() => onBack()}
            className="text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
          >
            Edit
          </button>
        </div>
        <div className="ml-9 space-y-1 text-sm text-neutral-700">
          <p className="font-medium">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          {shippingAddress.company && <p>{shippingAddress.company}</p>}
          <p>{shippingAddress.address1}</p>
          {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
          <p>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postcode}
          </p>
          <p>{shippingAddress.country}</p>
          <p className="pt-2">Phone: {shippingAddress.phone}</p>
          <p>Email: {shippingAddress.email}</p>
        </div>
      </div>

      {/* Billing Address */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
        <div className="mb-4 flex items-start gap-3">
          <FileText className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-neutral-900">Billing Address</h3>
          </div>
          <button
            onClick={() => onBack()}
            className="text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
          >
            Edit
          </button>
        </div>
        <div className="ml-9 text-sm text-neutral-700">
          {billingAddress.sameAsShipping ? (
            <p className="italic text-neutral-600">Same as shipping address</p>
          ) : (
            <div className="space-y-1">
              <p className="font-medium">
                {billingAddress.firstName} {billingAddress.lastName}
              </p>
              {billingAddress.company && <p>{billingAddress.company}</p>}
              <p>{billingAddress.address1}</p>
              {billingAddress.address2 && <p>{billingAddress.address2}</p>}
              <p>
                {billingAddress.city}, {billingAddress.state} {billingAddress.postcode}
              </p>
              <p>{billingAddress.country}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
        <div className="mb-4 flex items-start gap-3">
          <CreditCard className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-500" />
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-neutral-900">Payment Method</h3>
          </div>
          <button
            onClick={() => onBack()}
            className="text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
          >
            Edit
          </button>
        </div>
        <div className="ml-9 text-sm text-neutral-700">
          <p className="font-medium">{paymentMethod?.title || 'Not selected'}</p>
          {paymentMethod?.id === 'credit_card' && (
            <p className="mt-1 text-xs text-neutral-600">
              Your card will be charged after order confirmation
            </p>
          )}
          {paymentMethod?.id === 'paypal' && (
            <p className="mt-1 text-xs text-neutral-600">
              You will be redirected to PayPal to complete payment
            </p>
          )}
        </div>
      </div>

      {/* Order Notes */}
      <div>
        <label htmlFor="orderNotes" className="mb-2 block text-sm font-medium text-neutral-700">
          Order Notes (Optional)
        </label>
        <textarea
          id="orderNotes"
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          rows={4}
          placeholder="Add any special instructions or notes about your order..."
          className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Terms and Conditions */}
      <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 h-5 w-5 flex-shrink-0 rounded border-neutral-300 text-primary-500 focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-700">
            I have read and agree to the{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-500 underline hover:text-primary-600"
            >
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-500 underline hover:text-primary-600"
            >
              Privacy Policy
            </a>
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between border-t border-neutral-200 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center gap-2 rounded-xl bg-neutral-200 px-8 py-4 font-bold text-neutral-900 transition-colors hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="btn-bapi-accent flex items-center gap-2 rounded-xl px-8 py-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Place Order
              <span className="text-xl">🎉</span>
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 pt-4 text-sm text-neutral-500">
        <span className="text-xl">🔒</span>
        <span>Secure 256-bit SSL encrypted checkout</span>
      </div>
    </div>
  );
}
