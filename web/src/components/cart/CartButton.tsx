'use client';

import { useCartDrawer } from '../../store/hooks';
import CartIcon from './CartIcon';

const CartButton = () => {
  const { openCart } = useCartDrawer();

  return (
    <button onClick={openCart} className="transition hover:text-blue-600" aria-label="Open cart">
      <CartIcon />
    </button>
  );
};

export default CartButton;
