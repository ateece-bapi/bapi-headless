import { gql } from 'graphql-request';

/**
 * GraphQL queries for fetching WooCommerce customer orders
 * Uses WordPress customer ID linked in Clerk metadata
 */

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($customerId: Int!, $first: Int = 10, $after: String) {
    customer(customerId: $customerId) {
      orders(first: $first, after: $after) {
        nodes {
          id
          databaseId
          orderNumber
          date
          status
          total
          subtotal
          totalTax
          shippingTotal
          discountTotal
          paymentMethod
          paymentMethodTitle
          customerNote
          billing {
            firstName
            lastName
            company
            address1
            address2
            city
            state
            postcode
            country
            email
            phone
          }
          shipping {
            firstName
            lastName
            company
            address1
            address2
            city
            state
            postcode
            country
          }
          lineItems {
            nodes {
              productId
              variationId
              quantity
              subtotal
              total
              totalTax
              product {
                node {
                  ... on SimpleProduct {
                    id
                    databaseId
                    name
                    slug
                    image {
                      sourceUrl
                    }
                  }
                }
              }
            }
          }
          shippingLines {
            nodes {
              methodTitle
              total
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const GET_CUSTOMER_ORDER_DETAILS = gql`
  query GetCustomerOrderDetails($orderId: Int!) {
    order(id: $orderId, idType: DATABASE_ID) {
      id
      databaseId
      orderNumber
      date
      status
      total
      subtotal
      totalTax
      shippingTotal
      discountTotal
      paymentMethod
      paymentMethodTitle
      customerNote
      billing {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
        email
        phone
      }
      shipping {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
      }
      lineItems {
        nodes {
          productId
          variationId
          quantity
          subtotal
          subtotalTax
          total
          totalTax
          product {
            node {
              ... on SimpleProduct {
                id
                databaseId
                name
                slug
                image {
                  sourceUrl
                }
                price
              }
            }
          }
        }
      }
      shippingLines {
        nodes {
          methodTitle
          total
        }
      }
      couponLines {
        nodes {
          code
          discount
        }
      }
      refunds {
        nodes {
          id
          amount
          reason
          date
        }
      }
    }
  }
`;

export const GET_CUSTOMER_INFO = gql`
  query GetCustomerInfo($customerId: Int!) {
    customer(customerId: $customerId) {
      id
      databaseId
      email
      firstName
      lastName
      username
      billing {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
        email
        phone
      }
      shipping {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
      }
      orderCount
    }
  }
`;
