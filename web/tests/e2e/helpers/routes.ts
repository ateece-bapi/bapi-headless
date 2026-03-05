/**
 * E2E Test Route Helpers
 * 
 * Centralized route generation for i18n testing.
 * Avoids hardcoding locale prefixes throughout test files.
 */

/**
 * Normalize locale values from env/inputs by trimming whitespace and
 * stripping any leading/trailing slashes (e.g. '/en/' -> 'en').
 * Falls back to 'en' if the result is empty (e.g. '/', '   ').
 */
export function normalizeLocale(locale: string): string {
  const normalized = locale.trim().replace(/^\/+|\/+$/g, '');
  return normalized || 'en';
}

// Default test locale (can be overridden via environment variable)
export const DEFAULT_LOCALE = normalizeLocale(process.env.E2E_LOCALE || 'en');

/**
 * Build a locale-prefixed route for testing
 * @param path - The path without locale prefix (e.g., '/products', '/categories/temperature')
 * @param locale - Optional locale override (defaults to DEFAULT_LOCALE)
 * @returns Locale-prefixed route (e.g., '/en/products')
 */
export function buildRoute(path: string, locale: string = DEFAULT_LOCALE): string {
  const normalizedLocale = normalizeLocale(locale);
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${normalizedLocale}${normalizedPath}`;
}

/**
 * Common test routes with locale prefix
 */
export const routes = {
  home: (locale: string = DEFAULT_LOCALE) => `/${normalizeLocale(locale)}`,
  products: (locale: string = DEFAULT_LOCALE) => buildRoute('/products', locale),
  cart: (locale: string = DEFAULT_LOCALE) => buildRoute('/cart', locale),
  checkout: (locale: string = DEFAULT_LOCALE) => buildRoute('/checkout', locale),
  category: (slug: string, locale: string = DEFAULT_LOCALE) => buildRoute(`/categories/${slug}`, locale),
  subcategory: (category: string, subSlug: string, locale: string = DEFAULT_LOCALE) =>
    buildRoute(`/products/${category}/${subSlug}`, locale),
  product: (slug: string, locale: string = DEFAULT_LOCALE) => buildRoute(`/product/${slug}`, locale),
};
