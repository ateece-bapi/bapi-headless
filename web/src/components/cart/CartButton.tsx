'use client';

import { useCartDrawer } from '@/store';
import { CartIcon } from '@/components/cart';

export function CartButton() {
  const { openCart } = useCartDrawer();
  
  return (
    <button
      onClick={openCart}
      className="hover:text-blue-600 transition"
      aria-label="Open cart"
    >
      <CartIcon />
    </button>
  );
}
