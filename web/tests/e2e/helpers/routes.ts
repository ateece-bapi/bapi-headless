/**
 * E2E Test Route Helpers
 * 
 * Centralized route generation for i18n testing.
 * Avoids hardcoding locale prefixes throughout test files.
 */

// Default test locale (can be overridden via environment variable)
export const DEFAULT_LOCALE = process.env.E2E_LOCALE || 'en';

/**
 * Build a locale-prefixed route for testing
 * @param path - The path without locale prefix (e.g., '/products', '/categories/temperature')
 * @param locale - Optional locale override (defaults to DEFAULT_LOCALE)
 * @returns Locale-prefixed route (e.g., '/en/products')
 */
export function buildRoute(path: string, locale: string = DEFAULT_LOCALE): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

/**
 * Common test routes with locale prefix
 */
export const routes = {
  home: (locale: string = DEFAULT_LOCALE) => `/${locale}`,
  products: (locale: string = DEFAULT_LOCALE) => buildRoute('/products', locale),
  category: (slug: string, locale: string = DEFAULT_LOCALE) => buildRoute(`/categories/${slug}`, locale),
  subcategory: (category: string, subSlug: string, locale: string = DEFAULT_LOCALE) =>
    buildRoute(`/products/${category}/${subSlug}`, locale),
  product: (slug: string, locale: string = DEFAULT_LOCALE) => buildRoute(`/product/${slug}`, locale),
};
