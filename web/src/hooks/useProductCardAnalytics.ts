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
  trackComparison,
  createProductCardEventData,
  trackViewModeChange as trackViewModeChangeFn,
  getViewport,
  QuickViewPerformanceTracker,
  type ProductCardEventData,
  type QuickViewEventData,
  type ComparisonEventData,
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
  isInComparison?: boolean;
  comparisonCount?: number;
  maxComparisonLimit?: number;
}

export function useProductCardAnalytics({
  product,
  cardType,
  viewMode,
  positionInGrid,
  totalProducts,
  isInComparison = false,
  comparisonCount = 0,
  maxComparisonLimit = 4,
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
  // Comparison Tracking
  // ============================================================================

  const trackComparisonToggle = useCallback(
    (isAdding: boolean) => {
      const comparisonData: ComparisonEventData = {
        ...baseEventData,
        comparison_count: isAdding ? comparisonCount + 1 : comparisonCount - 1,
        max_comparison_limit: maxComparisonLimit,
      };

      trackComparison(isAdding ? 'added' : 'removed', comparisonData);
    },
    [baseEventData, comparisonCount, maxComparisonLimit]
  );

  const trackComparisonLimitReached = useCallback(() => {
    const comparisonData: ComparisonEventData = {
      ...baseEventData,
      comparison_count: comparisonCount,
      max_comparison_limit: maxComparisonLimit,
    };

    trackComparison('limit_reached', comparisonData);
  }, [baseEventData, comparisonCount, maxComparisonLimit]);

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

    // Comparison tracking
    trackComparisonToggle,
    trackComparisonLimitReached,

    // Computed states
    isInComparison,
    canAddToComparison: comparisonCount < maxComparisonLimit,
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
