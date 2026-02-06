import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
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

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // All languages use prefix: /en, /de, /fr (better for SEO and cache)
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route needs authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.includes(route)
  );
  
  const isAdminRoute = adminRoutes.some(route => 
    pathname.includes(route)
  );

  // Check for auth token in cookies
  const authToken = request.cookies.get('auth_token')?.value;

  // Redirect to sign-in if accessing protected route without auth
  if ((isProtectedRoute || isAdminRoute) && !authToken) {
    const signInUrl = new URL('/sign-in', request.url);
    // Preserve intended destination for post-login redirect
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If accessing sign-in page while already authenticated, redirect to account
  if (pathname.includes('/sign-in') && authToken) {
    // Extract locale from pathname or use default
    const localeMatch = pathname.match(/^\/(en|de|fr|es|ja|zh|vi|ar)/);
    const locale = localeMatch ? localeMatch[1] : defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/account`, request.url));
  }

  // Run next-intl middleware for locale detection
  const response = intlMiddleware(request);
  
  // Override cache headers for static pages (GET requests only)
  if (request.method === 'GET') {
    // Static routes that should be CDN cached
    const isStaticRoute = 
      pathname === '/' ||
      pathname.match(/^\/(en|de|fr|es|ja|zh|vi|ar)(\/.*)?$/) ||
      pathname.startsWith('/products') ||
      pathname.startsWith('/company') ||
      pathname.startsWith('/support') ||
      pathname.startsWith('/resources');
    
    if (isStaticRoute) {
      // Set proper cache headers for CDN
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400'
      );
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for static files and API routes
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
