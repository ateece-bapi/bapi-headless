/**
 * wordpress-content.ts tests
 *
 * Pure content-cleaning utilities — no mocking needed.
 *
 * Covers:
 * - stripShortcodes: removes vc_*, et_pb_*, fusion_*, elementor, generic […]
 *   patterns; collapses excess blank lines; falsy → ''
 * - extractCleanText: strips shortcodes + HTML tags + decodes entities + trims whitespace
 * - hasVisualComposerContent: detects [vc_ pattern presence
 * - cleanWordPressContent: strips shortcodes when VC present; returns as-is otherwise
 */

import { describe, it, expect } from 'vitest';
import {
  stripShortcodes,
  extractCleanText,
  hasVisualComposerContent,
  cleanWordPressContent,
} from '../utils/wordpress-content';

// ─── stripShortcodes ──────────────────────────────────────────────────────────

describe('stripShortcodes', () => {
  describe('falsy / empty input', () => {
    it('returns empty string for empty string', () => {
      expect(stripShortcodes('')).toBe('');
    });

    it('returns empty string for falsy value at runtime', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(stripShortcodes(null as any)).toBe('');
    });
  });

  describe('Visual Composer (vc_) shortcodes', () => {
    it('removes opening vc_ tags', () => {
      expect(stripShortcodes('[vc_row]Content[/vc_row]')).not.toContain('[vc_');
    });

    it('removes closing vc_ tags', () => {
      expect(stripShortcodes('[vc_row]Content[/vc_row]')).not.toContain('[/vc_');
    });

    it('preserves text content after removing vc_ tags', () => {
      const result = stripShortcodes('[vc_row][vc_column]Hello world[/vc_column][/vc_row]');
      expect(result).toContain('Hello world');
    });

    it('removes vc_ tags with attributes', () => {
      const result = stripShortcodes('[vc_column width="1/2"]Content[/vc_column]');
      expect(result).not.toContain('vc_column');
      expect(result).toContain('Content');
    });
  });

  describe('Divi (et_pb_) shortcodes', () => {
    it('removes et_pb_ opening and closing tags', () => {
      const result = stripShortcodes('[et_pb_section]Content[/et_pb_section]');
      expect(result).not.toContain('et_pb_');
      expect(result).toContain('Content');
    });
  });

  describe('Fusion Builder shortcodes', () => {
    it('removes fusion_ shortcodes', () => {
      const result = stripShortcodes('[fusion_builder_container]Text[/fusion_builder_container]');
      expect(result).not.toContain('fusion_');
      expect(result).toContain('Text');
    });
  });

  describe('Elementor shortcodes', () => {
    it('removes elementor shortcodes', () => {
      const result = stripShortcodes('[elementor-template id="123"]');
      expect(result).not.toContain('elementor');
    });
  });

  describe('generic shortcodes', () => {
    it('removes arbitrary [shortcode] patterns', () => {
      const result = stripShortcodes('[gallery ids="1,2,3"]Some text[/gallery]');
      expect(result).not.toContain('[gallery');
      expect(result).not.toContain('[/gallery]');
      expect(result).toContain('Some text');
    });

    it('removes self-closing shortcodes', () => {
      const result = stripShortcodes('Before [caption id="1"] After');
      expect(result).not.toContain('[caption');
    });
  });

  describe('plain content without shortcodes', () => {
    it('returns plain text unchanged', () => {
      expect(stripShortcodes('No shortcodes here.')).toBe('No shortcodes here.');
    });

    it('returns HTML content unchanged', () => {
      const html = '<p>Hello <strong>world</strong></p>';
      expect(stripShortcodes(html)).toBe(html);
    });
  });

  describe('whitespace normalisation', () => {
    it('collapses 3+ consecutive blank lines to 2', () => {
      const result = stripShortcodes('Line1\n\n\n\nLine2');
      expect(result).not.toMatch(/\n\s*\n\s*\n/);
      expect(result).toContain('Line1');
      expect(result).toContain('Line2');
    });
  });
});

// ─── extractCleanText ─────────────────────────────────────────────────────────

describe('extractCleanText', () => {
  it('returns empty string for empty input', () => {
    expect(extractCleanText('')).toBe('');
  });

  it('strips HTML tags', () => {
    expect(extractCleanText('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('strips shortcodes before HTML tags', () => {
    const result = extractCleanText('[vc_row]<p>Clean</p>[/vc_row]');
    expect(result).toBe('Clean');
  });

  it('decodes &nbsp; to space', () => {
    const result = extractCleanText('Hello&nbsp;World');
    expect(result).toBe('Hello World');
  });

  it('decodes &amp;', () => {
    expect(extractCleanText('Fish &amp; Chips')).toBe('Fish & Chips');
  });

  it('decodes &lt; and &gt;', () => {
    expect(extractCleanText('&lt;tag&gt;')).toBe('<tag>');
  });

  it('decodes &quot;', () => {
    expect(extractCleanText('She said &quot;hello&quot;')).toBe('She said "hello"');
  });

  it('decodes &#039;', () => {
    expect(extractCleanText("It&#039;s fine")).toBe("It's fine");
  });

  it('collapses multiple spaces to single space', () => {
    expect(extractCleanText('too   many    spaces')).toBe('too many spaces');
  });

  it('trims leading and trailing whitespace', () => {
    expect(extractCleanText('  hello  ')).toBe('hello');
  });

  it('handles mixed HTML and shortcodes', () => {
    const input = '[vc_row]<h2>Title</h2><p>Body text here.</p>[/vc_row]';
    const result = extractCleanText(input);
    // Tags are replaced with empty string (not spaces), then whitespace collapsed
    expect(result).toBe('TitleBody text here.');
  });
});

// ─── hasVisualComposerContent ─────────────────────────────────────────────────

describe('hasVisualComposerContent', () => {
  it('returns true when content contains [vc_ pattern', () => {
    expect(hasVisualComposerContent('[vc_row]Content[/vc_row]')).toBe(true);
  });

  it('returns true for partial vc_ match', () => {
    expect(hasVisualComposerContent('Some text [vc_column]...')).toBe(true);
  });

  it('returns false for content without [vc_', () => {
    expect(hasVisualComposerContent('<p>Regular HTML</p>')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(hasVisualComposerContent('')).toBe(false);
  });

  it('returns false for content with other shortcodes', () => {
    expect(hasVisualComposerContent('[gallery ids="1"]')).toBe(false);
  });
});

// ─── cleanWordPressContent ────────────────────────────────────────────────────

describe('cleanWordPressContent', () => {
  it('returns empty string for empty input', () => {
    expect(cleanWordPressContent('')).toBe('');
  });

  it('strips shortcodes when VC content is detected', () => {
    const input = '[vc_row][vc_column]<p>Real content</p>[/vc_column][/vc_row]';
    const result = cleanWordPressContent(input);
    expect(result).not.toContain('[vc_');
    expect(result).toContain('Real content');
  });

  it('returns content as-is when no VC shortcodes present', () => {
    const html = '<p>Standard <strong>HTML</strong> content.</p>';
    expect(cleanWordPressContent(html)).toBe(html);
  });

  it('returns plain text as-is when no VC shortcodes', () => {
    expect(cleanWordPressContent('Plain text')).toBe('Plain text');
  });
});
