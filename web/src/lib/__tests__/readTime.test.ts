/**
 * readTime.ts tests
 *
 * Pure utility functions — no mocking needed.
 *
 * Covers:
 * - calculateReadTime: empty/falsy → 1, word counting, 200 WPM default,
 *   custom WPM, HTML tag stripping, minimum 1 minute, rounding up
 * - formatReadTime: returns '${minutes} min read' (no pluralization)
 * - getCategoryColor: all known BAPI categories, unknown → default
 */

import { describe, it, expect } from 'vitest';
import { calculateReadTime, formatReadTime, getCategoryColor } from '../utils/readTime';

// ─── calculateReadTime ────────────────────────────────────────────────────────

describe('calculateReadTime', () => {
  describe('falsy / empty input', () => {
    it('returns 1 for empty string', () => {
      expect(calculateReadTime('')).toBe(1);
    });

    it('returns 1 for whitespace-only string', () => {
      expect(calculateReadTime('   ')).toBe(1);
    });

    // Runtime safety: the signature is (string) but guard handles falsy
    it('returns 1 for falsy value passed at runtime', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(calculateReadTime(null as any)).toBe(1);
    });
  });

  describe('word counting with default 200 WPM', () => {
    it('returns 1 for short content (< 200 words)', () => {
      const words = Array(100).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe(1);
    });

    it('returns 1 for exactly 200 words', () => {
      const words = Array(200).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe(1);
    });

    it('returns 2 for 201 words (rounds up)', () => {
      const words = Array(201).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe(2);
    });

    it('returns 2 for 400 words', () => {
      const words = Array(400).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe(2);
    });

    it('returns 5 for 1000 words', () => {
      const words = Array(1000).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe(5);
    });

    it('returns 10 for 2000 words', () => {
      const words = Array(2000).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe(10);
    });
  });

  describe('HTML tag stripping', () => {
    it('strips HTML tags before counting words', () => {
      // 200 words wrapped in <p> tags — should still be 1 min
      const words = Array(200).fill('word').join(' ');
      const html = `<p>${words}</p>`;
      expect(calculateReadTime(html)).toBe(1);
    });

    it('does not count tag names as words', () => {
      const html = '<h1>Title</h1><p>One two three</p>';
      // Only "Title One two three" = 4 words → 1 min
      expect(calculateReadTime(html)).toBe(1);
    });

    it('handles deeply nested HTML', () => {
      const words = Array(400).fill('word').join(' </span><span>');
      const html = `<div><p><span>${words}</span></p></div>`;
      expect(calculateReadTime(html)).toBe(2);
    });
  });

  describe('custom wordsPerMinute', () => {
    it('uses provided WPM when specified', () => {
      const words = Array(100).fill('word').join(' '); // 100 words
      // At 100 WPM → ceil(100/100) = 1
      expect(calculateReadTime(words, 100)).toBe(1);
      // At 50 WPM → ceil(100/50) = 2
      expect(calculateReadTime(words, 50)).toBe(2);
    });

    it('minimum is always 1 even with very slow WPM on very short content', () => {
      // 1 word at 1 WPM = ceil(1/1) = 1, max(1,1) = 1
      expect(calculateReadTime('word', 1)).toBe(1);
    });
  });

  describe('minimum 1 minute', () => {
    it('never returns 0 for non-empty content', () => {
      expect(calculateReadTime('hi')).toBeGreaterThanOrEqual(1);
    });
  });
});

// ─── formatReadTime ───────────────────────────────────────────────────────────

describe('formatReadTime', () => {
  it('formats 1 minute correctly', () => {
    expect(formatReadTime(1)).toBe('1 min read');
  });

  it('formats 5 minutes correctly', () => {
    expect(formatReadTime(5)).toBe('5 min read');
  });

  it('formats 10 minutes correctly', () => {
    expect(formatReadTime(10)).toBe('10 min read');
  });

  it('uses the number provided without modification', () => {
    expect(formatReadTime(3)).toBe('3 min read');
  });
});

// ─── getCategoryColor ─────────────────────────────────────────────────────────

describe('getCategoryColor', () => {
  describe('product / announcement', () => {
    it('returns yellow for "product"', () => {
      expect(getCategoryColor('product')).toBe('bg-accent-500 text-neutral-900');
    });

    it('returns yellow for "Product Update"', () => {
      expect(getCategoryColor('Product Update')).toBe('bg-accent-500 text-neutral-900');
    });

    it('returns yellow for "announcement"', () => {
      expect(getCategoryColor('announcement')).toBe('bg-accent-500 text-neutral-900');
    });
  });

  describe('news / industry', () => {
    it('returns blue for "news"', () => {
      expect(getCategoryColor('news')).toBe('bg-primary-500 text-white');
    });

    it('returns blue for "Industry Insights"', () => {
      expect(getCategoryColor('Industry Insights')).toBe('bg-primary-500 text-white');
    });
  });

  describe('technical / case study', () => {
    it('returns gray for "technical"', () => {
      expect(getCategoryColor('technical')).toBe('bg-neutral-500 text-white');
    });

    it('returns gray for "Case Study"', () => {
      expect(getCategoryColor('Case Study')).toBe('bg-neutral-500 text-white');
    });

    it('returns gray for "case studies"', () => {
      expect(getCategoryColor('case studies')).toBe('bg-neutral-500 text-white');
    });
  });

  describe('events / webinars', () => {
    it('returns green for "event"', () => {
      expect(getCategoryColor('event')).toBe('bg-green-500 text-white');
    });

    it('returns green for "Webinar"', () => {
      expect(getCategoryColor('Webinar')).toBe('bg-green-500 text-white');
    });
  });

  describe('unknown / default', () => {
    it('returns default for unrecognized category', () => {
      expect(getCategoryColor('Miscellaneous')).toBe('bg-neutral-200 text-neutral-900');
    });

    it('returns default for empty string', () => {
      expect(getCategoryColor('')).toBe('bg-neutral-200 text-neutral-900');
    });
  });
});
