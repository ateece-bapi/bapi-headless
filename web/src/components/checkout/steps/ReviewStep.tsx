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

export default function ReviewStep({
  data,
  onBack,
  onPlaceOrder,
  isProcessing,
}: ReviewStepProps) {
  const { showToast } = useToast();
  const [orderNotes, setOrderNotes] = useState(data.orderNotes || '');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { shippingAddress, billingAddress, paymentMethod } = data;

  const handlePlaceOrder = () => {
    if (!acceptedTerms) {
      showToast(
        'warning',
        'Accept Terms',
        'Please accept the terms and conditions to continue'
      );
      return;
    }

    onPlaceOrder();
  };

  return (
    <div className="space-y-8">
      {/* Review Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Review Your Order
        </h2>
        <p className="text-neutral-600">
          Please review your information before placing your order
        </p>
      </div>

      {/* Shipping Address */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              Shipping Address
            </h3>
          </div>
          <button
            onClick={() => onBack()}
            className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="ml-9 text-sm text-neutral-700 space-y-1">
          <p className="font-medium">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          {shippingAddress.company && <p>{shippingAddress.company}</p>}
          <p>{shippingAddress.address1}</p>
          {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
          <p>
            {shippingAddress.city}, {shippingAddress.state}{' '}
            {shippingAddress.postcode}
          </p>
          <p>{shippingAddress.country}</p>
          <p className="pt-2">Phone: {shippingAddress.phone}</p>
          <p>Email: {shippingAddress.email}</p>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              Billing Address
            </h3>
          </div>
          <button
            onClick={() => onBack()}
            className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="ml-9 text-sm text-neutral-700">
          {billingAddress.sameAsShipping ? (
            <p className="text-neutral-600 italic">Same as shipping address</p>
          ) : (
            <div className="space-y-1">
              <p className="font-medium">
                {billingAddress.firstName} {billingAddress.lastName}
              </p>
              {billingAddress.company && <p>{billingAddress.company}</p>}
              <p>{billingAddress.address1}</p>
              {billingAddress.address2 && <p>{billingAddress.address2}</p>}
              <p>
                {billingAddress.city}, {billingAddress.state}{' '}
                {billingAddress.postcode}
              </p>
              <p>{billingAddress.country}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              Payment Method
            </h3>
          </div>
          <button
            onClick={() => onBack()}
            className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="ml-9 text-sm text-neutral-700">
          <p className="font-medium">{paymentMethod?.title || 'Not selected'}</p>
          {paymentMethod?.id === 'credit_card' && (
            <p className="text-neutral-600 text-xs mt-1">
              Your card will be charged after order confirmation
            </p>
          )}
          {paymentMethod?.id === 'paypal' && (
            <p className="text-neutral-600 text-xs mt-1">
              You will be redirected to PayPal to complete payment
            </p>
          )}
        </div>
      </div>

      {/* Order Notes */}
      <div>
        <label
          htmlFor="orderNotes"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Order Notes (Optional)
        </label>
        <textarea
          id="orderNotes"
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          rows={4}
          placeholder="Add any special instructions or notes about your order..."
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Terms and Conditions */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 flex-shrink-0"
          />
          <span className="text-sm text-neutral-700">
            I have read and agree to the{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 font-medium underline"
            >
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 font-medium underline"
            >
              Privacy Policy
            </a>
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="px-8 py-4 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
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
      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 pt-4">
        <span className="text-xl">🔒</span>
        <span>Secure 256-bit SSL encrypted checkout</span>
      </div>
    </div>
  );
}
