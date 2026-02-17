import type { CurrencyCode } from '@/types/region';
import { CURRENCIES } from '@/types/region';

/**
 * Fallback exchange rates (used if API fails)
 * Updated: February 17, 2026
 */
const FALLBACK_RATES: Record<CurrencyCode, number> = {
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
 * Current exchange rates (loaded from API or fallback)
 */
let EXCHANGE_RATES: Record<CurrencyCode, number> = { ...FALLBACK_RATES };
let ratesLastUpdated: number | null = null;

/**
 * Fetch live exchange rates from API
 * Called automatically when rates are older than 24 hours
 */
async function fetchExchangeRates(): Promise<void> {
  try {
    const response = await fetch('/api/exchange-rates');
    
    if (!response.ok) {
      console.warn('Exchange rate API returned non-OK status, using fallback rates');
      return;
    }

    const data = await response.json();
    
    if (data.rates) {
      EXCHANGE_RATES = data.rates;
      ratesLastUpdated = Date.now();
      console.log('Exchange rates updated successfully', {
        source: data.source,
        cached: data.cached,
        timestamp: new Date(data.timestamp).toISOString(),
      });
    }
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using fallback values:', error);
  }
}

/**
 * Get current exchange rates (fetches if needed)
 * Rates are cached for 24 hours
 */
async function getExchangeRates(): Promise<Record<CurrencyCode, number>> {
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  
  // Fetch if never loaded or cache expired
  if (!ratesLastUpdated || Date.now() - ratesLastUpdated > CACHE_DURATION) {
    await fetchExchangeRates();
  }
  
  return EXCHANGE_RATES;
}

/**
 * Initialize exchange rates (call on app startup)
 * This is non-blocking and will use fallback rates if API fails
 */
export function initializeExchangeRates(): void {
  fetchExchangeRates().catch((error) => {
    console.warn('Initial exchange rate fetch failed:', error);
  });
}

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
 * Uses live exchange rates (with fallback if API unavailable)
 */
export function convertPrice(amountInUSD: number, targetCurrency: CurrencyCode): number {
  const rate = EXCHANGE_RATES[targetCurrency] || FALLBACK_RATES[targetCurrency] || 1.0;
  return amountInUSD * rate;
}

/**
 * Format and convert price from USD to target currency
 * Uses live exchange rates (with fallback if API unavailable)
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
 * Parse price string from WooCommerce to extract USD amount
 * Handles formats like "$19.99", "$10.00 - $25.00", "From $15.00"
 * 
 * @param priceString - Formatted price string from WooCommerce
 * @returns USD amount as number, or null if parsing fails
 * 
 * @example
 * parsePrice("$19.99") // 19.99
 * parsePrice("$10.00 - $25.00") // 10.00 (returns minimum price)
 * parsePrice("From $15.00") // 15.00
 */
export function parsePrice(priceString: string | null | undefined): number | null {
  if (!priceString) return null;

  // Remove common prefix words
  let cleaned = priceString.replace(/^(From|Starting at|Up to)\s+/i, '').trim();

  // Extract first number (for ranges, use minimum price)
  const match = cleaned.match(/[\d,]+\.?\d*/);
  if (!match) return null;

  // Remove commas and parse
  const numberStr = match[0].replace(/,/g, '');
  const amount = parseFloat(numberStr);

  return isNaN(amount) ? null : amount;
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
 * Convert WooCommerce price string to target currency
 * Parses USD amount from formatted string and converts to target currency
 * 
 * @param priceString - Formatted price from WooCommerce (e.g., "$19.99")
 * @param targetCurrency - Target currency code
 * @returns Formatted price in target currency, or null if parsing fails
 * 
 * @example
 * convertWooCommercePrice("$19.99", "EUR") // "18.39€"
 * convertWooCommercePrice("$10.00 - $25.00", "JPY") // "¥1,495"
 */
export function convertWooCommercePrice(
  priceString: string | null | undefined,
  targetCurrency: CurrencyCode
): string | null {
  const usdAmount = parsePrice(priceString);
  if (usdAmount === null) return null;

  return formatConvertedPrice(usdAmount, targetCurrency);
}
