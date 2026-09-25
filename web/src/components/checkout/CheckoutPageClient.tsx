'use client';

/**
 * Checkout Page Client Component
 *
 * Multi-step checkout wizard with:
 * - Step 1: Shipping Information
 * - Step 2: Payment Method
 * - Step 3: Review & Place Order
 *
 * Features:
 * - Progress indicator
 * - Form validation
 * - Cart summary sidebar
 * - Step navigation (next/back)
 * - Order placement
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import logger from '@/lib/logger';
import CheckoutWizard from './CheckoutWizard';
import CheckoutSummary from './CheckoutSummary';
import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';
import { schedulePendingToast } from '@/components/ui/PendingToastFlush';
import { useCartStore } from '@/store/cart';
import { getScrollBehavior } from '@/lib/utils/motion';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
}

export interface BillingAddress extends ShippingAddress {
  sameAsShipping: boolean;
}

export interface PaymentMethod {
  id: string;
  title: string;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod | null;
  shippingMethod: string | null;
  orderNotes: string;
  paymentIntentId?: string; // Stripe payment intent ID
  orderId?: number; // Set once the WooCommerce order is created (immediately for ACH, at Place Order for Card)
}

interface CheckoutPageClientProps {
  locale: string;
}

export default function CheckoutPageClient({ locale }: CheckoutPageClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const t = useTranslations('checkoutPage');
  const { clearCart, items: cartItems, totalItems } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cart, setCart] = useState<any>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  // Initialize checkout data
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingAddress: {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'US',
      phone: '',
      email: '',
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'US',
      phone: '',
      email: '',
      sameAsShipping: true,
    },
    paymentMethod: null,
    shippingMethod: null,
    orderNotes: '',
  });

  // Fetch cart on mount
  useEffect(() => {
    // For Phase 3: Use local cart from Zustand
    fetchLocalCart();
  }, []);

  // Monitor cart changes - redirect if cart becomes empty during checkout
  useEffect(() => {
    // Skip during initial loading
    if (isLoadingCart) return;

    // Redirect to cart if empty (e.g., after clearing or manual removal)
    if (totalItems() === 0) {
      logger.debug('[Checkout] Cart became empty, redirecting to cart page');
      schedulePendingToast({ type: 'warning', title: t('toasts.cartEmpty'), message: t('toasts.cartEmptyMessage') });
      router.push(`/${locale}/cart`);
    }
  }, [totalItems, isLoadingCart, router, showToast, locale, t]);

  const fetchLocalCart = () => {
    try {
      setIsLoadingCart(true);

      // Get cart from local storage (Zustand store)
      const localCartData = localStorage.getItem('bapi-cart-storage');

      logger.debug('[Checkout] LocalStorage data check', { hasData: !!localCartData });

      if (!localCartData) {
        logger.debug('[Checkout] No cart data found');
        setIsLoadingCart(false);
        schedulePendingToast({ type: 'warning', title: t('toasts.cartEmpty'), message: t('toasts.cartEmptyMessage') });
        setTimeout(() => router.push(`/${locale}/cart`), 1000);
        return;
      }

      const parsed = JSON.parse(localCartData);
      const items = parsed.state?.items || [];
      const zustandItemCount = totalItems();

      logger.debug('[Checkout] Cart items loaded', { itemCount: items.length });

      // Warn if local storage has fewer items than the Zustand store expected
      // (can happen if localStorage was partially cleared or corrupted in another tab)
      if (zustandItemCount > 0 && items.length < zustandItemCount) {
        showToast(
          'warning',
          'Cart Updated',
          `${zustandItemCount - items.length} item(s) could not be restored and were removed from your cart.`,
          6000
        );
      }

      if (items.length === 0) {
        logger.debug('[Checkout] Cart is empty');
        setIsLoadingCart(false);
        schedulePendingToast({ type: 'warning', title: t('toasts.cartEmpty'), message: t('toasts.cartEmptyMessage') });
        setTimeout(() => router.push(`/${locale}/cart`), 1000);
        return;
      }

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        return sum + price * item.quantity;
      }, 0);

      logger.debug('[Checkout] Setting cart data', { itemCount: items.length, subtotal });

      // Convert to WooCommerce cart format expected by CheckoutSummary
      setCart({
        subtotal: `$${subtotal.toFixed(2)}`,
        tax: '$0.00',
        shipping: '$0.00',
        total: `$${subtotal.toFixed(2)}`,
        contents: {
          itemCount: items.length,
          nodes: items.map((item: any) => ({
            key: item.id,
            quantity: item.quantity,
            product: {
              node: {
                id: item.id,
                name: item.name,
                image: item.image
                  ? {
                      sourceUrl: item.image.sourceUrl,
                      altText: item.name,
                    }
                  : null,
              },
            },
            subtotal: item.price,
            total: `$${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}`,
          })),
        },
      });

      setIsLoadingCart(false);
    } catch (error) {
      logger.error('[Checkout] Error loading local cart', error);
      showToast('error', t('toasts.error'), t('toasts.errorMessage'));
      setIsLoadingCart(false);
    }
  };

  const fetchCart = async () => {
    try {
      setIsLoadingCart(true);
      const response = await fetch('/api/cart');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Redirect to cart if empty
      if (data.cart?.isEmpty) {
        schedulePendingToast({ type: 'warning', title: t('toasts.cartEmpty'), message: t('toasts.cartEmptyMessage') });
        router.push(`/${locale}/cart`);
        return;
      }

      setCart(data.cart);
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('checkout.fetch_cart_failed', error);
      schedulePendingToast({ type: 'error', title, message });
      router.push(`/${locale}/cart`);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: getScrollBehavior() });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: getScrollBehavior() });
    }
  };

  const handleUpdateData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  /**
   * Confirms a Stripe PaymentIntent and creates the WooCommerce order via /api/payment/confirm.
   * Shared by PaymentStep (called immediately for Bank Account/ACH, since settlement is
   * asynchronous) and handlePlaceOrder (called at Place Order for Credit Card).
   */
  const confirmStripePayment = async (
    paymentIntentId: string
  ): Promise<{ success: boolean; orderId?: number; message?: string }> => {
    try {
      const localCartData = localStorage.getItem('bapi-cart-storage');
      const cartItems = localCartData ? JSON.parse(localCartData).state?.items || [] : [];

      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          orderData: {
            shippingAddress: checkoutData.shippingAddress,
            billingAddress: checkoutData.billingAddress,
            orderNotes: checkoutData.orderNotes,
          },
          cartItems, // Send cart items for WooCommerce sync
        }),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, message: result.message || 'Payment confirmation failed' };
      }

      return { success: true, orderId: result.order.id };
    } catch (error) {
      logError('checkout.confirm_payment_failed', error);
      return { success: false, message: 'Unable to confirm payment. Please try again.' };
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      // ACH (Bank Account) orders are already created in PaymentStep right after the PaymentIntent
      // confirms — don't create a second order here, just finish the redirect.
      if (checkoutData.orderId) {
        clearCart();
        schedulePendingToast({ type: 'success', title: t('toasts.orderPlaced'), message: t('toasts.orderPlacedMessage') });
        router.push(`/${locale}/order-confirmation/${checkoutData.orderId}`);
        return;
      }

      // If using Stripe (Credit Card), confirm payment now
      if (checkoutData.paymentIntentId) {
        const result = await confirmStripePayment(checkoutData.paymentIntentId);

        if (!result.success) {
          throw new Error(result.message || 'Payment confirmation failed');
        }

        // Clear cart after successful order
        clearCart();
        logger.info('[Checkout] Cart cleared after successful order');

        // Redirect to order confirmation with actual order ID
        schedulePendingToast({ type: 'success', title: t('toasts.orderPlaced'), message: t('toasts.orderPlacedMessage') });
        router.push(`/${locale}/order-confirmation/${result.orderId}`);
      } else {
        // Every supported tile (Card, Bank Account) requires a Stripe-confirmed PaymentIntent
        // by this point — reaching here means checkout state is broken, so fail loudly instead
        // of fabricating a mock order that reports success without any actual payment.
        throw new Error('No payment method was confirmed. Please select a payment method and try again.');
      }
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('checkout.place_order_failed', error, { checkoutData });
      showToast('error', title, message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isLoadingCart) {
    return (
      <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="animate-pulse">
          <div className="mb-8 h-8 w-48 rounded bg-neutral-200"></div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="h-64 rounded bg-neutral-200"></div>
              <div className="h-64 rounded bg-neutral-200"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 rounded bg-neutral-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container px-4 py-8 sm:px-6 sm:py-12 lg:px-8 xl:px-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">{t('header.title')}</h1>
        <p className="mt-2 text-neutral-700">
          {3 - currentStep + 1 === 1
            ? t('header.stepsRemaining', { count: 3 - currentStep + 1 })
            : t('header.stepsRemainingPlural', { count: 3 - currentStep + 1 })}
        </p>
      </div>

      {/* Checkout Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Checkout Wizard (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <CheckoutWizard
            currentStep={currentStep}
            checkoutData={checkoutData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateData={handleUpdateData}
            onPlaceOrder={handlePlaceOrder}
            onConfirmPayment={confirmStripePayment}
            isProcessing={isProcessing}
          />
        </div>

        {/* Checkout Summary (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
