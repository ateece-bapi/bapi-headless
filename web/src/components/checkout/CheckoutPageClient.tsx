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
import { useCartStore } from '@/store/cart';

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
      showToast('warning', t('toasts.cartEmpty'), t('toasts.cartEmptyMessage'));
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
        showToast('warning', t('toasts.cartEmpty'), t('toasts.cartEmptyMessage'));
        setTimeout(() => router.push(`/${locale}/cart`), 1000);
        return;
      }

      const parsed = JSON.parse(localCartData);
      const items = parsed.state?.items || [];

      logger.debug('[Checkout] Cart items loaded', { itemCount: items.length });

      if (items.length === 0) {
        logger.debug('[Checkout] Cart is empty');
        setIsLoadingCart(false);
        showToast('warning', t('toasts.cartEmpty'), t('toasts.cartEmptyMessage'));
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
        showToast('warning', t('toasts.cartEmpty'), t('toasts.cartEmptyMessage'));
        router.push(`/${locale}/cart`);
        return;
      }

      setCart(data.cart);
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('checkout.fetch_cart_failed', error);
      showToast('error', title, message);
      router.push(`/${locale}/cart`);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpdateData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      // Get cart items from localStorage
      const localCartData = localStorage.getItem('bapi-cart-storage');
      const cartItems = localCartData ? JSON.parse(localCartData).state?.items || [] : [];

      // If using Stripe, confirm payment first
      if (checkoutData.paymentIntentId) {
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: checkoutData.paymentIntentId,
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
          throw new Error(result.message || 'Payment confirmation failed');
        }

        // Clear cart after successful order
        if (result.clearCart) {
          clearCart();
          logger.info('[Checkout] Cart cleared after successful order');
        }

        // Redirect to order confirmation with actual order ID
        router.push(`/${locale}/order-confirmation/${result.order.id}`);
        showToast('success', t('toasts.orderPlaced'), t('toasts.orderPlacedMessage'));
      } else {
        // PayPal or other payment methods
        // Phase 2: Implement PayPal order creation via WooCommerce API
        // For now, create mock order (Stripe is primary payment method for launch)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const mockOrderId = Math.floor(Math.random() * 100000);
        router.push(`/${locale}/order-confirmation/${mockOrderId}`);
        showToast('success', t('toasts.orderPlaced'), t('toasts.orderPlacedMessage'));
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
        <p className="mt-2 text-neutral-600">
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
