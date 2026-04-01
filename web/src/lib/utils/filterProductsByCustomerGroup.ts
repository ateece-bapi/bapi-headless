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

/**
 * Product type with customer group fields (from GraphQL)
 * Also supports title-based parsing as a fallback when customerGroup fields
 * are not included in specific product queries or are not populated in WP yet.
 */
export interface ProductWithCustomerGroup {
  name?: string | null;
  customerGroup1?: Array<string | null> | null;
  customerGroup2?: Array<string | null> | null;
  customerGroup3?: Array<string | null> | null;
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
 * Checks both GraphQL fields (when available) and title prefix (fallback)
 *
 * @param product - Product with name and optional customerGroup fields
 * @returns Array of customer group codes
 */
export function getProductCustomerGroups(product: ProductWithCustomerGroup): string[] {
  const groups: string[] = [];

  // Try GraphQL fields first (when schema is updated)
  if (product.customerGroup1?.length) {
    groups.push(...product.customerGroup1.filter((g): g is string => g !== null));
  }
  if (product.customerGroup2?.length) {
    groups.push(...product.customerGroup2.filter((g): g is string => g !== null));
  }
  if (product.customerGroup3?.length) {
    groups.push(...product.customerGroup3.filter((g): g is string => g !== null));
  }

  // Fallback: parse from title if no GraphQL data
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
 * @param product - Product to check
 * @param userCustomerGroup - User's customer group (null for guests)
 * @returns true if user can view product
 */
export function canUserViewProduct(
  product: ProductWithCustomerGroup,
  userCustomerGroup: string | null | undefined
): boolean {
  const productGroups = getProductCustomerGroups(product);

  // Public product (no customer group restrictions)
  if (productGroups.length === 0) {
    return true;
  }

  // Restricted product, but user has no customer group (guest)
  if (!userCustomerGroup) {
    return false;
  }

  // Check if user's group matches any product group (case-insensitive)
  const normalizedUserGroup = userCustomerGroup.toLowerCase();
  return productGroups.includes(normalizedUserGroup);
}

/**
 * Filter array of products based on user's customer group
 *
 * @param products - Array of products to filter
 * @param userCustomerGroup - User's customer group (null for guests)
 * @returns Filtered array of products user can view
 *
 * @example
 * // Guest user - only sees public products
 * filterProductsByCustomerGroup(allProducts, null)
 *
 * // ALC user - sees public + ALC products
 * filterProductsByCustomerGroup(allProducts, 'alc')
 */
export function filterProductsByCustomerGroup<T extends ProductWithCustomerGroup>(
  products: T[],
  userCustomerGroup: string | null | undefined
): T[] {
  return products.filter((product) => canUserViewProduct(product, userCustomerGroup));
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
