import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import "./globals.css";
import BackToTop from "@/components/layout/BackToTop";
import ChatWidgetClient from "@/components/chat/ChatWidgetClient";
import { AnalyticsClient, SpeedInsightsClient } from "@/components/analytics/AnalyticsClient";
import { WebVitalsClient } from "@/components/analytics/WebVitalsClient";
import { ToastProvider } from "@/components/ui/Toast";

// Removed Geist font imports and variables. Only Acumin and Roboto should be used (see globals.css)

export const metadata: Metadata = {
  title: {
    default: "BAPI | Precision Sensor Solutions for Building Automation",
    template: "%s | BAPI"
  },
  description: "Engineered sensor solutions for mission-critical facilities. NIST-traceable accuracy, BACnet-certified controllers, trusted by engineers worldwide for healthcare, data centers, and critical infrastructure.",
  openGraph: {
    title: "BAPI | Precision Sensor Solutions for Building Automation",
    description: "Engineered sensor solutions for mission-critical facilities. NIST-traceable accuracy, BACnet-certified controllers, trusted by engineers worldwide.",
    type: "website",
    url: "https://bapi-headless.vercel.app/",
    siteName: "BAPI",
    images: [
      {
        url: "https://bapi-headless.vercel.app/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "BAPI - Building Automation Products"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@bapi",
    title: "BAPI | Precision Sensor Solutions for Building Automation",
    description: "Engineered sensor solutions for mission-critical facilities. NIST-traceable accuracy, BACnet-certified controllers, trusted by engineers worldwide.",
    images: ["https://bapi-headless.vercel.app/og-default.jpg"]
  },
  metadataBase: new URL("https://bapi-headless.vercel.app/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es"
    }
  }
};

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
