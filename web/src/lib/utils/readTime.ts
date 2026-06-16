/**
 * Utility function to calculate estimated reading time for text content
 * 
 * Based on industry standard: Average adult reading speed is 200-250 words per minute
 * For technical B2B content, we use 200 WPM (more conservative)
 */

/**
 * Calculate estimated reading time in minutes
 * @param content - HTML content string (may contain tags)
 * @param wordsPerMinute - Reading speed (default: 200 for technical content)
 * @returns Estimated minutes to read (minimum 1 minute)
 */
export function calculateReadTime(content: string, wordsPerMinute: number = 200): number {
  if (!content || content.trim().length === 0) {
    return 1;
  }

  // Strip HTML tags to get plain text
  const plainText = content.replace(/<[^>]+>/g, ' ');
  
  // Split by whitespace and filter out empty strings
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  
  // Calculate minutes (round up to nearest minute, minimum 1)
  const minutes = Math.ceil(words.length / wordsPerMinute);
  
  return Math.max(1, minutes);
}

/**
 * Format read time for display
 * @param minutes - Number of minutes
 * @returns Formatted string (e.g., "5 min read", "1 min read")
 */
export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

/**
 * Get category color for badge styling
 * Industry-standard B2B color coding
 */
export function getCategoryColor(categoryName: string): string {
  const category = categoryName.toLowerCase();
  
  // BAPI-specific category colors
  if (category.includes('product') || category.includes('announcement')) {
    return 'bg-accent-500 text-neutral-900'; // Yellow for products
  }
  
  if (category.includes('news') || category.includes('industry')) {
    return 'bg-primary-500 text-white'; // Blue for news
  }
  
  if (category.includes('technical') || category.includes('case stud')) {
    return 'bg-neutral-500 text-white'; // Gray for technical
  }
  
  if (category.includes('event') || category.includes('webinar')) {
    return 'bg-green-500 text-white'; // Green for events
  }
  
  // Default
  return 'bg-neutral-200 text-neutral-900';
}
