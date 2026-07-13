/**
 * i18n configuration tests
 *
 * Verifies that the locales array in src/i18n.ts matches the expected language
 * inventory documented in README.md (11 languages as of Phase 1 + Hindi).
 *
 * If this test fails after adding or removing a locale, update:
 *   1. The expected count below
 *   2. The README "11 languages" reference
 */

import { describe, it, expect } from 'vitest';
import { locales, defaultLocale } from '../i18n';

describe('i18n locales', () => {
  it('contains exactly 11 supported locales', () => {
    expect(locales).toHaveLength(11);
  });

  it('includes all Phase 1 + Hindi languages', () => {
    const expected = ['en', 'de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar', 'th', 'pl', 'hi'] as const;
    for (const lang of expected) {
      expect(locales).toContain(lang);
    }
  });

  it('has English as the default locale', () => {
    expect(defaultLocale).toBe('en');
  });

  it('default locale is a member of the locales array', () => {
    expect(locales).toContain(defaultLocale);
  });
});
