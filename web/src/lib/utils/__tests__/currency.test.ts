import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  convertPrice,
  formatConvertedPrice,
  getCurrencySymbol,
  getCurrencyName,
  formatPriceRange,
  parsePrice,
  convertWooCommercePrice,
  convertWooCommercePriceNumeric,
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

    it('formats PLN correctly', () => {
      expect(formatPrice(100, 'PLN')).toBe('100.00zł');
      expect(formatPrice(1234.56, 'PLN')).toBe('1,234.56zł');
    });

    it('formats AED correctly', () => {
      expect(formatPrice(100, 'AED')).toBe('100.00د.إ');
      expect(formatPrice(1234.56, 'AED')).toBe('1,234.56د.إ');
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

    it('converts USD to PLN', () => {
      const result = convertPrice(100, 'PLN');
      expect(result).toBe(398); // 100 * 3.98
    });

    it('converts USD to AED', () => {
      const result = convertPrice(100, 'AED');
      expect(result).toBe(367); // 100 * 3.67
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

    it('converts and formats USD to PLN', () => {
      expect(formatConvertedPrice(100, 'PLN')).toBe('398.00zł');
    });

    it('converts and formats USD to AED', () => {
      expect(formatConvertedPrice(100, 'AED')).toBe('367.00د.إ');
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
      expect(getCurrencySymbol('PLN')).toBe('zł');
      expect(getCurrencySymbol('AED')).toBe('د.إ');
    });
  });

  describe('getCurrencyName', () => {
    it('returns correct currency names', () => {
      expect(getCurrencyName('USD')).toBe('US Dollar');
      expect(getCurrencyName('EUR')).toBe('Euro');
      expect(getCurrencyName('GBP')).toBe('British Pound');
      expect(getCurrencyName('PLN')).toBe('Polish Zloty');
      expect(getCurrencyName('AED')).toBe('UAE Dirham');
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

    it('formats PLN range', () => {
      expect(formatPriceRange(10, 100, 'PLN')).toBe('39.80zł - 398.00zł');
    });

    it('formats AED range', () => {
      expect(formatPriceRange(10, 100, 'AED')).toBe('36.70د.إ - 367.00د.إ');
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

  describe('parsePrice', () => {
    it('parses simple dollar amounts', () => {
      expect(parsePrice('$99.99')).toBe(99.99);
      expect(parsePrice('$10.00')).toBe(10);
      expect(parsePrice('$5')).toBe(5);
    });

    it('handles comma-separated values', () => {
      expect(parsePrice('$1,234.56')).toBe(1234.56);
      expect(parsePrice('$10,000')).toBe(10000);
      expect(parsePrice('$1,000,000.99')).toBe(1000000.99);
    });

    it('removes common prefixes', () => {
      expect(parsePrice('From $99.99')).toBe(99.99);
      expect(parsePrice('Starting at $15.00')).toBe(15);
      expect(parsePrice('from $50')).toBe(50);
    });

    it('extracts first number from ranges', () => {
      expect(parsePrice('$10 - $25')).toBe(10);
      expect(parsePrice('$10.00 - $25.00')).toBe(10);
      expect(parsePrice('$99.99-$199.99')).toBe(99.99);
    });

    it('returns null for invalid inputs', () => {
      expect(parsePrice(null)).toBeNull();
      expect(parsePrice(undefined)).toBeNull();
      expect(parsePrice('')).toBeNull();
      expect(parsePrice('abc')).toBeNull();
      expect(parsePrice('$')).toBeNull();
    });

    it('handles dollar sign prefix variations', () => {
      expect(parsePrice('99.99')).toBe(99.99);
      expect(parsePrice('$99.99')).toBe(99.99);
    });
  });

  describe('convertWooCommercePrice', () => {
    describe('USD preservation', () => {
      it('preserves original USD string for single prices', () => {
        expect(convertWooCommercePrice('$99.99', 'USD')).toBe('$99.99');
        expect(convertWooCommercePrice('$1,234.56', 'USD')).toBe('$1,234.56');
      });

      it('preserves original USD string for ranges', () => {
        expect(convertWooCommercePrice('$10.00 - $25.00', 'USD')).toBe('$10.00 - $25.00');
        expect(convertWooCommercePrice('$99 - $199', 'USD')).toBe('$99 - $199');
      });

      it('preserves original USD string with prefixes', () => {
        expect(convertWooCommercePrice('From $99.99', 'USD')).toBe('From $99.99');
        expect(convertWooCommercePrice('Starting at $15.00', 'USD')).toBe('Starting at $15.00');
      });

      it('defaults to USD when no currency specified', () => {
        expect(convertWooCommercePrice('$99.99')).toBe('$99.99');
      });
    });

    describe('single price conversion', () => {
      it('converts USD to EUR', () => {
        const result = convertWooCommercePrice('$99.99', 'EUR');
        expect(result).toMatch(/^\d+\.\d{2}€$/);
        expect(parseFloat(result)).toBeCloseTo(91.99, 1);
      });

      it('converts USD to GBP', () => {
        const result = convertWooCommercePrice('$99.99', 'GBP');
        expect(result).toMatch(/^£\d+\.\d{2}$/);
        expect(parseFloat(result.replace(/[£,]/g, ''))).toBeCloseTo(79.0, 1);
      });

      it('converts USD to PLN', () => {
        const result = convertWooCommercePrice('$99.99', 'PLN');
        expect(result).toMatch(/^\d+\.\d{2}zł$/);
      });

      it('converts USD to AED', () => {
        const result = convertWooCommercePrice('$99.99', 'AED');
        expect(result).toMatch(/د\.إ$/);
      });
    });

    describe('range conversion', () => {
      it('converts USD range to EUR', () => {
        const result = convertWooCommercePrice('$10.00 - $25.00', 'EUR');
        expect(result).toContain('€');
        expect(result).toContain(' - ');
        expect(result.split(' - ')).toHaveLength(2);
      });

      it('converts USD range to GBP', () => {
        const result = convertWooCommercePrice('$10 - $100', 'GBP');
        expect(result).toContain('£');
        expect(result).toContain(' - ');
      });

      it('converts USD range to PLN', () => {
        const result = convertWooCommercePrice('$10 - $100', 'PLN');
        expect(result).toContain('zł');
        expect(result).toContain(' - ');
      });

      it('converts USD range to AED', () => {
        const result = convertWooCommercePrice('$10 - $100', 'AED');
        expect(result).toContain('د.إ');
        expect(result).toContain(' - ');
      });
    });

    describe('edge cases', () => {
      it('returns empty string for null', () => {
        expect(convertWooCommercePrice(null, 'EUR')).toBe('');
      });

      it('returns empty string for undefined', () => {
        expect(convertWooCommercePrice(undefined, 'EUR')).toBe('');
      });

      it('returns original string if parsing fails', () => {
        expect(convertWooCommercePrice('Invalid', 'EUR')).toBe('Invalid');
        expect(convertWooCommercePrice('$', 'EUR')).toBe('$');
      });

      it('handles comma-separated values', () => {
        const result = convertWooCommercePrice('$1,234.56', 'EUR');
        expect(result).toMatch(/^\d+,\d{3}\.\d{2}€$/);
      });
    });

    describe('all 5 supported currencies', () => {
      const testPrice = '$100.00';

      it('handles USD', () => {
        expect(convertWooCommercePrice(testPrice, 'USD')).toBe(testPrice);
      });

      it('handles EUR', () => {
        const result = convertWooCommercePrice(testPrice, 'EUR');
        expect(result).toMatch(/€$/);
      });

      it('handles GBP', () => {
        const result = convertWooCommercePrice(testPrice, 'GBP');
        expect(result).toMatch(/^£/);
      });

      it('handles PLN', () => {
        const result = convertWooCommercePrice(testPrice, 'PLN');
        expect(result).toMatch(/zł$/);
      });

      it('handles AED', () => {
        const result = convertWooCommercePrice(testPrice, 'AED');
        expect(result).toMatch(/د\.إ$/);
      });
    });
  });

  describe('convertWooCommercePriceNumeric', () => {
    it('converts a simple USD price to a number', () => {
      expect(convertWooCommercePriceNumeric('$99.99', 'USD')).toBe(99.99);
    });

    it('returns the minimum price for a price range', () => {
      expect(convertWooCommercePriceNumeric('$50.00 - $100.00', 'USD')).toBe(50.0);
    });

    it('handles "From $X" price prefix', () => {
      expect(convertWooCommercePriceNumeric('From $15.00', 'USD')).toBe(15.0);
    });

    it('converts USD price to EUR', () => {
      // $99.99 USD × 0.92 = 91.9908
      const result = convertWooCommercePriceNumeric('$99.99', 'EUR');
      expect(result).toBeCloseTo(91.99, 1);
    });

    it('converts USD price to GBP', () => {
      // $99.99 USD × 0.79 = 78.9921
      const result = convertWooCommercePriceNumeric('$99.99', 'GBP');
      expect(result).toBeCloseTo(78.99, 1);
    });

    it('converts USD price to PLN', () => {
      // $99.99 USD × 3.98 = 397.9602
      const result = convertWooCommercePriceNumeric('$99.99', 'PLN');
      expect(result).toBeCloseTo(397.96, 1);
    });

    it('converts USD price to AED', () => {
      // $99.99 USD × 3.67 = 366.9633
      const result = convertWooCommercePriceNumeric('$99.99', 'AED');
      expect(result).toBeCloseTo(366.96, 1);
    });

    it('returns 0 for invalid input', () => {
      expect(convertWooCommercePriceNumeric('invalid price', 'USD')).toBe(0);
      expect(convertWooCommercePriceNumeric('no numbers here', 'USD')).toBe(0);
    });

    it('returns 0 for null input', () => {
      expect(convertWooCommercePriceNumeric(null, 'USD')).toBe(0);
    });

    it('returns 0 for undefined input', () => {
      expect(convertWooCommercePriceNumeric(undefined, 'USD')).toBe(0);
    });

    it('returns 0 for empty string', () => {
      expect(convertWooCommercePriceNumeric('', 'USD')).toBe(0);
    });

    it('handles prices with commas (thousands separator)', () => {
      // $1,299.00 = 1299.00 USD
      expect(convertWooCommercePriceNumeric('$1,299.00', 'USD')).toBe(1299.0);
    });

    it('uses minimum price from range for currency conversion', () => {
      // $50 - $100 USD → minimum $50 × 0.92 = $46 EUR
      const result = convertWooCommercePriceNumeric('$50.00 - $100.00', 'EUR');
      expect(result).toBeCloseTo(50 * 0.92, 2);
    });

    it('handles all 5 supported currencies without throwing', () => {
      const currencies = [
        'USD',
        'EUR',
        'GBP',
        'PLN',
        'AED',
      ] as const;
      for (const currency of currencies) {
        expect(() => convertWooCommercePriceNumeric('$99.99', currency)).not.toThrow();
        expect(convertWooCommercePriceNumeric('$99.99', currency)).toBeGreaterThan(0);
      }
    });
  });
});
