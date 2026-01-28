import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// All supported locales - 8 languages for Phase 1
export const locales = ['en', 'de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  const locale = await requestLocale;

  // Validate that the incoming locale is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
