import { getGraphQLClient } from './client';
import { GetProductsDocument, GetProductBySlugDocument, GetProductCategoriesDocument } from './generated';
import type { GetProductsQuery, GetProductBySlugQuery, GetProductCategoriesQuery } from './generated';

/**
 * Server-side function to fetch products with pagination
 */
export async function getProducts(first: number = 10, after?: string): Promise<GetProductsQuery> {
  const client = getGraphQLClient();
  return client.request(GetProductsDocument, { first, after });
}

/**
 * Server-side function to fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<GetProductBySlugQuery> {
  const client = getGraphQLClient();
  // Defensive validation: ensure callers pass a non-empty slug.
  // GraphQL requires `$slug: ID!` for this query; calling with an empty
  // value results in a runtime error from the server. Centralize the
  // check here so callers get a clear, early error message.
  if (slug === null || slug === undefined || String(slug).trim() === '') {
    throw new Error('getProductBySlug called without a valid `slug` (received empty value)');
  }

  return client.request(GetProductBySlugDocument, { slug });
}

/**
 * Server-side function to fetch product categories
 */
export async function getProductCategories(first: number = 100): Promise<GetProductCategoriesQuery> {
  const client = getGraphQLClient();
  return client.request(GetProductCategoriesDocument, { first });
}
