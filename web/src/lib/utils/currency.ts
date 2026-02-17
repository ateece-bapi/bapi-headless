import type { CurrencyCode } from '@/types/region';
import { CURRENCIES } from '@/types/region';

/**
 * Exchange rates relative to USD (base currency)
 * In production, these should come from an API (e.g., exchangerate-api.com)
 */
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  SGD: 1.34,
  AED: 3.67,
  VND: 25320, // Vietnamese Dong (1 USD ≈ 25,320 VND)
};

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
 * Convert WooCommerce price string to target currency
 * One-step function: parses USD string and converts to target currency
 * 
 * @example
 * convertWooCommercePrice("$99.99", "EUR") // "€91.99"
 * convertWooCommercePrice("$50 - $100", "GBP") // "£39.50" (uses minimum)
 */
export function convertWooCommercePrice(
  priceString: string | null | undefined,
  targetCurrency: CurrencyCode = 'USD'
): string {
  const usdAmount = parsePrice(priceString);
  
  if (usdAmount === null) {
    return priceString || '';
  }

  // If already USD, just return formatted version
  if (targetCurrency === 'USD') {
    return formatPrice(usdAmount, 'USD');
  }

  // Convert and format
  return formatConvertedPrice(usdAmount, targetCurrency);
}
