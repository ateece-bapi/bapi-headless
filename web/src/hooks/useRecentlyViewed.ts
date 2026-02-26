'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import type { Product } from '@/lib/graphql/types';

const STORAGE_KEY = 'bapi-recently-viewed';
const MAX_ITEMS = 5;

/**
 * Hook for tracking recently viewed products
 *
 * Features:
 * - Add product to recently viewed
 * - Max 5 products (FIFO)
 * - localStorage persistence
 * - Deduplication (move to front if already viewed)
 */
export function useRecentlyViewed() {
  // Initialize from localStorage using lazy initial state
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      logger.error('Failed to parse recently viewed', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return [];
  });

  // Save to localStorage when list changes (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists (will add to front)
      const filtered = prev.filter((p) => p.id !== product.id);

      // Add to front, limit to MAX_ITEMS
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);

      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    count: recentlyViewed.length,
  };
}
