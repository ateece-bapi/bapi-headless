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
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import logger from '@/lib/logger';
import { ArrowRight, ArrowLeft, CreditCard, Banknote, Loader2 } from 'lucide-react';
import type { CheckoutData } from '../CheckoutPageClient';
import { useToast } from '@/components/ui/Toast';

// Dynamic imports for Stripe components (reduces bundle size by ~95KB)
const StripeProvider = dynamic(
  () => import('@/components/payment').then((mod) => ({ default: mod.StripeProvider })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
        <span className="ml-2 text-neutral-600">Loading payment form...</span>
      </div>
    ),
    ssr: false,
  }
);

const StripePaymentForm = dynamic(
  () => import('@/components/payment').then((mod) => ({ default: mod.StripePaymentForm })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
      </div>
    ),
    ssr: false,
  }
);

interface PaymentStepProps {
  data: CheckoutData;
  onNext: () => void;
  onBack: () => void;
  onUpdateData: (data: Partial<CheckoutData>) => void;
}

export default function PaymentStep({ data, onNext, onBack, onUpdateData }: PaymentStepProps) {
  const { showToast } = useToast();
  const t = useTranslations('checkoutPage.payment');
  const [selectedMethod, setSelectedMethod] = useState<string>(data.paymentMethod?.id || '');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoadingIntent, setIsLoadingIntent] = useState(false);
  const [cartTotal, setCartTotal] = useState<number>(0);

  const paymentMethods = [
    {
      id: 'credit_card',
      title: t('methods.creditCard.title'),
      description: t('methods.creditCard.description'),
      icon: CreditCard,
    },
    {
      id: 'paypal',
      title: t('methods.paypal.title'),
      description: t('methods.paypal.description'),
      icon: Banknote,
    },
  ];

  // Fetch cart total from localStorage
  useEffect(() => {
    const fetchCartTotal = () => {
      try {
        // Get cart from local storage (Zustand store)
        const localCartData = localStorage.getItem('bapi-cart-storage');
        if (!localCartData) {
          logger.debug('[PaymentStep] No cart data found');
          return;
        }

        const parsed = JSON.parse(localCartData);
        const items = parsed.state?.items || [];

        if (items.length === 0) {
          logger.debug('[PaymentStep] Cart is empty');
          return;
        }

        // Calculate total from items
        const subtotal = items.reduce((sum: number, item: any) => {
          const price = parseFloat(item.price.replace('$', '').replace(',', ''));
          return sum + price * item.quantity;
        }, 0);

        logger.debug('[PaymentStep] Cart total calculated', { subtotal });
        setCartTotal(subtotal);
      } catch (error) {
        logger.error('[PaymentStep] Failed to fetch cart total', error);
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
        showToast(
          'error',
          t('toasts.setupFailed'),
          result.message || t('toasts.setupError')
        );
      }
    } catch (error) {
      showToast('error', t('toasts.setupFailed'), t('toasts.setupError'));
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

    showToast('success', t('toasts.paymentConfirmed'), t('toasts.paymentConfirmedMessage'));
    onNext();
  };

  const handleStripeError = (error: string) => {
    showToast('error', t('toasts.paymentFailed'), error);
  };

  const handlePayPalNext = () => {
    if (!selectedMethod) {
      showToast('warning', t('toasts.selectMethod'), t('toasts.selectMethodMessage'));
      return;
    }

    // For PayPal, just proceed to review (payment happens after order placement)
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Payment Method Selection */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t('title')}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => handleMethodSelect(method.id)}
                className={`relative rounded-xl border-2 p-6 text-left transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                } `}
              >
                {/* Selected Indicator */}
                {selectedMethod === method.id && (
                  <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500">
                    <svg
                      className="h-4 w-4 text-white"
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
                  className={`mb-3 h-8 w-8 ${
                    selectedMethod === method.id ? 'text-primary-500' : 'text-neutral-400'
                  }`}
                />
                <h3 className="mb-1 text-lg font-semibold text-neutral-900">{method.title}</h3>
                <p className="text-sm text-neutral-600">{method.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stripe Credit Card Form */}
      {selectedMethod === 'credit_card' && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">{t('cardDetails.title')}</h3>

          {isLoadingIntent ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              <span className="ml-3 text-neutral-600">{t('cardDetails.settingUp')}</span>
            </div>
          ) : clientSecret ? (
            <StripeProvider clientSecret={clientSecret}>
              <StripePaymentForm onSuccess={handleStripeSuccess} onError={handleStripeError} />
            </StripeProvider>
          ) : (
            <div className="py-8 text-center text-neutral-600">
              {t('cardDetails.loadError')}
            </div>
          )}

          {/* Security Note */}
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-primary-200 bg-primary-50 p-4">
            <span className="text-xl">🔒</span>
            <div>
              <p className="text-sm font-medium text-primary-900">{t('security.title')}</p>
              <p className="mt-1 text-xs text-primary-700">
                {t('security.description')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PayPal Info */}
      {selectedMethod === 'paypal' && (
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-sm text-neutral-600">
            {t('paypal.redirectMessage')}
          </p>

          <button
            type="button"
            onClick={handlePayPalNext}
            className="btn-bapi-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3"
          >
            {t('paypal.continueButton')}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Back Button (only show if not in Stripe payment) */}
      {selectedMethod !== 'credit_card' && (
        <div className="flex justify-between border-t border-neutral-200 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl bg-neutral-200 px-8 py-4 font-bold text-neutral-900 transition-colors hover:bg-neutral-300"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('back')}
          </button>
        </div>
      )}

      {/* For credit card, Stripe form handles submission */}
    </div>
  );
}
