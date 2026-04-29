/**
 * Sanitize WordPress content HTML
 * Strips dangerous tags, inline styles, and WordPress-specific classes
 * Preserves semantic HTML structure for proper formatting
 * 
 * SECURITY: Protects against XSS by:
 * - Stripping all event handlers (onclick, onerror, etc.)
 * - Validating URL protocols (blocks javascript:, data:, vbscript:)
 * - Removing script/style tags
 * - Sanitizing all attributes
 */

/**
 * Decode a minimal set of HTML entities before URL validation so encoded
 * schemes like `javascript&#58;` cannot bypass protocol checks.
 */
function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(?:#(\d+)|#x([0-9a-fA-F]+)|colon|tab|newline|nbsp);/gi,
    (match, decimal, hex, named) => {
      if (decimal) {
        return String.fromCodePoint(Number.parseInt(decimal, 10));
      }

      if (hex) {
        return String.fromCodePoint(Number.parseInt(hex, 16));
      }

      switch (match.toLowerCase()) {
        case '&colon;':
          return ':';
        case '&tab;':
          return '\t';
        case '&newline;':
          return '\n';
        case '&nbsp;':
          return ' ';
        default:
          return match;
      }
    }
  );
}

/**
 * Normalize URL input to match how browsers interpret obfuscated schemes.
 * - trims outer whitespace
 * - decodes HTML entities
 * - strips ASCII control chars and whitespace
 */
function normalizeUrlForValidation(url: string): string {
  return decodeHtmlEntities(url.trim())
    .replace(/[\u0000-\u001F\u007F\s]+/g, '')
    .toLowerCase();
}

/**
 * Validate URL protocol to prevent XSS attacks.
 * Allows only safe schemes plus relative, query-only, and fragment URLs.
 */
function isValidUrl(url: string): boolean {
  if (!url) return false;

  const normalized = normalizeUrlForValidation(url);
  if (!normalized) return false;

  // Allow fragment, query-only, root-relative, and dot-relative URLs.
  if (
    normalized.startsWith('#') ||
    normalized.startsWith('?') ||
    normalized.startsWith('/') ||
    normalized.startsWith('./') ||
    normalized.startsWith('../')
  ) {
    return true;
  }

  const schemeMatch = normalized.match(/^([a-z][a-z0-9+.-]*):/);  
  if (!schemeMatch) {
    // No explicit scheme: treat as a relative URL such as `products/item`.
    return true;
  }

  const allowedProtocols = new Set(['http', 'https', 'mailto', 'tel']);
  return allowedProtocols.has(schemeMatch[1]);
}

/**
 * Transform pseudo-bullets (• text<br />) into proper HTML lists
 * WordPress often stores bulleted content as plain text with bullet characters
 */
function transformBulletsToLists(html: string): string {
  // Match paragraphs containing bullet points (• text<br /> pattern),
  // including WordPress/Gutenberg paragraphs with attributes.
  return html.replace(
    /<p\b[^>]*>((?:•[^<]*(?:<br\s*\/?>)?[\s\n]*)+)<\/p>/gi,
    (match, bulletContent) => {
      // Split on bullet character and filter empty items
      const items = bulletContent
        .split(/•/)
        .map((item: string) => item.replace(/<br\s*\/?>/gi, '').trim())
        .filter((item: string) => item.length > 0);

      if (items.length === 0) return match;

      // Convert to proper HTML list
      const listItems = items.map((item: string) => `  <li>${item}</li>`).join('\n');
      return `<ul>\n${listItems}\n</ul>`;
    }
  );
}

export function sanitizeWordPressContent(html: string): string {
  if (!html) return '';

  let cleaned = html;

  // 0. Transform pseudo-bullets (• text<br />) into proper HTML lists
  cleaned = transformBulletsToLists(cleaned);

  // 1. Remove dangerous tags and embedded media (videos belong in Videos tab, not description)
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, ''); // Remove embedded videos
  cleaned = cleaned.replace(/<div[^>]*video-container[^>]*>[\s\S]*?<\/div>/gi, ''); // Remove video wrapper divs

  // 2. Remove ALL inline style attributes (WordPress legacy styling)
  cleaned = cleaned.replace(/\sstyle="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\sstyle='[^']*'/gi, '');

  // 3. SECURITY: Remove all event handler attributes (onclick, onerror, onload, etc.) to prevent XSS
  // Handles optional whitespace around "=" and quoted or unquoted attribute values
  cleaned = cleaned.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Remove ALL class attributes EXCEPT iframe (needed for aspect ratio)
  cleaned = cleaned.replace(/<(?!iframe)(\w+)([^>]*)\sclass="[^"]*"/gi, '<$1$2');
  cleaned = cleaned.replace(/<(?!iframe)(\w+)([^>]*)\sclass='[^']*'/gi, '<$1$2');

  // 4. Remove WordPress-specific attributes
  cleaned = cleaned.replace(/\sdata-[^=]*="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\sid="wp-[^"]*"/gi, '');
  cleaned = cleaned.replace(/\salign(none|left|right|center)"/gi, '');

  // 5. Remove color/font attributes (legacy HTML)
  cleaned = cleaned.replace(/\scolor="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\sface="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\ssize="[^"]*"/gi, '');

  // 6. Clean image tags (preserve src and alt, validate URLs)
  cleaned = cleaned.replace(
    /<img([^>]*)>/gi,
    (match, attrs) => {
      const srcMatch = attrs.match(/src=["']([^"']*)["']/i);
      const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
      const widthMatch = attrs.match(/width=["']([^"']*)["']/i);
      const heightMatch = attrs.match(/height=["']([^"']*)["']/i);
      
      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      const width = widthMatch ? widthMatch[1] : '';
      const height = heightMatch ? heightMatch[1] : '';
      
      // SECURITY: Validate URL protocol
      if (src && isValidUrl(src)) {
        let attrs = `src="${src}" alt="${alt}"`;
        if (width) attrs += ` width="${width}"`;
        if (height) attrs += ` height="${height}"`;
        return `<img ${attrs}>`;
      }
      // Block images with invalid/dangerous URLs
      return '';
    }
  );

  // 7. Convert button-like links to semantic CTA buttons (validate URLs for security)
  cleaned = cleaned.replace(/<a\s+([^>]*?)>(.*?)<\/a>/gi, (match, attrs, content) => {
    // Extract href
    const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1] : '#';
    
    // SECURITY: Validate URL protocol - block dangerous protocols
    if (!isValidUrl(href)) {
      // Strip dangerous links, keep content as plain text
      return content.trim();
    }
    
    // Skip if content contains an image
    if (/<img/i.test(content)) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }

    // Detect if this is a CTA button based on content
    const isCTA = /download|configure|learn more|get started|buy now|shop|view|explore/i.test(
      content
    );

    if (isCTA) {
      return `<a href="${href}" class="cta-button" target="_blank" rel="noopener noreferrer">${content.trim()}</a>`;
    }

    // Regular link
    return `<a href="${href}">${content.trim()}</a>`;
  });

  // 8. Clean up excessive whitespace (preserve structure)
  cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n'); // Multiple blank lines to double newline
  cleaned = cleaned.replace(/[ \t]+/g, ' '); // Multiple spaces/tabs to single space
  // Only collapse whitespace between tags if not in lists or paragraphs
  cleaned = cleaned.replace(/(<\/(?:li|p|h[1-6])>)\s+(<(?:li|p|h[1-6]|ul|ol|hr))/gi, '$1\n$2');
  
  // 9. Remove truly empty tags
  cleaned = cleaned.replace(/<(p|div|span)[^>]*>\s*<\/\1>/gi, '');
  
  // 10. Normalize list structure (ensure proper spacing)
  cleaned = cleaned.replace(/<ul>/gi, '<ul>\n');
  cleaned = cleaned.replace(/<\/ul>/gi, '\n</ul>');
  cleaned = cleaned.replace(/<ol>/gi, '<ol>\n');
  cleaned = cleaned.replace(/<\/ol>/gi, '\n</ol>');
  cleaned = cleaned.replace(/<li>/gi, '<li>');
  cleaned = cleaned.replace(/<\/li>/gi, '</li>\n');

  return cleaned.trim();
}

// Alias for backward compatibility
export const sanitizeDescription = sanitizeWordPressContent;
