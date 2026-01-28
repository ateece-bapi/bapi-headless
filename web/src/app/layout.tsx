import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  // Get locale from params (next-intl provides this)
  const { locale } = await params;
  
  // Get messages for next-intl (will use locale from middleware)
  const messages = await getMessages({ locale });

  return (
    <ClerkProvider>
      <html lang={locale || 'en'}>
        <body className="antialiased">
          <NextIntlClientProvider messages={messages} locale={locale || 'en'}>
            <ToastProvider>
              <Header />
              {children}
              <Footer />
              <Toaster 
                position="top-right" 
                richColors 
                closeButton
                toastOptions={{
                  className: 'font-roboto',
                  style: {
                    fontFamily: 'Roboto, sans-serif',
                  },
                }}
              />
            </ToastProvider>
          </NextIntlClientProvider>
          <BackToTop />
        </body>
      </html>
    </ClerkProvider>
  );
}
