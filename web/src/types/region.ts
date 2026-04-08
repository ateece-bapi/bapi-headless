/**
 * Region and localization types
 */

export type RegionCode =
  | 'us'
  | 'uk'
  | 'eu'
  | 'pl'
  | 'mena';
export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'PLN'
  | 'AED';
export type LanguageCode =
  | 'en'
  | 'de'
  | 'fr'
  | 'es'
  | 'ja'
  | 'zh'
  | 'vi'
  | 'ar'
  | 'th'
  | 'pl'
  | 'hi';

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
  flag: string;
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
  uk: {
    code: 'uk',
    name: 'United Kingdom',
    currency: 'GBP',
    language: 'en',
    locale: 'en-GB',
    flag: '🇬🇧',
  },
  eu: {
    code: 'eu',
    name: 'Europe',
    currency: 'EUR',
    language: 'en',
    locale: 'en-GB',
    flag: '🇪🇺',
  },
  pl: {
    code: 'pl',
    name: 'Poland',
    currency: 'PLN',
    language: 'pl',
    locale: 'pl-PL',
    flag: '🇵🇱',
  },
  mena: {
    code: 'mena',
    name: 'Middle East',
    currency: 'AED',
    language: 'ar',
    locale: 'ar-AE',
    flag: '🇦🇪',
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
  PLN: {
    code: 'PLN',
    symbol: 'zł',
    name: 'Polish Zloty',
    decimals: 2,
    position: 'after',
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    decimals: 2,
    position: 'after',
  },
};

export const LANGUAGES: Record<LanguageCode, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24h',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
  },
  vi: {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
  },
  th: {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
  },
};
