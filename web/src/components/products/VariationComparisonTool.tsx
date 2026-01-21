'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, GitCompare, Check, X } from 'lucide-react';

interface ProductVariation {
  id: string;
  databaseId: number;
  name: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  sku?: string;
  partNumber?: string | null;
  attributes?: {
    nodes: Array<{
      name: string;
      value: string;
    }>;
  };
}

interface VariationComparisonToolProps {
  variations: ProductVariation[];
  className?: string;
}

/**
 * Collapsible Variation Comparison Tool
 * 
 * Allows B2B customers to compare 2-4 product variations side-by-side
 * to make informed purchasing decisions based on specs, pricing, and availability.
 */
export default function VariationComparisonTool({
  variations,
  className = ''
}: VariationComparisonToolProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState<string[]>([]);

  // Toggle variation selection
  const toggleVariation = (variationId: string) => {
    setSelectedVariations(prev => {
      if (prev.includes(variationId)) {
        return prev.filter(id => id !== variationId);
      } else {
        // Limit to 4 variations for comparison
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, variationId];
      }
    });
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedVariations([]);
  };

  // Get selected variation objects
  const selectedVariationObjects = variations.filter(v => 
    selectedVariations.includes(v.id)
  );

  // Extract unique attribute names from all selected variations
  const getComparisonAttributes = () => {
    const attributeNames = new Set<string>();
    selectedVariationObjects.forEach(variation => {
      variation.attributes?.nodes?.forEach(attr => {
        attributeNames.add(attr.name);
      });
    });
    return Array.from(attributeNames);
  };

  // Get attribute value for a specific variation
  const getAttributeValue = (variation: ProductVariation, attributeName: string) => {
    const attr = variation.attributes?.nodes?.find(a => a.name === attributeName);
    return attr?.value || '—';
  };

  // Check if attribute values differ across selected variations
  const isAttributeDifferent = (attributeName: string) => {
    const values = selectedVariationObjects.map(v => getAttributeValue(v, attributeName));
    return new Set(values).size > 1;
  };

  return (
    <div className={`border border-neutral-200 rounded-xl overflow-hidden ${className}`}>
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
        aria-expanded={isOpen}
        aria-controls="comparison-tool-content"
      >
        <div className="flex items-center gap-3">
          <GitCompare className="w-5 h-5 text-primary-600" />
          <span className="text-lg font-semibold text-neutral-900">
            Compare Variations
          </span>
          {selectedVariations.length > 0 && (
            <span className="px-2 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded">
              {selectedVariations.length} selected
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-neutral-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-600" />
        )}
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div id="comparison-tool-content" className="p-6 bg-white">
          {/* Instructions & Progress */}
          <div className="mb-4">
            <p className="text-sm text-neutral-600 mb-2">
              Select 2-4 variations to compare side-by-side. Differences are highlighted in yellow.
            </p>
            {selectedVariations.length < 2 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${(selectedVariations.length / 2) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">
                  {selectedVariations.length}/2 minimum
                </span>
              </div>
            )}
          </div>

          {/* Variation Selection List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                Select Variations ({selectedVariations.length}/4)
              </h3>
              {selectedVariations.length > 0 && (
                <button
                  onClick={clearSelections}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {variations.map((variation) => {
                const isSelected = selectedVariations.includes(variation.id);
                const isDisabled = !isSelected && selectedVariations.length >= 4;
                
                return (
                  <label
                    key={variation.id}
                    className={`
                      flex items-start gap-3 p-5 rounded-lg border-2 cursor-pointer transition-all transform
                      ${isSelected 
                        ? 'border-primary-500 bg-primary-50 shadow-md' 
                        : isDisabled
                          ? 'border-neutral-200 bg-neutral-50 opacity-50 cursor-not-allowed'
                          : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50 hover:shadow-md hover:scale-[1.02] bg-white'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleVariation(variation.id)}
                      disabled={isDisabled}
                      className="mt-1 w-6 h-6 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-neutral-900 mb-2 truncate">
                        {variation.partNumber || variation.sku || `Variation ${variation.databaseId}`}
                      </div>
                      {variation.attributes?.nodes && variation.attributes.nodes.length > 0 && (
                        <div className="text-xs text-neutral-600 mb-2">
                          {variation.attributes.nodes.map(attr => attr.value).join(' • ')}
                        </div>
                      )}
                      <div className="text-lg font-extrabold text-primary-700">
                        {variation.price || 'Price on request'}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Comparison Table */}
          {selectedVariations.length >= 2 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700 border-b-2 border-neutral-300">
                      Feature
                    </th>
                    {selectedVariationObjects.map((variation) => (
                      <th
                        key={variation.id}
                        className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 border-b-2 border-neutral-300"
                      >
                        {variation.partNumber || variation.sku || `Variation ${variation.databaseId}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr className="border-b border-neutral-200">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-700">
                      Price
                    </td>
                    {selectedVariationObjects.map((variation) => {
                      const prices = selectedVariationObjects.map(v => v.price);
                      const isDifferent = new Set(prices).size > 1;
                      
                      return (
                        <td
                          key={variation.id}
                          className={`px-4 py-3 text-sm font-bold text-primary-700 ${
                            isDifferent ? 'bg-accent-50' : ''
                          }`}
                        >
                          {variation.price || '—'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Stock Status Row */}
                  <tr className="border-b border-neutral-200">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-700">
                      Stock Status
                    </td>
                    {selectedVariationObjects.map((variation) => {
                      const statuses = selectedVariationObjects.map(v => v.stockStatus);
                      const isDifferent = new Set(statuses).size > 1;
                      const inStock = variation.stockStatus === 'IN_STOCK';
                      
                      return (
                        <td
                          key={variation.id}
                          className={`px-4 py-3 text-sm ${
                            isDifferent ? 'bg-accent-50' : ''
                          }`}
                        >
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                              inStock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {inStock ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* SKU Row */}
                  <tr className="border-b border-neutral-200">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-700">
                      SKU
                    </td>
                    {selectedVariationObjects.map((variation) => {
                      const skus = selectedVariationObjects.map(v => v.sku);
                      const isDifferent = new Set(skus).size > 1;
                      
                      return (
                        <td
                          key={variation.id}
                          className={`px-4 py-3 text-sm font-mono text-neutral-600 ${
                            isDifferent ? 'bg-accent-50' : ''
                          }`}
                        >
                          {variation.sku || '—'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Attribute Rows */}
                  {getComparisonAttributes().map((attributeName) => {
                    const isDifferent = isAttributeDifferent(attributeName);
                    
                    return (
                      <tr key={attributeName} className="border-b border-neutral-200">
                        <td className="px-4 py-3 text-sm font-medium text-neutral-700">
                          {attributeName}
                        </td>
                        {selectedVariationObjects.map((variation) => (
                          <td
                            key={variation.id}
                            className={`px-4 py-3 text-sm text-neutral-900 ${
                              isDifferent ? 'bg-accent-50' : ''
                            }`}
                          >
                            {getAttributeValue(variation, attributeName)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {selectedVariations.length < 2 && (
            <div className="text-center py-12 text-neutral-500">
              <GitCompare className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="text-sm">
                Select at least 2 variations to start comparing
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
