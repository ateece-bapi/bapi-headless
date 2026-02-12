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
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setComparisonProducts(parsed);
      } catch (error) {
        logger.error('Failed to parse comparison products', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage when comparison changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonProducts));
    }
  }, [comparisonProducts, isClient]);

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
