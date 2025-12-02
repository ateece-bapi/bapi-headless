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
  const safe = (raw ?? {}) as Record<string, unknown>;

  if (!('product' in safe) || safe.product == null) return { product: null } as GetProductBySlugQuery;

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

  // Normalize variations to the { nodes: [] } shape
  const variRaw = productRaw.variations as Record<string, unknown> | null | undefined;
  if (!variRaw) {
    p.variations = { nodes: [] };
  } else if (variRaw && typeof variRaw === 'object') {
    const nodes = Array.isArray((variRaw as Record<string, unknown>).nodes) ? ((variRaw as Record<string, unknown>).nodes as Array<Record<string, unknown>>) : [];
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
      const vImage = vImageRaw && typeof vImageRaw === 'object'
        ? {
            sourceUrl: String(vImageRaw.sourceUrl ?? vImageRaw.source_url ?? ''),
            altText: (vImageRaw.altText ?? vImageRaw.alt_text ?? vImageRaw.alt ?? '') as string | null,
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
  p.shortDescription = (p.shortDescription ?? (productRaw.short_description ?? null)) as string | null;
  p.description = (p.description ?? (productRaw.content ?? null)) as string | null;

  return { product: p as GetProductBySlugQuery['product'] } as GetProductBySlugQuery;
}

/**
 * Server-side function to fetch product categories
 */
export async function getProductCategories(first: number = 100): Promise<GetProductCategoriesQuery> {
  const client = getGraphQLClient();
  return client.request(GetProductCategoriesDocument, { first });
}
