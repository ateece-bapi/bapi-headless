import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { merge } from 'lodash-es';
import logger from '@/lib/logger';

// All supported locales - 10 languages for Phase 1
export const locales = ['en', 'de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar', 'th', 'pl'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

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
