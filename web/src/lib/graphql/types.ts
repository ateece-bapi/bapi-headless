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
 * @param currency - Optional currency to convert price to (defaults to USD)
 * @returns Formatted price string with currency symbol, or null if unavailable
 *
 * @example
 * ```ts
 * const price = getProductPrice(product);
 * const priceInEUR = getProductPrice(product, 'EUR');
 * if (price) {
 *   console.log(`Product costs ${price}`);
 * }
 * ```
 */
export function getProductPrice(
  product: Product | null | undefined,
  currency?: CurrencyCode
): string | null {
  if (!product) return null;

  if ('price' in product && product.price) {
    // Preserve WooCommerce-formatted price (including ranges) for USD/default
    if (!currency || currency === 'USD') {
      return product.price;
    }

    // For non-USD currencies, convert the price string
    return convertWooCommercePrice(product.price, currency);
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
