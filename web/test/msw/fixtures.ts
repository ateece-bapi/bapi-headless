import { productSchema, type Product } from '@/lib/validation/product';

export const mockProduct: Product = {
  id: 'cHJvZHVjdDox',
  databaseId: 101,
  name: 'Test Sensor 101',
  slug: 'test-sensor-101',
  shortDescription: '<p>Short description for test sensor</p>',
  description: '<p>Full description for test sensor</p>',
  __typename: 'SimpleProduct',
  price: '$49.00',
  image: { sourceUrl: 'https://example.com/test-101.jpg', altText: 'Test Sensor 101' },
  galleryImages: { nodes: [] },
  variations: { nodes: [] },
};

// Validate the fixture at module load so mistakes are caught early.
productSchema.parse(mockProduct);

// Product shape used by client-side components (serialized/minimal)
export const mockProductForClient = {
  id: mockProduct.id,
  databaseId: mockProduct.databaseId,
  name: mockProduct.name,
  slug: mockProduct.slug,
  price: mockProduct.price,
  image: mockProduct.image,
  gallery: [],
  variations: [],
} as const;

export function makeProductForClient(overrides: Partial<typeof mockProductForClient> = {}) {
  return { ...mockProductForClient, ...overrides };
}

export default mockProduct;
