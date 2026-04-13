/**
 * Converts a string to a URL-friendly slug format.
 * 
 * This utility normalizes customer group names from ACF fields (display names like "END USER")
 * to match WordPress taxonomy slugs (like "end-user").
 * 
 * @param str - The string to slugify
 * @returns A lowercase, hyphenated slug
 * 
 * @example
 * ```typescript
 * slugify("END USER")    // "end-user"
 * slugify("ALC")         // "alc"
 * slugify("  ACS  ")     // "acs"
 * slugify("Buy Resell")  // "buy-resell"
 * slugify("")            // ""
 * ```
 */
export function slugify(str: string): string {
  return str
    .trim()                    // Remove leading/trailing whitespace
    .toLowerCase()             // Convert to lowercase
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/[^\w-]/g, '')    // Remove non-word characters except hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

/**
 * Slugifies an array of customer group strings.
 * Filters out null/undefined values and returns unique slugs.
 * 
 * @param groups - Array of customer group strings (may contain null/undefined)
 * @returns Array of unique slugified strings
 * 
 * @example
 * ```typescript
 * slugifyArray(["END USER", "ALC", null])     // ["end-user", "alc"]
 * slugifyArray(["  ACS  ", "ACS", "end user"]) // ["acs", "end-user"]
 * ```
 */
export function slugifyArray(groups: (string | null | undefined)[]): string[] {
  return Array.from(
    new Set(
      groups
        .filter((g): g is string => typeof g === 'string' && g.length > 0)
        .map(slugify)
        .filter(slug => slug.length > 0) // Remove empty strings after slugification
    )
  );
}
