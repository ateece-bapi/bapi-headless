/**
 * Types for WooCommerce product variations
 * Based on production data analysis of ZPM product (ID: 137933)
 */

export interface ProductAttribute {
  id: string;
  name: string;
  label: string;
  options: string[];
  variation: boolean;
}

export interface VariationAttribute {
  name: string;
  label: string;
  value: string;
}

export interface ProductVariation {
  id: string;
  databaseId: number;
  name: string;
  description?: string | null;
  price: string;
  regularPrice: string;
  salePrice?: string | null;
  stockStatus: string;
  stockQuantity?: number | null;
  weight?: string | null;
  partNumber?: string;
  sku: string;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  attributes: {
    nodes: VariationAttribute[];
  };
}

export interface VariableProductData {
  attributes: {
    nodes: ProductAttribute[];
  };
  variations: {
    nodes: ProductVariation[];
  };
}

/**
 * Selected variation configuration
 * Maps attribute name to selected value
 * Example: { "pressure-range": "Standard Range...", "display": "Display" }
 */
export type SelectedAttributes = Record<string, string>;
