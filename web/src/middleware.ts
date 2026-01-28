import createMiddleware from 'next-intl/middleware';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Don't add /en prefix for default locale
});

// Define public routes (no authentication required)
const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/api/preview',
  '/api/revalidate',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/:locale',
  '/:locale/products(.*)',
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
]);

// Combine Clerk and next-intl middleware
export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Handle authentication for protected routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Apply internationalization
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Match all pathnames except for static files and API routes
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
