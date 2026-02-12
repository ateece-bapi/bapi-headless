'use client';

/**
 * Order Confirmation Client Component
 *
 * Displays order confirmation details after successful checkout
 * Features:
 * - Order summary
 * - Payment confirmation
 * - Shipping details
 * - Order items list
 * - Call to action buttons
 * - Cart clearing on mount
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, CreditCard, Home, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';
import { useCartStore } from '@/store/cart';
import OrderSummary from './OrderSummary';
import OrderItems from './OrderItems';
import ShippingDetails from './ShippingDetails';

interface OrderConfirmationClientProps {
  orderId: string;
}

interface OrderData {
  id: number;
  orderNumber: string;
  status: string;
  total: string;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: string;
    image?: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  subtotal: string;
  shipping: string;
  tax: string;
  createdAt: string;
}

export default function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const clearCart = useCartStore((state) => state.clearCart);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clear cart on mount (order successfully placed)
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);

    try {
      // Fetch real order data from WooCommerce API
      const response = await fetch(`/api/orders/${orderId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch order details');
      }

      const result = await response.json();

      if (!result.success || !result.order) {
        throw new Error('Invalid response from server');
      }

      setOrder(result.order);
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('order_confirmation.fetch_failed', error, { orderId });
      showToast('error', title, message);

      // Redirect to home after 3 seconds if order not found
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary-500" />
          <p className="text-lg text-neutral-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="max-w-md text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-neutral-400" />
          <h1 className="mb-2 text-2xl font-bold text-neutral-900">Order Not Found</h1>
          <p className="mb-6 text-neutral-600">We couldn't find the order you're looking for.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-600"
          >
            <Home className="h-5 w-5" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="mb-8 rounded-xl bg-white p-8 text-center shadow-lg">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="mb-2 text-3xl font-bold text-neutral-900 sm:text-4xl">Order Confirmed!</h1>

          <p className="mb-6 text-lg text-neutral-600">
            Thank you for your order. We've received your purchase and will process it shortly.
          </p>

          <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
            <span>Order Number:</span>
            <span className="font-mono text-lg font-bold text-neutral-900">
              {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 text-center shadow">
            <Package className="mx-auto mb-3 h-8 w-8 text-primary-500" />
            <h3 className="mb-1 font-semibold text-neutral-900">Processing</h3>
            <p className="text-sm text-neutral-600">Your order is being prepared</p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow">
            <Truck className="mx-auto mb-3 h-8 w-8 text-neutral-400" />
            <h3 className="mb-1 font-semibold text-neutral-900">Shipping Soon</h3>
            <p className="text-sm text-neutral-600">You'll receive tracking info</p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow">
            <CreditCard className="mx-auto mb-3 h-8 w-8 text-green-500" />
            <h3 className="mb-1 font-semibold text-neutral-900">Payment Confirmed</h3>
            <p className="text-sm text-neutral-600">Transaction successful</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Order Items */}
            <OrderItems items={order.items} />

            {/* Shipping Details */}
            <ShippingDetails
              shippingAddress={order.shippingAddress}
              billingAddress={order.billingAddress}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={order.subtotal}
              shipping={order.shipping}
              tax={order.tax}
              total={order.total}
              paymentMethod={order.paymentMethod}
              transactionId={order.transactionId}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-200 px-8 py-4 font-bold text-neutral-900 transition-colors hover:bg-neutral-300"
          >
            <Home className="h-5 w-5" />
            Continue Shopping
          </Link>

          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-4 font-bold text-white shadow-md transition-colors hover:bg-primary-600 hover:shadow-lg"
          >
            View Order Status
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">
          <p className="text-sm text-blue-900">
            <strong>📧 Confirmation Email Sent</strong>
            <br />
            We've sent a confirmation email to your inbox with order details and tracking
            information.
          </p>
        </div>
      </div>
    </div>
  );
}
