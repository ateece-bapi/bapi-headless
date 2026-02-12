'use client';

import { useReportWebVitals } from 'next/web-vitals';
import logger from '@/lib/logger';

/**
 * Google Analytics gtag function interface
 */
interface GtagFunction {
  (command: 'event', eventName: string, eventParams: Record<string, unknown>): void;
}

/**
 * Extend Window interface for gtag
 */
declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

/**
 * Web Vitals tracking component for Core Web Vitals monitoring
 *
 * Tracks:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - CLS (Cumulative Layout Shift) - Visual stability
 * - INP (Interaction to Next Paint) - Responsiveness (replaces FID)
 * - FCP (First Contentful Paint) - Initial render
 * - TTFB (Time to First Byte) - Server response time
 *
 * Google's Core Web Vitals thresholds:
 * - LCP: < 2.5s (good), < 4s (needs improvement), >= 4s (poor)
 * - CLS: < 0.1 (good), < 0.25 (needs improvement), >= 0.25 (poor)
 * - INP: < 200ms (good), < 500ms (needs improvement), >= 500ms (poor)
 *
 * @see https://web.dev/vitals/
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`[Web Vitals] ${metric.name}: ${metric.value}`, {
        id: metric.id,
        rating: metric.rating,
      });
    }

    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      // Send to Vercel Analytics (automatic with @vercel/speed-insights)

      // You can also send to custom analytics here
      // Example: Google Analytics 4
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_label: metric.id,
          non_interaction: true,
        });
      }

      // Example: Sentry performance monitoring
      // if (Sentry) {
      //   Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      //     level: 'info',
      //     tags: {
      //       metric: metric.name,
      //       rating: metric.rating,
      //     },
      //     extra: {
      //       value: metric.value,
      //       id: metric.id,
      //     },
      //   });
      // }
    }

    // Log poor metrics as warnings
    if (metric.rating === 'poor') {
      logger.warn(`[Web Vitals] Poor ${metric.name}: ${metric.value}`, {
        threshold: getThreshold(metric.name),
        actual: metric.value,
      });
    }
  });

  return null;
}

/**
 * Get recommended threshold for each metric
 */
function getThreshold(metricName: string): number | string {
  switch (metricName) {
    case 'LCP':
      return 2500; // 2.5 seconds
    case 'CLS':
      return 0.1;
    case 'INP':
      return 200; // 200ms
    case 'FCP':
      return 1800; // 1.8 seconds
    case 'TTFB':
      return 800; // 800ms
    default:
      return 'unknown';
  }
}
