/**
 * Type guards and utility types for WooCommerce products
 */

import type { GetProductsQuery, GetProductBySlugQuery } from './generated';
import type { CurrencyCode } from '@/types/region';
import { convertWooCommercePrice } from '@/lib/utils/currency';

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
 * Extracts formatted price from WooCommerce product
 *
 * Handles various product types (Simple, Variable, Group) which may
 * have different price field structures. Returns pre-formatted string
 * from WooCommerce (e.g., "$19.99", "$10.00 - $25.00").
 *
 * @param product - Product from GraphQL query (nullable for safe type guards)
 * @param currency - Optional target currency for automatic conversion (uses USD if not specified)
 * @returns Formatted price string with currency symbol, or null if unavailable
 *
 * @example
 * ```ts
 * // Without conversion (returns WooCommerce USD price)
 * const usdPrice = getProductPrice(product);
 * 
 * // With currency conversion
 * const eurPrice = getProductPrice(product, 'EUR'); // "$19.99" → "18.39€"
 * const jpyPrice = getProductPrice(product, 'JPY'); // "$19.99" → "¥2,990"
 * ```
 */
export function getProductPrice(
  product: Product | null | undefined,
  currency?: CurrencyCode
): string | null {
  if (!product) return null;

  if ('price' in product && product.price) {
    const priceString = product.price;
    
    // If no currency specified or USD, return original price from WooCommerce
    if (!currency || currency === 'USD') {
      return priceString;
    }
    
    // Convert to specified currency
    return convertWooCommercePrice(priceString, currency);
  }

  return null;
}

/**
 * Extracts stock status from WooCommerce product
 *
 * Returns WooCommerce stock status enum value. Common values:
 * - "IN_STOCK" - Available for purchase
 * - "OUT_OF_STOCK" - Not available
 * - "ON_BACKORDER" - Can order but will ship later
 *
 * @param product - Product from GraphQL query
 * @returns Stock status string or null if unavailable
 *
 * @example
 * ```ts
 * const status = getProductStockStatus(product);
 * const isAvailable = status === 'IN_STOCK';
 * ```
 */
export function getProductStockStatus(product: Product | null | undefined): string | null {
  if (!product) return null;

  if ('stockStatus' in product && product.stockStatus) {
    return product.stockStatus;
  }

  return null;
}

/**
 * Checks if WooCommerce product is currently on sale
 *
 * Sale status is set in WooCommerce admin when sale price is active.
 * Use this to show "SALE" badges or calculate discounts.
 *
 * @param product - Product from GraphQL query
 * @returns true if product has active sale, false otherwise
 *
 * @example
 * ```tsx
 * {isProductOnSale(product) && (
 *   <span className="badge">SALE</span>
 * )}
 * ```
 */
export function isProductOnSale(product: Product | null | undefined): boolean {
  if (!product) return false;

  if ('onSale' in product) {
    return Boolean(product.onSale);
  }

  return false;
}
