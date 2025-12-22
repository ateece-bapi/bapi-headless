/**
 * Custom hook for managing product attribute selection and matching variations.
 * @param attributes Product attributes array
 * @param variations Product variations array
 */
import { useState, useMemo } from 'react';
import type { Variation } from './ProductPage/ProductDetailClient';

export function useProductAttributes(
  attributes: Array<{ name: string; options: string[] }> = [],
  variations: Variation[] = []
) {
  // Initial selection: first option for each attribute
  const initialSelection = attributes.reduce<Record<string, string>>((acc, attr) => {
    acc[attr.name] = attr.options[0] ?? '';
    return acc;
  }, {});

  const [attributeSelection, setAttributeSelection] = useState<Record<string, string>>(initialSelection);

  // Find matching variation based on current selection
  const selectedVariation = useMemo(() => {
    if (Object.keys(attributeSelection).length > 0) {
      const found = variations.find((v) => {
        if (!v.attributes) return false;
        for (const k of Object.keys(attributeSelection)) {
          if ((v.attributes[k] ?? '') !== attributeSelection[k]) return false;
        }
        return true;
      });
      if (found) return found;
    }
    return null;
  }, [attributeSelection, variations]);

  return {
    attributeSelection,
    setAttributeSelection,
    selectedVariation,
  };
}
