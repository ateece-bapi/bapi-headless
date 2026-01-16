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
    // For Phase 3: Use local cart from Zustand
    fetchLocalCart();
  }, []);

  const fetchLocalCart = () => {
    try {
      setIsLoadingCart(true);
      
      // Get cart from local storage (Zustand store)
      const localCartData = localStorage.getItem('bapi-cart-storage');
      
      console.log('[Checkout] LocalStorage data:', localCartData ? 'Present' : 'Missing');
      
      if (!localCartData) {
        console.log('[Checkout] No cart data found');
        setIsLoadingCart(false);
        showToast('warning', 'Cart Empty', 'Your cart is empty. Add items before checking out.');
        setTimeout(() => router.push('/cart'), 1000);
        return;
      }
      
      const parsed = JSON.parse(localCartData);
      const items = parsed.state?.items || [];
      
      console.log('[Checkout] Cart items:', items.length);
      
      if (items.length === 0) {
        console.log('[Checkout] Cart is empty');
        setIsLoadingCart(false);
        showToast('warning', 'Cart Empty', 'Your cart is empty. Add items before checking out.');
        setTimeout(() => router.push('/cart'), 1000);
        return;
      }
      
      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        return sum + (price * item.quantity);
      }, 0);
      
      console.log('[Checkout] Setting cart data with', items.length, 'items, subtotal:', subtotal);
      
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
                image: item.image ? {
                  sourceUrl: item.image.sourceUrl,
                  altText: item.name
                } : null
              }
            },
            subtotal: item.price,
            total: `$${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}`
          }))
        }
      });
      
      setIsLoadingCart(false);
    } catch (error) {
      console.error('[Checkout] Error loading local cart:', error);
      showToast('error', 'Error', 'Unable to load cart.');
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

        // Redirect to order confirmation with actual order ID
        router.push(`/order-confirmation/${result.order.id}`);
        showToast('success', 'Order Placed!', 'Your order has been placed successfully.');
      } else {
        // PayPal or other payment methods
        // TODO: Implement PayPal order creation
        // For now, create mock order
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        const mockOrderId = Math.floor(Math.random() * 100000);
        router.push(`/order-confirmation/${mockOrderId}`);
        showToast('success', 'Order Placed!', 'Your order has been placed successfully.');
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
