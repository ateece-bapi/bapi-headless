import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Senior-level middleware implementation with proper cache headers
 * 
 * Problem: next-intl middleware by default sets cache-control: no-cache
 * Solution: Keep i18n functionality but override cache headers for static pages
 * 
 * Benefits:
 * - Automatic locale detection and redirects (i18n works)
 * - CDN caching enabled for static pages (performance preserved)
 * - Best of both worlds: functionality + performance
 */

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // English uses /products, other languages use /de/products
});

export default function middleware(request: NextRequest) {
  // Run next-intl middleware for locale detection
  const response = intlMiddleware(request);
  
  // Override cache headers for static pages (GET requests only)
  if (request.method === 'GET') {
    const pathname = request.nextUrl.pathname;
    
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
