import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatMeasurement,
  formatTemperatureRange,
  formatDimensions,
  formatWeight,
  parseAndFormatTemperatureRange,
  getLanguageName,
} from '../locale';

describe('Locale Utilities', () => {
  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T10:30:00Z');

    it('formats date with English locale', () => {
      const result = formatDate(testDate, 'en');
      expect(result).toMatch(/01\/15\/2024/); // US format
    });

    it('formats date with German locale', () => {
      const result = formatDate(testDate, 'de');
      expect(result).toMatch(/15\.01\.2024/); // DE format
    });

    it('formats date with French locale', () => {
      const result = formatDate(testDate, 'fr');
      expect(result).toMatch(/15\/01\/2024/); // FR format
    });

    it('accepts date string', () => {
      const result = formatDate('2024-01-15', 'en');
      // Date string without timezone may vary based on local timezone
      expect(result).toMatch(/\/2024/);
    });

    it('accepts timestamp number', () => {
      const result = formatDate(testDate.getTime(), 'en');
      expect(result).toMatch(/01\/15\/2024/);
    });

    it('applies custom options', () => {
      const result = formatDate(testDate, 'en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('formatTime', () => {
    const testDate = new Date('2024-01-15T14:30:00Z');

    it('formats time with English locale (12h)', () => {
      const result = formatTime(testDate, 'en');
      // Depending on timezone, could be different hours
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('formats time with German locale (24h)', () => {
      const result = formatTime(testDate, 'de');
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('accepts custom options', () => {
      const result = formatTime(testDate, 'en', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('formatDateTime', () => {
    const testDate = new Date('2024-01-15T14:30:00Z');

    it('formats date and time together', () => {
      const result = formatDateTime(testDate, 'en');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}\s+\d{1,2}:\d{2}/);
    });

    it('applies custom date and time options', () => {
      const result = formatDateTime(
        testDate,
        'en',
        { month: 'long', day: 'numeric', year: 'numeric' },
        { hour: '2-digit', minute: '2-digit' }
      );
      expect(result).toContain('January');
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('formatNumber', () => {
    it('formats number with English locale', () => {
      expect(formatNumber(1234567.89, 'en')).toBe('1,234,567.89');
    });

    it('formats number with German locale', () => {
      const result = formatNumber(1234567.89, 'de');
      // German uses . for thousands and , for decimal
      expect(result).toMatch(/1\.234\.567,89/);
    });

    it('formats number with French locale', () => {
      const result = formatNumber(1234567.89, 'fr');
      // French uses space for thousands and , for decimal
      expect(result).toMatch(/1\s234\s567,89/);
    });

    it('handles small numbers', () => {
      expect(formatNumber(0.99, 'en')).toBe('0.99');
    });

    it('handles zero', () => {
      expect(formatNumber(0, 'en')).toBe('0');
    });

    it('handles negative numbers', () => {
      expect(formatNumber(-1234.56, 'en')).toBe('-1,234.56');
    });

    it('applies custom options for decimals', () => {
      const result = formatNumber(123.456, 'en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(result).toBe('123.46'); // Rounded to 2 decimals
    });
  });

  describe('formatMeasurement', () => {
    describe('Temperature conversion', () => {
      it('keeps Celsius for non-US locales', () => {
        const result = formatMeasurement(20, 'celsius', 'de');
        expect(result).toBe('20,0°C'); // German uses comma for decimal
      });

      it('converts Celsius to Fahrenheit for US locale', () => {
        const result = formatMeasurement(20, 'celsius', 'en');
        expect(result).toBe('68.0°F'); // 20°C = 68°F
      });

      it('keeps Fahrenheit for US locale', () => {
        const result = formatMeasurement(68, 'fahrenheit', 'en');
        expect(result).toBe('68.0°F');
      });

      it('converts Fahrenheit to Celsius for non-US locales', () => {
        const result = formatMeasurement(68, 'fahrenheit','de');
        expect(result).toBe('20,0°C'); // 68°F = 20°C, German uses comma
      });

      it('handles freezing point', () => {
        const result = formatMeasurement(0, 'celsius', 'en');
        expect(result).toBe('32.0°F');
      });

      it('handles boiling point', () => {
        const result = formatMeasurement(100, 'celsius', 'en');
        expect(result).toBe('212.0°F');
      });
    });

    describe('Distance conversion', () => {
      it('keeps meters for non-US locales', () => {
        const result = formatMeasurement(100, 'meters', 'de');
        expect(result).toBe('100,0m'); // German uses comma for decimal
      });

      it('converts meters to feet for US locale', () => {
        const result = formatMeasurement(10, 'meters', 'en');
        expect(result).toBe('32.8ft'); // 10m ≈ 32.8ft
      });

      it('keeps feet for US locale', () => {
        const result = formatMeasurement(100, 'feet', 'en');
        expect(result).toBe('100.0ft');
      });

      it('converts feet to meters for non-US locales', () => {
        const result = formatMeasurement(32.8, 'feet', 'de');
        expect(result).toBe('10,0m'); // 32.8ft ≈ 10m, German uses comma
      });

      it('converts inches to centimeters for non-US locales', () => {
        const result = formatMeasurement(10, 'inches', 'de');
        expect(result).toBe('25,4cm'); // 10" = 25.4cm
      });

      it('keeps inches for US locale', () => {
        const result = formatMeasurement(10, 'inches', 'en');
        expect(result).toBe('10.0"');
      });

      it('converts centimeters to inches for US locale', () => {
        const result = formatMeasurement(25.4, 'centimeters', 'en');
        expect(result).toBe('10.0"'); // 25.4cm = 10"
      });

      it('keeps centimeters for non-US locales', () => {
        const result = formatMeasurement(25, 'centimeters', 'de');
        expect(result).toBe('25,0cm');
      });
    });

    describe('Weight conversion', () => {
      it('converts kilograms to pounds for US locale', () => {
        const result = formatMeasurement(5, 'kilograms', 'en');
        expect(result).toBe('11.0lbs'); // 5kg ≈ 11lbs
      });

      it('keeps kilograms for non-US locales', () => {
        const result = formatMeasurement(5, 'kilograms', 'de');
        expect(result).toBe('5,0kg');
      });

      it('keeps pounds for US locale', () => {
        const result = formatMeasurement(10, 'pounds', 'en');
        expect(result).toBe('10.0lbs');
      });

      it('converts pounds to kilograms for non-US locales', () => {
        const result = formatMeasurement(11, 'pounds', 'de');
        expect(result).toBe('5,0kg'); // 11lbs ≈ 5kg
      });
    });

    describe('Region-aware conversions', () => {
      it('uses imperial for US region explicitly', () => {
        const result = formatMeasurement(20, 'celsius', 'fr', 'us');
        expect(result).toBe('68,0°F'); // French formatting, US units
      });

      it('uses metric for EU region explicitly', () => {
        const result = formatMeasurement(68, 'fahrenheit', 'en', 'eu');
        expect(result).toBe('20.0°C'); // English formatting, EU units
      });

      it('uses metric for Asia region', () => {
        const result = formatMeasurement(68, 'fahrenheit', 'ja', 'asia');
        expect(result).toBe('20.0°C'); // Japanese formatting, metric units
      });

      it('uses metric for MENA region', () => {
        const result = formatMeasurement(68, 'fahrenheit', 'ar', 'mena');
        expect(result).toBe('20.0°C'); // Arabic locale with Western numerals (standard for technical specs)
      });
    });
  });

  describe('formatTemperatureRange', () => {
    it('formats temperature range for US locale', () => {
      const result = formatTemperatureRange(-40, 185, 'fahrenheit', 'en');
      expect(result).toBe('-40.0°F to 185.0°F');
    });

    it('converts and formats range for non-US locale', () => {
      const result = formatTemperatureRange(-40, 85, 'celsius', 'en');
      expect(result).toBe('-40.0°F to 185.0°F'); // Converts to Fahrenheit for US
    });

    it('keeps Celsius for EU locale', () => {
      const result = formatTemperatureRange(-40, 85, 'celsius', 'de');
      expect(result).toBe('-40,0°C to 85,0°C'); // German formatting
    });
  });

  describe('formatDimensions', () => {
    it('formats dimensions in inches for US locale', () => {
      const result = formatDimensions(4.5, 2.8, 1.2, 'inches', 'en');
      expect(result).toBe('4.5" x 2.8" x 1.2"');
    });

    it('converts inches to centimeters for EU locale', () => {
      const result = formatDimensions(4.5, 2.8, 1.2, 'inches', 'de');
      expect(result).toBe('11,4cm x 7,1cm x 3,0cm');
    });

    it('keeps centimeters for EU locale', () => {
      const result = formatDimensions(11.4, 7.1, 3.0, 'centimeters', 'de');
      expect(result).toBe('11,4cm x 7,1cm x 3,0cm');
    });

    it('converts centimeters to inches for US locale', () => {
      const result = formatDimensions(11.4, 7.1, 3.0, 'centimeters', 'en');
      expect(result).toBe('4.5" x 2.8" x 1.2"');
    });
  });

  describe('formatWeight', () => {
    it('formats weight in pounds for US locale', () => {
      const result = formatWeight(0.5, 'pounds', 'en');
      expect(result).toBe('0.5lbs');
    });

    it('converts pounds to kilograms for EU locale', () => {
      const result = formatWeight(2.2, 'pounds', 'de');
      expect(result).toBe('1,0kg'); // 2.2lbs ≈ 1kg
    });

    it('keeps kilograms for EU locale', () => {
      const result = formatWeight(1.5, 'kilograms', 'fr');
      expect(result).toBe('1,5kg'); // French uses comma
    });
  });

  describe('parseAndFormatTemperatureRange', () => {
    it('parses simple range string', () => {
      const result = parseAndFormatTemperatureRange('-40 to 185', 'fahrenheit', 'en');
      expect(result).toBe('-40.0°F to 185.0°F');
    });

    it('parses range with units in string', () => {
      const result = parseAndFormatTemperatureRange('-40°F to 185°F', 'fahrenheit', 'en');
      expect(result).toBe('-40.0°F to 185.0°F');
    });

    it('converts parsed range to different units', () => {
      const result = parseAndFormatTemperatureRange('-40 to 185', 'fahrenheit', 'de');
      expect(result).toBe('-40,0°C to 85,0°C');
    });

    it('returns original string if cannot parse', () => {
      const result = parseAndFormatTemperatureRange('invalid range', 'fahrenheit', 'en');
      expect(result).toBe('invalid range');
    });

    it('handles decimal values', () => {
      const result = parseAndFormatTemperatureRange('-40.5 to 185.7', 'fahrenheit', 'en');
      expect(result).toBe('-40.5°F to 185.7°F');
    });
  });

  describe('getLanguageName', () => {
    it('returns native name by default', () => {
      expect(getLanguageName('en')).toBe('English');
      expect(getLanguageName('de')).toBe('Deutsch');
      expect(getLanguageName('fr')).toBe('Français');
      expect(getLanguageName('es')).toBe('Español');
      expect(getLanguageName('ja')).toBe('日本語');
      expect(getLanguageName('zh')).toBe('中文');
      expect(getLanguageName('ar')).toBe('العربية');
    });

    it('returns English name when native is false', () => {
      expect(getLanguageName('en', false)).toBe('English');
      expect(getLanguageName('de', false)).toBe('German');
      expect(getLanguageName('fr', false)).toBe('French');
      expect(getLanguageName('es', false)).toBe('Spanish');
      expect(getLanguageName('ja', false)).toBe('Japanese');
      expect(getLanguageName('zh', false)).toBe('Chinese');
      expect(getLanguageName('ar', false)).toBe('Arabic');
    });
  });
});
