import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  convertPrice,
  formatConvertedPrice,
  getCurrencySymbol,
  getCurrencyName,
  formatPriceRange,
} from '../currency';

describe('Currency Utilities', () => {
  describe('formatPrice', () => {
    it('formats USD correctly', () => {
      expect(formatPrice(100, 'USD')).toBe('$100.00');
      expect(formatPrice(1234.56, 'USD')).toBe('$1,234.56');
      expect(formatPrice(0.99, 'USD')).toBe('$0.99');
    });

    it('formats EUR correctly', () => {
      expect(formatPrice(100, 'EUR')).toBe('100.00€');
      expect(formatPrice(1234.56, 'EUR')).toBe('1,234.56€');
    });

    it('formats GBP correctly', () => {
      expect(formatPrice(100, 'GBP')).toBe('£100.00');
      expect(formatPrice(1234.56, 'GBP')).toBe('£1,234.56');
    });

    it('formats JPY correctly (no decimals)', () => {
      expect(formatPrice(100, 'JPY')).toBe('¥100');
      expect(formatPrice(1234, 'JPY')).toBe('¥1,234');
    });

    it('formats CAD correctly', () => {
      expect(formatPrice(100, 'CAD')).toBe('C$100.00');
      expect(formatPrice(1234.56, 'CAD')).toBe('C$1,234.56');
    });

    it('formats MXN correctly', () => {
      expect(formatPrice(100, 'MXN')).toBe('$100.00');
      expect(formatPrice(1234.56, 'MXN')).toBe('$1,234.56');
    });

    it('formats with currency code when showCode is true', () => {
      expect(formatPrice(100, 'USD', { showCode: true })).toBe('$100.00 USD');
      expect(formatPrice(100, 'EUR', { showCode: true })).toBe('100.00€ EUR');
    });

    it('respects custom decimal places', () => {
      expect(
        formatPrice(100.12345, 'USD', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      ).toBe('$100');
      expect(
        formatPrice(100.12345, 'USD', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
      ).toBe('$100.123');
    });

    it('handles zero correctly', () => {
      expect(formatPrice(0, 'USD')).toBe('$0.00');
      expect(formatPrice(0, 'EUR')).toBe('0.00€');
    });

    it('handles large numbers', () => {
      expect(formatPrice(1000000, 'USD')).toBe('$1,000,000.00');
      expect(formatPrice(123456789.99, 'USD')).toBe('$123,456,789.99');
    });
  });

  describe('convertPrice', () => {
    it('converts USD to USD (no change)', () => {
      expect(convertPrice(100, 'USD')).toBe(100);
    });

    it('converts USD to EUR', () => {
      const result = convertPrice(100, 'EUR');
      expect(result).toBe(92); // 100 * 0.92
    });

    it('converts USD to GBP', () => {
      const result = convertPrice(100, 'GBP');
      expect(result).toBe(79); // 100 * 0.79
    });

    it('converts USD to JPY', () => {
      const result = convertPrice(100, 'JPY');
      expect(result).toBe(14950); // 100 * 149.5
    });

    it('converts USD to CNY', () => {
      const result = convertPrice(100, 'CNY');
      expect(result).toBe(724); // 100 * 7.24
    });

    it('converts USD to SGD', () => {
      const result = convertPrice(100, 'SGD');
      expect(result).toBe(134); // 100 * 1.34
    });

    it('converts USD to AED', () => {
      const result = convertPrice(100, 'AED');
      expect(result).toBe(367); // 100 * 3.67
    });

    it('converts USD to CAD', () => {
      const result = convertPrice(100, 'CAD');
      expect(result).toBe(136); // 100 * 1.36
    });

    it('converts USD to MXN', () => {
      const result = convertPrice(100, 'MXN');
      expect(result).toBe(1750); // 100 * 17.5
    });

    it('handles zero', () => {
      expect(convertPrice(0, 'EUR')).toBe(0);
    });

    it('handles decimals', () => {
      const result = convertPrice(10.5, 'EUR');
      expect(result).toBeCloseTo(9.66, 2); // 10.5 * 0.92
    });
  });

  describe('formatConvertedPrice', () => {
    it('converts and formats USD to EUR', () => {
      expect(formatConvertedPrice(100, 'EUR')).toBe('92.00€');
    });

    it('converts and formats USD to GBP', () => {
      expect(formatConvertedPrice(100, 'GBP')).toBe('£79.00');
    });

    it('converts and formats USD to JPY', () => {
      expect(formatConvertedPrice(100, 'JPY')).toBe('¥14,950');
    });

    it('converts and formats USD to CAD', () => {
      expect(formatConvertedPrice(100, 'CAD')).toBe('C$136.00');
    });

    it('converts and formats USD to MXN', () => {
      expect(formatConvertedPrice(100, 'MXN')).toBe('$1,750.00');
    });

    it('handles USD default (no conversion)', () => {
      expect(formatConvertedPrice(100)).toBe('$100.00');
      expect(formatConvertedPrice(100, 'USD')).toBe('$100.00');
    });

    it('applies custom formatting options', () => {
      expect(formatConvertedPrice(100, 'EUR', { showCode: true })).toBe('92.00€ EUR');
    });

    it('handles decimals correctly', () => {
      expect(formatConvertedPrice(99.99, 'EUR')).toBe('91.99€');
    });
  });

  describe('getCurrencySymbol', () => {
    it('returns correct symbols', () => {
      expect(getCurrencySymbol('USD')).toBe('$');
      expect(getCurrencySymbol('EUR')).toBe('€');
      expect(getCurrencySymbol('GBP')).toBe('£');
      expect(getCurrencySymbol('JPY')).toBe('¥');
      expect(getCurrencySymbol('CNY')).toBe('¥');
      expect(getCurrencySymbol('SGD')).toBe('S$');
      expect(getCurrencySymbol('AED')).toBe('د.إ');
      expect(getCurrencySymbol('CAD')).toBe('C$');
      expect(getCurrencySymbol('MXN')).toBe('$');
    });
  });

  describe('getCurrencyName', () => {
    it('returns correct currency names', () => {
      expect(getCurrencyName('USD')).toBe('US Dollar');
      expect(getCurrencyName('EUR')).toBe('Euro');
      expect(getCurrencyName('GBP')).toBe('British Pound');
      expect(getCurrencyName('JPY')).toBe('Japanese Yen');
      expect(getCurrencyName('CNY')).toBe('Chinese Yuan');
      expect(getCurrencyName('SGD')).toBe('Singapore Dollar');
      expect(getCurrencyName('AED')).toBe('UAE Dirham');
      expect(getCurrencyName('CAD')).toBe('Canadian Dollar');
      expect(getCurrencyName('MXN')).toBe('Mexican Peso');
    });
  });

  describe('formatPriceRange', () => {
    it('formats USD range', () => {
      expect(formatPriceRange(10, 100, 'USD')).toBe('$10.00 - $100.00');
    });

    it('formats EUR range', () => {
      expect(formatPriceRange(10, 100, 'EUR')).toBe('9.20€ - 92.00€');
    });

    it('formats GBP range', () => {
      expect(formatPriceRange(10, 100, 'GBP')).toBe('£7.90 - £79.00');
    });

    it('formats JPY range', () => {
      expect(formatPriceRange(10, 100, 'JPY')).toBe('¥1,495 - ¥14,950');
    });

    it('formats CAD range', () => {
      expect(formatPriceRange(10, 100, 'CAD')).toBe('C$13.60 - C$136.00');
    });

    it('formats MXN range', () => {
      expect(formatPriceRange(10, 100, 'MXN')).toBe('$175.00 - $1,750.00');
    });

    it('handles same min and max', () => {
      expect(formatPriceRange(50, 50, 'USD')).toBe('$50.00 - $50.00');
    });

    it('handles decimals', () => {
      expect(formatPriceRange(9.99, 99.99, 'USD')).toBe('$9.99 - $99.99');
    });

    it('defaults to USD when currency not specified', () => {
      expect(formatPriceRange(10, 100)).toBe('$10.00 - $100.00');
    });
  });
});
