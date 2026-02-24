import { cache } from 'react';
import { getGraphQLClient } from './client';
import {
  GetProductsDocument,
  GetProductBySlugDocument,
  GetProductBySlugLightDocument,
  GetProductDetailsDeferredDocument,
  GetProductVariationsDocument,
  GetProductRelatedDocument,
  GetProductCategoriesDocument,
  GetProductCategoryDocument,
  GetProductsByCategoryDocument,
} from './generated';
import type {
  GetProductsQuery,
  GetProductBySlugQuery,
  GetProductBySlugLightQuery,
  GetProductDetailsDeferredQuery,
  GetProductVariationsQuery,
  GetProductRelatedQuery,
  GetProductCategoriesQuery,
  GetProductCategoryQuery,
  GetProductsByCategoryQuery,
} from './generated';
import { AppError } from '@/lib/errors';

/**
 * Server-side function to fetch products with pagination
 * Wrapped with React cache() for automatic deduplication across generateMetadata and page components
 */
export const getProducts = cache(
  async (first: number = 10, after?: string): Promise<GetProductsQuery> => {
    try {
      const client = getGraphQLClient(['products', 'product-list']);
      return await client.request(GetProductsDocument, { first, after });
    } catch (error) {
      throw new AppError(
        `Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'Unable to load products at this time. Please try again later.',
        'PRODUCTS_FETCH_ERROR',
        500
      );
    }
  }
);

/**
 * Server-side function to fetch a single product by slug
 * Wrapped with React cache() for automatic deduplication across generateMetadata and page components
 */
export const getProductBySlug = cache(async (slug: string): Promise<GetProductBySlugQuery> => {
  // Defensive validation: ensure callers pass a non-empty slug.
  // GraphQL requires `$slug: ID!` for this query; calling with an empty
  // value results in a runtime error from the server. Centralize the
  // check here so callers get a clear, early error message.
  if (slug === null || slug === undefined || String(slug).trim() === '') {
    throw new AppError(
      'getProductBySlug called without a valid slug',
      'Invalid product URL. Please check the link and try again.',
      'INVALID_PRODUCT_SLUG',
      400
    );
  }

  try {
    const client = getGraphQLClient(['products', `product-${slug}`]);
    const resp = await client.request(GetProductBySlugDocument, { slug });
    // Normalize the response at the fetch layer so callers receive a
    // consistent, repaired shape and validation can run deterministically.
    return normalizeProductQueryResponse(resp);
  } catch (error) {
    throw new AppError(
      `Failed to fetch product '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`,
      'Unable to load this product. The product may not exist or there may be a temporary issue.',
      'PRODUCT_FETCH_ERROR',
      404
    );
  }
});

// Normalizer: Make best-effort repairs to common GraphQL response issues so
// callers (and validation) can depend on a consistent shape.
/**
 * TODO (Post-Launch): Replace defensive normalization with schema validation
 * ===========================================================================
 * PROBLEM: 120-line normalizer with 8+ "as any"/"as Record<string, unknown>" casts
 *          defeats TypeScript safety and masks upstream WordPress schema issues.
 * 
 * ROOT CAUSE: This function exists to defensively handle inconsistencies in the
 *             WPGraphQL schema responses:
 * 
 * 1. Missing __typename fields on Product type
 * 2. Inconsistent image field naming:
 *    - sourceUrl vs source_url
 *    - altText vs alt_text vs alt
 *    - mediaDetails vs media_details
 * 3. Inconsistent collection structures:
 *    - galleryImages: sometimes Array, sometimes { nodes: [] }, sometimes null
 *    - variations: sometimes missing, sometimes { nodes: undefined }
 *    - attributes: sometimes Array, sometimes { nodes: [] }
 * 4. Missing relatedProducts.partNumber field
 * 5. Inconsistent string fallbacks (shortDescription vs short_description, etc.)
 * 
 * RECOMMENDED APPROACH (Post-Launch):
 * 
 * 1. Add Zod schema validation layer BETWEEN GraphQL response and normalizer
 *    - Parse raw response with Zod schema
 *    - Log warnings when normalization is actually needed (detect real problems)
 *    - Track which inconsistencies occur in production
 * 
 * 2. Fix WordPress/WPGraphQL schema at source
 *    - Ensure WPGraphQL returns consistent field naming (camelCase)
 *    - Guarantee { nodes: [] } shape for all connection types
 *    - Add missing fields to schema (partNumber on related products)
 *    - Ensure __typename always present
 * 
 * 3. Add unit tests for normalizeProductQueryResponse
 *    - Test with malformed inputs (missing fields, wrong types, null values)
 *    - Ensure backward compatibility during migration
 *    - Document which edge cases are actually possible vs overcautious
 * 
 * 4. Gradually remove normalization as schema becomes reliable
 *    - Once Zod validation shows schema is consistent for 30 days
 *    - Remove unnecessary fallbacks and type casts
 *    - Let TypeScript do its job
 * 
 * SEVERITY: Low (works correctly, but hides upstream problems and defeats type safety)
 * URGENCY: Defer to post-launch (Phase 1 launches April 10, 2026)
 * 
 * EXAMPLE ISSUES THIS MASKS:
 * - Line 48: (galleryRaw as Record<string, unknown>).nodes
 * - Line 60-61: (rp.image as any).sourceUrl / .altText
 * - Line 79-80: (attrsRaw as any).nodes
 * - Line 119: Final cast loses all type information
 */
export function normalizeProductQueryResponse(raw: unknown): GetProductBySlugQuery {
  const safe = (raw ?? {}) as Record<string, unknown>;

  if (!('product' in safe) || safe.product == null)
    return { product: null } as GetProductBySlugQuery;

  const productRaw = safe.product as Record<string, unknown>;
  const p: Record<string, unknown> = { ...productRaw };

  // Ensure typename exists
  if (p.__typename === undefined || p.__typename === null) {
    p.__typename = 'Product';
  }

  // Normalize image fields from various WP naming conventions
  const imageRaw = productRaw.image as Record<string, unknown> | null | undefined;
  if (imageRaw && typeof imageRaw === 'object') {
    const normalizedImage = {
      sourceUrl: String(imageRaw.sourceUrl ?? imageRaw.source_url ?? ''),
      altText: (imageRaw.altText ?? imageRaw.alt_text ?? imageRaw.alt ?? '') as string | null,
      mediaDetails: imageRaw.mediaDetails ?? imageRaw.media_details ?? null,
    };
    p.image = normalizedImage;
  } else {
    p.image = null;
  }

  // Normalize galleryImages to the { nodes: [] } shape
  const galleryRaw = productRaw.galleryImages;
  if (!galleryRaw) {
    p.galleryImages = { nodes: [] };
  } else if (Array.isArray(galleryRaw)) {
    p.galleryImages = { nodes: galleryRaw };
  } else if (galleryRaw && typeof galleryRaw === 'object') {
    const nodes = Array.isArray((galleryRaw as Record<string, unknown>).nodes)
      ? ((galleryRaw as Record<string, unknown>).nodes as Array<Record<string, unknown>>)
      : [];
    p.galleryImages = { nodes };
  }

  // Normalize related products to include partNumber
  const relatedRaw = productRaw.related as { nodes?: Array<Record<string, unknown>> } | undefined;
  p.relatedProducts = Array.isArray(relatedRaw?.nodes)
    ? relatedRaw.nodes.map((rp) => ({
        id: rp.id ?? '',
        name: rp.name ?? '',
        slug: rp.slug ?? '',
        partNumber: rp.partNumber ?? '',
        image:
          rp.image && typeof rp.image === 'object' && 'sourceUrl' in rp.image
            ? {
                sourceUrl: (rp.image as any).sourceUrl ?? '',
                altText: (rp.image as any).altText ?? rp.name ?? '',
              }
            : null,
      }))
    : [];

  // Normalize sku for main product
  p.sku = productRaw.sku ?? '';

  // Normalize variations to the { nodes: [] } shape
  const variRaw = productRaw.variations as Record<string, unknown> | null | undefined;
  if (!variRaw) {
    p.variations = { nodes: [] };
  } else if (variRaw && typeof variRaw === 'object') {
    const nodes = Array.isArray((variRaw as Record<string, unknown>).nodes)
      ? ((variRaw as Record<string, unknown>).nodes as Array<Record<string, unknown>>)
      : [];
    // Normalize each variation's attributes and image fields for consistency
    const normalizedVariations = nodes.map((vn) => {
      const v = (vn ?? {}) as Record<string, unknown>;

      // Normalize attributes to { nodes: Array< { name, label, value } > }
      const attrsRaw = v.attributes as Record<string, unknown> | null | undefined;
      let attrsNodes: Array<Record<string, unknown>> = [];
      if (attrsRaw) {
        if (Array.isArray((attrsRaw as any).nodes)) {
          attrsNodes = (attrsRaw as any).nodes as Array<Record<string, unknown>>;
        } else if (Array.isArray(attrsRaw)) {
          attrsNodes = attrsRaw as Array<Record<string, unknown>>;
        }
      }

      const normalizedAttrs = attrsNodes.map((a) => ({
        id: a?.id ?? null,
        name: a?.name ?? a?.label ?? null,
        label: a?.label ?? a?.name ?? null,
        value: a?.value ?? null,
      }));

      // Normalize variation image
      const vImageRaw = v.image as Record<string, unknown> | null | undefined;
      const vImage =
        vImageRaw && typeof vImageRaw === 'object'
          ? {
              sourceUrl: String(vImageRaw.sourceUrl ?? vImageRaw.source_url ?? ''),
              altText: (vImageRaw.altText ?? vImageRaw.alt_text ?? vImageRaw.alt ?? '') as
                | string
                | null,
            }
          : null;

      return {
        ...v,
        attributes: { nodes: normalizedAttrs },
        image: vImage,
      } as Record<string, unknown>;
    });

    p.variations = { nodes: normalizedVariations };
  }

  // Basic string fallbacks
  p.name = (p.name ?? '') as string;
  p.slug = (p.slug ?? '') as string;
  p.price = (p.price ?? '') as string;
  p.shortDescription = (p.shortDescription ?? productRaw.short_description ?? null) as
    | string
    | null;
  p.description = (p.description ?? productRaw.content ?? null) as string | null;

  return { product: p as GetProductBySlugQuery['product'] } as GetProductBySlugQuery;
}

/**
 * Lightweight product query for initial page load (above-the-fold only)
 * Reduces payload by ~70% for faster Time to First Byte
 * Only fetches: name, price, main image, short description, categories
 */
export const getProductBySlugLight = cache(
  async (slug: string): Promise<GetProductBySlugLightQuery> => {
    if (slug === null || slug === undefined || String(slug).trim() === '') {
      throw new AppError(
        'getProductBySlugLight called without a valid slug',
        'Invalid product URL. Please check the link and try again.',
        'INVALID_PRODUCT_SLUG',
        400
      );
    }

    try {
      const client = getGraphQLClient(['products', `product-light-${slug}`]);
      return await client.request(GetProductBySlugLightDocument, { slug });
    } catch (error) {
      throw new AppError(
        `Failed to fetch product '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        'Unable to load this product. The product may not exist or there may be a temporary issue.',
        'PRODUCT_FETCH_ERROR',
        404
      );
    }
  }
);

/**
 * Deferred product details (description, gallery, tags, multipliers)
 * Load after hero section renders in separate Suspense boundary
 */
export const getProductDetailsDeferred = cache(
  async (id: string): Promise<GetProductDetailsDeferredQuery> => {
    if (!id) {
      throw new AppError(
        'getProductDetailsDeferred called without a valid ID',
        'Invalid product ID',
        'INVALID_PRODUCT_ID',
        400
      );
    }

    try {
      const client = getGraphQLClient(['products', `product-details-${id}`]);
      return await client.request(GetProductDetailsDeferredDocument, { id });
    } catch (error) {
      throw new AppError(
        `Failed to fetch product details for ID '${id}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        'Unable to load product details.',
        'PRODUCT_DETAILS_FETCH_ERROR',
        500
      );
    }
  }
);

/**
 * Product variations for VariableProduct configurator
 * Only load when needed for variable products
 */
export const getProductVariations = cache(
  async (id: string): Promise<GetProductVariationsQuery> => {
    if (!id) {
      throw new AppError(
        'getProductVariations called without a valid ID',
        'Invalid product ID',
        'INVALID_PRODUCT_ID',
        400
      );
    }

    try {
      const client = getGraphQLClient(['products', `product-variations-${id}`]);
      return await client.request(GetProductVariationsDocument, { id });
    } catch (error) {
      throw new AppError(
        `Failed to fetch variations for product ID '${id}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        'Unable to load product variations.',
        'PRODUCT_VARIATIONS_FETCH_ERROR',
        500
      );
    }
  }
);

/**
 * Related products
 * Load in separate Suspense boundary at bottom of page
 */
export const getProductRelated = cache(async (id: string): Promise<GetProductRelatedQuery> => {
  if (!id) {
    throw new AppError(
      'getProductRelated called without a valid ID',
      'Invalid product ID',
      'INVALID_PRODUCT_ID',
      400
    );
  }

  try {
    const client = getGraphQLClient(['products', `product-related-${id}`]);
    return await client.request(GetProductRelatedDocument, { id });
  } catch (error) {
    throw new AppError(
      `Failed to fetch related products for ID '${id}': ${error instanceof Error ? error.message : 'Unknown error'}`,
      'Unable to load related products.',
      'PRODUCT_RELATED_FETCH_ERROR',
      500
    );
  }
});

/**
 * Server-side function to fetch product categories
 */
export async function getProductCategories(
  first: number = 100
): Promise<GetProductCategoriesQuery> {
  const client = getGraphQLClient(['products', 'categories']);
  return client.request(GetProductCategoriesDocument, { first });
}

/**
 * Server-side function to fetch a single product category by slug
 * Wrapped with React cache() for automatic deduplication across generateMetadata and page components
 */
export const getProductCategory = cache(async (slug: string): Promise<GetProductCategoryQuery> => {
  if (slug === null || slug === undefined || String(slug).trim() === '') {
    throw new AppError(
      'getProductCategory called without a valid slug',
      'Invalid category URL. Please check the link and try again.',
      'INVALID_CATEGORY_SLUG',
      400
    );
  }

  try {
    const client = getGraphQLClient(['products', 'categories', `category-${slug}`]);
    return await client.request(GetProductCategoryDocument, { slug });
  } catch (error) {
    throw new AppError(
      `Failed to fetch category '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`,
      'Unable to load this category. The category may not exist or there may be a temporary issue.',
      'CATEGORY_FETCH_ERROR',
      404
    );
  }
});

/**
 * Server-side function to fetch products by category slug with pagination
 * Wrapped with React cache() for automatic deduplication across generateMetadata and page components
 */
export const getProductsByCategory = cache(
  async (
    categorySlug: string,
    first: number = 50,
    after?: string
  ): Promise<GetProductsByCategoryQuery> => {
    if (categorySlug === null || categorySlug === undefined || String(categorySlug).trim() === '') {
      throw new AppError(
        'getProductsByCategory called without a valid category slug',
        'Invalid category. Please check the link and try again.',
        'INVALID_CATEGORY_SLUG',
        400
      );
    }

    try {
      const client = getGraphQLClient(['products', `category-${categorySlug}`]);
      return await client.request(GetProductsByCategoryDocument, {
        categorySlug,
        first,
        after,
      });
    } catch (error) {
      throw new AppError(
        `Failed to fetch products for category '${categorySlug}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        'Unable to load products for this category. Please try again later.',
        'CATEGORY_PRODUCTS_FETCH_ERROR',
        500
      );
    }
  }
);
