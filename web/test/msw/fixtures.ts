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
  stockStatus: 'IN_STOCK',
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
  numericPrice: 49.0, // Parsed numeric value for cart calculations
  stockStatus: mockProduct.stockStatus,
  image: mockProduct.image,
  gallery: [],
  variations: [],
};

export function makeProductForClient(overrides: Partial<typeof mockProductForClient> = {}) {
  // If price is overridden but numericPrice is not, parse numericPrice from price string
  // NOTE: This uses simplified parsing safe for controlled test data (always US format: "$1,234.56")
  // Production code should use convertWooCommercePriceNumeric() for locale-aware parsing
  if (overrides.price !== undefined && overrides.numericPrice === undefined) {
    const parsedPrice = parseFloat(overrides.price.replace(/[^0-9.-]+/g, ''));
    return { ...mockProductForClient, ...overrides, numericPrice: isNaN(parsedPrice) ? 0 : parsedPrice };
  }
  
  return { ...mockProductForClient, ...overrides };
}

export default mockProduct;
