"use client";

import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface Variation {
  id: string;
  databaseId?: number;
  name?: string;
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER' | null;
  stockQuantity?: number | null;
  attributes: Record<string, string>;
  partNumber?: string | null;
  sku?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
}

interface AttributeOption {
  name: string;
  options: string[];
}

interface ProductVariationSelectorProps {
  product: {
    attributes?: AttributeOption[];
    variations?: Variation[];
    price?: string | null;
    regularPrice?: string | null;
  };
  onVariationChange?: (variation: Variation | null) => void;
  className?: string;
}

/**
 * Enhanced product variation selector with visual attribute selection
 * 
 * Features:
 * - Visual button-based attribute selection
 * - Stock status indicators per variation
 * - Dynamic price updates
 * - Disabled state for out-of-stock variations
 * - Selected variation details display
 * 
 * @param product - Product with attributes and variations
 * @param onVariationChange - Callback when variation selection changes
 * @param className - Optional CSS classes
 */
export default function ProductVariationSelector({ 
  product, 
  onVariationChange,
  className = ''
}: ProductVariationSelectorProps) {
  const { attributes = [], variations = [] } = product;

  // Build initial state for each attribute (first option selected by default)
  const initialSelections = attributes.reduce<Record<string, string>>((acc, attr) => {
    acc[attr.name] = attr.options[0] || '';
    return acc;
  }, {});

  const [selections, setSelections] = useState<Record<string, string>>(initialSelections);

  // Find matching variation based on current selections
  const selectedVariation = variations.find((v) => {
    return Object.entries(selections).every(([name, value]) => v.attributes[name] === value);
  });

  // Notify parent component of variation changes
  useEffect(() => {
    if (onVariationChange) {
      onVariationChange(selectedVariation || null);
    }
  }, [selectedVariation, onVariationChange]);

  /**
   * Check if a specific attribute option is available in stock
   * 
   * @param attributeName - Name of the attribute (e.g., "Size")
   * @param optionValue - Value of the option (e.g., "Large")
   * @returns true if any variation with this option is in stock
   */
  const isOptionAvailable = (attributeName: string, optionValue: string): boolean => {
    // Create hypothetical selections with this option
    const testSelections = { ...selections, [attributeName]: optionValue };
    
    // Find if any variation matches these selections
    const matchingVariation = variations.find((v) => {
      return Object.entries(testSelections).every(([name, value]) => {
        return v.attributes[name] === value;
      });
    });

    // Available if variation exists and is in stock
    if (!matchingVariation) return false;
    
    const hasStock = matchingVariation.stockQuantity === null || 
                     matchingVariation.stockQuantity === undefined || 
                     matchingVariation.stockQuantity > 0;
    
    return matchingVariation.stockStatus === 'IN_STOCK' && hasStock;
  };

  /**
   * Handle attribute option selection
   * 
   * @param attributeName - Name of the attribute being changed
   * @param optionValue - New value for the attribute
   */
  const handleOptionSelect = (attributeName: string, optionValue: string) => {
    setSelections(prev => ({
      ...prev,
      [attributeName]: optionValue
    }));
  };

  // Hide selector if no variations or attributes
  const showSelector = variations.length > 0 && attributes.length > 0;

  if (!showSelector) {
    return (
      <section className={`mb-8 ${className}`}>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Product Options</h2>
        <div className="bg-neutral-50 rounded-xl p-6 text-neutral-500 text-center border border-neutral-200">
          This product has no configurable options.
        </div>
      </section>
    );
  }

  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">Select Options</h2>
      
      <div className="space-y-6">
        {attributes.map((attr) => (
          <div key={attr.name} className="space-y-3">
            <label className="block text-sm font-medium text-neutral-700">
              {attr.name}
              <span className="ml-2 text-primary-500 font-semibold">
                {selections[attr.name]}
              </span>
            </label>
            
            <div className="flex flex-wrap gap-2">
              {attr.options.map((option) => {
                const isSelected = selections[attr.name] === option;
                const isAvailable = isOptionAvailable(attr.name, option);
                
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => handleOptionSelect(attr.name, option)}
                    className={`
                      relative px-4 py-2.5 rounded-lg border-2 font-medium text-sm
                      transition-all duration-200
                      ${isSelected 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-primary-300'
                      }
                      ${!isAvailable 
                        ? 'opacity-40 cursor-not-allowed line-through' 
                        : 'hover:shadow-md'
                      }
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    `}
                    aria-label={`Select ${attr.name}: ${option}`}
                    aria-pressed={isSelected}
                  >
                    {option}
                    
                    {/* Selected checkmark */}
                    {isSelected && isAvailable && (
                      <Check className="inline-block ml-1.5 w-4 h-4 text-primary-600" aria-hidden="true" />
                    )}
                    
                    {/* Out of stock X */}
                    {!isAvailable && (
                      <X className="inline-block ml-1.5 w-4 h-4 text-neutral-400" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Variation Details */}
      {selectedVariation && (
        <div className="mt-6 p-5 bg-neutral-50 rounded-xl border border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">Selected Variation</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Part Number / SKU */}
            <div>
              <div className="text-xs text-neutral-500 mb-1">Part Number</div>
              <div className="font-medium text-neutral-900">
                {selectedVariation.partNumber || selectedVariation.sku || 'N/A'}
              </div>
            </div>

            {/* Price */}
            {selectedVariation.price && (
              <div>
                <div className="text-xs text-neutral-500 mb-1">Price</div>
                <div className="font-bold text-primary-700 text-lg">
                  {selectedVariation.price}
                  {selectedVariation.regularPrice && 
                   selectedVariation.price !== selectedVariation.regularPrice && (
                    <span className="ml-2 text-sm text-neutral-400 line-through font-normal">
                      {selectedVariation.regularPrice}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div>
              <div className="text-xs text-neutral-500 mb-1">Availability</div>
              <div className={`
                inline-flex items-center gap-1.5 font-medium text-sm
                ${selectedVariation.stockStatus === 'IN_STOCK' 
                  ? 'text-success-700' 
                  : selectedVariation.stockStatus === 'ON_BACKORDER'
                  ? 'text-warning-600'
                  : 'text-error-700'
                }
              `}>
                <span className={`
                  w-2 h-2 rounded-full
                  ${selectedVariation.stockStatus === 'IN_STOCK' 
                    ? 'bg-success-500' 
                    : selectedVariation.stockStatus === 'ON_BACKORDER'
                    ? 'bg-warning-500'
                    : 'bg-error-500'
                  }
                `} />
                {selectedVariation.stockStatus === 'IN_STOCK' 
                  ? 'In Stock' 
                  : selectedVariation.stockStatus === 'ON_BACKORDER'
                  ? 'On Backorder'
                  : 'Out of Stock'
                }
                {selectedVariation.stockQuantity !== null && 
                 selectedVariation.stockQuantity !== undefined && (
                  <span className="text-neutral-500">
                    ({selectedVariation.stockQuantity} available)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
