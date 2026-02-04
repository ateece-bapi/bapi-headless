'use client';

import { useState, useEffect } from 'react';
import { Package, TrendingUp, Clock, RotateCcw, Share2, Check } from 'lucide-react';
import logger from '@/lib/logger';
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
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  
  // Filter to only attributes used for variations
  const variationAttributes = attributes.filter(attr => attr.variation);
  
  // Helper to normalize attribute name to slug format
  const normalizeToSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };
  
  // Handle attribute selection
  // attributeName is the display label, need to convert to slug for matching
  const handleAttributeChange = (attributeName: string, value: string) => {
    // Convert display name to slug (e.g., "Pressure Range" → "pressure-range")
    const attributeSlug = normalizeToSlug(attributeName);
    
    const newSelections = {
      ...selectedAttributes,
      [attributeSlug]: value
    };
    
    setSelectedAttributes(newSelections);
    
    // Check if all attributes are selected (use newSelections, not state)
    // Use slugified names to match what's in newSelections
    const attributeSlugs = variationAttributes.map(a => normalizeToSlug(a.name));
    const allSelected = areAllAttributesSelected(
      attributeSlugs,
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
  
  // Handle clear/reset
  const handleClear = () => {
    setSelectedAttributes({});
    setMatchedVariation(null);
    onVariationChange(null, null);
  };
  
  // Reset when attributes or variations data change (but not callback)
  useEffect(() => {
    setSelectedAttributes({});
    setMatchedVariation(null);
    onVariationChange(null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes, variations]);
  
  // Sync selected attributes to URL on mount and when selections change
  useEffect(() => {
    // On mount, read URL params and restore selection
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSelections: SelectedAttributes = {};
      let hasUrlParams = false;
      
      variationAttributes.forEach(attr => {
        const slug = normalizeToSlug(attr.name);
        const value = params.get(slug);
        if (value) {
          urlSelections[slug] = value;
          hasUrlParams = true;
        }
      });
      
      if (hasUrlParams && Object.keys(selectedAttributes).length === 0) {
        setSelectedAttributes(urlSelections);
        
        // Check if we can find a matching variation
        const attributeSlugs = variationAttributes.map(a => normalizeToSlug(a.name));
        const allSelected = areAllAttributesSelected(attributeSlugs, urlSelections);
        if (allSelected) {
          const variation = findMatchingVariation(variations, urlSelections);
          if (variation) {
            setMatchedVariation(variation);
            onVariationChange(variation, variation.partNumber || variation.sku || null);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update URL when selections change
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(selectedAttributes).length > 0) {
      const params = new URLSearchParams(window.location.search);
      
      // Add/update selected attributes
      Object.entries(selectedAttributes).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      
      // Update URL without page reload
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [selectedAttributes]);
  
  // Handle share configuration
  const handleShare = async () => {
    if (typeof window !== 'undefined' && Object.keys(selectedAttributes).length > 0) {
      const url = window.location.href;
      
      try {
        // Try using Web Share API (mobile)
        if (navigator.share) {
          await navigator.share({
            title: `${matchedVariation?.name || 'Product Configuration'}`,
            text: `Check out this configuration: ${matchedVariation?.partNumber || matchedVariation?.sku || ''}`,
            url: url,
          });
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(url);
          setShowShareConfirmation(true);
          setTimeout(() => setShowShareConfirmation(false), 3000);
        }
      } catch (error) {
        // Silent fail - user might have cancelled
        logger.debug('Share cancelled or failed');
      }
    }
  };
  
  if (variationAttributes.length === 0) {
    return null;
  }
  
  // Calculate progress
  const selectedCount = Object.keys(selectedAttributes).filter(k => selectedAttributes[k]).length;
  const totalCount = variationAttributes.length;
  const progressPercent = (selectedCount / totalCount) * 100;
  
  return (
    <section className={`mb-12 ${className}`}>
      {/* Enterprise Configuration Header */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white px-8 py-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Configure Your Product</h2>
            <p className="text-primary-100 text-sm">
              Select your specifications below • {selectedCount} of {totalCount} options selected
            </p>
          </div>
          <div className="flex gap-2">
            {selectedCount > 0 && (
              <>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 rounded-lg transition-colors font-semibold shadow-md relative"
                  disabled={!matchedVariation}
                  title={matchedVariation ? 'Share this configuration' : 'Complete configuration to share'}
                >
                  {showShareConfirmation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span className="font-medium hidden sm:inline">Share</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline">Reset</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Configuration Grid */}
      <div className="bg-white border-2 border-neutral-200 rounded-b-2xl shadow-lg">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configuration Options */}
        {variationAttributes.map((attribute) => {
          const uiType = detectAttributeType(attribute);
          const attributeSlug = normalizeToSlug(attribute.name);
          const value = selectedAttributes[attributeSlug] || '';
          
          const commonProps = {
            label: attribute.label,
            options: attribute.options,
            value,
            onChange: (val: string) => handleAttributeChange(attribute.label, val)
          };
          
          switch (uiType) {
            case 'color-swatch':
              return <ColorSwatchSelector key={attribute.id} {...commonProps} />;
            
            case 'binary-toggle':
              return <BinaryToggleSelector key={attribute.id} {...commonProps} options={attribute.options as [string, string]} />;
            
            case 'radio-group':
              return <RadioGroupSelector key={attribute.id} {...commonProps} />;
            
            case 'dropdown':
            default:
              return <DropdownSelector key={attribute.id} {...commonProps} />;
          }
        })}
          </div>
          
          {/* Configuration Summary - Shows when variation is matched */}
          {matchedVariation && (
            <div className="mt-8 pt-8 border-t-2 border-primary-200 bg-gradient-to-br from-primary-25 to-primary-50 -m-8 mb-0 p-8 rounded-b-2xl">
              <div className="bg-gradient-to-br from-accent-50 via-accent-100 to-white border-2 border-accent-500 rounded-xl p-6 shadow-xl">
                <div className="flex items-start justify-between gap-6">
                  {/* Price and Part Number */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm font-bold text-accent-800 uppercase tracking-wider">
                        ✓ Selected Configuration
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-neutral-600 uppercase tracking-wide mb-2">Part Number</p>
                        <p className="text-xl font-mono font-bold text-neutral-900 bg-white px-4 py-3 rounded-lg border-2 border-accent-400 inline-block shadow-sm">
                          {matchedVariation.partNumber || matchedVariation.sku}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 uppercase tracking-wide mb-2">Your Price</p>
                        <p className="text-4xl font-bold text-primary-700">
                          {matchedVariation.price}
                        </p>
                        {basePrice && basePrice !== matchedVariation.price && (
                          <span className="text-base text-neutral-500 line-through ml-3">{basePrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock Status */}
                  <div className="text-right">
                    <p className="text-xs font-bold text-accent-700 uppercase tracking-wider mb-3">
                      Availability
                    </p>
                    {matchedVariation.stockStatus === 'IN_STOCK' ? (
                      <div className="bg-green-100 border-2 border-green-500 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="font-bold text-green-800">In Stock</span>
                        </div>
                        <p className="text-xs text-green-700 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          Ships in 2-3 days
                        </p>
                      </div>
                    ) : matchedVariation.stockStatus === 'ON_BACKORDER' ? (
                      <div className="bg-amber-100 border-2 border-amber-500 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                          <span className="font-bold text-amber-800">Backorder</span>
                        </div>
                        <p className="text-xs text-amber-700">Contact for lead time</p>
                      </div>
                    ) : (
                      <div className="bg-red-100 border-2 border-red-500 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="font-bold text-red-800">Out of Stock</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Invalid combination message - show when all selected but no match */}
          {!matchedVariation && selectedCount === totalCount && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-400 rounded-lg">
              <p className="text-sm font-bold text-red-900 mb-1">
                Invalid Configuration
              </p>
              <p className="text-sm text-red-700">
                This combination of options is not available. Please try different selections.
              </p>
            </div>
          )}
          
          {/* Selection prompt - only show when partially complete */}
          {!matchedVariation && selectedCount > 0 && selectedCount < totalCount && (
            <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-400 rounded-lg">
              <p className="text-sm font-medium text-amber-900">
                Please select {totalCount - selectedCount} more option{totalCount - selectedCount > 1 ? 's' : ''} to see final configuration
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
