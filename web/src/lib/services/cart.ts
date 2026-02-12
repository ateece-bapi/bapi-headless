/**
 * WooCommerce Cart Service
 *
 * Handles all cart operations with WooCommerce GraphQL backend.
 * Manages session persistence, stock validation, and cart synchronization.
 *
 * Features:
 * - Server-side cart persistence with WooCommerce sessions
 * - Real-time stock validation
 * - Shipping and tax calculations
 * - Coupon code support
 * - Error handling with user-friendly messages
 */

import { getGraphQLClient } from '@/lib/graphql/client';
import type {
  AddToCartMutation,
  AddToCartMutationVariables,
  GetCartQuery,
  UpdateCartItemQuantityMutation,
  UpdateCartItemQuantityMutationVariables,
  RemoveItemsFromCartMutation,
  RemoveItemsFromCartMutationVariables,
  EmptyCartMutation,
  ApplyCouponMutation,
  ApplyCouponMutationVariables,
  RemoveCouponMutation,
  RemoveCouponMutationVariables,
} from '@/lib/graphql/generated';
import { gql } from 'graphql-request';

// Re-export cart queries for use in API routes
export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($productId: Int!, $quantity: Int = 1, $variationId: Int) {
    addToCart(input: { productId: $productId, quantity: $quantity, variationId: $variationId }) {
      cart {
        isEmpty
        total
        subtotal
        contentsTax
        shippingTotal
        totalTax
        contents {
          nodes {
            key
            quantity
            subtotal
            total
            product {
              node {
                id
                databaseId
                name
                slug
                ... on SimpleProduct {
                  price
                  stockStatus
                  stockQuantity
                }
                ... on VariableProduct {
                  price
                  stockStatus
                }
                image {
                  sourceUrl
                  altText
                }
              }
            }
            variation {
              node {
                id
                databaseId
                name
                price
                stockStatus
                stockQuantity
              }
            }
          }
        }
      }
      cartItem {
        key
        quantity
        total
      }
    }
  }
`;

export const GET_CART_QUERY = gql`
  query GetCart {
    cart {
      isEmpty
      total
      subtotal
      contentsTax
      shippingTotal
      shippingTax
      totalTax
      discountTotal
      discountTax
      contents {
        itemCount
        nodes {
          key
          quantity
          subtotal
          total
          tax
          product {
            node {
              id
              databaseId
              name
              slug
              ... on SimpleProduct {
                price
                regularPrice
                salePrice
                stockStatus
                stockQuantity
              }
              ... on VariableProduct {
                price
                regularPrice
                salePrice
                stockStatus
              }
              image {
                sourceUrl
                altText
              }
            }
          }
          variation {
            node {
              id
              databaseId
              name
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
              image {
                sourceUrl
                altText
              }
            }
          }
        }
      }
      availableShippingMethods {
        packageDetails
        rates {
          id
          label
          cost
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM_MUTATION = gql`
  mutation UpdateCartItemQuantity($key: ID!, $quantity: Int!) {
    updateItemQuantities(input: { items: [{ key: $key, quantity: $quantity }] }) {
      cart {
        isEmpty
        total
        subtotal
        contentsTax
        shippingTotal
        totalTax
        contents {
          nodes {
            key
            quantity
            subtotal
            total
            product {
              node {
                id
                databaseId
                name
                slug
                ... on SimpleProduct {
                  price
                  stockStatus
                }
                ... on VariableProduct {
                  price
                  stockStatus
                }
                image {
                  sourceUrl
                  altText
                }
              }
            }
            variation {
              node {
                id
                databaseId
                name
                price
                stockStatus
              }
            }
          }
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation RemoveItemsFromCart($key: ID!) {
    removeItemsFromCart(input: { keys: [$key] }) {
      cart {
        isEmpty
        total
        subtotal
        contentsTax
        shippingTotal
        totalTax
        contents {
          nodes {
            key
            quantity
            subtotal
            total
            product {
              node {
                id
                databaseId
                name
                slug
                ... on SimpleProduct {
                  price
                  stockStatus
                }
                ... on VariableProduct {
                  price
                  stockStatus
                }
                image {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const EMPTY_CART_MUTATION = gql`
  mutation EmptyCart {
    emptyCart(input: { clearPersistentCart: true }) {
      cart {
        isEmpty
        total
      }
    }
  }
`;

export const APPLY_COUPON_MUTATION = gql`
  mutation ApplyCoupon($code: String!) {
    applyCoupon(input: { code: $code }) {
      cart {
        total
        subtotal
        discountTotal
        appliedCoupons {
          code
          discountAmount
          description
        }
      }
    }
  }
`;

export const REMOVE_COUPON_MUTATION = gql`
  mutation RemoveCoupon($codes: [String!]!) {
    removeCoupons(input: { codes: $codes }) {
      cart {
        total
        subtotal
        discountTotal
        appliedCoupons {
          code
          discountAmount
        }
      }
    }
  }
`;

/**
 * Cart Service - All WooCommerce cart operations
 */
export class CartService {
  /**
   * Get current cart from WooCommerce
   *
   * @param sessionToken - WooCommerce session token (from cookies)
   * @returns Cart data with items, totals, shipping, and tax
   */
  static async getCart(sessionToken?: string): Promise<GetCartQuery> {
    const client = getGraphQLClient(
      ['cart'],
      false,
      sessionToken ? { 'woocommerce-session': `Session ${sessionToken}` } : undefined
    );

    return client.request<GetCartQuery>(GET_CART_QUERY);
  }

  /**
   * Add item to cart
   *
   * @param productId - WooCommerce product database ID
   * @param quantity - Quantity to add
   * @param variationId - Optional variation ID for variable products
   * @param sessionToken - WooCommerce session token
   * @returns Updated cart data
   */
  static async addToCart(
    productId: number,
    quantity: number = 1,
    variationId?: number,
    sessionToken?: string
  ): Promise<AddToCartMutation> {
    const client = getGraphQLClient(
      ['cart'],
      false,
      sessionToken ? { 'woocommerce-session': `Session ${sessionToken}` } : undefined
    );

    return client.request<AddToCartMutation, AddToCartMutationVariables>(ADD_TO_CART_MUTATION, {
      productId,
      quantity,
      variationId,
    });
  }

  /**
   * Update cart item quantity
   *
   * @param key - Cart item key from WooCommerce
   * @param quantity - New quantity (0 to remove)
   * @param sessionToken - WooCommerce session token
   * @returns Updated cart data
   */
  static async updateQuantity(
    key: string,
    quantity: number,
    sessionToken?: string
  ): Promise<UpdateCartItemQuantityMutation> {
    const client = getGraphQLClient(
      ['cart'],
      false,
      sessionToken ? { 'woocommerce-session': `Session ${sessionToken}` } : undefined
    );

    return client.request<UpdateCartItemQuantityMutation, UpdateCartItemQuantityMutationVariables>(
      UPDATE_CART_ITEM_MUTATION,
      { key, quantity }
    );
  }

  /**
   * Remove item from cart
   *
   * @param key - Cart item key from WooCommerce
   * @param sessionToken - WooCommerce session token
   * @returns Updated cart data
   */
  static async removeItem(
    key: string,
    sessionToken?: string
  ): Promise<RemoveItemsFromCartMutation> {
    const client = getGraphQLClient(
      ['cart'],
      false,
      sessionToken ? { 'woocommerce-session': `Session ${sessionToken}` } : undefined
    );

    return client.request<RemoveItemsFromCartMutation, RemoveItemsFromCartMutationVariables>(
      REMOVE_FROM_CART_MUTATION,
      { key }
    );
  }

  /**
   * Clear all items from cart
   *
   * @param sessionToken - WooCommerce session token
   * @returns Empty cart data
   */
  static async emptyCart(sessionToken?: string): Promise<EmptyCartMutation> {
    const client = getGraphQLClient(
      ['cart'],
      false,
      sessionToken ? { 'woocommerce-session': `Session ${sessionToken}` } : undefined
    );

    return client.request<EmptyCartMutation>(EMPTY_CART_MUTATION);
  }

  /**
   * Apply coupon code to cart
   *
   * @param code - Coupon code
   * @param sessionToken - WooCommerce session token
   * @returns Updated cart with discount applied
   */
  static async applyCoupon(code: string, sessionToken?: string): Promise<ApplyCouponMutation> {
    const client = getGraphQLClient(
      ['cart'],
      false,
      sessionToken ? { 'woocommerce-session': `Session ${sessionToken}` } : undefined
    );

    return client.request<ApplyCouponMutation, ApplyCouponMutationVariables>(
      APPLY_COUPON_MUTATION,
      { code }
    );
  }

  /**
   * Remove coupon from cart
   *
   * @param codes - Array of coupon codes to remove
   * @param sessionToken - WooCommerce session token
   * @returns Updated cart without coupons
   */
  static async removeCoupon(codes: string[], sessionToken?: string): Promise<RemoveCouponMutation> {
    const client = getGraphQLClient(
      ['cart'],
      false,
      sessionToken ? { 'woocommerce-session': `Session ${sessionToken}` } : undefined
    );

    return client.request<RemoveCouponMutation, RemoveCouponMutationVariables>(
      REMOVE_COUPON_MUTATION,
      { codes }
    );
  }
}
