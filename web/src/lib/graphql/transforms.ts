import { cache } from 'react';
import type { GetProductBySlugQuery } from './generated';
import { getProductPrice, getProductStockStatus } from './types';

/**
 * Cached product transformation for client components
 * Runs once per request and reuses result across components
 */
export const transformProductForClient = cache((product: GetProductBySlugQuery['product']) => {
  if (!product) return null;

  return {
    id: product.id,
    databaseId: product.databaseId ?? 0,
    name: product.name ?? 'Product',
    slug: product.slug ?? '',
    partNumber: (product as any).partNumber ?? '',
    sku: (product as any).sku ?? '',
    price: getProductPrice(product) || '$0.00',
    regularPrice: (product as any).regularPrice ?? '',
    stockStatus: getProductStockStatus(product) || null,
    stockQuantity: (product as any).stockQuantity ?? null,

    // Basic fields
    image: product.image
      ? {
          sourceUrl: product.image.sourceUrl || '',
          altText: product.image.altText || product.name || '',
        }
      : null,

    // Short description only (full description loaded via Suspense)
    shortDescription: product.shortDescription || null,

    // Categories
    productCategories: Array.isArray((product as any).productCategories?.nodes)
      ? (product as any).productCategories.nodes.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        }))
      : [],

    // Gallery (limit to first 5 for initial render)
    gallery: (
      (product.galleryImages?.nodes || []) as Array<{ sourceUrl?: string; altText?: string | null }>
    )
      .slice(0, 5)
      .map((node) => ({
        sourceUrl: node?.sourceUrl ?? '',
        altText: node?.altText ?? '',
      })),

    // Variations
    variations: Array.isArray((product as any).variations?.nodes)
      ? (product as any).variations.nodes.map((v: any) => ({
          id: v.id,
          databaseId: v.databaseId ?? 0,
          name: v.name ?? `${product.name ?? 'Product'} variant`,
          price: v.price ?? null,
          regularPrice: v.regularPrice ?? null,
          attributes: Array.isArray(v.attributes?.nodes)
            ? v.attributes.nodes.reduce((acc: Record<string, string>, a: any) => {
                if (a && a.name && a.value) acc[a.name] = a.value;
                return acc;
              }, {})
            : {},
          image: v.image
            ? { sourceUrl: v.image.sourceUrl ?? '', altText: v.image.altText ?? '' }
            : null,
          partNumber: v.partNumber ?? null,
          sku: v.sku ?? null,
        }))
      : [],
  };
});
