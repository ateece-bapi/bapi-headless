/**
 * sanitizeDescription.ts tests
 *
 * Tests the security-focused WordPress HTML sanitizer that prevents XSS,
 * validates URLs, and cleans up WordPress legacy markup.
 *
 * SECURITY focus:
 * - Event handlers (onclick, onerror, etc.) must be stripped
 * - javascript: / data: / vbscript: URLs must be blocked
 * - Encoded scheme bypasses (javascript&#58;, %6a%61vascript:) must be blocked
 * - script/style/iframe tags must be removed
 *
 * Content transformation:
 * - Pseudo-bullet paragraphs (• text<br/>) → <ul><li>
 * - CTA links gain class="cta-button"
 * - Empty tags removed
 * - WordPress classes/styles/data-* stripped
 */

import { describe, it, expect } from 'vitest';
import { sanitizeWordPressContent, sanitizeDescription } from '../sanitizeDescription';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Assert the output does NOT contain any of the given strings. */
function expectNone(html: string, ...forbidden: string[]) {
  const result = sanitizeWordPressContent(html);
  for (const f of forbidden) {
    expect(result, `should not contain: ${f}`).not.toContain(f);
  }
  return result;
}

// ─── Falsy input ──────────────────────────────────────────────────────────────

describe('sanitizeWordPressContent – falsy input', () => {
  it('returns empty string for empty string', () => {
    expect(sanitizeWordPressContent('')).toBe('');
  });

  // The function signature is (html: string) but the guard `if (!html)` still
  // handles falsy values passed at runtime.
  it('returns empty string for falsy value coerced at runtime', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(sanitizeWordPressContent(null as any)).toBe('');
  });
});

// ─── SECURITY: event handlers ─────────────────────────────────────────────────

describe('sanitizeWordPressContent – XSS: event handlers', () => {
  it('strips onclick attribute', () => {
    expectNone('<a href="/" onclick="alert(1)">click</a>', 'onclick', 'alert');
  });

  it('strips onerror on img', () => {
    expectNone('<img src="x" onerror="alert(1)">', 'onerror', 'alert');
  });

  it('strips onload on body', () => {
    expectNone('<div onload="evil()">text</div>', 'onload', 'evil');
  });

  it('strips onmouseover', () => {
    expectNone('<span onmouseover="steal()">hover</span>', 'onmouseover');
  });

  it('strips event handler with single-quoted value', () => {
    expectNone("<a href='/' onclick='bad()'>x</a>", 'onclick', 'bad');
  });

  it('strips event handler with unquoted value', () => {
    expectNone('<div onload=evil()>x</div>', 'onload', 'evil');
  });

  it('strips multiple event handlers on same element', () => {
    const result = expectNone(
      '<a href="/" onclick="a()" onmouseover="b()">x</a>',
      'onclick', 'onmouseover'
    );
    expect(result).toContain('href="/"');
    expect(result).toContain('x');
  });
});

// ─── SECURITY: dangerous tags ─────────────────────────────────────────────────

describe('sanitizeWordPressContent – XSS: dangerous tags', () => {
  it('removes script tags and their content', () => {
    expectNone('<p>Safe</p><script>alert("xss")</script>', 'script', 'alert', 'xss');
  });

  it('removes style tags', () => {
    expectNone('<style>body { color: red }</style><p>ok</p>', '<style', 'body { color');
  });

  it('removes iframe tags', () => {
    expectNone('<iframe src="https://evil.com"></iframe>', 'iframe');
  });

  it('removes video-container div', () => {
    expectNone('<div class="video-container"><video src="x"></video></div>', 'video-container');
  });

  it('preserves content after removing script tag', () => {
    const result = sanitizeWordPressContent('<script>bad()</script><p>Keep this</p>');
    expect(result).toContain('Keep this');
  });
});

// ─── SECURITY: URL validation ─────────────────────────────────────────────────

describe('sanitizeWordPressContent – XSS: URL validation on links', () => {
  it('allows http:// links', () => {
    const result = sanitizeWordPressContent('<a href="http://example.com">link</a>');
    expect(result).toContain('href="http://example.com"');
  });

  it('allows https:// links', () => {
    const result = sanitizeWordPressContent('<a href="https://example.com">link</a>');
    expect(result).toContain('href="https://example.com"');
  });

  it('allows relative links', () => {
    const result = sanitizeWordPressContent('<a href="/products/sensor">link</a>');
    expect(result).toContain('href="/products/sensor"');
  });

  it('allows fragment links', () => {
    const result = sanitizeWordPressContent('<a href="#section">jump</a>');
    expect(result).toContain('href="#section"');
  });

  it('allows mailto: links', () => {
    const result = sanitizeWordPressContent('<a href="mailto:info@example.com">email</a>');
    expect(result).toContain('href="mailto:');
  });

  it('allows tel: links', () => {
    const result = sanitizeWordPressContent('<a href="tel:+15555551234">call</a>');
    expect(result).toContain('href="tel:');
  });

  it('strips javascript: links, keeps text content', () => {
    const result = sanitizeWordPressContent('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain('javascript:');
    expect(result).not.toContain('alert');
    expect(result).toContain('click');
  });

  it('strips data: URL links', () => {
    const result = sanitizeWordPressContent('<a href="data:text/html,<script>evil()</script>">x</a>');
    expect(result).not.toContain('data:');
  });

  it('strips vbscript: links', () => {
    const result = sanitizeWordPressContent('<a href="vbscript:MsgBox(1)">x</a>');
    expect(result).not.toContain('vbscript:');
  });

  it('blocks encoded javascript: bypass (&#106;avascript:)', () => {
    const result = sanitizeWordPressContent('<a href="&#106;avascript:alert(1)">x</a>');
    expect(result).not.toContain('javascript:');
    expect(result).not.toContain('alert');
  });

  it('blocks percent-encoded javascript: bypass (%6a%61vascript:)', () => {
    const result = sanitizeWordPressContent('<a href="%6a%61vascript:alert(1)">x</a>');
    expect(result).not.toContain('javascript:');
    expect(result).not.toContain('alert');
  });

  it('blocks javascript: with leading whitespace/newline bypass', () => {
    const result = sanitizeWordPressContent('<a href="\njavascript:alert(1)">x</a>');
    expect(result).not.toContain('javascript:');
  });
});

// ─── SECURITY: URL validation on images ───────────────────────────────────────

describe('sanitizeWordPressContent – XSS: URL validation on images', () => {
  it('preserves img with valid https src', () => {
    const result = sanitizeWordPressContent('<img src="https://cdn.example.com/photo.jpg" alt="photo">');
    expect(result).toContain('src="https://cdn.example.com/photo.jpg"');
  });

  it('removes img with javascript: src', () => {
    const result = sanitizeWordPressContent('<img src="javascript:alert(1)" alt="x">');
    expect(result).not.toContain('javascript:');
    expect(result).not.toContain('<img');
  });

  it('removes img with data: src', () => {
    const result = sanitizeWordPressContent('<img src="data:image/svg+xml,<svg onload=alert(1)>" alt="x">');
    expect(result).not.toContain('data:');
    expect(result).not.toContain('<img');
  });
});

// ─── Attribute stripping ──────────────────────────────────────────────────────

describe('sanitizeWordPressContent – attribute stripping', () => {
  it('removes inline style attributes', () => {
    const result = sanitizeWordPressContent('<p style="color:red">text</p>');
    expect(result).not.toContain('style=');
    expect(result).toContain('text');
  });

  it('removes class attributes (non-iframe)', () => {
    const result = sanitizeWordPressContent('<div class="wp-block">text</div>');
    expect(result).not.toContain('class="wp-block"');
    expect(result).toContain('text');
  });

  it('removes data-* attributes', () => {
    const result = sanitizeWordPressContent('<p data-block-id="123">text</p>');
    expect(result).not.toContain('data-block-id');
  });

  it('removes color attribute', () => {
    const result = sanitizeWordPressContent('<font color="#ff0000">red</font>');
    expect(result).not.toContain('color=');
  });

  it('removes face attribute', () => {
    const result = sanitizeWordPressContent('<font face="Arial">text</font>');
    expect(result).not.toContain('face=');
  });

  it('strips WordPress id= attributes starting with wp-', () => {
    const result = sanitizeWordPressContent('<div id="wp-block-123">content</div>');
    expect(result).not.toContain('id="wp-');
  });
});

// ─── Bullet transformation ────────────────────────────────────────────────────

describe('sanitizeWordPressContent – bullet → list transformation', () => {
  it('converts • bullets in paragraph to <ul><li>', () => {
    const result = sanitizeWordPressContent('<p>• Item A<br/>• Item B<br/>• Item C</p>');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>Item A</li>');
    expect(result).toContain('<li>Item B</li>');
    expect(result).toContain('<li>Item C</li>');
    expect(result).not.toContain('•');
  });

  it('converts ● bullets', () => {
    const result = sanitizeWordPressContent('<p>● Alpha<br/>● Beta</p>');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>Alpha</li>');
  });

  it('leaves regular paragraphs unchanged (no bullets)', () => {
    const result = sanitizeWordPressContent('<p>Normal paragraph text here.</p>');
    expect(result).not.toContain('<ul>');
    expect(result).toContain('Normal paragraph text here.');
  });
});

// ─── CTA link detection ───────────────────────────────────────────────────────

describe('sanitizeWordPressContent – CTA link class', () => {
  it('adds cta-button class to links with CTA text', () => {
    const result = sanitizeWordPressContent('<a href="/products">Learn More</a>');
    expect(result).toContain('cta-button');
  });

  it('adds cta-button class to "Download" links', () => {
    const result = sanitizeWordPressContent('<a href="/doc.pdf">Download</a>');
    expect(result).toContain('cta-button');
  });

  it('does not add cta-button class to regular links', () => {
    const result = sanitizeWordPressContent('<a href="/page">Read the article</a>');
    expect(result).not.toContain('cta-button');
  });

  it('links wrapping images get target=_blank but not cta-button', () => {
    const result = sanitizeWordPressContent(
      '<a href="https://example.com"><img src="logo.png" alt="logo"></a>'
    );
    expect(result).toContain('target="_blank"');
    expect(result).not.toContain('cta-button');
  });
});

// ─── Empty tag removal ────────────────────────────────────────────────────────

describe('sanitizeWordPressContent – empty tag removal', () => {
  it('removes empty <p> tags', () => {
    const result = sanitizeWordPressContent('<p></p><p>content</p>');
    expect(result).not.toContain('<p></p>');
    expect(result).toContain('content');
  });

  it('removes whitespace-only <p> tags', () => {
    const result = sanitizeWordPressContent('<p>   </p><p>real</p>');
    expect(result).toContain('real');
  });
});

// ─── Structure preservation ───────────────────────────────────────────────────

describe('sanitizeWordPressContent – structure preservation', () => {
  it('preserves headings', () => {
    const result = sanitizeWordPressContent('<h2>Section Title</h2>');
    expect(result).toContain('<h2>Section Title</h2>');
  });

  it('preserves strong and em tags', () => {
    const result = sanitizeWordPressContent('<p><strong>Bold</strong> and <em>italic</em></p>');
    expect(result).toContain('<strong>Bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });

  it('preserves ordered lists', () => {
    const result = sanitizeWordPressContent('<ol><li>Step 1</li><li>Step 2</li></ol>');
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>Step 1</li>');
  });
});

// ─── sanitizeDescription alias ────────────────────────────────────────────────

describe('sanitizeDescription (alias)', () => {
  it('is the exact same function reference as sanitizeWordPressContent', () => {
    expect(sanitizeDescription).toBe(sanitizeWordPressContent);
  });
});
