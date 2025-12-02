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

    // Spy on the real client module's getGraphQLClient export so queries
    // uses our mocked implementation at runtime (ESM live-binding).
    const { vi } = await import('vitest');
    const clientModule = await import('./client');
    const spy = vi.spyOn(clientModule, 'getGraphQLClient').mockImplementation(() => ({
      request: async (_doc: unknown, _vars: unknown) => mockProduct,
    } as any));

    const mod = await import('./queries');

    const resp = await mod.getProductBySlug('test-product');
    expect(resp).toEqual(mockProduct);

    spy.mockRestore();
  });

  it('normalizes incomplete GraphQL responses (adds __typename, normalizes gallery/image)', async () => {
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://example.test/graphql';

    const incompleteProduct = {
      product: {
        id: 'prod-2',
        databaseId: 2,
        name: 'Incomplete Product',
        slug: 'incomplete-product',
        // missing __typename
        price: '$19.99',
        // image uses alternative keys sometimes returned by WP
        image: { source_url: 'https://example.test/img.png', alt_text: 'Alt Text' },
        // galleryImages is null in some responses
        galleryImages: null,
        // variations missing nodes
        variations: null,
      },
    };

    const { vi } = await import('vitest');
    const clientModule = await import('./client');
    const spy = vi.spyOn(clientModule, 'getGraphQLClient').mockImplementation(() => ({
      request: async (_doc: unknown, _vars: unknown) => incompleteProduct,
    } as any));

    const mod = await import('./queries');

    const resp = await mod.getProductBySlug('incomplete-product');
    expect(resp).toHaveProperty('product');
    const p = resp.product as any;
    // normalizer should add a __typename
    expect(p.__typename).toBeDefined();
    // image should be normalized to have sourceUrl and altText
    expect(p.image).toBeDefined();
    expect(p.image.sourceUrl).toBe('https://example.test/img.png');
    expect(p.image.altText).toBe('Alt Text');
    // galleryImages.nodes should be an array
    expect(Array.isArray(p.galleryImages?.nodes)).toBe(true);
    // variations.nodes should be an array
    expect(Array.isArray(p.variations?.nodes)).toBe(true);

    spy.mockRestore();
  });
});
