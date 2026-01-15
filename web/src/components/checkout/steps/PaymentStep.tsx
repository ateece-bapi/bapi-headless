'use client';

/**
 * Payment Step Component
 * 
 * Step 2 of checkout: Select payment method
 * - Payment method selection (Credit Card, PayPal)
 * - Payment form (for demo, real integration would use Stripe/PayPal)
 * - Back and Next navigation
 */

import { useState } from 'react';
import { ArrowRight, ArrowLeft, CreditCard, Banknote } from 'lucide-react';
import type { CheckoutData } from '../CheckoutPageClient';
import { useToast } from '@/components/ui/Toast';

interface PaymentStepProps {
  data: CheckoutData;
  onNext: () => void;
  onBack: () => void;
  onUpdateData: (data: Partial<CheckoutData>) => void;
}

const paymentMethods = [
  {
    id: 'credit_card',
    title: 'Credit Card',
    description: 'Pay with credit or debit card',
    icon: CreditCard,
  },
  {
    id: 'paypal',
    title: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: Banknote,
  },
];

export default function PaymentStep({
  data,
  onNext,
  onBack,
  onUpdateData,
}: PaymentStepProps) {
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string>(
    data.paymentMethod?.id || ''
  );
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    const method = paymentMethods.find((m) => m.id === methodId);
    if (method) {
      onUpdateData({
        paymentMethod: {
          id: method.id,
          title: method.title,
        },
      });
    }
  };

  const validateCardData = (): boolean => {
    if (selectedMethod === 'credit_card') {
      if (
        !cardData.cardNumber ||
        !cardData.cardName ||
        !cardData.expiryDate ||
        !cardData.cvv
      ) {
        showToast(
          'warning',
          'Missing Information',
          'Please fill in all card details'
        );
        return false;
      }

      // Basic card number validation (16 digits)
      const cardNum = cardData.cardNumber.replace(/\s/g, '');
      if (cardNum.length !== 16 || !/^\d+$/.test(cardNum)) {
        showToast(
          'warning',
          'Invalid Card',
          'Please enter a valid 16-digit card number'
        );
        return false;
      }

      // Basic expiry validation (MM/YY format)
      if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
        showToast(
          'warning',
          'Invalid Expiry',
          'Please enter expiry in MM/YY format'
        );
        return false;
      }

      // Basic CVV validation (3-4 digits)
      if (!/^\d{3,4}$/.test(cardData.cvv)) {
        showToast('warning', 'Invalid CVV', 'Please enter a valid 3-4 digit CVV');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMethod) {
      showToast(
        'warning',
        'Select Payment Method',
        'Please select a payment method'
      );
      return;
    }

    if (!validateCardData()) {
      return;
    }

    onNext();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Payment Method Selection */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Payment Method
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => handleMethodSelect(method.id)}
                className={`
                  relative p-6 border-2 rounded-xl text-left transition-all
                  ${
                    selectedMethod === method.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }
                `}
              >
                {/* Selected Indicator */}
                {selectedMethod === method.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                <Icon
                  className={`w-8 h-8 mb-3 ${
                    selectedMethod === method.id
                      ? 'text-primary-500'
                      : 'text-neutral-400'
                  }`}
                />
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  {method.title}
                </h3>
                <p className="text-sm text-neutral-600">{method.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Credit Card Form */}
      {selectedMethod === 'credit_card' && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Card Details
          </h3>

          {/* Card Number */}
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Card Number *
            </label>
            <input
              type="text"
              id="cardNumber"
              value={cardData.cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                if (formatted.replace(/\s/g, '').length <= 16) {
                  setCardData((prev) => ({ ...prev, cardNumber: formatted }));
                }
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Cardholder Name */}
          <div>
            <label
              htmlFor="cardName"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Cardholder Name *
            </label>
            <input
              type="text"
              id="cardName"
              value={cardData.cardName}
              onChange={(e) =>
                setCardData((prev) => ({ ...prev, cardName: e.target.value }))
              }
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div>
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Expiry Date *
              </label>
              <input
                type="text"
                id="expiryDate"
                value={cardData.expiryDate}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value);
                  setCardData((prev) => ({ ...prev, expiryDate: formatted }));
                }}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* CVV */}
            <div>
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                CVV *
              </label>
              <input
                type="text"
                id="cvv"
                value={cardData.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    setCardData((prev) => ({ ...prev, cvv: value }));
                  }
                }}
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-start gap-2 bg-primary-50 border border-primary-200 rounded-lg p-4 mt-4">
            <span className="text-xl">🔒</span>
            <div>
              <p className="text-sm font-medium text-primary-900">
                Your payment is secure
              </p>
              <p className="text-xs text-primary-700 mt-1">
                We use 256-bit SSL encryption to protect your information
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PayPal Info */}
      {selectedMethod === 'paypal' && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
          <p className="text-sm text-neutral-600">
            You will be redirected to PayPal to complete your purchase securely.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-4 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <button
          type="submit"
          className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          Review Order
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
