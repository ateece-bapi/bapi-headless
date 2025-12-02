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

  it('resolves with product data when given a valid slug', async () => {
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://example.test/graphql';

    const mockProduct = {
      product: {
        id: 'prod-1',
        databaseId: 1,
        name: 'Test Product',
        slug: 'test-product',
        description: '<p>Full description</p>',
        shortDescription: '<p>Short</p>',
        __typename: 'SimpleProduct',
        price: '$9.99',
        image: null,
        galleryImages: { nodes: [] },
        variations: { nodes: [] },
      },
    };

    // Mock the GraphQL client module before importing queries so the module
    // uses our test double when calling getGraphQLClient().
    const vi = (await import('vitest')).vi;
    vi.mock('./client', () => ({
      getGraphQLClient: () => ({
        request: async (_doc: unknown, _vars: unknown) => mockProduct,
      }),
    }));

    const mod = await import('./queries');

    const resp = await mod.getProductBySlug('test-product');
    expect(resp).toEqual(mockProduct);

    vi.unmock('./client');
  });
});
