/**
 * Variation Utilities - Unit Tests
 *
 * Tests smart filtering, attribute normalization, and variation matching logic.
 * Addresses Copilot PR review comments #2, #3, #7, #8.
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeAttributeSlug,
  findMatchingVariation,
  areAllAttributesSelected,
  getAvailableOptions,
  MAX_VARIATIONS,
} from '../variations';
import type { ProductVariation, SelectedAttributes } from '@/types/variations';

describe('Variation Utilities', () => {
  describe('normalizeAttributeSlug', () => {
    it('converts basic strings to slugs', () => {
      expect(normalizeAttributeSlug('Display')).toBe('display');
      expect(normalizeAttributeSlug('Pressure Range')).toBe('pressure-range');
      expect(normalizeAttributeSlug('Static Pressure Tube')).toBe('static-pressure-tube');
    });

    it('handles special characters - degree symbol', () => {
      expect(normalizeAttributeSlug('°F Or °C Display')).toBe('f-or-c-display');
      expect(normalizeAttributeSlug('Temperature °F')).toBe('temperature-f');
    });

    it('handles special characters - commas', () => {
      expect(normalizeAttributeSlug('Ground Configuration, Comm Jack, Test And Balance')).toBe(
        'ground-configuration-comm-jack-test-and-balance'
      );
      expect(normalizeAttributeSlug('Option A, B, C')).toBe('option-a-b-c');
    });

    it('handles multiple spaces', () => {
      expect(normalizeAttributeSlug('Multiple   Spaces   Here')).toBe('multiple-spaces-here');
    });

    it('handles leading/trailing spaces', () => {
      expect(normalizeAttributeSlug('  Trimmed  ')).toBe('trimmed');
    });

    it('handles multiple consecutive hyphens', () => {
      expect(normalizeAttributeSlug('Option - - Value')).toBe('option-value');
    });

    it('handles mixed special characters and spaces', () => {
      expect(normalizeAttributeSlug('°F, °C Display Options')).toBe('f-c-display-options');
    });

    it('handles empty string', () => {
      expect(normalizeAttributeSlug('')).toBe('');
    });

    it('handles already normalized strings', () => {
      expect(normalizeAttributeSlug('already-normalized')).toBe('already-normalized');
    });
  });

  describe('findMatchingVariation', () => {
    const mockVariations: ProductVariation[] = [
      {
        id: 'var-1',
        databaseId: 1,
        name: 'Display + Standard Range',
        price: '$100',
        regularPrice: '$120',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-001',
        partNumber: 'PART-001',
        attributes: {
          nodes: [
            { name: 'display', value: 'Display', label: 'Display' },
            { name: 'pressure-range', value: 'Standard Range', label: 'Pressure Range' },
          ],
        },
      },
      {
        id: 'var-2',
        databaseId: 2,
        name: 'No Display + Standard Range',
        price: '$90',
        regularPrice: '$110',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-002',
        partNumber: 'PART-002',
        attributes: {
          nodes: [
            { name: 'display', value: 'No Display', label: 'Display' },
            { name: 'pressure-range', value: 'Standard Range', label: 'Pressure Range' },
          ],
        },
      },
      {
        id: 'var-3',
        databaseId: 3,
        name: 'Display + Extended Range',
        price: '$150',
        regularPrice: '$180',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-003',
        partNumber: 'PART-003',
        attributes: {
          nodes: [
            { name: 'display', value: 'Display', label: 'Display' },
            { name: 'pressure-range', value: 'Extended Range', label: 'Pressure Range' },
          ],
        },
      },
    ];

    it('finds exact match with all attributes', () => {
      const selected: SelectedAttributes = {
        display: 'Display',
        'pressure-range': 'Standard Range',
      };
      const result = findMatchingVariation(mockVariations, selected);
      expect(result).toBeTruthy();
      expect(result?.id).toBe('var-1');
      expect(result?.sku).toBe('SKU-001');
    });

    it('finds different variation with different selections', () => {
      const selected: SelectedAttributes = {
        display: 'No Display',
        'pressure-range': 'Standard Range',
      };
      const result = findMatchingVariation(mockVariations, selected);
      expect(result).toBeTruthy();
      expect(result?.id).toBe('var-2');
    });

    it('returns null when no match found', () => {
      const selected: SelectedAttributes = {
        display: 'No Display',
        'pressure-range': 'Extended Range', // This combination doesn't exist
      };
      const result = findMatchingVariation(mockVariations, selected);
      expect(result).toBeNull();
    });

    it('returns null with partial selections', () => {
      const selected: SelectedAttributes = {
        display: 'Display',
        // pressure-range missing
      };
      const result = findMatchingVariation(mockVariations, selected);
      expect(result).toBeNull();
    });

    it('returns null with empty selections', () => {
      const selected: SelectedAttributes = {};
      const result = findMatchingVariation(mockVariations, selected);
      expect(result).toBeNull();
    });

    it('handles empty variations array', () => {
      const selected: SelectedAttributes = {
        display: 'Display',
        'pressure-range': 'Standard Range',
      };
      const result = findMatchingVariation([], selected);
      expect(result).toBeNull();
    });
  });

  describe('areAllAttributesSelected', () => {
    it('returns true when all attributes selected', () => {
      const attributeNames = ['display', 'pressure-range', 'color'];
      const selected: SelectedAttributes = {
        display: 'Display',
        'pressure-range': 'Standard Range',
        color: 'Blue',
      };
      expect(areAllAttributesSelected(attributeNames, selected)).toBe(true);
    });

    it('returns false when some attributes missing', () => {
      const attributeNames = ['display', 'pressure-range', 'color'];
      const selected: SelectedAttributes = {
        display: 'Display',
        'pressure-range': 'Standard Range',
        // color missing
      };
      expect(areAllAttributesSelected(attributeNames, selected)).toBe(false);
    });

    it('returns false when attribute value is empty string', () => {
      const attributeNames = ['display', 'pressure-range'];
      const selected: SelectedAttributes = {
        display: 'Display',
        'pressure-range': '', // Empty string
      };
      expect(areAllAttributesSelected(attributeNames, selected)).toBe(false);
    });

    it('returns false when attribute value is undefined', () => {
      const attributeNames = ['display', 'pressure-range'];
      const selected: SelectedAttributes = {
        display: 'Display',
        // pressure-range is undefined
      };
      expect(areAllAttributesSelected(attributeNames, selected)).toBe(false);
    });

    it('returns true with empty attribute names array', () => {
      const attributeNames: string[] = [];
      const selected: SelectedAttributes = {};
      expect(areAllAttributesSelected(attributeNames, selected)).toBe(true);
    });

    it('handles extra selections not in attribute names', () => {
      const attributeNames = ['display'];
      const selected: SelectedAttributes = {
        display: 'Display',
        'extra-attribute': 'Some Value', // Not in attributeNames
      };
      expect(areAllAttributesSelected(attributeNames, selected)).toBe(true);
    });
  });

  describe('getAvailableOptions - Smart Filtering Tests', () => {
    const mockVariations: ProductVariation[] = [
      // Display + Standard Range
      {
        id: 'var-1',
        databaseId: 1,
        name: 'Display + Standard Range + Blue',
        price: '$100',
        regularPrice: '$120',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-001',
        partNumber: null,
        attributes: {
          nodes: [
            { name: 'display', value: 'Display', label: 'Display' },
            { name: 'pressure-range', value: 'Standard Range', label: 'Pressure Range' },
            { name: 'color', value: 'Blue', label: 'Color' },
          ],
        },
      },
      // Display + Standard Range + Red
      {
        id: 'var-2',
        databaseId: 2,
        name: 'Display + Standard Range + Red',
        price: '$100',
        regularPrice: '$120',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-002',
        partNumber: null,
        attributes: {
          nodes: [
            { name: 'display', value: 'Display', label: 'Display' },
            { name: 'pressure-range', value: 'Standard Range', label: 'Pressure Range' },
            { name: 'color', value: 'Red', label: 'Color' },
          ],
        },
      },
      // No Display + Extended Range + Blue
      {
        id: 'var-3',
        databaseId: 3,
        name: 'No Display + Extended Range + Blue',
        price: '$90',
        regularPrice: '$110',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-003',
        partNumber: null,
        attributes: {
          nodes: [
            { name: 'display', value: 'No Display', label: 'Display' },
            { name: 'pressure-range', value: 'Extended Range', label: 'Pressure Range' },
            { name: 'color', value: 'Blue', label: 'Color' },
          ],
        },
      },
      // No Display + Extended Range + Green
      {
        id: 'var-4',
        databaseId: 4,
        name: 'No Display + Extended Range + Green',
        price: '$90',
        regularPrice: '$110',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-004',
        partNumber: null,
        attributes: {
          nodes: [
            { name: 'display', value: 'No Display', label: 'Display' },
            { name: 'pressure-range', value: 'Extended Range', label: 'Pressure Range' },
            { name: 'color', value: 'Green', label: 'Color' },
          ],
        },
      },
    ];

    it('returns all options when no selections made', () => {
      const options = getAvailableOptions('display', mockVariations, {});
      expect(options).toEqual(['Display', 'No Display']);
    });

    it('filters options based on other selections - display options', () => {
      // When Standard Range selected, only Display should be available (not No Display)
      const options = getAvailableOptions('display', mockVariations, {
        'pressure-range': 'Standard Range',
      });
      expect(options).toEqual(['Display']);
      expect(options).not.toContain('No Display');
    });

    it('filters options based on other selections - pressure range options', () => {
      // When Display selected, only Standard Range should be available (not Extended Range)
      const options = getAvailableOptions('pressure-range', mockVariations, {
        display: 'Display',
      });
      expect(options).toEqual(['Standard Range']);
      expect(options).not.toContain('Extended Range');
    });

    it('filters options based on multiple selections', () => {
      // Display + Standard Range → only Blue and Red colors available
      const options = getAvailableOptions('color', mockVariations, {
        display: 'Display',
        'pressure-range': 'Standard Range',
      });
      expect(options).toEqual(['Blue', 'Red']);
      expect(options).not.toContain('Green');
    });

    it('returns empty array when no valid combinations exist', () => {
      // Display + Extended Range → No variations match
      const options = getAvailableOptions('color', mockVariations, {
        display: 'Display',
        'pressure-range': 'Extended Range',
      });
      expect(options).toEqual([]);
    });

    it('preserves insertion order from variations', () => {
      const options = getAvailableOptions('color', mockVariations, {});
      // Should appear in order they appear in mockVariations: Blue, Red, Green
      expect(options[0]).toBe('Blue');
      expect(options[1]).toBe('Red');
      expect(options[2]).toBe('Green');
    });

    it('deduplicates options while preserving order', () => {
      const options = getAvailableOptions('display', mockVariations, {});
      // Display appears twice (var-1, var-2) but should only appear once
      expect(options.filter((o) => o === 'Display')).toHaveLength(1);
      expect(options).toEqual(['Display', 'No Display']);
    });

    it('handles empty variations array', () => {
      const options = getAvailableOptions('display', [], {});
      expect(options).toEqual([]);
    });

    it('handles non-existent attribute', () => {
      const options = getAvailableOptions('non-existent', mockVariations, {});
      expect(options).toEqual([]);
    });

    it('ignores the attribute being queried in selections', () => {
      // When we want display options, current display selection should be ignored
      const options = getAvailableOptions('display', mockVariations, {
        display: 'Display', // This should be ignored
        'pressure-range': 'Standard Range',
      });
      expect(options).toEqual(['Display']); // Only Display matches, not because of the selection
    });
  });

  describe('MAX_VARIATIONS constant', () => {
    it('is defined as 500', () => {
      expect(MAX_VARIATIONS).toBe(500);
    });

    it('is a number', () => {
      expect(typeof MAX_VARIATIONS).toBe('number');
    });

    it('is positive', () => {
      expect(MAX_VARIATIONS).toBeGreaterThan(0);
    });
  });
});
