/**
 * Customer Group Product Filtering Utilities
 *
 * Filters products based on customer group restrictions for B2B access control.
 *
 * Business Rules:
 * - Products with (ALC), (ACS), (EMC), (CCG), (CCGA) prefixes in title are restricted
 * - Restricted products only visible to users in matching customer groups
 * - Standard products (no prefix) visible to all users including guests
 *
 * @module lib/utils/filterProductsByCustomerGroup
 * @see docs/CUSTOMER-GROUP-FILTERING.md
 */

import { slugify } from './slugify';

/**
 * Product type with customer group fields (from GraphQL)
 * 
 * Uses ACF fields customerGroup1/2/3 from WordPress GraphQL schema.
 * Falls back to title parsing for backwards compatibility if ACF fields missing.
 */
export interface ProductWithCustomerGroup {
  name?: string | null;
  customerGroup1?: string | null;
  customerGroup2?: string | null;
  customerGroup3?: string | null;
}

/**
 * Extract customer group from product title prefix
 *
 * @param productName - Product name/title (may be null or undefined)
 * @returns Lowercase customer group code or null
 *
 * @example
 * extractCustomerGroupFromTitle("(ALC) BAPI-Stat 4") // returns "alc"
 * extractCustomerGroupFromTitle("CCG/H205-B4X-Z-CG-WMW") // returns "ccg"
 * extractCustomerGroupFromTitle("BA/10K-3 Temperature Sensor") // returns null
 */
export function extractCustomerGroupFromTitle(
  productName: string | null | undefined
): string | null {
  if (!productName) return null;

  // Match pattern 1: (PREFIX) with parentheses - e.g., "(ALC) BAPI-Stat 4"
  let match = productName.match(/^\((\w+)\)/);
  if (match) {
    const prefix = match[1].toLowerCase();
    const validGroups = ['alc', 'acs', 'emc', 'ccg', 'ccga'];
    return validGroups.includes(prefix) ? prefix : null;
  }

  // Match pattern 2: PREFIX/ with slash - e.g., "CCG/H205-B4X-Z-CG-WMW"
  // Supports both 3-letter (CCG) and 4-letter (CCGA) prefixes
  match = productName.match(/^([A-Z]{3,4})\//);
  if (match) {
    const prefix = match[1].toLowerCase();
    const validGroups = ['alc', 'acs', 'emc', 'ccg', 'ccga'];
    return validGroups.includes(prefix) ? prefix : null;
  }

  return null;
}

/**
 * Get all customer groups assigned to a product
 *
 * Prioritizes ACF fields (customerGroup1/2/3), falls back to title parsing.
 * Implements hybrid approach for robustness.
 *
 * @param product - Product with name and optional customerGroup ACF fields
 * @returns Array of customer group slugs (lowercase)
 */
export function getProductCustomerGroups(product: ProductWithCustomerGroup): string[] {
  const groups: string[] = [];

  // Priority 1: Use ACF fields from GraphQL (proper implementation)
  const acfGroups = [
    product.customerGroup1,
    product.customerGroup2,
    product.customerGroup3,
  ]
    .filter((group): group is string => typeof group === 'string')
    .map((group) => group.trim())
    .filter((group) => group.length > 0);

  if (acfGroups.length > 0) {
    groups.push(...acfGroups.map((g) => g.toLowerCase()));
  }

  // Priority 2: Fallback to title parsing (defensive programming)
  if (groups.length === 0) {
    const groupFromTitle = extractCustomerGroupFromTitle(product.name);
    if (groupFromTitle) {
      groups.push(groupFromTitle);
    }
  }

  // Normalize to lowercase and deduplicate
  return [...new Set(groups.map((g) => g.toLowerCase()))];
}

/**
 * Check if user can view a product based on customer group rules
 *
 * Matches legacy WordPress behavior:
 * - Guest users default to ['end-user'] group
 * - Products WITHOUT customer-group taxonomy are visible to ALL users (no restrictions)
 * - Products WITH customer-group taxonomy are visible only to users with matching groups
 * - User can see product if they have ANY matching group (OR logic)
 *
 * @param product - Product to check
 * @param userCustomerGroups - User's customer groups array (defaults to ['end-user'] for guests)
 * @returns true if user can view product
 */
export function canUserViewProduct(
  product: ProductWithCustomerGroup,
  userCustomerGroups: string[] = ['end-user']
): boolean {
  const productGroups = getProductCustomerGroups(product);

  // Public product (no customer group restrictions) - visible to ALL users
  if (productGroups.length === 0) {
    return true;
  }

  // Product has restrictions - check if user has any matching group
  // Slugify both sides to ensure consistent comparison
  // (handles "END USER" from ACF vs "end-user" from taxonomy)
  const slugifiedUserGroups = userCustomerGroups.map(g => slugify(g));
  const slugifiedProductGroups = productGroups.map(g => slugify(g));

  // User can see product if they have ANY matching group
  return slugifiedUserGroups.some(ug => slugifiedProductGroups.includes(ug));
}

/**
 * Filter array of products based on user's customer groups
 *
 * @param products - Array of products to filter
 * @param userCustomerGroups - User's customer groups array (defaults to ['end-user'] for guests)
 * @returns Filtered array of products user can view
 *
 * @example
 * // Guest user - sees public products + 'end-user' restricted products
 * filterProductsByCustomerGroup(allProducts, ['end-user'])
 *
 * // ALC user - sees public + ALC products
 * filterProductsByCustomerGroup(allProducts, ['alc'])
 *
 * // Multi-group user - sees public + ALC + ACS products
 * filterProductsByCustomerGroup(allProducts, ['end-user', 'alc', 'acs'])
 */
export function filterProductsByCustomerGroup<T extends ProductWithCustomerGroup>(
  products: T[],
  userCustomerGroups: string[] = ['end-user']
): T[] {
  return products.filter((product) => canUserViewProduct(product, userCustomerGroups));
}

/**
 * Get product count by customer group for analytics/debugging
 *
 * @param products - Array of products
 * @returns Object with counts by group
 */
export function getProductCountsByGroup(
  products: ProductWithCustomerGroup[]
): Record<string, number> {
  const counts: Record<string, number> = {
    public: 0,
    alc: 0,
    acs: 0,
    emc: 0,
    ccg: 0,
    ccga: 0,
  };

  products.forEach((product) => {
    const groups = getProductCustomerGroups(product);
    if (groups.length === 0) {
      counts.public++;
    } else {
      groups.forEach((group) => {
        if (counts[group] !== undefined) {
          counts[group]++;
        }
      });
    }
  });

  return counts;
}
