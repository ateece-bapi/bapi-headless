import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price: string;
  quantity: number;
  image?: {
    sourceUrl: string;
    altText?: string;
  } | null;
  // Variation-specific fields
  variationId?: number;
  variationName?: string;
  variationSku?: string;
  selectedAttributes?: Record<string, string>;
  partNumber?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string, variationId?: number) => void;
  updateQuantity: (id: string, quantity: number, variationId?: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed values
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) => {
        set((state) => {
          // For variable products, use variationId as unique identifier
          // For simple products, use product id
          const uniqueKey = item.variationId ? `${item.id}-${item.variationId}` : item.id;

          const existingItem = state.items.find((i) => {
            const existingKey = i.variationId ? `${i.id}-${i.variationId}` : i.id;
            return existingKey === uniqueKey;
          });

          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map((i) => {
                const currentKey = i.variationId ? `${i.id}-${i.variationId}` : i.id;
                return currentKey === uniqueKey ? { ...i, quantity: i.quantity + quantity } : i;
              }),
            };
          }

          // Add new item
          return {
            items: [...state.items, { ...item, quantity }],
          };
        });
      },

      removeItem: (id, variationId) => {
        set((state) => {
          const uniqueKey = variationId ? `${id}-${variationId}` : id;
          return {
            items: state.items.filter((item) => {
              const itemKey = item.variationId ? `${item.id}-${item.variationId}` : item.id;
              return itemKey !== uniqueKey;
            }),
          };
        });
      },

      updateQuantity: (id, quantity, variationId) => {
        if (quantity <= 0) {
          get().removeItem(id, variationId);
          return;
        }

        set((state) => {
          const uniqueKey = variationId ? `${id}-${variationId}` : id;
          return {
            items: state.items.map((item) => {
              const itemKey = item.variationId ? `${item.id}-${item.variationId}` : item.id;
              return itemKey === uniqueKey ? { ...item, quantity } : item;
            }),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'bapi-cart-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not UI state like isOpen
      partialize: (state) => ({ items: state.items }),
    }
  )
);
