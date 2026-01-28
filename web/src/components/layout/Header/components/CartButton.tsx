import React from 'react';
import { Link } from '@/lib/navigation';

interface CartButtonProps {
  itemCount?: number;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount = 0 }) => (
  <Link
    href="/cart"
    className="group relative flex items-center justify-center w-10 h-10 hover:bg-neutral-50 hover:shadow-md rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 active:scale-[0.98]"
    aria-label={`View shopping cart${itemCount > 0 ? ` with ${itemCount} items` : ''}`}
    suppressHydrationWarning
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors duration-200"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    {itemCount > 0 && (
      <span 
        className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse"
        suppressHydrationWarning
      >
        {itemCount > 9 ? '9+' : itemCount}
      </span>
    )}
  </Link>
);

export default CartButton;