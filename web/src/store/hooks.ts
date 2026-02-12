'use client';

import { useCartStore } from './cart';

/**
 * Custom hook for accessing cart state and actions
 * Provides a simpler API for components
 */
export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore((state) => state.totalItems);
  const subtotal = useCartStore((state) => state.subtotal);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems: totalItems(),
    subtotal: subtotal(),
    isEmpty: items.length === 0,
  };
}

/**
 * Hook for cart drawer UI state
 */
export function useCartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);

  return {
    isOpen,
    toggleCart,
    openCart,
    closeCart,
  };
}
