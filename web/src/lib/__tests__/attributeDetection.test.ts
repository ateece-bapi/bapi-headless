/**
 * attributeDetection.ts tests
 *
 * Pure attribute UI-type detection — no mocking needed.
 *
 * Covers:
 * - detectAttributeType: color -> swatch, binary yes/no -> toggle,
 *   binary with/without -> toggle, 2-4 short options -> radio,
 *   5+ options -> dropdown, 2 non-binary options -> radio
 * - isPositiveOption: yes/display/included/with .../included ... -> true; others -> false
 * - getColorHex: named colors -> correct hex, case/trim insensitive,
 *   partial match, unknown -> default gray
 */

import { describe, it, expect } from 'vitest';
import { detectAttributeType, isPositiveOption, getColorHex } from '../attributeDetection';
import type { ProductAttribute } from '@/types/variations';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function attr(name: string, options: string[], label = name): ProductAttribute {
  return { id: '1', name, label, options, variation: true };
}

// ─── detectAttributeType ──────────────────────────────────────────────────────

describe('detectAttributeType', () => {
  describe('color-swatch', () => {
    it('returns color-swatch for attribute with "color" in name', () => {
      expect(detectAttributeType(attr('Housing Color', ['White', 'Black']))).toBe('color-swatch');
    });

    it('returns color-swatch for attribute with "color" in label', () => {
      expect(detectAttributeType(attr('pa_color', ['Red', 'Blue'], 'Select Color'))).toBe('color-swatch');
    });

    it('is case-insensitive for color detection', () => {
      expect(detectAttributeType(attr('HOUSING COLOR', ['White']))).toBe('color-swatch');
    });
  });

  describe('binary-toggle', () => {
    it('returns binary-toggle for Yes/No pair', () => {
      expect(detectAttributeType(attr('Display', ['Yes', 'No']))).toBe('binary-toggle');
    });

    it('returns binary-toggle for Display/No Display pair', () => {
      expect(detectAttributeType(attr('LCD', ['Display', 'No Display']))).toBe('binary-toggle');
    });

    it('returns binary-toggle for Included/Not Included pair', () => {
      expect(detectAttributeType(attr('Accessory', ['Included', 'Not Included']))).toBe('binary-toggle');
    });

    it('returns binary-toggle when one option starts with "with "', () => {
      expect(detectAttributeType(attr('Option', ['With Keypad', 'Standard']))).toBe('binary-toggle');
    });

    it('returns binary-toggle when one option starts with "without "', () => {
      expect(detectAttributeType(attr('Option', ['Without LCD', 'Basic']))).toBe('binary-toggle');
    });

    it('is case-insensitive for binary detection', () => {
      expect(detectAttributeType(attr('Display', ['YES', 'NO']))).toBe('binary-toggle');
    });
  });

  describe('radio-group', () => {
    it('returns radio-group for 2 non-binary short options', () => {
      expect(detectAttributeType(attr('Range', ['0-10V', '4-20mA']))).toBe('radio-group');
    });

    it('returns radio-group for 3 short options', () => {
      expect(detectAttributeType(attr('Type', ['A', 'B', 'C']))).toBe('radio-group');
    });

    it('returns radio-group for 4 short options', () => {
      expect(detectAttributeType(attr('Size', ['XS', 'S', 'M', 'L']))).toBe('radio-group');
    });
  });

  describe('dropdown', () => {
    it('returns dropdown for 5 or more options', () => {
      const options = ['A', 'B', 'C', 'D', 'E'];
      expect(detectAttributeType(attr('Model', options))).toBe('dropdown');
    });

    it('returns dropdown for 0 options', () => {
      expect(detectAttributeType(attr('Empty', []))).toBe('dropdown');
    });

    it('returns dropdown for long option text even with ≤4 options', () => {
      const longOptions = [
        'This is a very long option name exceeding fifty characters total here',
        'Another long option name that also exceeds fifty chars exactly',
      ];
      expect(detectAttributeType(attr('Long', longOptions))).toBe('dropdown');
    });
  });
});

// ─── isPositiveOption ─────────────────────────────────────────────────────────

describe('isPositiveOption', () => {
  it('returns true for "yes"', () => expect(isPositiveOption('yes')).toBe(true));
  it('returns true for "Yes" (case-insensitive)', () => expect(isPositiveOption('Yes')).toBe(true));
  it('returns true for "YES"', () => expect(isPositiveOption('YES')).toBe(true));
  it('returns true for "display"', () => expect(isPositiveOption('display')).toBe(true));
  it('returns true for "Display"', () => expect(isPositiveOption('Display')).toBe(true));
  it('returns true for "included"', () => expect(isPositiveOption('included')).toBe(true));
  it('returns true for "with keypad"', () => expect(isPositiveOption('with keypad')).toBe(true));
  it('returns true for "included accessory"', () => expect(isPositiveOption('included accessory')).toBe(true));

  it('returns false for "no"', () => expect(isPositiveOption('no')).toBe(false));
  it('returns false for "No Display"', () => expect(isPositiveOption('No Display')).toBe(false));
  it('returns false for "Not Included"', () => expect(isPositiveOption('Not Included')).toBe(false));
  it('returns false for "without lcd"', () => expect(isPositiveOption('without lcd')).toBe(false));
  it('returns false for "standard"', () => expect(isPositiveOption('standard')).toBe(false));
  it('returns false for empty string', () => expect(isPositiveOption('')).toBe(false));
});

// ─── getColorHex ──────────────────────────────────────────────────────────────

describe('getColorHex', () => {
  describe('direct color name matches', () => {
    it('returns correct hex for white', () => expect(getColorHex('white')).toBe('#FFFFFF'));
    it('returns correct hex for black', () => expect(getColorHex('black')).toBe('#000000'));
    it('returns correct hex for gray', () => expect(getColorHex('gray')).toBe('#808080'));
    it('returns correct hex for grey (alternate spelling)', () => expect(getColorHex('grey')).toBe('#808080'));
    it('returns BAPI blue', () => expect(getColorHex('blue')).toBe('#166fb9'));
    it('returns BAPI yellow', () => expect(getColorHex('yellow')).toBe('#FFC843'));
    it('returns correct hex for bright white', () => expect(getColorHex('bright white')).toBe('#FFFFFF'));
    it('returns correct hex for off white', () => expect(getColorHex('off white')).toBe('#F5F5DC'));
  });

  describe('case insensitivity and trimming', () => {
    it('is case-insensitive', () => {
      expect(getColorHex('White')).toBe('#FFFFFF');
      expect(getColorHex('BLACK')).toBe('#000000');
      expect(getColorHex('Blue')).toBe('#166fb9');
    });

    it('trims leading/trailing whitespace', () => {
      expect(getColorHex(' white ')).toBe('#FFFFFF');
    });
  });

  describe('partial match', () => {
    it('matches color name when it appears anywhere in the input', () => {
      // "bright white" contains "white", so partial match returns #FFFFFF
      const result = getColorHex('Gloss White');
      // partial match on "white" → #FFFFFF
      expect(result).toBe('#FFFFFF');
    });
  });

  describe('unknown colors', () => {
    it('returns default gray #9CA3AF for unknown color', () => {
      expect(getColorHex('ultraviolet')).toBe('#9CA3AF');
    });

    it('returns default gray for empty string', () => {
      expect(getColorHex('')).toBe('#9CA3AF');
    });
  });
});
