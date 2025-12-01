'use client';

import { useCartDrawer } from '../../store/hooks';
import { CartIcon } from './CartIcon';

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
