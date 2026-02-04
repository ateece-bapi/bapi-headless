import createMiddleware from 'next-intl/middleware';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // English uses /products, other languages use /de/products
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
  // Skip ALL middleware processing for API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    return;
  }

  // For public routes: skip Clerk auth entirely, only apply intl
  if (isPublicRoute(req)) {
    return intlMiddleware(req);
  }

  // For protected routes: apply Clerk auth protection THEN intl
  await auth.protect();
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Match all pathnames except for static files
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
