'use client';

/**
 * Payment Step Component
 * 
 * Step 2 of checkout: Select payment method and process payment
 * - Payment method selection (Credit Card via Stripe, PayPal)
 * - Integrated Stripe Elements for card payment
 * - Back and Next navigation
 */

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CreditCard, Banknote, Loader2 } from 'lucide-react';
import type { CheckoutData } from '../CheckoutPageClient';
import { useToast } from '@/components/ui/Toast';
import { StripeProvider, StripePaymentForm } from '@/components/payment';

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
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoadingIntent, setIsLoadingIntent] = useState(false);
  const [cartTotal, setCartTotal] = useState<number>(0);

  // Fetch cart total from localStorage
  useEffect(() => {
    const fetchCartTotal = () => {
      try {
        // Get cart from local storage (Zustand store)
        const localCartData = localStorage.getItem('bapi-cart-storage');
        if (!localCartData) {
          console.log('[PaymentStep] No cart data found');
          return;
        }
        
        const parsed = JSON.parse(localCartData);
        const items = parsed.state?.items || [];
        
        if (items.length === 0) {
          console.log('[PaymentStep] Cart is empty');
          return;
        }
        
        // Calculate total from items
        const subtotal = items.reduce((sum: number, item: any) => {
          const price = parseFloat(item.price.replace('$', '').replace(',', ''));
          return sum + (price * item.quantity);
        }, 0);
        
        console.log('[PaymentStep] Cart total:', subtotal);
        setCartTotal(subtotal);
      } catch (error) {
        console.error('[PaymentStep] Failed to fetch cart total:', error);
      }
    };

    fetchCartTotal();
  }, []);

  // Create payment intent when credit card is selected
  useEffect(() => {
    if (selectedMethod === 'credit_card' && !clientSecret && cartTotal > 0) {
      createPaymentIntent();
    }
  }, [selectedMethod, cartTotal]);

  const createPaymentIntent = async () => {
    setIsLoadingIntent(true);
    
    try {
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          currency: 'usd',
          metadata: {
            checkoutFlow: 'bapi-headless',
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.clientSecret) {
        setClientSecret(result.clientSecret);
      } else {
        showToast('error', 'Payment Setup Failed', result.message || 'Unable to initialize payment');
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to set up payment. Please try again.');
    } finally {
      setIsLoadingIntent(false);
    }
  };

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

  const handleStripeSuccess = (paymentIntentId: string) => {
    // Store payment intent ID for order creation
    onUpdateData({
      paymentIntentId,
    });
    
    showToast('success', 'Payment Confirmed', 'Proceeding to order review');
    onNext();
  };

  const handleStripeError = (error: string) => {
    showToast('error', 'Payment Failed', error);
  };

  const handlePayPalNext = () => {
    if (!selectedMethod) {
      showToast(
        'warning',
        'Select Payment Method',
        'Please select a payment method'
      );
      return;
    }

    // For PayPal, just proceed to review (payment happens after order placement)
    onNext();
  };

  return (
    <div className="space-y-8">
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

      {/* Stripe Credit Card Form */}
      {selectedMethod === 'credit_card' && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Card Details
          </h3>

          {isLoadingIntent ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <span className="ml-3 text-neutral-600">Setting up payment...</span>
            </div>
          ) : clientSecret ? (
            <StripeProvider clientSecret={clientSecret}>
              <StripePaymentForm
                onSuccess={handleStripeSuccess}
                onError={handleStripeError}
              />
            </StripeProvider>
          ) : (
            <div className="py-8 text-center text-neutral-600">
              Unable to load payment form. Please refresh and try again.
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-start gap-2 bg-primary-50 border border-primary-200 rounded-lg p-4 mt-6">
            <span className="text-xl">🔒</span>
            <div>
              <p className="text-sm font-medium text-primary-900">
                Your payment is secure
              </p>
              <p className="text-xs text-primary-700 mt-1">
                Powered by Stripe with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PayPal Info */}
      {selectedMethod === 'paypal' && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
          <p className="text-sm text-neutral-600">
            You will be redirected to PayPal to complete your purchase securely after reviewing your order.
          </p>
          
          <button
            type="button"
            onClick={handlePayPalNext}
            className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Continue to Review
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Back Button (only show if not in Stripe payment) */}
      {selectedMethod !== 'credit_card' && (
        <div className="flex justify-between pt-6 border-t border-neutral-200">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-4 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      )}

      {/* For credit card, Stripe form handles submission */}
    </div>
  );
}
