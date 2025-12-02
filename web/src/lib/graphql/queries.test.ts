import { describe, it, expect } from 'vitest';

describe('getProductBySlug', () => {
  it('throws a descriptive error when called with an empty slug', async () => {
    // Ensure the GraphQL client initializer doesn't fail due to missing env in tests
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://example.test/graphql';

    // Import after setting env so module-level endpoint picks up the value
    const mod = await import('./queries');

    await expect(mod.getProductBySlug('' as any)).rejects.toThrow(
      'getProductBySlug called without a valid `slug` (received empty value)'
    );
  });
});
