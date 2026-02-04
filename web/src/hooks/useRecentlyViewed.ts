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
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      } catch (error) {
        logger.error('Failed to parse recently viewed', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage when list changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isClient]);

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
