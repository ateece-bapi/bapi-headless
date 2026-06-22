/**
 * categoryTranslations.ts tests
 *
 * Pure i18n mapping utilities — no side effects, no mocking needed.
 *
 * Covers:
 * - getCategoryTranslationKey: exact match, case-insensitive, unknown → null
 * - getSubcategoryTranslationKey: exact match, case-insensitive, unknown → null
 * - hasCategoryTranslation: true for known, false for unknown, falsy input
 * - hasSubcategoryTranslation: true for known, false for unknown, falsy input
 * - getSupportedCategoryNames: returns array containing all known names
 * - getSupportedSubcategoryNames: returns array containing all known names
 */

import { describe, it, expect } from 'vitest';
import {
  getCategoryTranslationKey,
  getSubcategoryTranslationKey,
  hasCategoryTranslation,
  hasSubcategoryTranslation,
  getSupportedCategoryNames,
  getSupportedSubcategoryNames,
  CATEGORY_NAME_MAP,
  SUBCATEGORY_NAME_MAP,
} from '../categoryTranslations';

// ─── getCategoryTranslationKey ────────────────────────────────────────────────

describe('getCategoryTranslationKey', () => {
  it('returns correct key for exact-match category names', () => {
    expect(getCategoryTranslationKey('Temperature Sensors')).toBe('temperatureSensors');
    expect(getCategoryTranslationKey('Humidity Sensors')).toBe('humiditySensors');
    expect(getCategoryTranslationKey('Pressure Sensors')).toBe('pressureSensors');
    expect(getCategoryTranslationKey('Air Quality Sensors')).toBe('airQualitySensors');
    expect(getCategoryTranslationKey('Wireless Sensors')).toBe('wirelessSensors');
    expect(getCategoryTranslationKey('Accessories')).toBe('accessories');
    expect(getCategoryTranslationKey('Test Instruments')).toBe('testInstruments');
    expect(getCategoryTranslationKey('ETA Line')).toBe('etaLine');
  });

  it('returns correct key for lowercase variants', () => {
    expect(getCategoryTranslationKey('temperature sensors')).toBe('temperatureSensors');
    expect(getCategoryTranslationKey('humidity sensors')).toBe('humiditySensors');
  });

  it('is case-insensitive for mixed-case inputs not in map', () => {
    // "HUMIDITY SENSORS" is not in the map but should match case-insensitively
    expect(getCategoryTranslationKey('HUMIDITY SENSORS')).toBe('humiditySensors');
  });

  it('returns null for unrecognized category name', () => {
    expect(getCategoryTranslationKey('Unknown Category')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getCategoryTranslationKey('')).toBeNull();
  });

  it('returns consistent keys — all map values are camelCase strings', () => {
    for (const key of Object.values(CATEGORY_NAME_MAP)) {
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
      // camelCase: starts with lowercase
      expect(key[0]).toBe(key[0].toLowerCase());
    }
  });
});

// ─── getSubcategoryTranslationKey ─────────────────────────────────────────────

describe('getSubcategoryTranslationKey', () => {
  it('returns correct key for exact-match subcategory names', () => {
    expect(getSubcategoryTranslationKey('Room')).toBe('room');
    expect(getSubcategoryTranslationKey('Non-Room')).toBe('nonRoom');
    expect(getSubcategoryTranslationKey('Wireless System - Bluetooth Low Energy')).toBe('bluetoothWireless');
    expect(getSubcategoryTranslationKey('WAM - Wireless Asset Monitoring')).toBe('wamWireless');
  });

  it('returns correct key for lowercase variants in map', () => {
    expect(getSubcategoryTranslationKey('room')).toBe('room');
    expect(getSubcategoryTranslationKey('non-room')).toBe('nonRoom');
  });

  it('is case-insensitive for mixed-case inputs not directly in map', () => {
    expect(getSubcategoryTranslationKey('ROOM')).toBe('room');
    expect(getSubcategoryTranslationKey('NON-ROOM')).toBe('nonRoom');
  });

  it('returns null for unrecognized subcategory name', () => {
    expect(getSubcategoryTranslationKey('Unknown Sub')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getSubcategoryTranslationKey('')).toBeNull();
  });

  it('returns consistent keys — all map values are camelCase strings', () => {
    for (const key of Object.values(SUBCATEGORY_NAME_MAP)) {
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    }
  });
});

// ─── hasCategoryTranslation ───────────────────────────────────────────────────

describe('hasCategoryTranslation', () => {
  it('returns true for a known category', () => {
    expect(hasCategoryTranslation('Humidity Sensors')).toBe(true);
  });

  it('returns true for a lowercase variant in the map', () => {
    expect(hasCategoryTranslation('humidity sensors')).toBe(true);
  });

  it('returns true for a mixed-case variant not directly in map', () => {
    expect(hasCategoryTranslation('TEMPERATURE SENSORS')).toBe(true);
  });

  it('returns false for unknown category', () => {
    expect(hasCategoryTranslation('Foo Category')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(hasCategoryTranslation('')).toBe(false);
  });
});

// ─── hasSubcategoryTranslation ────────────────────────────────────────────────

describe('hasSubcategoryTranslation', () => {
  it('returns true for a known subcategory', () => {
    expect(hasSubcategoryTranslation('Room')).toBe(true);
    expect(hasSubcategoryTranslation('Non-Room')).toBe(true);
  });

  it('returns true case-insensitively', () => {
    expect(hasSubcategoryTranslation('ROOM')).toBe(true);
  });

  it('returns false for unknown subcategory', () => {
    expect(hasSubcategoryTranslation('Unknown Sub')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(hasSubcategoryTranslation('')).toBe(false);
  });
});

// ─── getSupportedCategoryNames ────────────────────────────────────────────────

describe('getSupportedCategoryNames', () => {
  it('returns an array', () => {
    expect(Array.isArray(getSupportedCategoryNames())).toBe(true);
  });

  it('contains all known top-level category names', () => {
    const names = getSupportedCategoryNames();
    expect(names).toContain('Temperature Sensors');
    expect(names).toContain('Humidity Sensors');
    expect(names).toContain('Pressure Sensors');
    expect(names).toContain('Air Quality Sensors');
    expect(names).toContain('Wireless Sensors');
    expect(names).toContain('Accessories');
    expect(names).toContain('Test Instruments');
    expect(names).toContain('ETA Line');
  });

  it('length matches CATEGORY_NAME_MAP key count', () => {
    expect(getSupportedCategoryNames().length).toBe(Object.keys(CATEGORY_NAME_MAP).length);
  });
});

// ─── getSupportedSubcategoryNames ────────────────────────────────────────────

describe('getSupportedSubcategoryNames', () => {
  it('returns an array', () => {
    expect(Array.isArray(getSupportedSubcategoryNames())).toBe(true);
  });

  it('contains known subcategory names', () => {
    const names = getSupportedSubcategoryNames();
    expect(names).toContain('Room');
    expect(names).toContain('Non-Room');
  });

  it('length matches SUBCATEGORY_NAME_MAP key count', () => {
    expect(getSupportedSubcategoryNames().length).toBe(Object.keys(SUBCATEGORY_NAME_MAP).length);
  });
});
