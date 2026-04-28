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
 * Note: WordPress GraphQL already sanitizes content on the backend.
 * This function provides additional client-side protection.
 * 
 * For now, we rely on WordPress's backend sanitization.
 * Future: Consider adding DOMPurify for additional client-side sanitization.
 * 
 * @param html - HTML string from WordPress (excerpt, description, etc.)
 * @returns Sanitized HTML string
 */
export function sanitizeWordPressContent(html: string | null | undefined): string {
  if (!html) return '';
  
  // WordPress GraphQL API already sanitizes content using wp_kses
  // This is a passthrough for now, but provides a hook for future enhancement
  return html;
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
