'use client';

/**
 * Cart Page Client Component
 * 
 * Fetches cart from WooCommerce API and displays cart management UI.
 * Handles loading states, errors, and empty cart scenarios.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import CartItems from './CartItems';
import CartSummary from './CartSummary';
import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';

interface CartData {
  isEmpty: boolean;
  total: string;
  subtotal: string;
  contentsTax: string;
  shippingTotal: string;
  shippingTax: string;
  totalTax: string;
  discountTotal: string;
  discountTax: string;
  contents: {
    itemCount: number;
    nodes: CartItem[];
  };
  appliedCoupons?: Array<{
    code: string;
    discountAmount: string;
  }>;
}

interface CartItem {
  key: string;
  quantity: number;
  subtotal: string;
  total: string;
  tax: string;
  product: {
    node: {
      id: string;
      databaseId: number;
      name: string;
      slug: string;
      price: string;
      regularPrice?: string;
      salePrice?: string;
      stockStatus: string;
      stockQuantity?: number;
      image?: {
        sourceUrl: string;
        altText?: string;
      };
    };
  };
  variation?: {
    node: {
      id: string;
      databaseId: number;
      name: string;
      price: string;
      regularPrice?: string;
      salePrice?: string;
      stockStatus: string;
      stockQuantity?: number;
      image?: {
        sourceUrl: string;
        altText?: string;
      };
    };
  };
}

export default function CartPageClient() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('cart.fetch_failed', error);
      showToast('error', title, message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemKey: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setIsUpdating(true);
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: itemKey, quantity: newQuantity }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setCart(data.cart);
      showToast('success', 'Updated', 'Cart updated successfully');
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('cart.update_failed', error, { itemKey, newQuantity });
      showToast('error', title, message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemKey: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: [itemKey] }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setCart(data.cart);
      showToast('success', 'Removed', 'Item removed from cart');
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('cart.remove_failed', error, { itemKey });
      showToast('error', title, message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      setIsUpdating(true);
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setCart(data.cart);
      showToast('success', 'Cart Cleared', 'All items removed from cart');
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('cart.clear_failed', error);
      showToast('error', title, message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-neutral-200 rounded"></div>
            <div className="h-32 bg-neutral-200 rounded"></div>
            <div className="h-32 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.isEmpty) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingCart className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-lg text-neutral-600 mb-8">
          Add some products to your cart to get started.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          Shopping Cart
        </h1>
        <Link
          href="/products"
          className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      {/* Cart Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <CartItems
            items={cart.contents.nodes}
            isUpdating={isUpdating}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        </div>

        {/* Cart Summary (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          <CartSummary
            cart={cart}
            onApplyCoupon={fetchCart}
            isUpdating={isUpdating}
          />
        </div>
      </div>
    </div>
  );
}
