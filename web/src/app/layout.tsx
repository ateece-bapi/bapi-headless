import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import BackToTop from '@/components/layout/BackToTop';
import { AnalyticsClient, SpeedInsightsClient } from '@/components/analytics/AnalyticsClient';
import { WebVitalsClient } from '@/components/analytics/WebVitalsClient';
import { StructuredData, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';
import { generateDefaultMetadata } from '@/lib/metadata';

// Roboto font configuration using Next.js font optimization
const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

/**
 * Root metadata - Optimized for AI discovery and search visibility
 * Uses centralized metadata generator for consistency
 */
export const metadata: Metadata = generateDefaultMetadata('en');

/**
 * Root layout - uses 'auto' for optimal caching while allowing dynamic features
 * Specific routes that need cookies can override with force-dynamic
 */
// Removed force-dynamic to enable back/forward cache - auth routes handle their own dynamic needs

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout doesn't have locale in route - default to 'en'
  // The [locale] layout handles locale-specific content
  const locale = 'en';

  // Generate site-wide structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi-headless.vercel.app';
  const organizationSchema = generateOrganizationSchema(siteUrl);
  const websiteSchema = generateWebSiteSchema(siteUrl, 'BAPI - Building Automation Products Inc.');

  return (
    <html lang={locale || 'en'}>
      <head>
        {/* Inline critical CSS for hero image container */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .hero-image-container { position: relative; width: 100%; max-width: 80rem; margin: 0 auto; }
            .hero-image { width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }          `,
          }}
        />
        {/* Resource hints for external domains */}
        <link
          rel="preconnect"
          href="https://bapiheadlessstaging.kinsta.cloud"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://bapiheadlessstaging.kinsta.cloud" />

        {/* Structured Data for  SEO */}
        <StructuredData schema={[organizationSchema, websiteSchema]} />
      </head>
      <body className={`${roboto.variable} font-sans antialiased`}>
        {children}
        <BackToTop />
        <WebVitalsClient />
        <AnalyticsClient />
        <SpeedInsightsClient />
      </body>
    </html>
  );
}