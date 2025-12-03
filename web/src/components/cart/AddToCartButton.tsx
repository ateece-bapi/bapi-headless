'use client';

import { useCart, useCartDrawer } from '@/store';
import type { CartItem } from '@/store';

interface AddToCartButtonProps {
  product: Omit<CartItem, 'quantity'>;
  quantity?: number;
  className?: string;
  showCartOnAdd?: boolean;
  useCart?: typeof useCart;
  useCartDrawer?: typeof useCartDrawer;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  showCartOnAdd = true,
  useCart: injectedUseCart,
  useCartDrawer: injectedUseCartDrawer,
  disabled = false,
}: AddToCartButtonProps) {
  const useCartHook = injectedUseCart ?? useCart;
  const useCartDrawerHook = injectedUseCartDrawer ?? useCartDrawer;
  const { addItem } = useCartHook();
  const { openCart } = useCartDrawerHook();

  const handleAddToCart = () => {
    addItem(product, quantity);
    if (showCartOnAdd) {
      openCart();
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-accent-500 hover:bg-accent-600 text-neutral-900 font-semibold py-2 px-4 rounded transition shadow-sm hover:shadow-md ${className}`}
      disabled={disabled}
    >
      Add to Cart
    </button>
  );
}
