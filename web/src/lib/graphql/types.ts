/**
 * Type guards and utility types for WooCommerce products
 */

import type { GetProductsQuery, GetProductBySlugQuery } from './generated';

// Extract product types from query results
type ProductNode = NonNullable<NonNullable<GetProductsQuery['products']>['nodes'][number]>;
type ProductDetail = NonNullable<GetProductBySlugQuery['product']>;

export type SimpleProduct = Extract<ProductNode, { __typename: 'SimpleProduct' }>;
export type VariableProduct = Extract<ProductNode, { __typename: 'VariableProduct' }>;
export type ExternalProduct = Extract<ProductNode, { __typename: 'ExternalProduct' }>;
export type GroupProduct = Extract<ProductNode, { __typename: 'GroupProduct' }>;
export type Product = ProductNode | ProductDetail;

/**
 * Type guard to check if a product is a SimpleProduct
 */
export function isSimpleProduct(product: Product | null | undefined): product is SimpleProduct {
  return product?.__typename === 'SimpleProduct';
}

/**
 * Type guard to check if a product is a VariableProduct
 */
export function isVariableProduct(product: Product | null | undefined): product is VariableProduct {
  return product?.__typename === 'VariableProduct';
}

/**
 * Type guard to check if a product is an ExternalProduct
 */
export function isExternalProduct(product: Product | null | undefined): product is ExternalProduct {
  return product?.__typename === 'ExternalProduct';
}

/**
 * Type guard to check if a product is a GroupProduct
 */
export function isGroupProduct(product: Product | null | undefined): product is GroupProduct {
  return product?.__typename === 'GroupProduct';
}

/**
 * Get the price from any product type
 */
export function getProductPrice(product: Product | null | undefined): string | null {
  if (!product) return null;
  
  if ('price' in product && product.price) {
    return product.price;
  }
  
  return null;
}

/**
 * Get stock status from any product type
 */
export function getProductStockStatus(product: Product | null | undefined): string | null {
  if (!product) return null;
  
  if ('stockStatus' in product && product.stockStatus) {
    return product.stockStatus;
  }
  
  return null;
}

/**
 * Check if product is on sale
 */
export function isProductOnSale(product: Product | null | undefined): boolean {
  if (!product) return false;
  
  if ('onSale' in product) {
    return Boolean(product.onSale);
  }
  
  return false;
}

