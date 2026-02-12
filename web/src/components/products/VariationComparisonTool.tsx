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
  className = '',
}: VariationComparisonToolProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState<string[]>([]);

  // Toggle variation selection
  const toggleVariation = (variationId: string) => {
    setSelectedVariations((prev) => {
      if (prev.includes(variationId)) {
        return prev.filter((id) => id !== variationId);
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
  const selectedVariationObjects = variations.filter((v) => selectedVariations.includes(v.id));

  // Extract unique attribute names from all selected variations
  const getComparisonAttributes = () => {
    const attributeNames = new Set<string>();
    selectedVariationObjects.forEach((variation) => {
      variation.attributes?.nodes?.forEach((attr) => {
        attributeNames.add(attr.name);
      });
    });
    return Array.from(attributeNames);
  };

  // Get attribute value for a specific variation
  const getAttributeValue = (variation: ProductVariation, attributeName: string) => {
    const attr = variation.attributes?.nodes?.find((a) => a.name === attributeName);
    return attr?.value || '—';
  };

  // Check if attribute values differ across selected variations
  const isAttributeDifferent = (attributeName: string) => {
    const values = selectedVariationObjects.map((v) => getAttributeValue(v, attributeName));
    return new Set(values).size > 1;
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-neutral-200 ${className}`}>
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-neutral-50 px-6 py-4 transition-colors hover:bg-neutral-100"
        aria-expanded={isOpen}
        aria-controls="comparison-tool-content"
      >
        <div className="flex items-center gap-3">
          <GitCompare className="h-5 w-5 text-primary-600" />
          <span className="text-lg font-semibold text-neutral-900">Compare Variations</span>
          {selectedVariations.length > 0 && (
            <span className="rounded bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">
              {selectedVariations.length} selected
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-neutral-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-neutral-600" />
        )}
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div id="comparison-tool-content" className="bg-white p-6">
          {/* Instructions & Progress */}
          <div className="mb-4">
            <p className="mb-2 text-sm text-neutral-600">
              Select 2-4 variations to compare side-by-side. Differences are highlighted in yellow.
            </p>
            {selectedVariations.length < 2 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${(selectedVariations.length / 2) * 100}%` }}
                  />
                </div>
                <span className="whitespace-nowrap text-xs font-medium text-neutral-500">
                  {selectedVariations.length}/2 minimum
                </span>
              </div>
            )}
          </div>

          {/* Variation Selection List */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
                Select Variations ({selectedVariations.length}/4)
              </h3>
              {selectedVariations.length > 0 && (
                <button
                  onClick={clearSelections}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {variations.map((variation) => {
                const isSelected = selectedVariations.includes(variation.id);
                const isDisabled = !isSelected && selectedVariations.length >= 4;

                return (
                  <label
                    key={variation.id}
                    className={`flex transform cursor-pointer items-start gap-3 rounded-lg border-2 p-5 transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : isDisabled
                          ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-50'
                          : 'border-neutral-200 bg-white hover:scale-[1.02] hover:border-primary-300 hover:bg-neutral-50 hover:shadow-md'
                    } `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleVariation(variation.id)}
                      disabled={isDisabled}
                      className="mt-1 h-6 w-6 cursor-pointer rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 truncate text-base font-semibold text-neutral-900">
                        {variation.partNumber ||
                          variation.sku ||
                          `Variation ${variation.databaseId}`}
                      </div>
                      {variation.attributes?.nodes && variation.attributes.nodes.length > 0 && (
                        <div className="mb-2 text-xs text-neutral-600">
                          {variation.attributes.nodes.map((attr) => attr.value).join(' • ')}
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
                    <th className="border-b-2 border-neutral-300 px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                      Feature
                    </th>
                    {selectedVariationObjects.map((variation) => (
                      <th
                        key={variation.id}
                        className="border-b-2 border-neutral-300 px-4 py-3 text-left text-sm font-semibold text-neutral-900"
                      >
                        {variation.partNumber ||
                          variation.sku ||
                          `Variation ${variation.databaseId}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr className="border-b border-neutral-200">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-700">Price</td>
                    {selectedVariationObjects.map((variation) => {
                      const prices = selectedVariationObjects.map((v) => v.price);
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
                    <td className="px-4 py-3 text-sm font-medium text-neutral-700">Stock Status</td>
                    {selectedVariationObjects.map((variation) => {
                      const statuses = selectedVariationObjects.map((v) => v.stockStatus);
                      const isDifferent = new Set(statuses).size > 1;
                      const inStock = variation.stockStatus === 'IN_STOCK';

                      return (
                        <td
                          key={variation.id}
                          className={`px-4 py-3 text-sm ${isDifferent ? 'bg-accent-50' : ''}`}
                        >
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
                              inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {inStock ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            {inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* SKU Row */}
                  <tr className="border-b border-neutral-200">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-700">SKU</td>
                    {selectedVariationObjects.map((variation) => {
                      const skus = selectedVariationObjects.map((v) => v.sku);
                      const isDifferent = new Set(skus).size > 1;

                      return (
                        <td
                          key={variation.id}
                          className={`px-4 py-3 font-mono text-sm text-neutral-600 ${
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
            <div className="py-12 text-center text-neutral-500">
              <GitCompare className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
              <p className="text-sm">Select at least 2 variations to start comparing</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
