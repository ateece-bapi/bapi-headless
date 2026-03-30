/**
 * Utility functions for matching product variations based on selected attributes
 */

import type { ProductVariation, SelectedAttributes } from '@/types/variations';

/**
 * Maximum number of variations to fetch from GraphQL
 * This constant is referenced in products.graphql query: variations(first: MAX_VARIATIONS)
 */
export const MAX_VARIATIONS = 500;

/**
 * Normalizes attribute names to slug format for consistent matching
 * Must handle special characters (°, commas, etc.) to match WooCommerce slugs
 *
 * @param name - Attribute name to normalize (e.g., "°F Or °C Display")
 * @returns Normalized slug (e.g., "f-or-c-display")
 *
 * @example
 * ```ts
 * normalizeAttributeSlug("°F Or °C Display") // "f-or-c-display"
 * normalizeAttributeSlug("Ground Configuration, Comm Jack, Test And Balance") // "ground-configuration-comm-jack-test-and-balance"
 * ```
 */
export function normalizeAttributeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[°,]/g, '') // Remove special characters (degree symbol, commas)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Finds the variation that matches the selected attributes
 *
 * @param variations - Array of all product variations
 * @param selectedAttributes - Object mapping attribute names to selected values
 * @returns Matching variation or null if no match found
 *
 * @example
 * ```ts
 * const selected = {
 *   "pressure-range": "Standard Range (10 ranges from -5 to +5 WC)",
 *   "display": "Display",
 *   "static-pressure-tube": "Included 6\" Static Pressure Tube Assembly"
 * };
 * const variation = findMatchingVariation(variations, selected);
 * ```
 */
export function findMatchingVariation(
  variations: ProductVariation[],
  selectedAttributes: SelectedAttributes
): ProductVariation | null {
  // Find variation where ALL attributes match
  return (
    variations.find((variation) => {
      const varAttrs = variation.attributes.nodes;

      // Check if this variation matches all selected attributes
      return varAttrs.every((attr) => {
        const selectedValue = selectedAttributes[attr.name];
        return selectedValue === attr.value;
      });
    }) || null
  );
}

/**
 * Checks if all required attributes have been selected
 *
 * @param attributeNames - Array of attribute names to check
 * @param selectedAttributes - Object mapping attribute names to selected values
 * @returns True if all attributes that are used for variations have been selected
 */
export function areAllAttributesSelected(
  attributeNames: string[],
  selectedAttributes: SelectedAttributes
): boolean {
  return attributeNames.every((name) => {
    return selectedAttributes[name] !== undefined && selectedAttributes[name] !== '';
  });
}

/**
 * Gets the available options for an attribute based on current selections
 * (For future enhancement: disable options that don't have valid combinations)
 *
 * @param attributeName - The attribute to get options for
 * @param variations - All product variations
 * @param currentSelections - Currently selected attributes
 * @returns Array of available option values
 */
export function getAvailableOptions(
  attributeName: string,
  variations: ProductVariation[],
  currentSelections: SelectedAttributes
): string[] {
  // Get all variations that match the current selections (excluding the attribute we're checking)
  const otherSelections = Object.entries(currentSelections).filter(
    ([key]) => key !== attributeName
  );

  if (otherSelections.length === 0) {
    // No other selections, return all options from all variations
    const options = new Set<string>();
    variations.forEach((variation) => {
      const attr = variation.attributes.nodes.find((a) => a.name === attributeName);
      if (attr?.value) {
        options.add(attr.value);
      }
    });
    return Array.from(options);
  }

  // Filter variations that match other selections
  const matchingVariations = variations.filter((variation) => {
    return otherSelections.every(([key, value]) => {
      const attr = variation.attributes.nodes.find((a) => a.name === key);
      return attr?.value === value;
    });
  });

  // Get unique options from matching variations
  // FIX #5: Preserve insertion order rather than using Set (which can reorder)
  // This maintains consistent UI option ordering across renders
  const seenOptions = new Set<string>();
  const orderedOptions: string[] = [];

  matchingVariations.forEach((variation) => {
    const attr = variation.attributes.nodes.find((a) => a.name === attributeName);
    if (attr?.value && !seenOptions.has(attr.value)) {
      seenOptions.add(attr.value);
      orderedOptions.push(attr.value);
    }
  });

  return orderedOptions;
}
