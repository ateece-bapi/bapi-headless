/**
 * sanitize.ts tests
 *
 * Tests the styling-focused HTML sanitizer that strips WordPress classes,
 * inline styles, and presentational attributes while preserving structure.
 *
 * Covers:
 * - sanitizeWordPressContent: null/undefined/empty → ''
 * - Removes class, style, id attributes
 * - Removes bare presentational attributes (width, height, align, etc.)
 * - Adds max-width style to img tags
 * - Preserves non-presentational HTML structure
 *
 * - stripHtml: null/undefined/empty → ''
 * - Strips all tags, preserves text content
 * - Handles nested tags, self-closing tags, tags with attributes
 * - Handles malformed/unterminated tags
 */

import { describe, it, expect } from 'vitest';
import { sanitizeWordPressContent, stripHtml } from '../sanitize';

// ─── sanitizeWordPressContent ─────────────────────────────────────────────────

describe('sanitizeWordPressContent', () => {
  describe('falsy input', () => {
    it('returns empty string for null', () => {
      expect(sanitizeWordPressContent(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(sanitizeWordPressContent(undefined)).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(sanitizeWordPressContent('')).toBe('');
    });
  });

  describe('class attributes', () => {
    it('removes class attribute from a tag', () => {
      const result = sanitizeWordPressContent('<p class="wp-block-paragraph">Hello</p>');
      expect(result).not.toContain('class=');
      expect(result).toContain('Hello');
    });

    it('removes class attribute with multiple classes', () => {
      const result = sanitizeWordPressContent('<div class="foo bar baz">content</div>');
      expect(result).not.toContain('class=');
    });
  });

  describe('style attributes', () => {
    it('removes inline style attribute', () => {
      const result = sanitizeWordPressContent('<p style="color: red; font-size: 14px;">text</p>');
      expect(result).not.toContain('style=');
      expect(result).toContain('text');
    });
  });

  describe('id attributes', () => {
    it('removes id attribute', () => {
      const result = sanitizeWordPressContent('<h2 id="section-title">Title</h2>');
      expect(result).not.toContain('id=');
      expect(result).toContain('Title');
    });
  });

  describe('bare presentational attributes', () => {
    it('removes width attribute without value', () => {
      const result = sanitizeWordPressContent('<table width>data</table>');
      expect(result).not.toContain(' width');
    });

    it('removes align attribute without value', () => {
      const result = sanitizeWordPressContent('<td align>cell</td>');
      expect(result).not.toContain(' align');
    });
  });

  describe('img tag handling', () => {
    it('adds max-width style to img without existing style', () => {
      const result = sanitizeWordPressContent('<img src="photo.jpg" alt="Photo">');
      expect(result).toContain('max-width: 100%');
      expect(result).toContain('height: auto');
    });

    it('appends max-width style to img with existing style attribute', () => {
      // sanitize.ts strips all style attributes first, then re-adds max-width to imgs
      const result = sanitizeWordPressContent('<img src="photo.jpg" alt="x" style="border: 1px solid red;">');
      expect(result).toContain('max-width: 100%');
      expect(result).toContain('height: auto');
    });

    it('preserves src and alt on img', () => {
      const result = sanitizeWordPressContent('<img src="test.jpg" alt="Test image" class="wp-img">');
      expect(result).toContain('src="test.jpg"');
      expect(result).toContain('alt="Test image"');
    });
  });

  describe('HTML structure preservation', () => {
    it('preserves paragraph tags', () => {
      const result = sanitizeWordPressContent('<p>Hello world</p>');
      expect(result).toContain('<p>');
      expect(result).toContain('Hello world');
      expect(result).toContain('</p>');
    });

    it('preserves headings', () => {
      const result = sanitizeWordPressContent('<h2>Section</h2><p>Body</p>');
      expect(result).toContain('<h2>');
      expect(result).toContain('Section');
    });

    it('preserves list structure', () => {
      const result = sanitizeWordPressContent('<ul><li>Item 1</li><li>Item 2</li></ul>');
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>Item 1</li>');
    });

    it('preserves plain text with no tags', () => {
      const result = sanitizeWordPressContent('Just plain text');
      expect(result).toBe('Just plain text');
    });
  });
});

// ─── stripHtml ────────────────────────────────────────────────────────────────

describe('stripHtml', () => {
  describe('falsy input', () => {
    it('returns empty string for null', () => {
      expect(stripHtml(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(stripHtml(undefined)).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(stripHtml('')).toBe('');
    });
  });

  describe('tag stripping', () => {
    it('strips a single tag', () => {
      expect(stripHtml('<p>Hello</p>')).toBe('Hello');
    });

    it('strips multiple different tags', () => {
      expect(stripHtml('<h1>Title</h1><p>Body</p>')).toBe('TitleBody');
    });

    it('strips nested tags', () => {
      expect(stripHtml('<div><p><strong>Bold text</strong></p></div>')).toBe('Bold text');
    });

    it('strips self-closing tags', () => {
      expect(stripHtml('Before<br/>After')).toBe('BeforeAfter');
    });

    it('strips tags with attributes', () => {
      expect(stripHtml('<a href="https://example.com" class="link">Click here</a>')).toBe('Click here');
    });

    it('strips img tags entirely (no text content)', () => {
      expect(stripHtml('<img src="photo.jpg" alt="photo">')).toBe('');
    });

    it('preserves text between tags', () => {
      expect(stripHtml('<p>First</p><p>Second</p>')).toBe('FirstSecond');
    });

    it('returns plain text unchanged', () => {
      expect(stripHtml('just text')).toBe('just text');
    });

    it('preserves HTML entities in text', () => {
      expect(stripHtml('<p>&amp; &lt; &gt;</p>')).toBe('&amp; &lt; &gt;');
    });

    it('handles malformed/unterminated tags without throwing', () => {
      // Closed tag is stripped; unterminated tag (no closing >) is left as-is
      // because the regex <[^>]*> only matches complete <...> pairs
      expect(stripHtml('<p>text</p>')).toBe('text');
      expect(() => stripHtml('before<b after')).not.toThrow();
    });
  });
});
