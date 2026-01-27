import { graphql, HttpResponse } from 'msw';

/**
 * Mock GraphQL handlers for Storybook
 * 
 * These handlers intercept GraphQL requests to WordPress and return mock data.
 * Used to develop components without a live WordPress backend.
 */

/**
 * Mock product data for GetProductBySlug query
 */
const mockProduct = {
  id: 'cG9zdDoxMjM0',
  databaseId: 1234,
  name: 'Temperature Sensor - BA/10K-3-O-12',
  slug: 'temperature-sensor-ba-10k-3-o-12',
  description: '<p>Professional building automation temperature sensor with 10K Type III thermistor. Precision accuracy for HVAC applications.</p>',
  shortDescription: '<p>10K Type III thermistor, outdoor rated, 12" leads</p>',
  image: {
    sourceUrl: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BA10K-3-O-12-1.jpg',
    altText: 'BAPI Temperature Sensor',
  },
  price: '$89.00',
  regularPrice: '$89.00',
  salePrice: null,
  onSale: false,
  stockStatus: 'IN_STOCK',
  sku: 'BA/10K-3-O-12',
  __typename: 'SimpleProduct' as const,
};

/**
 * Mock product with missing image (edge case)
 */
const mockProductNoImage = {
  ...mockProduct,
  id: 'cG9zdDo1Njc4',
  databaseId: 5678,
  name: 'Humidity Sensor - No Image Test',
  slug: 'humidity-sensor-no-image',
  image: null,
};

/**
 * Mock product with long title (edge case)
 */
const mockProductLongTitle = {
  ...mockProduct,
  id: 'cG9zdDo5OTk5',
  databaseId: 9999,
  name: 'Professional Building Automation Temperature and Humidity Sensor with Advanced Calibration and Extended Warranty Coverage for Industrial Applications',
  slug: 'long-title-sensor',
};

/**
 * Mock product out of stock (edge case)
 */
const mockProductOutOfStock = {
  ...mockProduct,
  id: 'cG9zdDoxMTEx',
  databaseId: 1111,
  name: 'CO2 Sensor - Out of Stock',
  slug: 'co2-sensor-out-of-stock',
  stockStatus: 'OUT_OF_STOCK' as const,
};

/**
 * MSW GraphQL handlers
 */
export const handlers = [
  /**
   * GetProductBySlug - Default success case
   */
  graphql.query('GetProductBySlug', ({ variables }) => {
    const { slug } = variables;

    // Route to different mock products based on slug
    if (slug === 'humidity-sensor-no-image') {
      return HttpResponse.json({
        data: {
          product: mockProductNoImage,
        },
      });
    }

    if (slug === 'long-title-sensor') {
      return HttpResponse.json({
        data: {
          product: mockProductLongTitle,
        },
      });
    }

    if (slug === 'co2-sensor-out-of-stock') {
      return HttpResponse.json({
        data: {
          product: mockProductOutOfStock,
        },
      });
    }

    // Default product
    return HttpResponse.json({
      data: {
        product: mockProduct,
      },
    });
  }),

  /**
   * GetProductBySlug - Not found case
   */
  graphql.query('GetProductBySlug', ({ variables }) => {
    const { slug } = variables;

    if (slug === 'not-found-404') {
      return HttpResponse.json({
        data: {
          product: null,
        },
      });
    }
  }),

  /**
   * GetProductBySlug - Network error case
   */
  graphql.query('GetProductBySlug', ({ variables }) => {
    const { slug } = variables;

    if (slug === 'error-500') {
      return HttpResponse.json(
        {
          errors: [
            {
              message: 'Internal server error',
              extensions: {
                category: 'internal',
              },
            },
          ],
        },
        { status: 500 }
      );
    }
  }),
];
