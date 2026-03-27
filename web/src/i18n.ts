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
  localePrefix: 'as-needed', // Changed from 'always' - middleware not running causes requestLocale=undefined
});

export default getRequestConfig(async ({ requestLocale }) => {
  // In next-intl v4 with Next.js 15, requestLocale is a Promise when using routing
  // This is set by setRequestLocale() in the layout
  let locale = await requestLocale;
  
  // RUNTIME DEBUG: Log what locale we're getting (both build and runtime)
  console.log('[i18n.ts RUNTIME] requestLocale resolved to:', locale);
  
  // Validate that the incoming locale is valid, fallback to default
  if (!locale || !locales.includes(locale as Locale)) {
    console.log('[i18n.ts RUNTIME] Invalid locale, falling back to default');
    locale = defaultLocale;
  }
  const validLocale = locale as Locale;

  // Always load English as base (complete translations)
  const englishMessages = (await import(`../messages/en.json`)).default;

  // If not English, merge with locale-specific translations (overlay on top of English)
  let messages = englishMessages;
  if (validLocale !== 'en') {
    try {
      console.log(`[i18n.ts RUNTIME] Loading messages for locale: ${validLocale}`);
      const localeMessages = (await import(`../messages/${validLocale}.json`)).default;
      // Merge: locale-specific overrides English
      messages = merge({}, englishMessages, localeMessages);
      console.log(`[i18n.ts RUNTIME] Successfully merged ${validLocale} messages`);
    } catch (error) {
      logger.warn(`Failed to load messages for locale ${validLocale}, using English fallback`);
    }
  } else {
    console.log('[i18n.ts RUNTIME] Using English messages (no merge needed)');
  }

  console.log(`[i18n.ts RUNTIME] Returning config with locale: ${validLocale}`);
  return {
    locale: validLocale,
    messages,
  };
});
