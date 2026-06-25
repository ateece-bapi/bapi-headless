/**
 * regionLanguageMapping.ts tests
 *
 * Pure lookup utilities — no mocking needed.
 *
 * Covers:
 * - REGION_LANGUAGE_MAP: every region maps to the expected language
 * - getSuggestedLanguage: returns correct LanguageCode for each RegionCode
 * - getLanguageSuggestionMessage: correct message templates per region,
 *   languageName interpolation, MENA-specific phrasing
 */

import { describe, it, expect } from 'vitest';
import {
  REGION_LANGUAGE_MAP,
  getSuggestedLanguage,
  getLanguageSuggestionMessage,
} from '../utils/regionLanguageMapping';
import type { RegionCode } from '@/types/region';

// ─── REGION_LANGUAGE_MAP ──────────────────────────────────────────────────────

describe('REGION_LANGUAGE_MAP', () => {
  it('maps us → en', () => expect(REGION_LANGUAGE_MAP.us).toBe('en'));
  it('maps uk → en', () => expect(REGION_LANGUAGE_MAP.uk).toBe('en'));
  it('maps eu → en', () => expect(REGION_LANGUAGE_MAP.eu).toBe('en'));
  it('maps pl → pl', () => expect(REGION_LANGUAGE_MAP.pl).toBe('pl'));
  it('maps mena → ar', () => expect(REGION_LANGUAGE_MAP.mena).toBe('ar'));

  it('covers all 5 defined RegionCodes', () => {
    const keys = Object.keys(REGION_LANGUAGE_MAP);
    expect(keys).toHaveLength(5);
    expect(keys).toContain('us');
    expect(keys).toContain('uk');
    expect(keys).toContain('eu');
    expect(keys).toContain('pl');
    expect(keys).toContain('mena');
  });
});

// ─── getSuggestedLanguage ─────────────────────────────────────────────────────

describe('getSuggestedLanguage', () => {
  const cases: Array<[RegionCode, string]> = [
    ['us', 'en'],
    ['uk', 'en'],
    ['eu', 'en'],
    ['pl', 'pl'],
    ['mena', 'ar'],
  ];

  for (const [region, expected] of cases) {
    it(`returns '${expected}' for region '${region}'`, () => {
      expect(getSuggestedLanguage(region)).toBe(expected);
    });
  }
});

// ─── getLanguageSuggestionMessage ─────────────────────────────────────────────

describe('getLanguageSuggestionMessage', () => {
  describe('standard "Switch to X?" regions', () => {
    const standardRegions: RegionCode[] = ['us', 'uk', 'eu', 'pl'];

    for (const region of standardRegions) {
      it(`returns "Switch to English?" for region '${region}'`, () => {
        expect(getLanguageSuggestionMessage(region, 'English')).toBe('Switch to English?');
      });
    }

    it('interpolates any language name correctly', () => {
      expect(getLanguageSuggestionMessage('pl', 'Polish')).toBe('Switch to Polish?');
    });
  });

  describe('MENA region — distinct phrasing', () => {
    it('returns "Switch to Arabic for this region?"', () => {
      expect(getLanguageSuggestionMessage('mena', 'Arabic')).toBe(
        'Switch to Arabic for this region?'
      );
    });

    it('interpolates any language name for mena', () => {
      expect(getLanguageSuggestionMessage('mena', 'French')).toBe(
        'Switch to French for this region?'
      );
    });
  });
});
