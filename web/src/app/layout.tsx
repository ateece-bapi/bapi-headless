import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import "./globals.css";
import BackToTop from "@/components/layout/BackToTop";
import ChatWidgetClient from "@/components/chat/ChatWidgetClient";
import { AnalyticsClient, SpeedInsightsClient } from "@/components/analytics/AnalyticsClient";
import { WebVitalsClient } from "@/components/analytics/WebVitalsClient";
import { ToastProvider } from "@/components/ui/Toast";
import { StructuredData, generateOrganizationSchema, generateWebSiteSchema } from "@/lib/schema";
import { generateDefaultMetadata } from "@/lib/metadata";

// Removed Geist font imports and variables. Only Acumin and Roboto should be used (see globals.css)

/**
 * Root metadata - Optimized for AI discovery and search visibility
 * Uses centralized metadata generator for consistency
 */
export const metadata: Metadata = generateDefaultMetadata('en');

/**
 * Root layout - must be dynamic to support cookies and authentication
 */
export const dynamic = 'force-dynamic'; // Required for cookie reading

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get locale from next-intl middleware
  const locale = await getLocale();
  
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
          <style dangerouslySetInnerHTML={{ __html: `
            .hero-image-container { position: relative; width: 100%; max-width: 80rem; margin: 0 auto; }
            .hero-image { width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }          ` }} />
          {/* Resource hints for external domains */}
          <link rel="preconnect" href="https://bapiheadlessstaging.kinsta.cloud" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://bapiheadlessstaging.kinsta.cloud" />
          
          {/* Structured Data for  SEO */}
          <StructuredData schema={[organizationSchema, websiteSchema]} />
        </head>
        <body className="antialiased">
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ToastProvider>
              {children}
              <ChatWidgetClient />
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
