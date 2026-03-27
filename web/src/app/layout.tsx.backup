import { Roboto } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';

// Roboto font configuration - optimized for performance
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
