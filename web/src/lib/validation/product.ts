import { z } from 'zod';

export const imageSchema = z.object({
  sourceUrl: z.string().url(),
  altText: z.string().nullable().optional(),
});

export const galleryImagesSchema = z.object({
  nodes: z.array(imageSchema).optional(),
}).optional();

export const variationsSchema = z.object({
  nodes: z.array(z.any()).optional(),
}).optional();

export const productSchema = z.object({
  id: z.string(),
  databaseId: z.number(),
  name: z.string(),
  slug: z.string(),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  __typename: z.string().optional(),
  price: z.string(),
  image: imageSchema.nullable().optional(),
  galleryImages: galleryImagesSchema,
  variations: variationsSchema,
});

export type Product = z.infer<typeof productSchema>;

export const getProductQuerySchema = z.object({
  product: productSchema.nullable().optional(),
});

export type ProductQuery = z.infer<typeof getProductQuerySchema>;
