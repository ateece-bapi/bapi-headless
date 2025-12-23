/**
 * Region and localization types
 */

export type RegionCode = 'us' | 'eu' | 'asia';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'SGD';
export type LanguageCode = 'en' | 'de' | 'fr' | 'es' | 'ja' | 'zh';

export interface Region {
  code: RegionCode;
  name: string;
  currency: CurrencyCode;
  language: LanguageCode;
  locale: string;
  flag: string;
}

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimals: number;
  position: 'before' | 'after';
}

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dateFormat: string;
  timeFormat: string;
}

export const REGIONS: Record<RegionCode, Region> = {
  us: {
    code: 'us',
    name: 'United States',
    currency: 'USD',
    language: 'en',
    locale: 'en-US',
    flag: '🇺🇸',
  },
  eu: {
    code: 'eu',
    name: 'Europe',
    currency: 'EUR',
    language: 'en',
    locale: 'en-GB',
    flag: '🇪🇺',
  },
  asia: {
    code: 'asia',
    name: 'Asia Pacific',
    currency: 'SGD',
    language: 'en',
    locale: 'en-SG',
    flag: '🌏',
  },
};

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
    position: 'before',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2,
    position: 'after',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimals: 2,
    position: 'before',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    decimals: 0,
    position: 'before',
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    decimals: 2,
    position: 'before',
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    decimals: 2,
    position: 'before',
  },
};

export const LANGUAGES: Record<LanguageCode, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24h',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
  },
};
