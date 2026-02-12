import type { LanguageCode } from '@/types/region';
import { LANGUAGES } from '@/types/region';

/**
 * Format a date according to the language/region settings
 */
export function formatDate(
  date: Date | string | number,
  language: LanguageCode = 'en',
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  };

  // Use the appropriate locale
  const locale = getLocaleFromLanguage(language);
  return dateObj.toLocaleDateString(locale, defaultOptions);
}

/**
 * Format a time according to the language/region settings
 */
export function formatTime(
  date: Date | string | number,
  language: LanguageCode = 'en',
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const config = LANGUAGES[language];

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: config.timeFormat === '12h',
    ...options,
  };

  const locale = getLocaleFromLanguage(language);
  return dateObj.toLocaleTimeString(locale, defaultOptions);
}

/**
 * Format a date and time together
 */
export function formatDateTime(
  date: Date | string | number,
  language: LanguageCode = 'en',
  dateOptions?: Intl.DateTimeFormatOptions,
  timeOptions?: Intl.DateTimeFormatOptions
): string {
  const formattedDate = formatDate(date, language, dateOptions);
  const formattedTime = formatTime(date, language, timeOptions);
  return `${formattedDate} ${formattedTime}`;
}

/**
 * Format a number according to locale
 */
export function formatNumber(
  num: number,
  language: LanguageCode = 'en',
  options: Intl.NumberFormatOptions = {}
): string {
  const locale = getLocaleFromLanguage(language);
  return num.toLocaleString(locale, options);
}

/**
 * Format a distance/measurement (with unit conversion)
 */
export function formatMeasurement(
  value: number,
  unit: 'celsius' | 'fahrenheit' | 'meters' | 'feet',
  language: LanguageCode = 'en'
): string {
  const locale = getLocaleFromLanguage(language);

  // US uses imperial, others use metric
  const useImperial = language === 'en' && locale === 'en-US';

  let displayValue = value;
  let displayUnit = unit;

  // Convert units if needed
  if (unit === 'celsius' && useImperial) {
    displayValue = (value * 9) / 5 + 32;
    displayUnit = 'fahrenheit';
  } else if (unit === 'fahrenheit' && !useImperial) {
    displayValue = ((value - 32) * 5) / 9;
    displayUnit = 'celsius';
  } else if (unit === 'meters' && useImperial) {
    displayValue = value * 3.28084;
    displayUnit = 'feet';
  } else if (unit === 'feet' && !useImperial) {
    displayValue = value / 3.28084;
    displayUnit = 'meters';
  }

  const formattedValue = formatNumber(displayValue, language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const unitSymbol = getUnitSymbol(displayUnit);
  return `${formattedValue}${unitSymbol}`;
}

/**
 * Get locale string from language code
 */
function getLocaleFromLanguage(language: LanguageCode): string {
  const localeMap: Record<LanguageCode, string> = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    ja: 'ja-JP',
    zh: 'zh-CN',
    vi: 'vi-VN',
    ar: 'ar-AE',
    th: 'th-TH',
    pl: 'pl-PL',
    hi: 'hi-IN',
  };
  return localeMap[language];
}

/**
 * Get unit symbol
 */
function getUnitSymbol(unit: string): string {
  const symbols: Record<string, string> = {
    celsius: '°C',
    fahrenheit: '°F',
    meters: 'm',
    feet: 'ft',
  };
  return symbols[unit] || unit;
}

/**
 * Get language native name
 */
export function getLanguageName(language: LanguageCode, native = true): string {
  const config = LANGUAGES[language];
  return native ? config.nativeName : config.name;
}
