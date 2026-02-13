'use client';

/**
 * Cart Page Client Component
 *
 * Fetches cart from WooCommerce API and displays cart management UI.
 * Handles loading states, errors, and empty cart scenarios.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import logger from '@/lib/logger';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import CartItems from './CartItems';
import CartSummary from './CartSummary';
import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';
import { useCartStore } from '@/store/cart';

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
  const t = useTranslations();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();

  // Get Zustand store actions
  const {
    updateQuantity: updateZustandQuantity,
    removeItem: removeZustandItem,
    clearCart: clearZustandCart,
  } = useCartStore();

  // Fetch cart on mount
  useEffect(() => {
    // For Phase 3: Use local cart from Zustand instead of WooCommerce API
    // WooCommerce cart will be synced during checkout
    fetchLocalCart();
  }, []);

  const fetchLocalCart = () => {
    try {
      setIsLoading(true);

      // Get cart from local storage (Zustand store)
      const localCartData = localStorage.getItem('bapi-cart-storage');
      if (!localCartData) {
        setCart(null);
        setIsLoading(false);
        return;
      }

      const parsed = JSON.parse(localCartData);
      const items = parsed.state?.items || [];

      // Convert Zustand cart format to WooCommerce cart format
      const mockCart: CartData = {
        isEmpty: items.length === 0,
        total: items
          .reduce((sum: number, item: any) => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            return sum + price * item.quantity;
          }, 0)
          .toFixed(2),
        subtotal: items
          .reduce((sum: number, item: any) => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            return sum + price * item.quantity;
          }, 0)
          .toFixed(2),
        contentsTax: '0.00',
        shippingTotal: '0.00',
        shippingTax: '0.00',
        totalTax: '0.00',
        discountTotal: '0.00',
        discountTax: '0.00',
        contents: {
          itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
          nodes: items.map((item: any) => ({
            // Use composite key for variations, simple id for simple products (matches Zustand store)
            key: item.variationId ? `${item.id}-${item.variationId}` : item.id,
            quantity: item.quantity,
            subtotal: `$${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}`,
            total: `$${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}`,
            tax: '$0.00',
            product: {
              node: {
                id: item.id,
                databaseId: item.databaseId,
                name: item.name,
                slug: item.slug,
                price: item.price,
                stockStatus: 'IN_STOCK',
                image: item.image,
              },
            },
            // Add variation data if present
            variation: item.variationId
              ? {
                  node: {
                    databaseId: item.variationId,
                  },
                }
              : null,
          })),
        },
      };

      setCart(mockCart as any);
      setIsLoading(false);
    } catch (error) {
      logger.error('[CartPage] Error loading local cart', error);
      setIsLoading(false);
    }
  };

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

      // Update Zustand store
      updateZustandQuantity(itemKey, newQuantity);

      // Refresh cart display
      fetchLocalCart();

      showToast('success', t('cartPage.toasts.updated'), t('cartPage.toasts.cartUpdated'));
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

      // Parse the itemKey to extract id and variationId
      // Format: "productId" or "productId-variationId"
      const keyParts = itemKey.split('-');
      const productId = keyParts[0];
      const variationId = keyParts.length > 1 ? parseInt(keyParts[1], 10) : undefined;

      // Remove from Zustand store with correct parameters
      removeZustandItem(productId, variationId);

      // Refresh cart display
      fetchLocalCart();

      // Show success toast after state updates complete
      setTimeout(() => {
        showToast('success', t('cartPage.toasts.removed'), t('cartPage.toasts.itemRemoved'));
      }, 100);
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('cart.remove_failed', error, { itemKey });
      showToast('error', title, message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!confirm(t('cartPage.items.clearConfirm'))) return;

    try {
      setIsUpdating(true);

      // Clear cart from Zustand store
      clearZustandCart();

      // Refresh cart display
      fetchLocalCart();

      // Show success toast after state updates complete
      setTimeout(() => {
        showToast('success', t('cartPage.toasts.cartCleared'), t('cartPage.toasts.allItemsRemoved'));
      }, 100);
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
      <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="animate-pulse">
          <div className="mb-8 h-8 w-48 rounded bg-neutral-200"></div>
          <div className="space-y-4">
            <div className="h-32 rounded bg-neutral-200"></div>
            <div className="h-32 rounded bg-neutral-200"></div>
            <div className="h-32 rounded bg-neutral-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.isEmpty) {
    return (
      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingCart className="mx-auto mb-6 h-24 w-24 text-neutral-300" />
        <h1 className="mb-4 text-3xl font-bold text-neutral-900">{t('cartPage.empty.title')}</h1>
        <p className="mb-8 text-lg text-neutral-600">
          {t('cartPage.empty.description')}
        </p>
        <Link
          href="/products"
          className="btn-bapi-primary inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('cartPage.empty.button')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container px-4 py-8 sm:px-6 sm:py-12 lg:px-8 xl:px-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">{t('cartPage.header.title')}</h1>
        <Link
          href="/products"
          className="flex items-center gap-2 font-medium text-primary-500 transition-colors hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('cartPage.header.continueShopping')}
        </Link>
      </div>

      {/* Cart Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
          <CartSummary cart={cart} onApplyCoupon={fetchCart} isUpdating={isUpdating} />
        </div>
      </div>
    </div>
  );
}
