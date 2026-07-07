import type { CurrencyCode } from '@/types/region';
import { CURRENCIES } from '@/types/region';
// Imported from fallbackRates.ts (not exchangeRates.ts) intentionally:
// fallbackRates.ts has no next/* imports and is safe for client components.
// Server-side code should use getLiveExchangeRates() from ./exchangeRates instead.
import { FALLBACK_RATES, FALLBACK_RATES_LAST_UPDATED } from './fallbackRates';

/**
 * Exchange rates relative to USD (base currency).
 *
 * These static rates are used in client-side utilities (e.g. cart display).
 * For server-rendered price conversions, use `getLiveExchangeRates()` from
 * `./exchangeRates` (server-only) which fetches from the ECB daily feed.
 */
const EXCHANGE_RATES: Record<CurrencyCode, number> = FALLBACK_RATES;

// Re-export so callers can display when rates were last confirmed.
export { FALLBACK_RATES_LAST_UPDATED as RATES_LAST_UPDATED };

/**
 * Format a price in the specified currency
 */
export function formatPrice(
  amount: number,
  currency: CurrencyCode = 'USD',
  options: {
    showCode?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const config = CURRENCIES[currency];
  const {
    showCode = false,
    minimumFractionDigits = config.decimals,
    maximumFractionDigits = config.decimals,
  } = options;

  const formattedNumber = amount.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const priceWithSymbol =
    config.position === 'before'
      ? `${config.symbol}${formattedNumber}`
      : `${formattedNumber}${config.symbol}`;

  return showCode ? `${priceWithSymbol} ${currency}` : priceWithSymbol;
}

/**
 * Convert price from USD to target currency
 */
export function convertPrice(amountInUSD: number, targetCurrency: CurrencyCode): number {
  const rate = EXCHANGE_RATES[targetCurrency];
  return amountInUSD * rate;
}

/**
 * Format and convert price from USD to target currency
 */
export function formatConvertedPrice(
  amountInUSD: number,
  targetCurrency: CurrencyCode = 'USD',
  options?: Parameters<typeof formatPrice>[2]
): string {
  const convertedAmount = convertPrice(amountInUSD, targetCurrency);
  return formatPrice(convertedAmount, targetCurrency, options);
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCIES[currency].symbol;
}

/**
 * Get currency name
 */
export function getCurrencyName(currency: CurrencyCode): string {
  return CURRENCIES[currency].name;
}

/**
 * Format price range
 */
export function formatPriceRange(
  minUSD: number,
  maxUSD: number,
  targetCurrency: CurrencyCode = 'USD'
): string {
  const minFormatted = formatConvertedPrice(minUSD, targetCurrency);
  const maxFormatted = formatConvertedPrice(maxUSD, targetCurrency);
  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Parse USD price from WooCommerce formatted string
 * Handles formats like "$19.99", "$10.00 - $25.00", "From $15.00"
 * Returns the numeric USD value or null if invalid
 */
export function parsePrice(priceString: string | null | undefined): number | null {
  if (!priceString || typeof priceString !== 'string') {
    return null;
  }

  // Remove common prefixes like "From ", "Starting at ", etc.
  const cleanString = priceString.replace(/^(from|starting at)\s*/i, '').trim();

  // Extract first dollar amount (handles ranges by taking minimum)
  const match = cleanString.match(/\$?([\d,]+\.?\d*)/);

  if (!match) {
    return null;
  }

  // Remove commas and parse as float
  const numericValue = parseFloat(match[1].replace(/,/g, ''));

  return isNaN(numericValue) ? null : numericValue;
}

/**
 * Parse a WooCommerce price string into a min/max USD range.
 * Handles formats like:
 *   "$19.99"
 *   "$10.00 - $25.00"
 *   "From $15.00"
 * Returns null if no numeric values can be parsed.
 */
function parsePriceRange(
  priceString: string | null | undefined
): { min: number; max: number } | null {
  if (!priceString || typeof priceString !== 'string') {
    return null;
  }

  // Reuse the same cleaning logic as parsePrice
  const cleanString = priceString.replace(/^(from|starting at)\s*/i, '').trim();

  // Extract all dollar amounts (supports single values and ranges)
  const matches = Array.from(cleanString.matchAll(/\$?([\d,]+\.?\d*)/g));

  if (matches.length === 0) {
    return null;
  }

  const parseAmount = (value: string): number | null => {
    const numeric = parseFloat(value.replace(/,/g, ''));
    return Number.isNaN(numeric) ? null : numeric;
  };

  const first = parseAmount(matches[0][1]);
  if (first === null) {
    return null;
  }

  const secondMatch = matches[1]?.[1];
  const second = secondMatch != null ? parseAmount(secondMatch) : null;

  const min = first;
  const max = second ?? first;

  return { min, max };
}

/**
 * Convert WooCommerce price string to target currency
 * One-step function: parses USD string and converts to target currency
 *
 * @example
 * convertWooCommercePrice("$99.99", "EUR") // "91.99€"
 * convertWooCommercePrice("$50 - $100", "GBP") // "£39.50 - £79.00"
 */
export function convertWooCommercePrice(
  priceString: string | null | undefined,
  targetCurrency: CurrencyCode = 'USD'
): string {
  // If we can't parse or have no string, fall back to original behavior
  if (!priceString || typeof priceString !== 'string') {
    return priceString || '';
  }

  // For USD, preserve the original WooCommerce-formatted string
  if (targetCurrency === 'USD') {
    return priceString;
  }

  const range = parsePriceRange(priceString);

  if (!range) {
    // If parsing fails, return the original string unchanged
    return priceString;
  }

  const { min, max } = range;

  // Single price
  if (min === max) {
    return formatConvertedPrice(min, targetCurrency);
  }

  // Price range
  return formatPriceRange(min, max, targetCurrency);
}

/**
 * Convert WooCommerce price string to numeric value in target currency
 * Returns the numeric value for calculations (avoids fragile string parsing)
 *
 * @example
 * convertWooCommercePriceNumeric("$99.99", "EUR") // 91.99
 * convertWooCommercePriceNumeric("$50 - $100", "GBP") // 39.50 (returns min)
 * convertWooCommercePriceNumeric("invalid", "USD") // 0
 */
export function convertWooCommercePriceNumeric(
  priceString: string | null | undefined,
  targetCurrency: CurrencyCode = 'USD'
): number {
  // Parse the USD price(s) from the string
  const range = parsePriceRange(priceString);

  if (!range) {
    // If parsing fails, return 0 as safe fallback
    return 0;
  }

  // Always use minimum price for cart calculations (simplest for ranges)
  const usdPrice = range.min;

  // Convert to target currency
  return convertPrice(usdPrice, targetCurrency);
}
