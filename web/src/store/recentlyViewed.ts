import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RecentlyViewedProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price: string;
  image?: {
    sourceUrl: string;
    altText?: string;
  } | null;
  viewedAt: number; // timestamp
}

interface RecentlyViewedState {
  products: RecentlyViewedProduct[];

  // Actions
  addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void;
  clearHistory: () => void;
  removeProduct: (id: string) => void;
}

const MAX_RECENT_PRODUCTS = 10;

/**
 * Recently Viewed Products Store
 *
 * Tracks products the user has viewed with localStorage persistence.
 * Automatically limits to 10 most recent products.
 *
 * @example
 * ```tsx
 * const { products, addProduct, clearHistory } = useRecentlyViewedStore();
 *
 * // Track a product view
 * addProduct({
 *   id: 'product-1',
 *   databaseId: 123,
 *   name: 'Product Name',
 *   slug: 'product-slug',
 *   price: '$19.99',
 *   image: { sourceUrl: 'https://...', altText: 'Product' }
 * });
 *
 * // Display recent products
 * {products.map(product => <ProductCard key={product.id} product={product} />)}
 *
 * // Clear history
 * clearHistory();
 * ```
 */
export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      products: [],

      /**
       * Add a product to recently viewed history
       *
       * - Removes duplicates (if already in history)
       * - Adds to beginning of list (most recent first)
       * - Limits to MAX_RECENT_PRODUCTS (10)
       * - Adds timestamp for sorting
       */
      addProduct: (product) => {
        set((state) => {
          // Remove existing entry if product already viewed
          const filteredProducts = state.products.filter((p) => p.id !== product.id);

          // Add to beginning with current timestamp
          const updatedProducts = [{ ...product, viewedAt: Date.now() }, ...filteredProducts];

          // Limit to MAX_RECENT_PRODUCTS
          return {
            products: updatedProducts.slice(0, MAX_RECENT_PRODUCTS),
          };
        });
      },

      /**
       * Clear all recently viewed products
       */
      clearHistory: () => {
        set({ products: [] });
      },

      /**
       * Remove a specific product from history
       */
      removeProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: 'bapi-recently-viewed', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Hook for recently viewed products functionality
 *
 * Provides convenient access to the store with computed values
 */
export function useRecentlyViewed() {
  const store = useRecentlyViewedStore();

  return {
    ...store,
    /**
     * Get products excluding a specific product (e.g., current product)
     */
    getProductsExcluding: (excludeId: string) => {
      return store.products.filter((p) => p.id !== excludeId);
    },
    /**
     * Check if a product has been viewed
     */
    hasViewed: (productId: string) => {
      return store.products.some((p) => p.id === productId);
    },
    /**
     * Get number of recently viewed products
     */
    count: store.products.length,
    /**
     * Check if history is empty
     */
    isEmpty: store.products.length === 0,
  };
}
