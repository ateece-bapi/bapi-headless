import { getRequestConfig } from 'next-intl/server';
import { defineRouting } from 'next-intl/routing';
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
  localePrefix: 'always', // Always include locale in URL for predictable routing
});

export default getRequestConfig(async ({ requestLocale }) => {
  // In next-intl v4 with Next.js 15, requestLocale is a Promise when using routing
  // This is set by setRequestLocale() in the layout
  let locale = await requestLocale;
  
  // Validate that the incoming locale is valid, fallback to default
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }
  const validLocale = locale as Locale;

  // PERFORMANCE FIX: Only load the specific locale file needed (no double-loading)
  // This reduces bundle size by ~50% for non-English users
  let messages;
  try {
    // Use explicit imports to help Next.js tree-shake unused locales
    // This prevents bundling all locale files in the client bundle
    switch (validLocale) {
      case 'en':
        messages = (await import('../messages/en.json')).default;
        break;
      case 'de':
        messages = (await import('../messages/de.json')).default;
        break;
      case 'fr':
        messages = (await import('../messages/fr.json')).default;
        break;
      case 'es':
        messages = (await import('../messages/es.json')).default;
        break;
      case 'ja':
        messages = (await import('../messages/ja.json')).default;
        break;
      case 'zh':
        messages = (await import('../messages/zh.json')).default;
        break;
      case 'vi':
        messages = (await import('../messages/vi.json')).default;
        break;
      case 'ar':
        messages = (await import('../messages/ar.json')).default;
        break;
      case 'th':
        messages = (await import('../messages/th.json')).default;
        break;
      case 'pl':
        messages = (await import('../messages/pl.json')).default;
        break;
      case 'hi':
        messages = (await import('../messages/hi.json')).default;
        break;
      default:
        messages = (await import('../messages/en.json')).default;
    }
  } catch {
    logger.warn(`Failed to load messages for locale ${validLocale}, using English fallback`);
    messages = (await import('../messages/en.json')).default;
  }

  return {
    locale: validLocale,
    messages,
  };
});
