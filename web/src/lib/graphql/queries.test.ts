import { describe, it, expect } from 'vitest';
import type { GetProductBySlugQuery } from '@/lib/graphql';

describe('getProductBySlug', () => {
  it('throws a descriptive error when called with an empty slug', async () => {
    // Ensure the GraphQL client initializer doesn't fail due to missing env in tests
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://example.test/graphql';

    // Import after setting env so module-level endpoint picks up the value
    const mod = await import('./queries');

    await expect(mod.getProductBySlug('')).rejects.toThrow(
      'getProductBySlug called without a valid slug'
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
        relatedProducts: [],
        sku: '',
      },
    };

    // Spy on the real client module's getGraphQLClient export so queries
    // uses our mocked implementation at runtime (ESM live-binding).
    const { vi } = await import('vitest');
    const clientModule = await import('./client');
    const spy = vi.spyOn(clientModule, 'getGraphQLClient').mockImplementation(() => ({
      request: async (
        _doc: import('graphql-request').RequestDocument,
        _vars?: Record<string, unknown>
      ) => mockProduct,
    } as ReturnType<typeof clientModule.getGraphQLClient>));

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
      request: async (
        _doc: import('graphql-request').RequestDocument,
        _vars?: Record<string, unknown>
      ) => incompleteProduct,
    } as ReturnType<typeof clientModule.getGraphQLClient>));

    const mod = await import('./queries');

    const resp = await mod.getProductBySlug('incomplete-product');
    expect(resp).toHaveProperty('product');
    const p = resp.product;
    
    // Ensure product is not null
    expect(p).toBeDefined();
    expect(p).not.toBeNull();
    if (!p) throw new Error('Product should not be null');

    // normalizer should add a __typename
    expect(p.__typename).toBeDefined();
    // image should be normalized to have sourceUrl and altText
    expect(p.image).toBeDefined();
    expect(p.image?.sourceUrl).toBe('https://example.test/img.png');
    expect(p.image?.altText).toBe('Alt Text');
    // galleryImages.nodes should be an array
    expect(Array.isArray(p.galleryImages?.nodes)).toBe(true);
    
    // variations is only on VariableProduct, so check type first
    if ('variations' in p) {
      expect(Array.isArray(p.variations?.nodes)).toBe(true);
    }

    spy.mockRestore();
  });

  it('normalizes variation attributes and variation image', async () => {
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'http://example.test/graphql';

    const productWithVariations = {
      product: {
        id: 'prod-3',
        databaseId: 3,
        name: 'Variable Product',
        slug: 'variable-product',
        __typename: 'VariableProduct',
        price: '$29.99',
        variations: {
          nodes: [
            {
              id: 'var-1',
              databaseId: 101,
              name: 'Variant A',
              price: '$29.99',
              // attributes may come back as nodes with varying keys
              attributes: { nodes: [{ id: 'a1', name: 'Size', value: 'M' }, { id: 'a2', name: 'Color', value: 'Red' }] },
              // variation image may use WP naming
              image: { source_url: 'https://example.test/var-a.png', alt_text: 'Variant A' },
            },
          ],
        },
      },
    };

    const { vi } = await import('vitest');
    const clientModule = await import('./client');
    const spy = vi.spyOn(clientModule, 'getGraphQLClient').mockImplementation(() => ({
      request: async (
        _doc: import('graphql-request').RequestDocument,
        _vars?: Record<string, unknown>
      ) => productWithVariations,
    } as ReturnType<typeof clientModule.getGraphQLClient>));

    const mod = await import('./queries');
    const resp = await mod.getProductBySlug('variable-product');
    expect(resp).toHaveProperty('product');

    const p = resp.product;
    
    // Ensure product is not null and has variations
    expect(p).toBeDefined();
    expect(p).not.toBeNull();
    if (!p || !('variations' in p)) {
      throw new Error('Product should be a VariableProduct with variations');
    }
    
    expect(Array.isArray(p.variations?.nodes)).toBe(true);
    const v = p.variations?.nodes?.[0];
    expect(v).toBeDefined();
    // attributes should be normalized to { nodes: [...] }
    expect(Array.isArray(v.attributes?.nodes)).toBe(true);
    expect(v.attributes.nodes[0].name).toBe('Size');
    expect(v.attributes.nodes[0].value).toBe('M');
    // variation image should be normalized to have sourceUrl and altText
    expect(v.image).toBeDefined();
    expect(v.image.sourceUrl).toBe('https://example.test/var-a.png');
    expect(v.image.altText).toBe('Variant A');

    spy.mockRestore();
  });
});
