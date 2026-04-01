import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Senior-level middleware with authentication and cache headers
 * 
 * Features:
 * - Protected routes require authentication (JWT token in cookie)
 * - Automatic locale detection and redirects (next-intl)
 * - CDN caching for static pages (performance)
 * - Redirect to sign-in with preserved destination
 */

// Supported locales - update this list when adding new languages
const LOCALE_PATTERN = 'en|de|fr|es|ja|zh|vi|ar|th|pl|hi';
const LOCALE_REGEX = new RegExp(`^/(${LOCALE_PATTERN})`);
const LOCALE_WITH_END_REGEX = new RegExp(`^/(${LOCALE_PATTERN})(?:\/|$)`);
const LOCALE_HOMEPAGE_REGEX = new RegExp(`^/(${LOCALE_PATTERN})/?$`);

// Module-level regex constants for public static CDN-cacheable routes
// Created once at startup (not on every request) for performance
// Pattern: ^/(locale/)? properly groups locale+slash to prevent double-slash matches
const LOCALE_PRODUCTS_REGEX = new RegExp(`^/(${LOCALE_PATTERN}/)?products`);
const LOCALE_COMPANY_REGEX = new RegExp(`^/(${LOCALE_PATTERN}/)?company`);
const LOCALE_SUPPORT_REGEX = new RegExp(`^/(${LOCALE_PATTERN}/)?support`);
const LOCALE_RESOURCES_REGEX = new RegExp(`^/(${LOCALE_PATTERN}/)?resources`);

// Protected routes that require authentication
const protectedRoutes = [
  '/account',
  '/account/profile',
  '/account/orders',
  '/account/favorites',
  '/account/quotes',
  '/account/settings',
];

// Admin-only routes (for future implementation)
const adminRoutes = [
  '/admin',
  '/admin/chat-analytics',
];

// Create next-intl middleware with routing config
const intlMiddleware = createMiddleware(routing);

/**
 * Legacy category slug mappings for backward compatibility
 * Redirects short slugs to full WordPress category slugs
 */
const CATEGORY_SLUG_REDIRECTS: Record<string, string> = {
  temperature: 'temperature-sensors',
  humidity: 'humidity-sensors',
  pressure: 'pressure-sensors',
  'air-quality': 'air-quality-sensors',
  wireless: 'bluetooth-wireless',
};

/**
 * Extract locale from pathname, falling back to default locale.
 * Uses LOCALE_WITH_END_REGEX to ensure locale is followed by slash or end of string.
 */
function extractLocale(pathname: string): string {
  const localeMatch = pathname.match(LOCALE_WITH_END_REGEX);
  return localeMatch ? localeMatch[1] : routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // RUNTIME DEBUG: Log incoming requests
  console.log('[MIDDLEWARE] Incoming request:', pathname);

  // Helper to strip locale prefix for accurate path matching.
  // Uses LOCALE_WITH_END_REGEX (not LOCALE_REGEX) to avoid incorrectly stripping
  // locale-like prefixes from non-locale paths (e.g., /english/page → glish/page).
  const stripLocalePrefix = (path: string) =>
    path.replace(LOCALE_WITH_END_REGEX, '/');
  
  // ============================================================================
  // LEGACY REDIRECTS - Category Routing Consolidation (April 2026)
  // ============================================================================
  
  // 1. Redirect /categories/* → /products/* (301 permanent redirect)
  const categoriesMatch = pathname.match(/^\/([a-z]{2})\/categories\/(.+)$/);
  if (categoriesMatch) {
    const [, locale, categorySlug] = categoriesMatch;
    const newUrl = new URL(`/${locale}/products/${categorySlug}`, request.url);
    console.log('[MIDDLEWARE] 301 Redirect /categories → /products:', newUrl.toString());
    return NextResponse.redirect(newUrl, { status: 301 });
  }
  
  // 2. Redirect short category slugs → full WordPress slugs (301 permanent redirect)
  const shortSlugMatch = pathname.match(/^\/([a-z]{2})\/products\/([a-z-]+)$/);
  if (shortSlugMatch) {
    const [, locale, slug] = shortSlugMatch;
    const fullSlug = CATEGORY_SLUG_REDIRECTS[slug];
    if (fullSlug) {
      const newUrl = new URL(`/${locale}/products/${fullSlug}`, request.url);
      console.log('[MIDDLEWARE] 301 Redirect short slug → full slug:', newUrl.toString());
      return NextResponse.redirect(newUrl, { status: 301 });
    }
  }
  
  // Check if route needs authentication (use segment matching to prevent false positives)
  const isProtectedRoute = protectedRoutes.some(route => {
    const pathWithoutLocale = stripLocalePrefix(pathname);
    return pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`);
  });
  
  const isAdminRoute = adminRoutes.some(route => {
    const pathWithoutLocale = stripLocalePrefix(pathname);
    return pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`);
  });

  // Check for auth token in cookies
  const authToken = request.cookies.get('auth_token')?.value;

  // Redirect to sign-in if accessing protected route without auth
  if ((isProtectedRoute || isAdminRoute) && !authToken) {
    const locale = extractLocale(pathname);
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    // Preserve intended destination for post-login redirect
    signInUrl.searchParams.set('redirect', pathname);
    console.log('[MIDDLEWARE] Redirecting to sign-in:', signInUrl.toString());
    return NextResponse.redirect(signInUrl);
  }

  // If accessing sign-in page while already authenticated, redirect to account
  const pathWithoutLocale = stripLocalePrefix(pathname);
  if ((pathWithoutLocale === '/sign-in' || pathWithoutLocale.startsWith('/sign-in/')) && authToken) {
    const locale = extractLocale(pathname);
    return NextResponse.redirect(new URL(`/${locale}/account`, request.url));
  }

  // Run next-intl middleware for locale detection
  const response = intlMiddleware(request);
  
  // Override cache headers for static pages (GET requests only)
  // CRITICAL: Never cache authenticated/protected routes to prevent data leakage
  if (request.method === 'GET' && !isProtectedRoute && !isAdminRoute && !authToken) {
    // Only cache truly public, non-personalized routes
    const isPublicStaticRoute = 
      pathname === '/' ||
      pathname.match(LOCALE_HOMEPAGE_REGEX) || // Locale homepage only
      pathname.match(LOCALE_PRODUCTS_REGEX) ||
      pathname.match(LOCALE_COMPANY_REGEX) ||
      pathname.match(LOCALE_SUPPORT_REGEX) ||
      pathname.match(LOCALE_RESOURCES_REGEX);
    
    if (isPublicStaticRoute) {
      // Set proper cache headers for CDN with locale awareness
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400'
      );
      // CRITICAL: Vary by Accept-Language to ensure locale-specific caching
      response.headers.set('Vary', 'Accept-Language, Cookie');
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except static files and Next.js internals
    '/((?!_next|api|.*\\.).*)',
  ],
};
