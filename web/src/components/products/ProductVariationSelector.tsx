"use client";

import React from 'react';
import VariationSelector from './VariationSelector';
import type { ProductAttribute, ProductVariation } from '@/types/variations';

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
 * Product Variation Selector Adapter
 * 
 * Wraps the new enterprise VariationSelector component and adapts
 * the product page data structure to the variation system types.
 * 
 * This maintains backward compatibility while using the new smart
 * variation selector with color swatches, toggles, radio groups, etc.
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

  // Hide selector if no variations or attributes
  if (variations.length === 0 || attributes.length === 0) {
    return null;
  }

  // Transform old attribute format to new ProductAttribute format
  const transformedAttributes: ProductAttribute[] = attributes.map((attr, index) => ({
    id: `attr-${index}`,
    name: attr.name,
    label: attr.name, // Same as name for now
    options: attr.options,
    variation: true // All attributes are for variations
  }));

  // Transform old variation format to new ProductVariation format
  const transformedVariations: ProductVariation[] = variations.map((variation) => ({
    id: variation.id,
    databaseId: variation.databaseId || 0,
    name: variation.name || '',
    price: variation.price || '',
    regularPrice: variation.regularPrice || '',
    stockStatus: variation.stockStatus || 'IN_STOCK',
    partNumber: variation.partNumber || undefined, // Transform null to undefined
    sku: variation.sku || '',
    attributes: {
      nodes: Object.entries(variation.attributes).map(([name, value]) => ({
        name,
        label: name,
        value: String(value)
      }))
    }
  }));

  // Handle variation change - transform back to old format
  const handleVariationChange = (
    newVariation: ProductVariation | null, 
    partNumber: string | null
  ) => {
    if (onVariationChange) {
      if (!newVariation) {
        onVariationChange(null);
        return;
      }

      // Transform back to old Variation format
      const oldFormatVariation: Variation = {
        id: newVariation.id,
        databaseId: newVariation.databaseId,
        name: newVariation.name,
        price: newVariation.price,
        regularPrice: newVariation.regularPrice,
        salePrice: null,
        stockStatus: newVariation.stockStatus as 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER',
        stockQuantity: null,
        attributes: newVariation.attributes.nodes.reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {} as Record<string, string>),
        partNumber: newVariation.partNumber,
        sku: newVariation.sku,
        image: null
      };

      onVariationChange(oldFormatVariation);
    }
  };

  return (
    <div className={className}>
      <VariationSelector
        attributes={transformedAttributes}
        variations={transformedVariations}
        basePrice={product.price || undefined}
        onVariationChange={handleVariationChange}
      />
    </div>
  );
}
