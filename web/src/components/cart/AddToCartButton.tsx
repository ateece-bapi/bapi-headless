'use client';

import { useCart, useCartDrawer } from '@/store';
import type { CartItem } from '@/store';

interface AddToCartButtonProps {
  product: Omit<CartItem, 'quantity'>;
  quantity?: number;
  className?: string;
  showCartOnAdd?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  showCartOnAdd = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { openCart } = useCartDrawer();
  
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
    >
      Add to Cart
    </button>
  );
}
