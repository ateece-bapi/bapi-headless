/**
 * Sanitize WordPress content HTML
 * Strips ALL inline styles, WordPress classes, and legacy formatting
 * Applies clean, modern BAPI styling principles
 */
export function sanitizeWordPressContent(html: string): string {
  if (!html) return '';
  
  let cleaned = html;
  
  // 1. Remove ALL inline style attributes (WordPress legacy styling)
  cleaned = cleaned.replace(/\sstyle="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\sstyle='[^']*'/gi, '');
  
  // 2. Remove ALL class attributes (WordPress-specific classes)
  cleaned = cleaned.replace(/\sclass="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\sclass='[^']*'/gi, '');
  
  // 3. Remove WordPress-specific attributes
  cleaned = cleaned.replace(/\sdata-[^=]*="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\sid="wp-[^"]*"/gi, '');
  
  // 4. Remove color/font attributes (legacy HTML)
  cleaned = cleaned.replace(/\scolor="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\sface="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\ssize="[^"]*"/gi, '');
  
  // 5. Convert button-like links to semantic CTA buttons
  cleaned = cleaned.replace(
    /<a\s+([^>]*?)>(.*?)<\/a>/gi,
    (match, attrs, content) => {
      // Extract href (only attribute we keep)
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
      const href = hrefMatch ? hrefMatch[1] : '#';
      
      // Detect if this is a CTA button based on content
      const isCTA = /download|configure|learn more|get started|buy now|shop|view|explore/i.test(content);
      
      if (isCTA) {
        return `<a href="${href}" class="cta-button" target="_blank" rel="noopener noreferrer">${content.trim()}</a>`;
      }
      
      // Regular link
      return `<a href="${href}">${content.trim()}</a>`;
    }
  );
  
  // 6. Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/>\s+</g, '><');
  
  // 7. Remove empty tags
  cleaned = cleaned.replace(/<(\w+)[^>]*>\s*<\/\1>/gi, '');
  
  return cleaned.trim();
}

// Alias for backward compatibility
export const sanitizeDescription = sanitizeWordPressContent;
