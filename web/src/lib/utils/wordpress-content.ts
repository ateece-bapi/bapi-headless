/**
 * WordPress Content Cleaning Utilities
 * Remove Visual Composer/WP Bakery and other shortcodes from content
 */

/**
 * Remove all WordPress shortcodes from content
 */
export function stripShortcodes(content: string): string {
  if (!content) return '';

  // Remove all shortcode tags like [vc_row], [/vc_column], etc.
  let cleaned = content.replace(/\[vc_[^\]]*\]/g, '');
  cleaned = cleaned.replace(/\[\/vc_[^\]]*\]/g, '');

  // Remove other common page builder shortcodes
  cleaned = cleaned.replace(/\[\/?et_pb_[^\]]*\]/g, ''); // Divi
  cleaned = cleaned.replace(/\[\/?fusion_[^\]]*\]/g, ''); // Fusion Builder
  cleaned = cleaned.replace(/\[\/?elementor[^\]]*\]/g, ''); // Elementor

  // Remove general shortcode pattern [shortcode]...[/shortcode]
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '');

  // Clean up excessive whitespace and newlines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Extract clean text content, removing HTML tags and shortcodes
 */
export function extractCleanText(content: string): string {
  if (!content) return '';

  // First strip shortcodes
  let cleaned = stripShortcodes(content);

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  // Clean up whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Check if content contains Visual Composer shortcodes
 */
export function hasVisualComposerContent(content: string): boolean {
  return /\[vc_/.test(content);
}

/**
 * Clean WordPress content for display
 * Removes shortcodes while preserving HTML structure
 */
export function cleanWordPressContent(content: string): string {
  if (!content) return '';

  // Check if content has Visual Composer shortcodes
  if (hasVisualComposerContent(content)) {
    // Strip all shortcodes
    return stripShortcodes(content);
  }

  // If no VC shortcodes, return as-is (may have valid HTML)
  return content;
}
