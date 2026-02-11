import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TranslationTest } from "@/components/debug/TranslationTest";
import ChatWidgetClient from "@/components/chat/ChatWidgetClient";
import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ToastProvider } from "@/components/ui/Toast";

/**
 * Locale layout - wraps all localized pages with Header/Footer
 * This prevents duplicate headers in root layout
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
  
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ToastProvider>
      <>
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-skip-link focus:px-6 focus:py-3 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:font-semibold focus:ring-4 focus:ring-primary-300"
      >
        Skip to main content
      </a>
      
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer />
      <ChatWidgetClient />
      <TranslationTest />
      </>
      </ToastProvider>
    </NextIntlClientProvider>
  );
}
