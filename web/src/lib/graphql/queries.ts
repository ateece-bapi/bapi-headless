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

  const resp = await client.request(GetProductBySlugDocument, { slug });
  // Normalize the response at the fetch layer so callers receive a
  // consistent, repaired shape and validation can run deterministically.
  return normalizeProductQueryResponse(resp);
}

// Normalizer: Make best-effort repairs to common GraphQL response issues so
// callers (and validation) can depend on a consistent shape.
export function normalizeProductQueryResponse(raw: unknown): GetProductBySlugQuery {
  const safe = (raw ?? {}) as any;

  if (!safe.product) return { product: null } as GetProductBySlugQuery;

  const p = { ...safe.product } as any;

  if (p.__typename === undefined || p.__typename === null) {
    p.__typename = 'Product';
  }

  if (p.image && typeof p.image === 'object') {
    p.image = {
      sourceUrl: p.image.sourceUrl ?? p.image.source_url ?? '',
      altText: p.image.altText ?? p.image.alt_text ?? p.image.alt ?? '',
      mediaDetails: p.image.mediaDetails ?? p.image.media_details ?? null,
    };
  } else {
    p.image = null;
  }

  if (!p.galleryImages) {
    p.galleryImages = { nodes: [] };
  } else if (Array.isArray(p.galleryImages)) {
    p.galleryImages = { nodes: p.galleryImages };
  } else if (p.galleryImages && !Array.isArray(p.galleryImages.nodes)) {
    p.galleryImages = { nodes: p.galleryImages.nodes ? Array.from(p.galleryImages.nodes) : [] };
  }

  if (!p.variations) {
    p.variations = { nodes: [] };
  } else if (p.variations && !Array.isArray(p.variations.nodes)) {
    p.variations = { nodes: p.variations.nodes ? Array.from(p.variations.nodes) : [] };
  }

  p.name = p.name ?? '';
  p.slug = p.slug ?? '';
  p.price = p.price ?? '';
  p.shortDescription = p.shortDescription ?? p.short_description ?? null;
  p.description = p.description ?? p.content ?? null;

  return { product: p } as GetProductBySlugQuery;
}

/**
 * Server-side function to fetch product categories
 */
export async function getProductCategories(first: number = 100): Promise<GetProductCategoriesQuery> {
  const client = getGraphQLClient();
  return client.request(GetProductCategoriesDocument, { first });
}
