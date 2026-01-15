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
import { useRouter } from 'next/navigation';
import CheckoutWizard from './CheckoutWizard';
import CheckoutSummary from './CheckoutSummary';
import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';

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

export default function CheckoutPageClient() {
  const router = useRouter();
  const { showToast } = useToast();
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
    fetchCart();
  }, []);

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
        showToast('warning', 'Cart Empty', 'Your cart is empty. Add items before checking out.');
        router.push('/cart');
        return;
      }
      
      setCart(data.cart);
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('checkout.fetch_cart_failed', error);
      showToast('error', title, message);
      router.push('/cart');
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

      // TODO: Implement actual order placement with WooCommerce
      // For now, simulate order placement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast('success', 'Order Placed!', 'Your order has been placed successfully.');
      
      // Redirect to order confirmation (TODO: with actual order ID)
      router.push('/checkout/confirmation?order=12345');
      
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
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-neutral-200 rounded"></div>
              <div className="h-64 bg-neutral-200 rounded"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          Checkout
        </h1>
        <p className="text-neutral-600 mt-2">
          Complete your order in {3 - currentStep + 1} easy step{3 - currentStep + 1 !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
