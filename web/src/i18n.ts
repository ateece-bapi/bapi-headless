import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { defineRouting } from 'next-intl/routing';
import { merge } from 'lodash-es';
import logger from '@/lib/logger';

// All supported locales - 11 languages (Phase 1 + Hindi)
export const locales = ['en', 'de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar', 'th', 'pl', 'hi'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Routing configuration for next-intl
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request, fallback to default if undefined
  let locale = await requestLocale;
  
  // If no locale provided, use default (handles root '/' path)
  if (!locale) {
    locale = defaultLocale;
  }

  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Always load English as base (complete translations)
  const englishMessages = (await import(`../messages/en.json`)).default;
  
  // If not English, merge with locale-specific translations (overlay on top of English)
  let messages = englishMessages;
  if (locale !== 'en') {
    try {
      const localeMessages = (await import(`../messages/${locale}.json`)).default;
      // Merge: locale-specific overrides English
      messages = merge({}, englishMessages, localeMessages);
    } catch (error) {
      logger.warn(`Failed to load messages for locale ${locale}, using English fallback`);
    }
  }

  return {
    locale,
    messages,
  };
});
