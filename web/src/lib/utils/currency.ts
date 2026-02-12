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
