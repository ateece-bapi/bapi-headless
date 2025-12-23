'use client';

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
}


const AddToCartButton = ({
  product,
  quantity = 1,
  className = '',
  showCartOnAdd = true,
  useCart: injectedUseCart,
  useCartDrawer: injectedUseCartDrawer,
  disabled = false,
}: AddToCartButtonProps) => {
  const useCartHook = injectedUseCart ?? useCart;
  const useCartDrawerHook = injectedUseCartDrawer ?? useCartDrawer;
  const { addItem } = useCartHook();
  const { openCart } = useCartDrawerHook();
  const { showToast } = useToast();

  const handleAddToCart = () => {
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

      addItem(product, quantity);
      
      // Success feedback
      showToast(
        'success',
        'Added to Cart',
        `${product.name} has been added to your cart.`,
        3000
      );

      if (showCartOnAdd) {
        openCart();
      }
    } catch (error) {
      logError('cart.add_failed', error, { product, quantity });
      showToast(
        'error',
        ERROR_MESSAGES.ADD_TO_CART_ERROR.title,
        ERROR_MESSAGES.ADD_TO_CART_ERROR.message,
        5000
      );
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-accent-500 hover:bg-accent-600 text-neutral-900 font-semibold py-2 px-4 rounded transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      aria-label={disabled ? 'Out of stock' : `Add ${product.name} to cart`}
    >
      {disabled ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}

export default AddToCartButton;
