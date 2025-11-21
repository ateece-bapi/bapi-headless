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
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition ${className}`}
    >
      Add to Cart
    </button>
  );
}
