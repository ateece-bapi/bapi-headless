import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

/**
 * Next.js middleware with internationalization
 * 
 * Clerk authentication completely removed - all pages can now be statically generated.
 * Authentication is handled server-side via JWT tokens in API routes.
 */
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // English uses /products, other languages use /de/products
});

export const config = {
  matcher: [
    // Match all pathnames except for static files
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
