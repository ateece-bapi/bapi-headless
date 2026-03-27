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
  localePrefix: 'always',
});

export default getRequestConfig(async ({ locale }) => {
  // In next-intl v4 with Next.js 15, locale is passed directly from routing
  // This is set by setRequestLocale() in the layout
  
  // DEBUG: Log what we receive
  console.log('[i18n.ts] getRequestConfig called with locale:', locale);
  
  // Validate that the incoming locale is valid, fallback to default
  const validLocale = (locale && locales.includes(locale as Locale)) ? locale : defaultLocale;
  
  console.log('[i18n.ts] Validated locale:', validLocale);

  // Always load English as base (complete translations)
  const englishMessages = (await import(`../messages/en.json`)).default;

  // If not English, merge with locale-specific translations (overlay on top of English)
  let messages = englishMessages;
  if (validLocale !== 'en') {
    try {
      console.log('[i18n.ts] Loading German messages for:', validLocale);
      const localeMessages = (await import(`../messages/${validLocale}.json`)).default;
      console.log('[i18n.ts] German messages loaded, keys:', Object.keys(localeMessages).slice(0, 5));
      console.log('[i18n.ts] German nav.products:', (localeMessages as any)?.nav?.products);
      console.log('[i18n.ts] English nav.products:', (englishMessages as any)?.nav?.products);
      
      // Merge: locale-specific overrides English
      messages = merge({}, englishMessages, localeMessages);
      
      console.log('[i18n.ts] After merge, messages has keys:', Object.keys(messages).slice(0, 5));
      console.log('[i18n.ts] After merge, nav.products:', (messages as any)?.nav?.products);
    } catch (error) {
      console.error('[i18n.ts] ERROR loading messages:', error);
      logger.warn(`Failed to load messages for locale ${validLocale}, using English fallback`);
    }
  }

  console.log('[i18n.ts] Returning locale:', validLocale, 'with', Object.keys(messages).length, 'top-level keys');
  
  return {
    locale: validLocale,
    messages,
  };
});
