'use client';

import { useState, useEffect } from 'react';
import type { 
  ProductAttribute, 
  ProductVariation, 
  SelectedAttributes 
} from '@/types/variations';
import { 
  findMatchingVariation, 
  areAllAttributesSelected 
} from '@/lib/variations';

interface VariationSelectorProps {
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  onVariationChange: (variation: ProductVariation | null, partNumber: string | null) => void;
  className?: string;
}

/**
 * Variation Selector Component
 * 
 * Renders dropdown selectors for configurable product attributes
 * Updates part number and price based on selected configuration
 * 
 * @example
 * ```tsx
 * <VariationSelector
 *   attributes={product.attributes.nodes}
 *   variations={product.variations.nodes}
 *   onVariationChange={(variation, partNumber) => {
 *     setSelectedVariation(variation);
 *     setPartNumber(partNumber);
 *   }}
 * />
 * ```
 */
export default function VariationSelector({
  attributes,
  variations,
  onVariationChange,
  className = ''
}: VariationSelectorProps) {
  // State for selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttributes>({});
  const [matchedVariation, setMatchedVariation] = useState<ProductVariation | null>(null);
  
  // Filter to only attributes used for variations
  const variationAttributes = attributes.filter(attr => attr.variation);
  
  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    const newSelections = {
      ...selectedAttributes,
      [attributeName]: value
    };
    setSelectedAttributes(newSelections);
    
    // Check if all attributes are selected
    const allSelected = areAllAttributesSelected(
      variationAttributes.map(a => a.name),
      newSelections
    );
    
    if (allSelected) {
      // Find matching variation
      const variation = findMatchingVariation(variations, newSelections);
      setMatchedVariation(variation);
      onVariationChange(variation, variation?.partNumber || variation?.sku || null);
    } else {
      // Not all attributes selected yet
      setMatchedVariation(null);
      onVariationChange(null, null);
    }
  };
  
  // Reset when attributes change
  useEffect(() => {
    setSelectedAttributes({});
    setMatchedVariation(null);
    onVariationChange(null, null);
  }, [attributes, variations, onVariationChange]);
  
  if (variationAttributes.length === 0) {
    return null;
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold text-neutral-900">Configure Product</h3>
      
      {variationAttributes.map((attribute) => (
        <div key={attribute.id} className="space-y-2">
          <label 
            htmlFor={`attr-${attribute.name}`}
            className="block text-sm font-semibold text-neutral-700 uppercase tracking-wide"
          >
            {attribute.label}
          </label>
          
          <select
            id={`attr-${attribute.name}`}
            value={selectedAttributes[attribute.name] || ''}
            onChange={(e) => handleAttributeChange(attribute.name, e.target.value)}
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg text-neutral-900 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
          >
            <option value="">Choose an option</option>
            {attribute.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
      
      {/* Variation info display */}
      {matchedVariation && (
        <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary-900">Selected Configuration</p>
              <p className="text-lg font-bold text-primary-600 mt-1">
                {matchedVariation.price}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary-700 uppercase tracking-wide">Part Number</p>
              <p className="text-sm font-mono font-bold text-primary-900 mt-1">
                {matchedVariation.partNumber || matchedVariation.sku}
              </p>
            </div>
          </div>
          
          {matchedVariation.stockStatus !== 'IN_STOCK' && (
            <div className="mt-3 pt-3 border-t border-primary-200">
              <p className="text-sm text-amber-700 font-medium">
                {matchedVariation.stockStatus === 'OUT_OF_STOCK' && '⚠️ Currently out of stock'}
                {matchedVariation.stockStatus === 'ON_BACKORDER' && '📦 Available on backorder'}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Show message if not all attributes selected */}
      {!matchedVariation && Object.keys(selectedAttributes).length > 0 && (
        <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
          <p className="text-sm text-neutral-600">
            Please select all options to see price and part number
          </p>
        </div>
      )}
    </div>
  );
}
