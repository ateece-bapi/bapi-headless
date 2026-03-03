import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import '../globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidgetClient from '@/components/chat/ChatWidgetClient';
import BackToTop from '@/components/layout/BackToTop';
import { AutoRegionDetection } from '@/components/region/AutoRegionDetection';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ToastProvider } from '@/components/ui/Toast';
import { AnalyticsClient, SpeedInsightsClient } from '@/components/analytics/AnalyticsClient';
import { WebVitalsClient } from '@/components/analytics/WebVitalsClient';
import { StructuredData, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';
import { generateDefaultMetadata } from '@/lib/metadata';
import { locales } from '@/i18n';

// Roboto font configuration using Next.js font optimization
const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

/**
 * Generate static params for all supported locales
 * This enables Next.js to pre-generate pages for each locale at build time
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Generate metadata for each locale
 * Uses centralized metadata generator with locale support
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateDefaultMetadata(locale);
}

/**
 * Locale layout - Root layout with HTML structure and locale-aware content
 * Senior-level architecture: Single source of truth for HTML/head/body
 * ISR-ready with proper locale segmentation for CDN caching
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params and set request locale
  const { locale } = await params;
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  // Generate site-wide structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi-headless.vercel.app';
  const organizationSchema = generateOrganizationSchema(siteUrl);
  const websiteSchema = generateWebSiteSchema(siteUrl, 'BAPI - Building Automation Products Inc.');

  return (
    <html lang={locale}>
      <head>
        {/* Inline critical CSS for hero image container */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .hero-image-container { position: relative; width: 100%; max-width: 80rem; margin: 0 auto; }
            .hero-image { width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `,
          }}
        />
        {/* Resource hints for external domains */}
        <link
          rel="preconnect"
          href="https://bapiheadlessstaging.kinsta.cloud"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://bapiheadlessstaging.kinsta.cloud" />

        {/* Structured Data for SEO */}
        <StructuredData schema={[organizationSchema, websiteSchema]} />
      </head>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ToastProvider>
            <>
              {/* Skip to main content link for keyboard users */}
              <a
                href="#main-content"
                className="focus:z-skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-primary-600 focus:px-6 focus:py-3 focus:font-semibold focus:text-white focus:shadow-lg focus:ring-4 focus:ring-primary-300"
              >
                Skip to main content
              </a>

              {/* Auto-detect region/language for first-time visitors */}
              <AutoRegionDetection />

              <Header />
              <main id="main-content">{children}</main>
              <Footer />
              <ChatWidgetClient />
            </>
          </ToastProvider>
        </NextIntlClientProvider>
        <BackToTop />
        <WebVitalsClient />
        <AnalyticsClient />
        <SpeedInsightsClient />
      </body>
    </html>
  );
}
