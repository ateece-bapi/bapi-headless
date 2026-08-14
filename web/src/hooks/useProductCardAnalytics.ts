'use client';

/**
 * useProductCardAnalytics Hook
 *
 * React hook for tracking product card analytics.
 * Provides easy-to-use methods for common tracking scenarios.
 *
 * Usage:
 * ```tsx
 * const analytics = useProductCardAnalytics({
 *   product,
 *   cardType: 'advanced',
 *   viewMode: 'grid',
 *   positionInGrid: index,
 * });
 *
 * <Link onClick={analytics.trackClick}>
 *   <button onClick={analytics.trackQuickViewOpen}>Quick View</button>
 * </Link>
 * ```
 */

import { useCallback, useMemo, useRef } from 'react';
import {
  trackProductCardEvent,
  trackQuickView,
  createProductCardEventData,
  trackViewModeChange as trackViewModeChangeFn,
  getViewport,
  QuickViewPerformanceTracker,
  type ProductCardEventData,
  type QuickViewEventData,
} from '@/lib/analytics/productCard';

export interface UseProductCardAnalyticsProps {
  product: {
    id: string;
    name?: string | null;
    slug?: string | null;
    partNumber?: string | null;
    price?: string | null;
    stockStatus?: string | null;
    onSale?: boolean;
  };
  cardType: 'basic' | 'advanced';
  viewMode: 'grid' | 'list';
  positionInGrid?: number;
  totalProducts?: number;
}

export function useProductCardAnalytics({
  product,
  cardType,
  viewMode,
  positionInGrid,
  totalProducts,
}: UseProductCardAnalyticsProps) {
  // Track hover start time for Quick View timing
  const hoverStartTime = useRef<number | null>(null);

  // Create base event data (memoized to avoid recreating on every render)
  const baseEventData: ProductCardEventData = useMemo(
    () =>
      createProductCardEventData(product, {
        cardType,
        viewMode,
        positionInGrid,
        totalProducts,
      }),
    [
      product.id,
      product.name,
      product.slug,
      product.partNumber,
      product.price,
      product.stockStatus,
      product.onSale,
      cardType,
      viewMode,
      positionInGrid,
      totalProducts,
    ]
  );

  // ============================================================================
  // Visibility Tracking (Intersection Observer)
  // ============================================================================

  const trackView = useCallback(() => {
    trackProductCardEvent('product_card_view', baseEventData);
  }, [baseEventData]);

  // ============================================================================
  // Click Tracking
  // ============================================================================

  const trackClick = useCallback(() => {
    trackProductCardEvent('product_card_click', baseEventData);
  }, [baseEventData]);

  // ============================================================================
  // Hover Tracking
  // ============================================================================

  const trackHoverStart = useCallback(() => {
    hoverStartTime.current = performance.now();
    trackProductCardEvent('product_card_hover', baseEventData);
  }, [baseEventData]);

  const trackHoverEnd = useCallback(() => {
    hoverStartTime.current = null;
  }, []);

  // ============================================================================
  // Quick View Tracking
  // ============================================================================

  const trackQuickViewOpen = useCallback(
    (trigger: 'button_click' | 'keyboard_shortcut' = 'button_click') => {
      const timeToOpen = hoverStartTime.current
        ? performance.now() - hoverStartTime.current
        : undefined;

      const quickViewData: QuickViewEventData = {
        ...baseEventData,
        trigger,
        time_to_open_ms: timeToOpen,
      };

      trackQuickView('opened', quickViewData);

      // Return performance tracker for measuring time to interactive
      return new QuickViewPerformanceTracker();
    },
    [baseEventData]
  );

  const trackQuickViewClose = useCallback(() => {
    const quickViewData: QuickViewEventData = {
      ...baseEventData,
      trigger: 'button_click', // Close is always button
    };

    trackQuickView('closed', quickViewData);
  }, [baseEventData]);

  // ============================================================================
  // Return API
  // ============================================================================

  return {
    // View tracking
    trackView,

    // Click tracking
    trackClick,

    // Hover tracking
    trackHoverStart,
    trackHoverEnd,

    // Quick View tracking
    trackQuickViewOpen,
    trackQuickViewClose,
  };
}

/**
 * Hook for tracking view mode changes (grid/list toggle)
 */
export function useViewModeAnalytics() {
  const previousMode = useRef<'grid' | 'list'>('grid');

  const trackViewModeChange = useCallback(
    (newMode: 'grid' | 'list', productCount: number) => {
      if (previousMode.current !== newMode) {
        trackViewModeChangeFn(newMode, {
          previous_mode: previousMode.current,
          product_count: productCount,
          viewport: getViewport(),
        });

        previousMode.current = newMode;
      }
    },
    []
  );

  return { trackViewModeChange };
}
