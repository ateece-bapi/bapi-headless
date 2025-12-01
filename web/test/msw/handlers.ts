import { graphql } from 'msw';
import { productSchema, getProductQuerySchema } from '@/lib/validation/product';

const mockProduct = {
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

// Validate the mock at module load to catch mistakes fast
productSchema.parse(mockProduct);

export const handlers = [
  // Mock GetProductBySlug GraphQL query
  graphql.query('GetProductBySlug', ((req: any, res: any, ctx: any) => {
    const payload = { product: mockProduct };
    // Validate the overall shape to satisfy types and document expectations
    getProductQuerySchema.parse(payload);
    return res(ctx.data(payload));
  }) as any),
];
