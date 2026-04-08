import { Roboto } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';

// Roboto font configuration - Phase 2.1: Fixed performance regressions
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap', // FOIT prevention: show fallback immediately
  preload: true, // Preload font files for faster FCP
  fallback: ['system-ui', '-apple-system', 'sans-serif'], // Simplified: 3 fonts for faster matching
  adjustFontFallback: false, // Removed: runtime JS overhead causing TBT regression
});

/**
 * Root layout - Required HTML structure for all routes
 * Uses server-side locale detection for accurate SSR lang attribute
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get locale from next-intl server-side (cookies/headers)
  const locale = await getLocale();

  // Phase 2: Dynamic WordPress GraphQL origin for preconnect (environment-aware)
  const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || '';
  const wordpressOrigin = graphqlUrl ? new URL(graphqlUrl).origin : '';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Phase 2.1: Resource hints optimized - DNS prefetch only (non-blocking) */}
        {/* Resolves DNS early without TLS handshake overhead */}
        {wordpressOrigin && (
          <link rel="dns-prefetch" href={wordpressOrigin} />
        )}
      </head>
      <body className={`${roboto.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
