/**
 * Product Card Analytics System
 *
 * Tracks user interactions with product cards to inform design decisions.
 * Integrates with Vercel Analytics for production tracking.
 *
 * Events Tracked:
 * - product_card_view: Card enters viewport (intersection observer)
 * - product_card_click: User clicks card to view product
 * - quick_view_opened: Quick View modal opened
 * - quick_view_closed: Quick View modal closed
 * - comparison_added: Product added to comparison
 * - comparison_removed: Product removed from comparison
 * - comparison_limit_reached: User tries to add when at max
 * - list_view_toggled: User switches between grid/list view
 */

import { track } from '@vercel/analytics';

// ============================================================================
// Types
// ============================================================================

export type ProductCardEvent =
  | 'product_card_view'
  | 'product_card_click'
  | 'product_card_hover'
  | 'quick_view_opened'
  | 'quick_view_closed'
  | 'comparison_added'
  | 'comparison_removed'
  | 'comparison_limit_reached'
  | 'list_view_toggled';

export interface ProductCardEventData {
  // Product identifiers
  product_id: string;
  product_name: string;
  product_slug: string;

  // Card context
  card_type: 'basic' | 'advanced';
  view_mode: 'grid' | 'list';

  // Product state
  has_sale_badge: boolean;
  has_stock_badge: boolean;
  has_part_number: boolean;
  stock_status?: string;
  price?: string | null;

  // Position & visibility
  position_in_grid?: number;
  total_products?: number;

  // Device context
  viewport: 'mobile' | 'tablet' | 'desktop';
  is_touch_device: boolean;

  // User context (if authenticated)
  is_authenticated?: boolean;
  user_customer_group?: string | null;
}

export interface QuickViewEventData extends Omit<ProductCardEventData, 'view_mode'> {
  trigger: 'button_click' | 'keyboard_shortcut';
  time_to_open_ms?: number; // How long did user hover before opening?
}

export interface ComparisonEventData extends Omit<ProductCardEventData, 'view_mode'> {
  comparison_count: number; // Current number of products in comparison
  max_comparison_limit: number; // Max allowed (typically 4)
}

// ============================================================================
// Viewport Detection
// ============================================================================

/**
 * Detect current viewport size
 */
export function getViewport(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;

  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Detect if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - legacy IE
    navigator.msMaxTouchPoints > 0
  );
}

// ============================================================================
// Analytics Tracking Functions
// ============================================================================

/**
 * Track a product card event
 */
export function trackProductCardEvent(event: ProductCardEvent, data: ProductCardEventData): void {
  // Only track in production or if analytics explicitly enabled
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_DEV_ANALYTICS) {
    console.log('[Analytics]', event, data);
    return;
  }

  try {
    track(event, {
      ...data,
      timestamp: new Date().toISOString(),
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  } catch (error) {
    console.error('Analytics tracking failed:', error);
    // Don't throw - analytics failure shouldn't break UX
  }
}

/**
 * Track Quick View interaction
 */
export function trackQuickView(
  action: 'opened' | 'closed',
  data: QuickViewEventData
): void {
  trackProductCardEvent(
    action === 'opened' ? 'quick_view_opened' : 'quick_view_closed',
    data as ProductCardEventData
  );
}

/**
 * Track Product Comparison interaction
 */
export function trackComparison(
  action: 'added' | 'removed' | 'limit_reached',
  data: ComparisonEventData
): void {
  const event: ProductCardEvent =
    action === 'added'
      ? 'comparison_added'
      : action === 'removed'
        ? 'comparison_removed'
        : 'comparison_limit_reached';

  trackProductCardEvent(event, data as ProductCardEventData);
}

/**
 * Track list/grid view toggle
 */
export function trackViewModeChange(
  newMode: 'grid' | 'list',
  context: {
    previous_mode: 'grid' | 'list';
    product_count: number;
    viewport: ReturnType<typeof getViewport>;
  }
): void {
  track('list_view_toggled', {
    new_mode: newMode,
    previous_mode: context.previous_mode,
    product_count: context.product_count,
    viewport: context.viewport,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// Analytics Helpers for Components
// ============================================================================

/**
 * Create common event data from product object
 */
export function createProductCardEventData(
  product: {
    id: string;
    name?: string | null;
    slug?: string | null;
    partNumber?: string | null;
    price?: string | null;
    stockStatus?: string | null;
    onSale?: boolean;
  },
  context: {
    cardType: 'basic' | 'advanced';
    viewMode: 'grid' | 'list';
    positionInGrid?: number;
    totalProducts?: number;
  }
): ProductCardEventData {
  return {
    product_id: product.id,
    product_name: product.name || 'Untitled Product',
    product_slug: product.slug || 'unknown',

    card_type: context.cardType,
    view_mode: context.viewMode,

    has_sale_badge: product.onSale || false,
    has_stock_badge: product.stockStatus === 'IN_STOCK',
    has_part_number: !!product.partNumber,
    stock_status: product.stockStatus || undefined,
    price: product.price,

    position_in_grid: context.positionInGrid,
    total_products: context.totalProducts,

    viewport: getViewport(),
    is_touch_device: isTouchDevice(),

    // TODO: Add authentication context when available
    is_authenticated: false,
    user_customer_group: null,
  };
}

// ============================================================================
// Performance Monitoring
// ============================================================================

/**
 * Track performance metric for product card interactions
 */
export function trackProductCardPerformance(
  metric: string,
  value: number,
  context?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance]', metric, value, context);
    return;
  }

  track('product_card_performance', {
    metric,
    value,
    ...context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Measure time to interactive for Quick View
 */
export class QuickViewPerformanceTracker {
  private startTime: number;

  constructor() {
    this.startTime = performance.now();
  }

  complete(productId: string): void {
    const duration = performance.now() - this.startTime;

    trackProductCardPerformance('quick_view_time_to_interactive', duration, {
      product_id: productId,
      viewport: getViewport(),
    });
  }
}

// ============================================================================
// Exports
// ============================================================================

export default {
  trackProductCardEvent,
  trackQuickView,
  trackComparison,
  trackViewModeChange,
  createProductCardEventData,
  getViewport,
  isTouchDevice,
  trackProductCardPerformance,
  QuickViewPerformanceTracker,
};
