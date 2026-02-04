import { locales } from '@/i18n';

/**
 * Generate static pages for all supported locales
 * This enables full static generation and CDN caching
 */
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

/**
 * Revalidate every 1 hour
 * Pages will be regenerated in the background
 */
export const revalidate = 3600;
