import type { LanguageCode, RegionCode } from '@/types/region';
import { LANGUAGES, REGIONS } from '@/types/region';

/**
 * Supported measurement units
 */
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type LengthUnit = 'meters' | 'feet' | 'inches' | 'centimeters' | 'millimeters';
export type WeightUnit = 'kilograms' | 'pounds' | 'grams' | 'ounces';
export type MeasurementUnit = TemperatureUnit | LengthUnit | WeightUnit;

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
 * Enhanced to support region-aware conversions
 */
export function formatMeasurement(
  value: number,
  unit: MeasurementUnit,
  language: LanguageCode = 'en',
  region?: RegionCode
): string {
  const locale = getLocaleFromLanguage(language);
  
  // Determine if we should use imperial (US) or metric
  const useImperial = shouldUseImperial(language, region);

  let displayValue = value;
  let displayUnit: MeasurementUnit = unit;

  // Temperature conversions
  if (unit === 'celsius' && useImperial) {
    displayValue = celsiusToFahrenheit(value);
    displayUnit = 'fahrenheit';
  } else if (unit === 'fahrenheit' && !useImperial) {
    displayValue = fahrenheitToCelsius(value);
    displayUnit = 'celsius';
  }
  // Length conversions
  else if (unit === 'meters' && useImperial) {
    displayValue = value * 3.28084;
    displayUnit = 'feet';
  } else if (unit === 'feet' && !useImperial) {
    displayValue = value / 3.28084;
    displayUnit = 'meters';
  } else if (unit === 'centimeters' && useImperial) {
    displayValue = value / 2.54;
    displayUnit = 'inches';
  } else if (unit === 'inches' && !useImperial) {
    displayValue = value * 2.54;
    displayUnit = 'centimeters';
  } else if (unit === 'millimeters' && useImperial) {
    displayValue = value / 25.4;
    displayUnit = 'inches';
  } else if (unit === 'millimeters' && !useImperial) {
    displayValue = value / 10;
    displayUnit = 'centimeters';
  }
  // Weight conversions
  else if (unit === 'kilograms' && useImperial) {
    displayValue = value * 2.20462;
    displayUnit = 'pounds';
  } else if (unit === 'pounds' && !useImperial) {
    displayValue = value / 2.20462;
    displayUnit = 'kilograms';
  } else if (unit === 'grams' && useImperial) {
    displayValue = value / 28.3495;
    displayUnit = 'ounces';
  } else if (unit === 'ounces' && !useImperial) {
    displayValue = value * 28.3495;
    displayUnit = 'grams';
  }

  const formattedValue = formatNumber(displayValue, language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const unitSymbol = getUnitSymbol(displayUnit);
  return `${formattedValue}${unitSymbol}`;
}

/**
 * Format a temperature range (e.g., "-40°F to 185°F")
 */
export function formatTemperatureRange(
  minValue: number,
  maxValue: number,
  unit: TemperatureUnit,
  language: LanguageCode = 'en',
  region?: RegionCode
): string {
  const min = formatMeasurement(minValue, unit, language, region);
  const max = formatMeasurement(maxValue, unit, language, region);
  return `${min} to ${max}`;
}

/**
 * Format dimensions (e.g., "4.5\" x 2.8\" x 1.2\"" or "11.4cm x 7.1cm x 3.0cm")
 */
export function formatDimensions(
  length: number,
  width: number,
  height: number,
  unit: 'inches' | 'centimeters',
  language: LanguageCode = 'en',
  region?: RegionCode
): string {
  const l = formatMeasurement(length, unit, language, region);
  const w = formatMeasurement(width, unit, language, region);
  const h = formatMeasurement(height, unit, language, region);
  return `${l} x ${w} x ${h}`;
}

/**
 * Format weight with optional unit conversion
 */
export function formatWeight(
  value: number,
  unit: WeightUnit,
  language: LanguageCode = 'en',
  region?: RegionCode
): string {
  return formatMeasurement(value, unit, language, region);
}

/**
 * Parse and format temperature range from string (e.g., "-40 to 185")
 * Useful for converting hardcoded temperature strings
 */
export function parseAndFormatTemperatureRange(
  rangeString: string,
  sourceUnit: TemperatureUnit,
  language: LanguageCode = 'en',
  region?: RegionCode
): string {
  // Extract numbers from string like "-40°F to 185°F" or "-40 to 185"
  const matches = rangeString.match(/-?\d+\.?\d*/g);
  if (!matches || matches.length < 2) {
    return rangeString; // Return original if can't parse
  }

  const min = parseFloat(matches[0]);
  const max = parseFloat(matches[1]);

  return formatTemperatureRange(min, max, sourceUnit, language, region);
}

/**
 * Convert Celsius to Fahrenheit
 */
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Convert Fahrenheit to Celsius
 */
function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Determine if region should use imperial units
 */
function shouldUseImperial(language: LanguageCode, region?: RegionCode): boolean {
  // If region explicitly provided, use it
  if (region) {
    return region === 'us';
  }

  // Otherwise, fall back to language detection
  // Only US English uses imperial
  const locale = getLocaleFromLanguage(language);
  return language === 'en' && locale === 'en-US';
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
function getUnitSymbol(unit: MeasurementUnit): string {
  const symbols: Record<MeasurementUnit, string> = {
    // Temperature
    celsius: '°C',
    fahrenheit: '°F',
    // Length
    meters: 'm',
    feet: 'ft',
    inches: '"',
    centimeters: 'cm',
    millimeters: 'mm',
    // Weight
    kilograms: 'kg',
    pounds: 'lbs',
    grams: 'g',
    ounces: 'oz',
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
