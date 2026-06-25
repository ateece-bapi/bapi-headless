/**
 * image.ts tests
 *
 * Pure utility functions and configuration constants — no mocking needed.
 *
 * Covers:
 * - getImageDimensions: WxH pattern in filename → {width, height}; no pattern → null
 * - optimizeImageUrl: appends w/h/quality/format params; relative/invalid URL → as-is
 * - isExternalImage: http:// and https:// → true; relative/protocol-relative → false
 * - getOptimizedImagePath: replaces .jpg/.jpeg/.png with .webp; .webp → unchanged;
 *   no matching extension → unchanged
 * - getImageProps: returns correct config objects for each image type
 * - generatePlaceholder: returns base64 data URI
 */

import { describe, it, expect } from 'vitest';
import {
  getImageDimensions,
  optimizeImageUrl,
  isExternalImage,
  getOptimizedImagePath,
  getImageProps,
  generatePlaceholder,
  IMAGE_QUALITY,
  IMAGE_SIZES,
  RESPONSIVE_SIZES,
} from '../utils/image';

// ─── getImageDimensions ───────────────────────────────────────────────────────

describe('getImageDimensions', () => {
  describe('matches WxH pattern in filename', () => {
    it('extracts dimensions from dash-separated filename', () => {
      expect(getImageDimensions('photo-800x600.jpg')).toEqual({ width: 800, height: 600 });
    });

    it('extracts dimensions from underscore-separated filename', () => {
      expect(getImageDimensions('photo_1200x900.png')).toEqual({ width: 1200, height: 900 });
    });

    it('extracts dimensions from full URL path', () => {
      expect(getImageDimensions('https://cdn.example.com/uploads/sensor-400x400.webp')).toEqual({
        width: 400,
        height: 400,
      });
    });

    it('handles single-digit dimensions', () => {
      expect(getImageDimensions('icon-16x16.png')).toEqual({ width: 16, height: 16 });
    });

    it('handles large dimensions', () => {
      expect(getImageDimensions('hero-1920x1080.jpg')).toEqual({ width: 1920, height: 1080 });
    });
  });

  describe('returns null when no pattern found', () => {
    it('returns null for filename without dimensions', () => {
      expect(getImageDimensions('photo.jpg')).toBeNull();
    });

    it('returns null for URL with no dimension pattern', () => {
      expect(getImageDimensions('https://cdn.example.com/product-hero.jpg')).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(getImageDimensions('')).toBeNull();
    });

    it('returns null for filename with only one number', () => {
      expect(getImageDimensions('image-800.jpg')).toBeNull();
    });
  });
});

// ─── optimizeImageUrl ─────────────────────────────────────────────────────────

describe('optimizeImageUrl', () => {
  const BASE = 'https://cms.example.com/uploads/sensor.jpg';

  it('always adds format=webp', () => {
    const result = optimizeImageUrl(BASE);
    expect(result).toContain('format=webp');
  });

  it('adds width param when provided', () => {
    const result = optimizeImageUrl(BASE, 400);
    expect(result).toContain('w=400');
  });

  it('adds height param when provided', () => {
    const result = optimizeImageUrl(BASE, undefined, 300);
    expect(result).toContain('h=300');
  });

  it('adds quality param when provided', () => {
    const result = optimizeImageUrl(BASE, undefined, undefined, 85);
    expect(result).toContain('quality=85');
  });

  it('adds all params together', () => {
    const result = optimizeImageUrl(BASE, 800, 600, 75);
    expect(result).toContain('w=800');
    expect(result).toContain('h=600');
    expect(result).toContain('quality=75');
    expect(result).toContain('format=webp');
  });

  it('does not add w param when width is undefined', () => {
    const result = optimizeImageUrl(BASE, undefined, 300);
    expect(result).not.toContain('w=');
  });

  it('preserves the original base URL', () => {
    const result = optimizeImageUrl(BASE, 400);
    expect(result).toContain('cms.example.com');
    expect(result).toContain('sensor.jpg');
  });

  it('returns relative URL unchanged (cannot parse)', () => {
    const relative = '/uploads/sensor.jpg';
    expect(optimizeImageUrl(relative, 400)).toBe(relative);
  });

  it('returns invalid URL unchanged', () => {
    expect(optimizeImageUrl('not-a-url', 400)).toBe('not-a-url');
  });

  it('works with URLs that already have query params', () => {
    const url = 'https://cdn.example.com/img.jpg?v=2';
    const result = optimizeImageUrl(url, 400);
    expect(result).toContain('v=2');
    expect(result).toContain('w=400');
    expect(result).toContain('format=webp');
  });
});

// ─── isExternalImage ──────────────────────────────────────────────────────────

describe('isExternalImage', () => {
  it('returns true for http:// URL', () => {
    expect(isExternalImage('http://example.com/image.jpg')).toBe(true);
  });

  it('returns true for https:// URL', () => {
    expect(isExternalImage('https://cdn.example.com/image.webp')).toBe(true);
  });

  it('returns false for root-relative path', () => {
    expect(isExternalImage('/uploads/image.jpg')).toBe(false);
  });

  it('returns false for relative path', () => {
    expect(isExternalImage('images/photo.jpg')).toBe(false);
  });

  it('returns false for protocol-relative URL', () => {
    expect(isExternalImage('//cdn.example.com/image.jpg')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isExternalImage('')).toBe(false);
  });
});

// ─── getOptimizedImagePath ────────────────────────────────────────────────────

describe('getOptimizedImagePath', () => {
  it('replaces .jpg extension with .webp', () => {
    expect(getOptimizedImagePath('/uploads/sensor.jpg')).toBe('/uploads/sensor.webp');
  });

  it('replaces .jpeg extension with .webp', () => {
    expect(getOptimizedImagePath('/uploads/photo.jpeg')).toBe('/uploads/photo.webp');
  });

  it('replaces .png extension with .webp', () => {
    expect(getOptimizedImagePath('/uploads/logo.png')).toBe('/uploads/logo.webp');
  });

  it('is case-insensitive for extension', () => {
    expect(getOptimizedImagePath('/uploads/image.JPG')).toBe('/uploads/image.webp');
    expect(getOptimizedImagePath('/uploads/image.PNG')).toBe('/uploads/image.webp');
  });

  it('returns .webp path unchanged', () => {
    expect(getOptimizedImagePath('/uploads/image.webp')).toBe('/uploads/image.webp');
  });

  it('returns path unchanged when no matching extension', () => {
    expect(getOptimizedImagePath('/uploads/image.svg')).toBe('/uploads/image.svg');
    expect(getOptimizedImagePath('/uploads/image.gif')).toBe('/uploads/image.gif');
  });

  it('works with full CDN URLs', () => {
    expect(getOptimizedImagePath('https://cdn.example.com/product.jpg')).toBe(
      'https://cdn.example.com/product.webp'
    );
  });
});

// ─── getImageProps ────────────────────────────────────────────────────────────

describe('getImageProps', () => {
  it('returns high quality for product type', () => {
    expect(getImageProps('product').quality).toBe(IMAGE_QUALITY.high);
  });

  it('returns high quality and eager loading for hero type', () => {
    const props = getImageProps('hero');
    expect(props.quality).toBe(IMAGE_QUALITY.high);
    expect(props.loading).toBe('eager');
  });

  it('returns thumbnail quality for thumbnail type', () => {
    expect(getImageProps('thumbnail').quality).toBe(IMAGE_QUALITY.thumbnail);
  });

  it('returns lossless quality for logo type', () => {
    expect(getImageProps('logo').quality).toBe(IMAGE_QUALITY.lossless);
  });

  it('returns correct sizes string for product', () => {
    expect(getImageProps('product').sizes).toBe(RESPONSIVE_SIZES.productCard);
  });

  it('returns correct sizes string for hero', () => {
    expect(getImageProps('hero').sizes).toBe(RESPONSIVE_SIZES.hero);
  });

  it('product with priority=true gets eager loading', () => {
    expect(getImageProps('product', true).loading).toBe('eager');
  });

  it('product with priority=false (default) gets lazy loading', () => {
    expect(getImageProps('product', false).loading).toBe('lazy');
  });
});

// ─── generatePlaceholder ──────────────────────────────────────────────────────

describe('generatePlaceholder', () => {
  it('returns a data URI string', () => {
    const result = generatePlaceholder(400, 300);
    expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it('produces a non-empty base64 payload', () => {
    const result = generatePlaceholder(100, 100);
    const base64 = result.replace('data:image/svg+xml;base64,', '');
    expect(base64.length).toBeGreaterThan(0);
  });

  it('produces different output for different dimensions', () => {
    const a = generatePlaceholder(400, 300);
    const b = generatePlaceholder(800, 600);
    expect(a).not.toBe(b);
  });
});

// ─── IMAGE_SIZES constants ────────────────────────────────────────────────────

describe('IMAGE_SIZES constants', () => {
  it('product thumbnail is 80×80', () => {
    expect(IMAGE_SIZES.product.thumbnail).toEqual({ width: 80, height: 80 });
  });

  it('product hero is 1200×1200', () => {
    expect(IMAGE_SIZES.product.hero).toEqual({ width: 1200, height: 1200 });
  });

  it('category card is 400×225 (16:9)', () => {
    const { width, height } = IMAGE_SIZES.category.card;
    expect(width / height).toBeCloseTo(16 / 9, 1);
  });
});
