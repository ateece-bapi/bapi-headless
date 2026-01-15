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
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, CreditCard, Home, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';
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
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual WooCommerce order API call
      // const response = await fetch(`/api/orders/${orderId}`);
      
      // Mock order data for now
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockOrder: OrderData = {
        id: parseInt(orderId),
        orderNumber: `BAPI-${orderId}`,
        status: 'processing',
        total: '$1,249.99',
        currency: 'USD',
        paymentMethod: 'Credit Card',
        transactionId: 'pi_' + Math.random().toString(36).substring(7),
        items: [
          {
            id: '1',
            name: 'BACnet IP Module',
            quantity: 2,
            price: '$499.99',
            image: '/placeholder-product.jpg',
          },
          {
            id: '2',
            name: 'Temperature Sensor',
            quantity: 5,
            price: '$49.99',
          },
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Industrial Blvd',
          address2: 'Suite 456',
          city: 'Minneapolis',
          state: 'MN',
          postcode: '55401',
          country: 'US',
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Industrial Blvd',
          address2: 'Suite 456',
          city: 'Minneapolis',
          state: 'MN',
          postcode: '55401',
          country: 'US',
        },
        subtotal: '$1,199.90',
        shipping: '$25.00',
        tax: '$25.09',
        createdAt: new Date().toISOString(),
      };

      setOrder(mockOrder);
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-lg text-neutral-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md text-center">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Order Not Found</h1>
          <p className="text-neutral-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-neutral-600 mb-6">
            Thank you for your order. We've received your purchase and will process it shortly.
          </p>
          
          <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
            <span>Order Number:</span>
            <span className="font-mono font-bold text-neutral-900 text-lg">
              {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <Package className="w-8 h-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-neutral-900 mb-1">Processing</h3>
            <p className="text-sm text-neutral-600">Your order is being prepared</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <Truck className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-semibold text-neutral-900 mb-1">Shipping Soon</h3>
            <p className="text-sm text-neutral-600">You'll receive tracking info</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <CreditCard className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-neutral-900 mb-1">Payment Confirmed</h3>
            <p className="text-sm text-neutral-600">Transaction successful</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
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
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-bold rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </Link>
          
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            View Order Status
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-sm text-blue-900">
            <strong>📧 Confirmation Email Sent</strong>
            <br />
            We've sent a confirmation email to your inbox with order details and tracking information.
          </p>
        </div>
      </div>
    </div>
  );
}
