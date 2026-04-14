/**
 * Sanitize WordPress content HTML
 * Strips dangerous tags, inline styles, and WordPress-specific classes
 * Preserves semantic HTML structure for proper formatting
 */
export function sanitizeWordPressContent(html: string): string {
  if (!html) return '';

  let cleaned = html;

  // 1. Remove dangerous tags and embedded media (videos belong in Videos tab, not description)
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, ''); // Remove embedded videos
  cleaned = cleaned.replace(/<div[^>]*video-container[^>]*>[\s\S]*?<\/div>/gi, ''); // Remove video wrapper divs

  // 2. Remove ALL inline style attributes (WordPress legacy styling)
  cleaned = cleaned.replace(/\sstyle="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\sstyle='[^']*'/gi, '');

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

  // 6. Clean image tags (preserve src and alt, remove WordPress classes)
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
      
      if (src) {
        let attrs = `src="${src}" alt="${alt}"`;
        if (width) attrs += ` width="${width}"`;
        if (height) attrs += ` height="${height}"`;
        return `<img ${attrs}>`;
      }
      return match;
    }
  );

  // 7. Convert button-like links to semantic CTA buttons
  cleaned = cleaned.replace(/<a\s+([^>]*?)>(.*?)<\/a>/gi, (match, attrs, content) => {
    // Skip if content contains an image
    if (/<img/i.test(content)) {
      // Extract href and preserve image links as-is
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
      const href = hrefMatch ? hrefMatch[1] : '#';
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }

    // Extract href (only attribute we keep)
    const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1] : '#';

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
