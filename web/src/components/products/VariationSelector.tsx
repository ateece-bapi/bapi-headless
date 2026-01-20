'use client';

import { useState, useEffect } from 'react';
import { Package, TrendingUp, Clock } from 'lucide-react';
import type { 
  ProductAttribute, 
  ProductVariation, 
  SelectedAttributes 
} from '@/types/variations';
import { 
  findMatchingVariation, 
  areAllAttributesSelected 
} from '@/lib/variations';
import { detectAttributeType } from '@/lib/attributeDetection';
import ColorSwatchSelector from './variation-selectors/ColorSwatchSelector';
import RadioGroupSelector from './variation-selectors/RadioGroupSelector';
import BinaryToggleSelector from './variation-selectors/BinaryToggleSelector';
import DropdownSelector from './variation-selectors/DropdownSelector';

interface VariationSelectorProps {
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  onVariationChange: (variation: ProductVariation | null, partNumber: string | null) => void;
  className?: string;
  basePrice?: string;
}

/**
 * Enterprise B2B Variation Selector
 * 
 * Intelligently renders optimal UI for each attribute type:
 * - Color swatches for colors
 * - Toggle switches for binary choices
 * - Radio groups for 2-4 options
 * - Dropdowns for complex selections
 * 
 * Features:
 * - Real-time price updates
 * - Part number preview
 * - Stock status indicators
 * - Professional B2B design
 */
export default function VariationSelector({
  attributes,
  variations,
  onVariationChange,
  className = '',
  basePrice
}: VariationSelectorProps) {
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
  
  // Calculate progress
  const selectedCount = Object.keys(selectedAttributes).filter(k => selectedAttributes[k]).length;
  const totalCount = variationAttributes.length;
  const progressPercent = (selectedCount / totalCount) * 100;
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-neutral-900">Configure Product</h3>
          <span className="text-sm font-medium text-neutral-600">
            {selectedCount} of {totalCount} selected
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      
      {/* Render attributes with smart UI */}
      <div className="space-y-5">
        {variationAttributes.map((attribute) => {
          const uiType = detectAttributeType(attribute);
          const value = selectedAttributes[attribute.name] || '';
          
          const commonProps = {
            label: attribute.label,
            options: attribute.options,
            value,
            onChange: (val: string) => handleAttributeChange(attribute.name, val),
            key: attribute.id
          };
          
          switch (uiType) {
            case 'color-swatch':
              return <ColorSwatchSelector {...commonProps} />;
            
            case 'binary-toggle':
              return <BinaryToggleSelector {...commonProps} options={attribute.options as [string, string]} />;
            
            case 'radio-group':
              return <RadioGroupSelector {...commonProps} />;
            
            case 'dropdown':
            default:
              return <DropdownSelector {...commonProps} />;
          }
        })}
      </div>
      
      {/* Configuration Summary Panel */}
      {matchedVariation && (
        <div className="sticky top-4 p-5 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-300 rounded-xl shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Selected Configuration</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-primary-900">
                  {matchedVariation.price}
                </p>
                {basePrice && basePrice !== matchedVariation.price && (
                  <span className="text-sm text-neutral-600 line-through">{basePrice}</span>
                )}
              </div>
            </div>
            
            {/* Part Number Badge */}
            <div className="text-right">
              <p className="text-xs text-primary-700 uppercase tracking-wide flex items-center gap-1 justify-end">
                <Package className="w-3 h-3" />
                Part Number
              </p>
              <p className="text-sm font-mono font-bold text-primary-900 mt-1 bg-white px-2 py-1 rounded border border-primary-200">
                {matchedVariation.partNumber || matchedVariation.sku}
              </p>
            </div>
          </div>
          
          {/* Stock & Availability */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              {matchedVariation.stockStatus === 'IN_STOCK' ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="font-medium text-green-700">In Stock</span>
                </>
              ) : matchedVariation.stockStatus === 'ON_BACKORDER' ? (
                <>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  <span className="font-medium text-amber-700">Backorder</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="font-medium text-red-700">Out of Stock</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-neutral-600" />
              <span className="text-neutral-700">Ships in 2-3 days</span>
            </div>
          </div>
          
          {/* Price change indicator */}
          {basePrice && basePrice !== matchedVariation.price && (
            <div className="mt-3 pt-3 border-t border-primary-200 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-700">
                Price varies with configuration
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Selection prompt */}
      {!matchedVariation && selectedCount > 0 && selectedCount < totalCount && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-medium text-amber-800">
            ⚠️ Please select all {totalCount - selectedCount} remaining option{totalCount - selectedCount > 1 ? 's' : ''} to see final price and part number
          </p>
        </div>
      )}
      
      {/* Initial state - no selections */}
      {selectedCount === 0 && (
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <p className="text-sm text-neutral-600">
            👆 Start by selecting your preferred options above to configure this product
          </p>
        </div>
      )}
    </div>
  );
}
