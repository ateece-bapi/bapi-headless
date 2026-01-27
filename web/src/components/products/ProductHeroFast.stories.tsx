import type { Meta, StoryObj } from '@storybook/react';
import { ProductHeroFast } from './ProductHeroFast';
import type { GetProductBySlugQuery } from '@/lib/graphql';

/**
 * ProductHeroFast Component Stories
 * 
 * Displays the main product hero section with image, title, price, and description.
 * Uses MSW to mock WordPress GraphQL responses for isolated component testing.
 */

const meta = {
  title: 'Product/ProductHeroFast',
  component: ProductHeroFast,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductHeroFast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Mock product data matching GraphQL response shape
 */
const mockProductDefault: NonNullable<GetProductBySlugQuery['product']> = {
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
  __typename: 'SimpleProduct',
};

/**
 * Default product display
 */
export const Default: Story = {
  args: {
    product: mockProductDefault,
  },
};

/**
 * Product with missing image (edge case)
 * 
 * Tests fallback UI when no product image is available.
 */
export const NoImage: Story = {
  args: {
    product: {
      ...mockProductDefault,
      id: 'cG9zdDo1Njc4',
      databaseId: 5678,
      name: 'Humidity Sensor - No Image Available',
      slug: 'humidity-sensor-no-image',
      image: null,
    },
  },
};

/**
 * Product with very long title (edge case)
 * 
 * Tests text wrapping and layout stability with lengthy product names.
 */
export const LongTitle: Story = {
  args: {
    product: {
      ...mockProductDefault,
      id: 'cG9zdDo5OTk5',
      databaseId: 9999,
      name: 'Professional Building Automation Temperature and Humidity Sensor with Advanced Calibration and Extended Warranty Coverage for Industrial Applications',
      slug: 'long-title-sensor',
    },
  },
};

/**
 * Product without short description (edge case)
 * 
 * Tests layout when short description is missing from WordPress.
 */
export const NoDescription: Story = {
  args: {
    product: {
      ...mockProductDefault,
      id: 'cG9zdDo3Nzc3',
      databaseId: 7777,
      name: 'CO2 Sensor - No Description',
      slug: 'co2-sensor-no-description',
      shortDescription: null,
    },
  },
};

/**
 * Out of stock product (edge case)
 * 
 * Tests display when product is unavailable for purchase.
 */
export const OutOfStock: Story = {
  args: {
    product: {
      ...mockProductDefault,
      id: 'cG9zdDoxMTEx',
      databaseId: 1111,
      name: 'CO2 Sensor - Out of Stock',
      slug: 'co2-sensor-out-of-stock',
      stockStatus: 'OUT_OF_STOCK',
    },
  },
};

/**
 * Product on sale (price highlighting)
 * 
 * Tests display with sale price and regular price strikethrough.
 */
export const OnSale: Story = {
  args: {
    product: {
      ...mockProductDefault,
      id: 'cG9zdDoyMjIy',
      databaseId: 2222,
      name: 'Wireless Sensor - Sale Price',
      slug: 'wireless-sensor-sale',
      regularPrice: '$129.00',
      salePrice: '$99.00',
      price: '$99.00',
      onSale: true,
    },
  },
};

/**
 * Product with HTML in description (sanitization test)
 * 
 * Tests XSS protection and HTML sanitization from WordPress content.
 */
export const HtmlInDescription: Story = {
  args: {
    product: {
      ...mockProductDefault,
      id: 'cG9zdDozMzMz',
      databaseId: 3333,
      name: 'Air Quality Sensor with Rich Content',
      slug: 'air-quality-sensor-html',
      shortDescription: '<p>Features <strong>bold text</strong>, <em>italic text</em>, and <a href="#">safe links</a>. <script>alert("XSS")</script> should be removed.</p>',
    },
  },
};
