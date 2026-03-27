import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidgetClient from '@/components/chat/ChatWidgetClient';
import BackToTop from '@/components/layout/BackToTop';
import { AutoRegionDetection } from '@/components/region/AutoRegionDetection';
import { HtmlLangAttribute } from '@/components/layout/HtmlLangAttribute';
import { LocaleDebug } from '@/components/debug/LocaleDebug';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ToastProvider } from '@/components/ui/Toast';
import { AnalyticsClient, SpeedInsightsClient } from '@/components/analytics/AnalyticsClient';
import { WebVitalsClient } from '@/components/analytics/WebVitalsClient';
import { StructuredData, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';
import { generateDefaultMetadata } from '@/lib/metadata';
import { locales } from '@/i18n';

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
  console.log('[Layout] Received locale from params:', locale);
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();
  console.log('[Layout] Got messages, top-level keys:', Object.keys(messages).slice(0, 10));
  console.log('[Layout] Sample nav.products translation:', (messages as any)?.nav?.products);
  console.log('[Layout] Sample nav.company translation:', (messages as any)?.nav?.company);
  console.log('[Layout] Locale being passed to NextIntlClientProvider:', locale);

  // Generate site-wide structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bapi-headless.vercel.app';
  const organizationSchema = generateOrganizationSchema(siteUrl);
  const websiteSchema = generateWebSiteSchema(siteUrl, 'BAPI - Building Automation Products Inc.');

  return (
    <>
      {/* Set lang attribute on html element */}
      <HtmlLangAttribute locale={locale} />

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

      <NextIntlClientProvider messages={messages} locale={locale}>
        <ToastProvider>
          <>
            {/* DEBUG: Client-side locale/translation logging */}
            <LocaleDebug />
            
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
            <main id="main-content" className="relative z-base">
              {children}
            </main>
            <Footer />
            <ChatWidgetClient />
          </>
        </ToastProvider>
      </NextIntlClientProvider>
      <BackToTop />
      <WebVitalsClient />
      <AnalyticsClient />
      <SpeedInsightsClient />
    </>
  );
}
