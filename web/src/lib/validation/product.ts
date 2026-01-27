import { z } from 'zod';

/**
 * Zod schema for product image validation
 * 
 * Validates WooCommerce image structure from GraphQL responses.
 * Ensures sourceUrl is valid URL and altText is optional.
 */
export const imageSchema = z.object({
  sourceUrl: z.string().url(),
  altText: z.string().nullable().optional(),
});

/**
 * Zod schema for product gallery validation
 * 
 * Validates array of gallery images. Gallery may be absent or empty.
 */
export const galleryImagesSchema = z.object({
  nodes: z.array(imageSchema).optional(),
}).optional();

/**
 * Zod schema for product variations validation
 * 
 * Validates WooCommerce product variations (size, color, etc.).
 * Used for variable products with multiple SKUs.
 */
export const variationsSchema = z.object({
  nodes: z.array(z.any()).optional(),
}).optional();

/**
 * Zod schema for complete product validation
 * 
 * Validates full product structure from WooCommerce GraphQL.
 * Use with .parse() for runtime validation or .safeParse() to handle errors.
 * 
 * @example
 * ```ts
 * const product = productSchema.parse(data);
 * // Or with error handling:
 * const result = productSchema.safeParse(data);
 * if (!result.success) {
 *   console.error(result.error);
 * }
 * ```
 */
export const productSchema = z.object({
  id: z.string(),
  databaseId: z.number(),
  name: z.string(),
  slug: z.string(),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  __typename: z.string().optional(),
  price: z.string(),
  stockStatus: z.string().optional(),
  image: imageSchema.nullable().optional(),
  galleryImages: galleryImagesSchema,
  variations: variationsSchema,
});

export type Product = z.infer<typeof productSchema>;

/**
 * Zod schema for GraphQL product query response
 * 
 * Validates the shape of getProductBySlug GraphQL responses.
 * Product field is nullable (returns null for 404/not found).
 */
export const getProductQuerySchema = z.object({
  product: productSchema.nullable().optional(),
});

export type ProductQuery = z.infer<typeof getProductQuerySchema>;

