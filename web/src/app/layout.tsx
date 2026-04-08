import { Roboto } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';

// Roboto font configuration - Phase 2: Optimized for critical rendering path
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap', // FOIT prevention: show fallback immediately
  preload: true, // Preload font files for faster FCP
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
  adjustFontFallback: true, // CLS prevention: match metrics to system fonts
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
        {/* Phase 2: Resource hints - Preconnect to WordPress GraphQL API */}
        {/* Establishes early connection (DNS + TLS handshake) before API requests */}
        {wordpressOrigin && (
          <link rel="preconnect" href={wordpressOrigin} crossOrigin="anonymous" />
        )}
      </head>
      <body className={`${roboto.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
