import { getProductBySlug } from './queries';
import { getProductQuerySchema, ProductQuery } from '@/lib/validation/product';

/**
 * Fetches product by slug and validates the returned shape using Zod.
 * Throws if the response doesn't match the expected schema.
 */
export async function getProductBySlugValidated(slug: string): Promise<ProductQuery> {
  const resp = await getProductBySlug(slug);
  const result = getProductQuerySchema.safeParse(resp);
  if (!result.success) {
    // For observability, throw a descriptive error so the caller can log/monitor
    throw new Error(`Invalid product shape from GraphQL for slug=${slug}: ${JSON.stringify(result.error.format())}`);
  }
  return result.data;
}
