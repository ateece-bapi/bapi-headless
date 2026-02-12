/**
 * Integration Tests for Cart Store (Zustand State Management)
 *
 * Tests the cart state management logic including:
 * - Add/remove/update operations
 * - Multiple operations in sequence
 * - Edge cases and error handling
 * - Computed values (totalItems, subtotal)
 *
 * NOTE: localStorage persistence is tested separately in E2E tests (Playwright)
 * Zustand's persist middleware requires real localStorage API (browser environment)
 * These tests focus on the core state management logic in Node/jsdom environment
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useCartStore } from '../cart';
import type { CartItem } from '../cart';

describe('Cart Store - State Management Tests', () => {
  // Clear cart state between tests
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  afterEach(() => {
    useCartStore.getState().clearCart();
  });

  // Sample product data
  const sampleProduct: Omit<CartItem, 'quantity'> = {
    id: 'prod-123',
    databaseId: 12345,
    name: 'Temperature Sensor',
    slug: 'temperature-sensor',
    price: '$49.99',
    image: {
      sourceUrl: 'https://example.com/image.jpg',
      altText: 'Temperature Sensor',
    },
  };

  const sampleProduct2: Omit<CartItem, 'quantity'> = {
    id: 'prod-456',
    databaseId: 67890,
    name: 'Humidity Sensor',
    slug: 'humidity-sensor',
    price: '$59.99',
    image: {
      sourceUrl: 'https://example.com/image2.jpg',
      altText: 'Humidity Sensor',
    },
  };

  describe('Add to Cart', () => {
    it('should add new item to cart', () => {
      const { addItem } = useCartStore.getState();

      addItem(sampleProduct, 1);

      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(1);
      expect(currentItems[0]).toMatchObject({
        id: 'prod-123',
        name: 'Temperature Sensor',
        quantity: 1,
      });
    });

    it('should update quantity when adding existing item', () => {
      const { addItem } = useCartStore.getState();

      // Add item twice
      addItem(sampleProduct, 1);
      addItem(sampleProduct, 2);

      // Should have 1 item with quantity 3
      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].quantity).toBe(3);
    });

    it('should handle multiple different items', () => {
      const { addItem } = useCartStore.getState();

      addItem(sampleProduct, 1);
      addItem(sampleProduct2, 2);

      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(2);
      expect(currentItems[0].id).toBe('prod-123');
      expect(currentItems[1].id).toBe('prod-456');
      expect(currentItems[1].quantity).toBe(2);
    });
  });

  describe('Remove from Cart', () => {
    it('should remove item from cart', () => {
      const { addItem, removeItem } = useCartStore.getState();

      // Add then remove
      addItem(sampleProduct, 1);
      addItem(sampleProduct2, 1);
      removeItem('prod-123');

      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].id).toBe('prod-456');
    });

    it('should handle removing non-existent item gracefully', () => {
      const { addItem, removeItem } = useCartStore.getState();

      addItem(sampleProduct, 1);
      removeItem('non-existent-id');

      // Original item should still be there
      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].id).toBe('prod-123');
    });
  });

  describe('Update Quantity', () => {
    it('should update quantity', () => {
      const { addItem, updateQuantity } = useCartStore.getState();

      addItem(sampleProduct, 1);
      updateQuantity('prod-123', 5);

      const currentItems = useCartStore.getState().items;
      expect(currentItems[0].quantity).toBe(5);
    });

    it('should remove item when quantity set to 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState();

      addItem(sampleProduct, 5);
      updateQuantity('prod-123', 0);

      // Item should be removed
      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(0);
    });

    it('should remove item when quantity is negative', () => {
      const { addItem, updateQuantity } = useCartStore.getState();

      addItem(sampleProduct, 5);
      updateQuantity('prod-123', -1);

      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(0);
    });
  });

  describe('Clear Cart', () => {
    it('should clear all items', () => {
      const { addItem, clearCart } = useCartStore.getState();

      // Add multiple items
      addItem(sampleProduct, 2);
      addItem(sampleProduct2, 3);

      // Clear cart
      clearCart();

      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(0);
    });
  });

  describe('Computed Values', () => {
    it('should calculate totalItems correctly', () => {
      const { addItem, totalItems } = useCartStore.getState();

      addItem(sampleProduct, 2);
      addItem(sampleProduct2, 3);

      expect(totalItems()).toBe(5);
    });

    it('should calculate subtotal correctly', () => {
      const { addItem, subtotal } = useCartStore.getState();

      addItem(sampleProduct, 2); // $49.99 × 2 = $99.98
      addItem(sampleProduct2, 1); // $59.99 × 1 = $59.99

      const total = subtotal();
      expect(total).toBeCloseTo(159.97, 2);
    });

    it('should handle prices with currency symbols', () => {
      const { addItem, subtotal } = useCartStore.getState();

      const productWithDollarSign = {
        ...sampleProduct,
        price: '$100.00',
      };

      addItem(productWithDollarSign, 1);
      expect(subtotal()).toBeCloseTo(100.0, 2);
    });

    it('should return 0 for empty cart calculations', () => {
      const { totalItems, subtotal } = useCartStore.getState();

      expect(totalItems()).toBe(0);
      expect(subtotal()).toBe(0);
    });
  });

  describe('UI State', () => {
    it('should toggle cart drawer', () => {
      const { toggleCart, isOpen: initialOpen } = useCartStore.getState();

      const before = initialOpen;
      toggleCart();
      const after = useCartStore.getState().isOpen;

      expect(after).toBe(!before);
    });

    it('should open cart drawer', () => {
      const { openCart, closeCart } = useCartStore.getState();

      closeCart(); // Ensure it's closed first
      openCart();

      expect(useCartStore.getState().isOpen).toBe(true);
    });

    it('should close cart drawer', () => {
      const { openCart, closeCart } = useCartStore.getState();

      openCart(); // Ensure it's open first
      closeCart();

      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe('Complex Workflows', () => {
    it('should handle add → update → remove sequence', () => {
      const { addItem, updateQuantity, removeItem } = useCartStore.getState();

      // Add item
      addItem(sampleProduct, 1);
      expect(useCartStore.getState().items).toHaveLength(1);

      // Update quantity
      updateQuantity('prod-123', 5);
      expect(useCartStore.getState().items[0].quantity).toBe(5);

      // Remove item
      removeItem('prod-123');
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('should handle rapid add operations', () => {
      const { addItem } = useCartStore.getState();

      // Rapidly add same product multiple times
      for (let i = 0; i < 10; i++) {
        addItem(sampleProduct, 1);
      }

      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].quantity).toBe(10);
    });

    it('should maintain data integrity across multiple operations', () => {
      const { addItem, updateQuantity, removeItem } = useCartStore.getState();

      // Complex sequence
      addItem(sampleProduct, 2);
      addItem(sampleProduct2, 1);
      updateQuantity('prod-123', 5);
      addItem(sampleProduct, 1); // Should add to existing
      removeItem('prod-456');

      const currentItems = useCartStore.getState().items;
      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].id).toBe('prod-123');
      expect(currentItems[0].quantity).toBe(6); // 5 + 1
    });
  });
});
