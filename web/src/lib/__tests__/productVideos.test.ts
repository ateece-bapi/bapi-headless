/**
 * productVideos.ts tests
 *
 * Mocks the @/data/product-videos.json import to control video data.
 *
 * Covers:
 * - getProductVideos: SKU lookup, productId fallback, SKU takes priority,
 *   unknown SKU + unknown ID → [], null/undefined inputs → []
 * - hasProductVideos: true when videos exist, false otherwise
 */

import { describe, it, expect, vi } from 'vitest';

// ─── Mock the JSON data module ────────────────────────────────────────────────

vi.mock('@/data/product-videos.json', () => ({
  default: {
    'BA/3324VC': [
      {
        id: 'vid-1',
        title: 'Installation Guide',
        url: 'https://youtube.com/watch?v=abc',
        publishedAt: '2024-01-01',
        duration: '5:30',
        category: 'Installation',
      },
      {
        id: 'vid-2',
        title: 'Product Overview',
        url: 'https://youtube.com/watch?v=def',
        publishedAt: '2024-02-01',
        duration: '3:15',
      },
    ],
    '418359': [
      {
        id: 'vid-3',
        title: 'ID Lookup Video',
        url: 'https://youtube.com/watch?v=ghi',
        publishedAt: '2024-03-01',
        duration: '2:00',
      },
    ],
  },
}));

// ─── Import after mock ─────────────────────────────────────────────────────────

import { getProductVideos, hasProductVideos } from '../productVideos';

// ─── getProductVideos ─────────────────────────────────────────────────────────

describe('getProductVideos', () => {
  describe('SKU lookup', () => {
    it('returns videos for a known SKU', () => {
      const videos = getProductVideos('BA/3324VC');
      expect(videos).toHaveLength(2);
      expect(videos[0].id).toBe('vid-1');
      expect(videos[1].id).toBe('vid-2');
    });

    it('returns correct video properties', () => {
      const [first] = getProductVideos('BA/3324VC');
      expect(first.title).toBe('Installation Guide');
      expect(first.url).toBe('https://youtube.com/watch?v=abc');
      expect(first.duration).toBe('5:30');
      expect(first.category).toBe('Installation');
    });
  });

  describe('productId fallback', () => {
    it('returns videos by productId when SKU has no match', () => {
      const videos = getProductVideos('UNKNOWN-SKU', '418359');
      expect(videos).toHaveLength(1);
      expect(videos[0].id).toBe('vid-3');
    });

    it('does NOT use productId fallback when SKU already matched', () => {
      // SKU matches → productId should be ignored
      const videos = getProductVideos('BA/3324VC', '418359');
      expect(videos).toHaveLength(2); // SKU results, not productId results
      expect(videos.every((v) => v.id !== 'vid-3')).toBe(true);
    });
  });

  describe('no match', () => {
    it('returns empty array for unknown SKU and no productId', () => {
      expect(getProductVideos('UNKNOWN-SKU')).toEqual([]);
    });

    it('returns empty array for unknown SKU and unknown productId', () => {
      expect(getProductVideos('UNKNOWN', '999')).toEqual([]);
    });

    it('returns empty array for null SKU and null productId', () => {
      expect(getProductVideos(null, null)).toEqual([]);
    });

    it('returns empty array for undefined SKU and undefined productId', () => {
      expect(getProductVideos(undefined, undefined)).toEqual([]);
    });

    it('returns empty array when both args omitted', () => {
      expect(getProductVideos()).toEqual([]);
    });
  });
});

// ─── hasProductVideos ─────────────────────────────────────────────────────────

describe('hasProductVideos', () => {
  it('returns true when SKU has videos', () => {
    expect(hasProductVideos('BA/3324VC')).toBe(true);
  });

  it('returns true when productId has videos (SKU not found)', () => {
    expect(hasProductVideos('UNKNOWN', '418359')).toBe(true);
  });

  it('returns false when neither SKU nor productId has videos', () => {
    expect(hasProductVideos('UNKNOWN', '999')).toBe(false);
  });

  it('returns false for null/undefined inputs', () => {
    expect(hasProductVideos(null, null)).toBe(false);
    expect(hasProductVideos(undefined, undefined)).toBe(false);
  });
});
