import { describe, it, expect } from 'vitest';
import { getProductBySlug } from './queries';

describe('getProductBySlug', () => {
  it('throws a descriptive error when called with an empty slug', async () => {
    // Ensure the GraphQL client initializer doesn't fail due to missing env in tests
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://example.test/graphql';

    await expect(getProductBySlug('' as any)).rejects.toThrow(
      'getProductBySlug called without a valid `slug` (received empty value)'
    );
  });
});
