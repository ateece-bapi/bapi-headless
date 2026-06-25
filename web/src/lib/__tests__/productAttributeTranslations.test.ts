/**
 * productAttributeTranslations.ts tests
 *
 * Pure i18n mapping — no mocking needed.
 *
 * Covers:
 * - getAttributeTranslationKey: exact match, all-caps variant, case-insensitive,
 *   unknown label → original label returned (not null)
 * - hasAttributeTranslation: true for known, false for unknown/empty
 * - getSupportedAttributeLabels: returns array with expected entries
 */

import { describe, it, expect } from 'vitest';
import {
  getAttributeTranslationKey,
  hasAttributeTranslation,
  getSupportedAttributeLabels,
} from '../productAttributeTranslations';

// ─── getAttributeTranslationKey ───────────────────────────────────────────────

describe('getAttributeTranslationKey', () => {
  describe('exact matches — temperature', () => {
    it('maps Temperature Application', () => {
      expect(getAttributeTranslationKey('Temperature Application')).toBe('temperature.application');
    });

    it('maps APPLICATION (all-caps variant)', () => {
      expect(getAttributeTranslationKey('APPLICATION')).toBe('temperature.application');
    });

    it('maps Room Enclosure Style', () => {
      expect(getAttributeTranslationKey('Room Enclosure Style')).toBe('temperature.roomEnclosure');
    });

    it('maps Temperature Sensor/Output', () => {
      expect(getAttributeTranslationKey('Temperature Sensor/Output')).toBe('temperature.sensorOutput');
    });

    it('maps TEMPERATURE SENSOR (all-caps)', () => {
      expect(getAttributeTranslationKey('TEMPERATURE SENSOR')).toBe('temperature.sensorOutput');
    });
  });

  describe('exact matches — humidity', () => {
    it('maps Humidity Application', () => {
      expect(getAttributeTranslationKey('Humidity Application')).toBe('humidity.application');
    });

    it('maps HUMIDITY APPLICATION (all-caps)', () => {
      expect(getAttributeTranslationKey('HUMIDITY APPLICATION')).toBe('humidity.application');
    });

    it('maps Humidity Sensor Output', () => {
      expect(getAttributeTranslationKey('Humidity Sensor Output')).toBe('humidity.sensorOutput');
    });

    it('maps Humidity Output (title case variation)', () => {
      expect(getAttributeTranslationKey('Humidity Output')).toBe('humidity.sensorOutput');
    });
  });

  describe('exact matches — general', () => {
    it('maps Display', () => {
      expect(getAttributeTranslationKey('Display')).toBe('general.display');
    });

    it('maps DISPLAY (all-caps)', () => {
      expect(getAttributeTranslationKey('DISPLAY')).toBe('general.display');
    });

    it('maps Voltage Range', () => {
      expect(getAttributeTranslationKey('Voltage Range')).toBe('general.voltage');
    });

    it('maps Communication Protocol', () => {
      expect(getAttributeTranslationKey('Communication Protocol')).toBe('general.protocol');
    });
  });

  describe('case-insensitive fallback', () => {
    it('matches "temperature application" (lowercase)', () => {
      expect(getAttributeTranslationKey('temperature application')).toBe('temperature.application');
    });

    it('matches mixed-case variant not directly in map', () => {
      expect(getAttributeTranslationKey('HUMIDITY ROOM ENCLOSURE')).toBe('humidity.roomEnclosure');
    });
  });

  describe('unknown labels — returns original', () => {
    it('returns the original label for an unmapped attribute', () => {
      expect(getAttributeTranslationKey('Unknown Attribute')).toBe('Unknown Attribute');
    });

    it('returns the original label for empty string', () => {
      // Edge case: empty string has no mapping — returns ''
      expect(getAttributeTranslationKey('')).toBe('');
    });
  });
});

// ─── hasAttributeTranslation ──────────────────────────────────────────────────

describe('hasAttributeTranslation', () => {
  it('returns true for a known attribute label', () => {
    expect(hasAttributeTranslation('Temperature Application')).toBe(true);
  });

  it('returns true for all-caps known variant', () => {
    expect(hasAttributeTranslation('DISPLAY')).toBe(true);
  });

  it('returns true for case-insensitive match', () => {
    expect(hasAttributeTranslation('humidity application')).toBe(true);
  });

  it('returns false for unknown attribute', () => {
    expect(hasAttributeTranslation('Unknown Attribute XYZ')).toBe(false);
  });

  it('returns false for empty string (maps to itself)', () => {
    expect(hasAttributeTranslation('')).toBe(false);
  });
});

// ─── getSupportedAttributeLabels ─────────────────────────────────────────────

describe('getSupportedAttributeLabels', () => {
  it('returns an array', () => {
    expect(Array.isArray(getSupportedAttributeLabels())).toBe(true);
  });

  it('includes key temperature labels', () => {
    const labels = getSupportedAttributeLabels();
    expect(labels).toContain('Temperature Application');
    expect(labels).toContain('Temperature Sensor/Output');
    expect(labels).toContain('Room Enclosure Style');
  });

  it('includes key humidity labels', () => {
    const labels = getSupportedAttributeLabels();
    expect(labels).toContain('Humidity Application');
    expect(labels).toContain('Humidity Sensor Output');
  });

  it('includes general labels', () => {
    const labels = getSupportedAttributeLabels();
    expect(labels).toContain('Display');
    expect(labels).toContain('Voltage Range');
  });

  it('has a non-zero count', () => {
    expect(getSupportedAttributeLabels().length).toBeGreaterThan(0);
  });
});
