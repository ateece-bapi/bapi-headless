import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockRequest } = vi.hoisted(() => ({
  mockRequest: vi.fn(),
}));

vi.mock('@/lib/graphql/client', () => ({
  getGraphQLClient: vi.fn(() => ({ request: mockRequest })),
}));

vi.mock('@/lib/logger', () => ({
  default: { error: vi.fn() },
}));

import { searchProducts } from '../productSearch';

describe('chat product search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('only queries products visible in the public catalog', async () => {
    mockRequest.mockResolvedValue({ products: { nodes: [] } });

    await searchProducts('duct sensor');

    const query = String(mockRequest.mock.calls[0][0]);
    expect(query).toContain('visibility: VISIBLE');
  });

  it('excludes all OEM products even when the user can access them', async () => {
    mockRequest.mockResolvedValue({
      products: {
        nodes: [
          {
            id: 'public-duct-sensor',
            databaseId: 1,
            name: 'BAPI Duct Temperature Sensor',
            slug: 'duct-temperature-sensor',
            customerGroup1: null,
          },
          {
            id: 'restricted-duct-sensor',
            databaseId: 2,
            name: 'ALC Duct Temperature Sensor',
            slug: 'alc-duct-temperature-sensor',
            customerGroup1: 'ALC',
          },
          {
            id: 'novar-duct-sensor',
            databaseId: 3,
            name: 'Novar UVC Compatible Duct Temperature Sensor',
            slug: 'novar-uvc-compatible-duct-temperature-sensor',
            customerGroup1: null,
          },
          {
            id: 'legacy-oem-duct-sensor',
            databaseId: 4,
            name: '(ACS) Duct Temperature Sensor',
            slug: 'acs-duct-temperature-sensor',
            customerGroup1: null,
          },
        ],
      },
    });

    const products = await searchProducts('duct sensor', 5, ['alc', 'acs']);

    expect(products.map((product) => product.slug)).toEqual(['duct-temperature-sensor']);
  });
});