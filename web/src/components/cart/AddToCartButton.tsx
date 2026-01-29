'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCart, useCartDrawer } from '@/store';
import type { CartItem } from '@/store';
import { useToast } from '@/components/ui/Toast';
import { ERROR_MESSAGES, logError } from '@/lib/errors';

interface AddToCartButtonProps {
  product: Omit<CartItem, 'quantity'>;
  quantity?: number;
  className?: string;
  showCartOnAdd?: boolean;
  useCart?: typeof useCart;
  useCartDrawer?: typeof useCartDrawer;
  disabled?: boolean;
  /** Show loading state (for async operations) */
  loading?: boolean;
  /** Success animation duration in ms (default: 2000) */
  successDuration?: number;
}

/**
 * Enhanced Add to Cart button with loading, success, and error states
 * 
 * Features:
 * - Loading spinner during async operations
 * - Success animation with checkmark
 * - Error handling with toast notifications
 * - Optimistic UI updates
 * - Disabled state for out-of-stock products
 * - Accessible with ARIA labels
 * 
 * @param product - Product to add to cart
 * @param quantity - Quantity to add (default: 1)
 * @param className - Additional CSS classes
 * @param showCartOnAdd - Open cart drawer after add (default: true)
 * @param disabled - Disable button (out of stock)
 * @param loading - Show loading state
 * @param successDuration - How long to show success state (default: 2000ms)
 */
const AddToCartButton = ({
  product,
  quantity = 1,
  className = '',
  showCartOnAdd = true,
  useCart: injectedUseCart,
  useCartDrawer: injectedUseCartDrawer,
  disabled = false,
  loading: externalLoading = false,
  successDuration = 2000,
}: AddToCartButtonProps) => {
  const useCartHook = injectedUseCart ?? useCart;
  const useCartDrawerHook = injectedUseCartDrawer ?? useCartDrawer;
  const { addItem } = useCartHook();
  const { openCart } = useCartDrawerHook();
  const { showToast } = useToast();
  
  const [internalLoading, setInternalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const loading = externalLoading || internalLoading;

  const handleAddToCart = async () => {
    // Prevent double-clicks
    if (loading || showSuccess) return;
    
    try {
      // Check if product is out of stock
      if (disabled) {
        showToast(
          'warning',
          ERROR_MESSAGES.OUT_OF_STOCK.title,
          ERROR_MESSAGES.OUT_OF_STOCK.message,
          5000
        );
        return;
      }

      // Validate product data
      if (!product.id || !product.name || !product.price) {
        logError('cart.invalid_product', new Error('Missing required product fields'), { product });
        showToast(
          'error',
          ERROR_MESSAGES.ADD_TO_CART_ERROR.title,
          'This product cannot be added to the cart at this time.',
          5000
        );
        return;
      }

      // Show loading state
      setInternalLoading(true);
      
      // Phase 3: Skip WooCommerce API call, only use local cart
      // Cart will be synced to WooCommerce during checkout
      await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay for UX
      
      // Add to local cart store
      addItem(product, quantity);
      
      // Show success state
      setInternalLoading(false);
      setShowSuccess(true);
      
      // Success feedback
      showToast(
        'success',
        'Added to Cart',
        `${product.name} has been added to your cart.`,
        3000
      );

      if (showCartOnAdd) {
        // Open cart after a brief delay to let user see the success animation
        setTimeout(() => openCart(), 400);
      }
      
      // Reset success state after duration
      setTimeout(() => {
        setShowSuccess(false);
      }, successDuration);
      
    } catch (error) {
      setInternalLoading(false);
      setShowSuccess(false);
      logError('cart.add_failed', error, { product, quantity });
      
      // Check if this is a variable product that needs options selected
      const errorMessage = error instanceof Error ? error.message : '';
      const isVariableProductError = errorMessage.includes('choose product options');
      
      if (isVariableProductError) {
        showToast(
          'warning',
          'Product Options Required',
          'This product requires selecting options (size, range, etc.). Variable product support coming soon.',
          6000
        );
      } else {
        showToast(
          'error',
          ERROR_MESSAGES.ADD_TO_CART_ERROR.title,
          ERROR_MESSAGES.ADD_TO_CART_ERROR.message,
          5000
        );
      }
    }
  };
  
  // Button text and icon based on state
  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Adding...</span>
        </>
      );
    }
    
    if (showSuccess) {
      return (
        <>
          <Check className="w-5 h-5" />
          <span>Added!</span>
        </>
      );
    }
    
    if (disabled) {
      return <span>Out of Stock</span>;
    }
    
    return (
      <>
        <ShoppingCart className="w-5 h-5" />
        <span>Add to Cart</span>
      </>
    );
  };
  
  // Dynamic button classes
  const buttonClasses = `
    flex items-center justify-center gap-2
    font-semibold py-3 px-6 rounded-xl
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    ${showSuccess 
      ? 'bg-success-500 hover:bg-success-600 text-white shadow-sm hover:shadow-md' 
      : disabled
        ? 'bg-neutral-300 text-neutral-500 shadow-sm'
        : 'btn-bapi-accent'
    }
    ${className}
  `;

  return (
    <button
      onClick={handleAddToCart}
      className={buttonClasses}
      disabled={disabled || loading || showSuccess}
      aria-label={
        loading 
          ? 'Adding to cart...' 
          : showSuccess 
            ? 'Added to cart' 
            : disabled 
              ? 'Out of stock' 
              : `Add ${product.name} to cart`
      }
    >
      {getButtonContent()}
    </button>
  );
}

export default AddToCartButton;
