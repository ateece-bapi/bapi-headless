/**
 * HTML Sanitization Utilities
 * 
 * WordPress GraphQL API returns pre-sanitized content (excerpts, descriptions)
 * using WordPress's internal sanitization (wp_kses, sanitize_text_field, etc.).
 * 
 * These helpers provide additional client-side sanitization for defense-in-depth.
 */

/**
 * Sanitizes HTML content from WordPress.
 * 
 * Removes WordPress-specific classes and inline styles that interfere with Tailwind prose styling.
 * WordPress GraphQL already sanitizes content on the backend for security.
 * This function provides additional cleanup for styling compatibility.
 * 
 * @param html - HTML string from WordPress (excerpt, description, etc.)
 * @returns Cleaned HTML string without WordPress classes/styles
 */
export function sanitizeWordPressContent(html: string | null | undefined): string {
  if (!html) return '';
  
  // Remove all class attributes
  let cleaned = html.replace(/\s+class="[^"]*"/gi, '');
  
  // Remove all inline style attributes
  cleaned = cleaned.replace(/\s+style="[^"]*"/gi, '');
  
  // Remove all id attributes
  cleaned = cleaned.replace(/\s+id="[^"]*"/gi, '');
  
  // Remove bare WordPress attributes (overflow, etc.) - attributes without values
  cleaned = cleaned.replace(/\s+(overflow|align|valign|bgcolor|width|height|border|cellpadding|cellspacing)(?=[\s>])/gi, '');
  
  // Add max-width constraint to images to prevent overflow
  // This happens AFTER removing WordPress styles, so we add back just this specific style
  cleaned = cleaned.replace(/<img(\s+[^>]*?)>/gi, (match, attrs) => {
    // If img already has style attribute, append to it; otherwise add new one
    if (attrs.includes('style=')) {
      return match.replace(/style="([^"]*)"/i, 'style="$1; max-width: 100%; height: auto;"');
    } else {
      return `<img${attrs} style="max-width: 100%; height: auto;">`;
    }
  });
  
  // Clean up any double spaces created by removals
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Clean up space before closing tags
  cleaned = cleaned.replace(/\s+>/g, '>');
  
  return cleaned;
}

/**
 * Strips all HTML tags from a string.
 * Use this when you need plain text only.
 * 
 * @param html - HTML string
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}
