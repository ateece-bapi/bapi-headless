/**
 * Tests for application category navigation data and lookup helpers
 * @module lib/navigation/__tests__/applicationCategories
 */

import { describe, it, expect } from 'vitest';
import {
  applicationCategories,
  getApplicationCategorySlugs,
  getSubcategorySlugs,
  getWordPressCategoriesForApplication,
  getFiltersForApplication,
  productMatchesApplicationFilters,
  getApplicationBreadcrumbs,
} from '../applicationCategories';

// -------------------------------------------------------------------------
// applicationCategories data shape
// -------------------------------------------------------------------------
describe('applicationCategories data', () => {
  it('is a non-empty record', () => {
    expect(Object.keys(applicationCategories).length).toBeGreaterThan(0);
  });

  it('every category has required fields matching its key slug', () => {
    for (const [slug, category] of Object.entries(applicationCategories)) {
      expect(category.name, `name missing for ${slug}`).toBeTruthy();
      expect(category.slug, `slug mismatch for ${slug}`).toBe(slug);
      expect(category.description, `description missing for ${slug}`).toBeTruthy();
      expect(category.icon, `icon missing for ${slug}`).toBeTruthy();
      expect(typeof category.subcategories, `subcategories not object for ${slug}`).toBe('object');
    }
  });

  it('every subcategory has required fields matching its key slug', () => {
    for (const category of Object.values(applicationCategories)) {
      for (const [subSlug, sub] of Object.entries(category.subcategories)) {
        expect(sub.name, `name missing for ${subSlug}`).toBeTruthy();
        expect(sub.slug, `slug mismatch for ${subSlug}`).toBe(subSlug);
        expect(sub.description, `description missing for ${subSlug}`).toBeTruthy();
        expect(Array.isArray(sub.wpCategories), `wpCategories not array for ${subSlug}`).toBe(true);
      }
    }
  });

  it('contains building-automation category', () => {
    expect(applicationCategories['building-automation']).toBeDefined();
  });

  it('building-automation has room-monitoring subcategory', () => {
    expect(
      applicationCategories['building-automation'].subcategories['room-monitoring']
    ).toBeDefined();
  });

  it('contains industrial-process category', () => {
    expect(applicationCategories['industrial-process']).toBeDefined();
  });

  it('contains wireless-remote category', () => {
    expect(applicationCategories['wireless-remote']).toBeDefined();
  });
});

// -------------------------------------------------------------------------
// getApplicationCategorySlugs
// -------------------------------------------------------------------------
describe('getApplicationCategorySlugs', () => {
  it('returns an array of strings', () => {
    const slugs = getApplicationCategorySlugs();
    expect(Array.isArray(slugs)).toBe(true);
    slugs.forEach((s) => expect(typeof s).toBe('string'));
  });

  it('includes known top-level category slugs', () => {
    const slugs = getApplicationCategorySlugs();
    expect(slugs).toContain('building-automation');
    expect(slugs).toContain('industrial-process');
    expect(slugs).toContain('wireless-remote');
  });

  it('matches the keys of applicationCategories', () => {
    expect(getApplicationCategorySlugs()).toEqual(Object.keys(applicationCategories));
  });
});

// -------------------------------------------------------------------------
// getSubcategorySlugs
// -------------------------------------------------------------------------
describe('getSubcategorySlugs', () => {
  it('returns subcategory slugs for building-automation', () => {
    const slugs = getSubcategorySlugs('building-automation');
    expect(slugs).toContain('room-monitoring');
    expect(slugs).toContain('hvac-duct');
    expect(slugs).toContain('indoor-air-quality');
  });

  it('returns empty array for unknown application slug', () => {
    expect(getSubcategorySlugs('nonexistent')).toEqual([]);
  });

  it('returns an array of strings', () => {
    getSubcategorySlugs('wireless-remote').forEach((s) => expect(typeof s).toBe('string'));
  });

  it('returns subcategory slugs for wireless-remote', () => {
    const slugs = getSubcategorySlugs('wireless-remote');
    expect(slugs).toContain('wireless-temp-humidity');
    expect(slugs).toContain('wireless-pressure');
  });
});

// -------------------------------------------------------------------------
// getWordPressCategoriesForApplication
// -------------------------------------------------------------------------
describe('getWordPressCategoriesForApplication', () => {
  it('returns wpCategories for a valid application and subcategory', () => {
    const cats = getWordPressCategoriesForApplication('building-automation', 'room-monitoring');
    expect(Array.isArray(cats)).toBe(true);
    expect(cats.length).toBeGreaterThan(0);
    expect(cats).toContain('room-sensors');
  });

  it('returns empty array for unknown application slug', () => {
    expect(
      getWordPressCategoriesForApplication('unknown-app', 'room-monitoring')
    ).toEqual([]);
  });

  it('returns empty array for unknown subcategory slug', () => {
    expect(
      getWordPressCategoriesForApplication('building-automation', 'nonexistent-sub')
    ).toEqual([]);
  });

  it('returns correct categories for wireless-remote / wireless-temp-humidity', () => {
    const cats = getWordPressCategoriesForApplication(
      'wireless-remote',
      'wireless-temp-humidity'
    );
    expect(cats).toContain('wireless-sensors');
  });

  it('returns an array for industrial-process / manufacturing', () => {
    const cats = getWordPressCategoriesForApplication('industrial-process', 'manufacturing');
    expect(Array.isArray(cats)).toBe(true);
  });
});

// -------------------------------------------------------------------------
// getFiltersForApplication
// -------------------------------------------------------------------------
describe('getFiltersForApplication', () => {
  it('returns filters for building-automation / room-monitoring', () => {
    const filters = getFiltersForApplication('building-automation', 'room-monitoring');
    expect(filters?.location).toBe('indoor');
    expect(filters?.mounting).toBe('wall');
  });

  it('returns empty object for unknown application', () => {
    expect(getFiltersForApplication('unknown', 'sub')).toEqual({});
  });

  it('returns empty object for unknown subcategory', () => {
    expect(getFiltersForApplication('building-automation', 'nonexistent')).toEqual({});
  });

  it('returns connectivity filter for wireless subcategory', () => {
    const filters = getFiltersForApplication('wireless-remote', 'wireless-temp-humidity');
    expect(filters?.connectivity).toBe('wireless');
  });

  it('returns outdoor location for outdoor-weather subcategory', () => {
    const filters = getFiltersForApplication('building-automation', 'outdoor-weather');
    expect(filters?.location).toBe('outdoor');
  });
});

// -------------------------------------------------------------------------
// productMatchesApplicationFilters
// -------------------------------------------------------------------------
describe('productMatchesApplicationFilters', () => {
  it('returns true when filters is empty object', () => {
    expect(productMatchesApplicationFilters({}, {})).toBe(true);
  });

  it('returns true when filters is undefined', () => {
    expect(productMatchesApplicationFilters({ sku: 'BA/10K-3' }, undefined)).toBe(true);
  });

  it('currently returns true for any product and filter combination (stub)', () => {
    const filters = { location: 'indoor' as const, mounting: 'wall' as const };
    expect(productMatchesApplicationFilters({ sku: 'ANY' }, filters)).toBe(true);
  });

  it('returns true for empty product with non-empty filters', () => {
    expect(productMatchesApplicationFilters({}, { industry: 'industrial' })).toBe(true);
  });
});

// -------------------------------------------------------------------------
// getApplicationBreadcrumbs
// -------------------------------------------------------------------------
describe('getApplicationBreadcrumbs', () => {
  it('always starts with Home breadcrumb', () => {
    const crumbs = getApplicationBreadcrumbs('building-automation');
    expect(crumbs[0]).toEqual({ name: 'Home', href: '/' });
  });

  it('always includes Applications breadcrumb as second item', () => {
    const crumbs = getApplicationBreadcrumbs('building-automation');
    expect(crumbs[1]).toEqual({ name: 'Applications', href: '/applications' });
  });

  it('returns only Home and Applications for an unknown application slug', () => {
    const crumbs = getApplicationBreadcrumbs('nonexistent');
    expect(crumbs.length).toBe(2);
    expect(crumbs[0].href).toBe('/');
    expect(crumbs[1].href).toBe('/applications');
  });

  it('returns three breadcrumbs for a valid top-level category', () => {
    const crumbs = getApplicationBreadcrumbs('building-automation');
    expect(crumbs.length).toBe(3);
    expect(crumbs[2].href).toBe('/applications/building-automation');
    expect(crumbs[2].name).toBeTruthy();
  });

  it('returns four breadcrumbs for a valid category + subcategory', () => {
    const crumbs = getApplicationBreadcrumbs('building-automation', 'room-monitoring');
    expect(crumbs.length).toBe(4);
    expect(crumbs[3].href).toBe('/applications/building-automation/room-monitoring');
    expect(crumbs[3].name).toBeTruthy();
  });

  it('returns three breadcrumbs when subcategory slug is not found', () => {
    const crumbs = getApplicationBreadcrumbs('building-automation', 'nonexistent-sub');
    expect(crumbs.length).toBe(3);
  });

  it('breadcrumb names are non-empty strings', () => {
    const crumbs = getApplicationBreadcrumbs('wireless-remote', 'wireless-pressure');
    crumbs.forEach((c) => {
      expect(typeof c.name).toBe('string');
      expect(c.name.length).toBeGreaterThan(0);
    });
  });
});
