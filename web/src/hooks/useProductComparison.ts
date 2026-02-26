'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import type { Product } from '@/lib/graphql/types';

const STORAGE_KEY = 'bapi-product-comparison';
const MAX_COMPARE = 3;

/**
 * Hook for managing product comparison
 *
 * Features:
 * - Add/remove products from comparison
 * - Max 3 products for comparison
 * - localStorage persistence
 * - Type-safe with Product type
 */
export function useProductComparison() {
  // Initialize from localStorage using lazy initial state
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      logger.error('Failed to parse comparison products', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return [];
  });

  // Save to localStorage when comparison changes (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonProducts));
    }
  }, [comparisonProducts]);

  const addToComparison = (product: Product) => {
    setComparisonProducts((prev) => {
      // Already in comparison
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      // Max limit reached
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparisonProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonProducts([]);
  };

  const isInComparison = (productId: string) => {
    return comparisonProducts.some((p) => p.id === productId);
  };

  const canAddMore = comparisonProducts.length < MAX_COMPARE;

  return {
    comparisonProducts,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore,
    count: comparisonProducts.length,
  };
}
