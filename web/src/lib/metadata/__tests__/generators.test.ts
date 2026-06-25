/**
 * Tests for metadata generators (SEO and Open Graph metadata)
 * @module lib/metadata/__tests__/generators
 */

import { describe, it, expect } from 'vitest';
import {
  LOCALE_TO_OG_LOCALE,
  LOCALE_TO_HREFLANG,
  SITE_CONFIG,
  generateProductMetadata,
  generateCategoryMetadata,
  generatePageMetadata,
  generateDefaultMetadata,
} from '../generators';
import type { ProductMetadataInput, CategoryMetadataInput } from '../types';

// Fixture: full product metadata input
const baseProduct: ProductMetadataInput = {
  name: 'Temperature Sensor',
  slug: 'ba-10k-3',
  sku: 'BA/10K-3',
  description: '<p>Precision room temperature sensor for building automation.</p>',
  shortDescription: '<p>Room temp sensor.</p>',
  price: '$45.00',
  stockStatus: 'IN_STOCK',
  categories: [{ name: 'Room Sensors', slug: 'room-sensors' }],
};

// Fixture: category metadata input
const baseCategory: CategoryMetadataInput = {
  name: 'Room Sensors',
  slug: 'room-sensors',
  description: 'Sensors for indoor room monitoring.',
  count: 42,
};

// Fixture: page metadata input
const basePage = {
  title: 'About BAPI',
  description: 'Learn about Building Automation Products Inc.',
  path: 'about',
};

// -------------------------------------------------------------------------
// LOCALE_TO_OG_LOCALE constant
// -------------------------------------------------------------------------
describe('LOCALE_TO_OG_LOCALE', () => {
  it('maps en to en_US', () => {
    expect(LOCALE_TO_OG_LOCALE['en']).toBe('en_US');
  });

  it('maps de to de_DE', () => {
    expect(LOCALE_TO_OG_LOCALE['de']).toBe('de_DE');
  });

  it('maps es to es_ES', () => {
    expect(LOCALE_TO_OG_LOCALE['es']).toBe('es_ES');
  });

  it('contains all 11 supported locale codes', () => {
    const expected = ['en', 'de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar', 'th', 'pl', 'hi'];
    expected.forEach((locale) => expect(LOCALE_TO_OG_LOCALE[locale]).toBeTruthy());
  });
});

// -------------------------------------------------------------------------
// LOCALE_TO_HREFLANG constant
// -------------------------------------------------------------------------
describe('LOCALE_TO_HREFLANG', () => {
  it('maps en to en-US', () => {
    expect(LOCALE_TO_HREFLANG['en']).toBe('en-US');
  });

  it('maps fr to fr-FR', () => {
    expect(LOCALE_TO_HREFLANG['fr']).toBe('fr-FR');
  });

  it('maps ja to ja-JP', () => {
    expect(LOCALE_TO_HREFLANG['ja']).toBe('ja-JP');
  });

  it('contains all 11 supported locale codes', () => {
    const expected = ['en', 'de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar', 'th', 'pl', 'hi'];
    expected.forEach((locale) => expect(LOCALE_TO_HREFLANG[locale]).toBeTruthy());
  });
});

// -------------------------------------------------------------------------
// SITE_CONFIG constant
// -------------------------------------------------------------------------
describe('SITE_CONFIG', () => {
  it('has siteName BAPI', () => {
    expect(SITE_CONFIG.siteName).toBe('BAPI');
  });

  it('has a valid https siteUrl', () => {
    expect(SITE_CONFIG.siteUrl).toMatch(/^https:\/\//);
  });

  it('has a non-empty defaultTitle', () => {
    expect(SITE_CONFIG.defaultTitle).toBeTruthy();
  });

  it('has a non-empty defaultDescription', () => {
    expect(SITE_CONFIG.defaultDescription).toBeTruthy();
  });

  it('has a keywords array with entries', () => {
    expect(Array.isArray(SITE_CONFIG.keywords)).toBe(true);
    expect(SITE_CONFIG.keywords.length).toBeGreaterThan(0);
  });

  it('organizationName contains BAPI', () => {
    expect(SITE_CONFIG.organizationName).toContain('BAPI');
  });
});

// -------------------------------------------------------------------------
// generateProductMetadata
// -------------------------------------------------------------------------
describe('generateProductMetadata', () => {
  it('returns title containing the product name', () => {
    const meta = generateProductMetadata(baseProduct);
    const titleStr = typeof meta.title === 'string' ? meta.title : JSON.stringify(meta.title);
    expect(titleStr).toContain('Temperature Sensor');
  });

  it('title includes SKU suffix when no partNumber provided', () => {
    const meta = generateProductMetadata(baseProduct);
    const titleStr = typeof meta.title === 'string' ? meta.title : JSON.stringify(meta.title);
    expect(titleStr).toContain('BA/10K-3');
  });

  it('title includes partNumber suffix when provided', () => {
    const meta = generateProductMetadata({ ...baseProduct, partNumber: 'BA10K3' });
    const titleStr = typeof meta.title === 'string' ? meta.title : JSON.stringify(meta.title);
    expect(titleStr).toContain('BA10K3');
  });

  it('description is a string within 160 character limit', () => {
    const meta = generateProductMetadata(baseProduct);
    expect(typeof meta.description).toBe('string');
    expect(meta.description!.length).toBeLessThanOrEqual(160);
  });

  it('description is AI-friendly and references the product name', () => {
    const meta = generateProductMetadata(baseProduct);
    expect(meta.description).toContain('Temperature Sensor');
  });

  it('keywords include product category name', () => {
    const meta = generateProductMetadata(baseProduct);
    expect(meta.keywords).toContain('Room Sensors');
  });

  it('openGraph type is website', () => {
    const meta = generateProductMetadata(baseProduct);
    expect((meta.openGraph as any)?.type).toBe('website');
  });

  it('openGraph branded title includes BAPI', () => {
    const meta = generateProductMetadata(baseProduct);
    expect((meta.openGraph as any)?.title).toContain('BAPI');
  });

  it('openGraph locale maps from locale arg via LOCALE_TO_OG_LOCALE', () => {
    const meta = generateProductMetadata(baseProduct, 'de');
    expect((meta.openGraph as any)?.locale).toBe('de_DE');
  });

  it('openGraph locale falls back to en_US for unknown locale', () => {
    const meta = generateProductMetadata(baseProduct, 'xx');
    expect((meta.openGraph as any)?.locale).toBe('en_US');
  });

  it('openGraph defaults to en_US when no locale argument provided', () => {
    const meta = generateProductMetadata(baseProduct);
    expect((meta.openGraph as any)?.locale).toBe('en_US');
  });

  it('canonical alternate contains locale prefix and product slug', () => {
    const meta = generateProductMetadata(baseProduct, 'en');
    expect((meta.alternates as any)?.canonical).toContain('/en/products/ba-10k-3');
  });

  it('language alternates include en-US and de-DE entries', () => {
    const meta = generateProductMetadata(baseProduct, 'en');
    const languages = (meta.alternates as any)?.languages;
    expect(languages?.['en-US']).toBeTruthy();
    expect(languages?.['de-DE']).toBeTruthy();
  });

  it('robots index and follow are true', () => {
    const meta = generateProductMetadata(baseProduct);
    expect((meta.robots as any)?.index).toBe(true);
    expect((meta.robots as any)?.follow).toBe(true);
  });

  it('twitter card is summary_large_image', () => {
    const meta = generateProductMetadata(baseProduct);
    expect((meta.twitter as any)?.card).toBe('summary_large_image');
  });

  it('other metadata includes product:brand', () => {
    const meta = generateProductMetadata(baseProduct);
    expect((meta.other as any)?.['product:brand']).toBeTruthy();
  });
});

// -------------------------------------------------------------------------
// generateCategoryMetadata
// -------------------------------------------------------------------------
describe('generateCategoryMetadata', () => {
  it('title contains the category name', () => {
    const meta = generateCategoryMetadata(baseCategory);
    const titleStr = typeof meta.title === 'string' ? meta.title : JSON.stringify(meta.title);
    expect(titleStr).toContain('Room Sensors');
  });

  it('title includes "Products"', () => {
    const meta = generateCategoryMetadata(baseCategory);
    const titleStr = typeof meta.title === 'string' ? meta.title : JSON.stringify(meta.title);
    expect(titleStr).toContain('Products');
  });

  it('description is within 160 character limit', () => {
    const meta = generateCategoryMetadata(baseCategory);
    expect(meta.description!.length).toBeLessThanOrEqual(160);
  });

  it('description references the category name', () => {
    const meta = generateCategoryMetadata(baseCategory);
    expect(meta.description).toContain('Room Sensors');
  });

  it('generates fallback description when category description is empty', () => {
    const meta = generateCategoryMetadata({ ...baseCategory, description: '' });
    expect(meta.description).toBeTruthy();
    expect(meta.description).toContain('Room Sensors');
  });

  it('openGraph type is website', () => {
    const meta = generateCategoryMetadata(baseCategory);
    expect((meta.openGraph as any)?.type).toBe('website');
  });

  it('openGraph branded title includes BAPI', () => {
    const meta = generateCategoryMetadata(baseCategory);
    expect((meta.openGraph as any)?.title).toContain('BAPI');
  });

  it('canonical alternate contains category slug', () => {
    const meta = generateCategoryMetadata(baseCategory, 'en');
    expect((meta.alternates as any)?.canonical).toContain('room-sensors');
  });

  it('robots index and follow are true', () => {
    const meta = generateCategoryMetadata(baseCategory);
    expect((meta.robots as any)?.index).toBe(true);
    expect((meta.robots as any)?.follow).toBe(true);
  });
});

// -------------------------------------------------------------------------
// generatePageMetadata
// -------------------------------------------------------------------------
describe('generatePageMetadata', () => {
  it('returns the page title as-is', () => {
    const meta = generatePageMetadata(basePage);
    expect(meta.title).toBe('About BAPI');
  });

  it('returns the page description as-is', () => {
    const meta = generatePageMetadata(basePage);
    expect(meta.description).toBe('Learn about Building Automation Products Inc.');
  });

  it('openGraph branded title appends | BAPI', () => {
    const meta = generatePageMetadata(basePage);
    expect((meta.openGraph as any)?.title).toBe('About BAPI | BAPI');
  });

  it('canonical contains locale prefix and path', () => {
    const meta = generatePageMetadata(basePage, 'en');
    expect((meta.alternates as any)?.canonical).toContain('/en/about');
  });

  it('defaults to website OpenGraph type', () => {
    const meta = generatePageMetadata(basePage);
    expect((meta.openGraph as any)?.type).toBe('website');
  });

  it('uses article type when explicitly specified', () => {
    const meta = generatePageMetadata({ ...basePage, type: 'article' });
    expect((meta.openGraph as any)?.type).toBe('article');
  });

  it('includes publishedTime in openGraph when provided', () => {
    const meta = generatePageMetadata({ ...basePage, publishedTime: '2026-01-15T00:00:00Z' });
    expect((meta.openGraph as any)?.publishedTime).toBe('2026-01-15T00:00:00Z');
  });

  it('includes keywords joined as comma-separated string when provided', () => {
    const meta = generatePageMetadata({ ...basePage, keywords: ['sensors', 'HVAC'] });
    expect(meta.keywords).toContain('sensors');
    expect(meta.keywords).toContain('HVAC');
  });

  it('keywords is undefined when not provided', () => {
    const meta = generatePageMetadata(basePage);
    expect(meta.keywords).toBeUndefined();
  });

  it('twitter card is summary_large_image', () => {
    const meta = generatePageMetadata(basePage);
    expect((meta.twitter as any)?.card).toBe('summary_large_image');
  });
});

// -------------------------------------------------------------------------
// generateDefaultMetadata
// -------------------------------------------------------------------------
describe('generateDefaultMetadata', () => {
  it('title template includes the site name', () => {
    const meta = generateDefaultMetadata();
    if (typeof meta.title === 'object' && meta.title !== null) {
      expect((meta.title as any).template).toContain('BAPI');
    } else {
      expect(String(meta.title)).toContain('BAPI');
    }
  });

  it('title.default is SITE_CONFIG.defaultTitle', () => {
    const meta = generateDefaultMetadata();
    if (typeof meta.title === 'object' && meta.title !== null) {
      expect((meta.title as any).default).toBe(SITE_CONFIG.defaultTitle);
    }
  });

  it('description is non-empty', () => {
    expect(generateDefaultMetadata().description).toBeTruthy();
  });

  it('keywords is a non-empty string', () => {
    const meta = generateDefaultMetadata();
    expect(typeof meta.keywords).toBe('string');
    expect((meta.keywords as string).length).toBeGreaterThan(0);
  });

  it('openGraph type is website', () => {
    const meta = generateDefaultMetadata();
    expect((meta.openGraph as any)?.type).toBe('website');
  });

  it('openGraph locale defaults to en_US for default locale', () => {
    const meta = generateDefaultMetadata('en');
    expect((meta.openGraph as any)?.locale).toBe('en_US');
  });

  it('robots index and follow are true', () => {
    const meta = generateDefaultMetadata();
    expect((meta.robots as any)?.index).toBe(true);
    expect((meta.robots as any)?.follow).toBe(true);
  });
});
