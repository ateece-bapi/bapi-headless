/**
 * ProductGrid Storybook Stories
 *
 * Advanced product grid component with Quick View, Product Comparison, and interactive features.
 * This documents the PRODUCTION product card variant (different from basic ProductCard.tsx).
 *
 * **Component Features:**
 * - Responsive grid layout (1→2→3→4→5 columns)
 * - Quick View modal button (hover overlay)
 * - Product Comparison checkbox (max 3-4 products)
 * - Sale badge (yellow BAPI accent gradient)
 * - Stock status badge (green gradient)
 * - Shimmer loading effect on images
 * - Intersection Observer for lazy loading/animation
 * - Hover effects: lift, border color, gradient overlay
 * - Price display with currency conversion support
 * - "Contact for Pricing" fallback
 * - Empty state with helpful suggestions
 *
 * **ProductCard Variants (Internal to ProductGrid):**
 * - SimpleProduct: Fixed price, stock quantity
 * - VariableProduct: Price range, variations
 *
 * **Story Coverage:**
 * - Default: 4 products with mixed states
 * - EmptyState: No products found message
 * - SingleProduct: One product only
 * - ManyProducts: 12 products with pagination
 * - WithSale: Sale badge demonstration
 * - OutOfStock: Stock status handling
 * - NoImages: Placeholder fallback
 * - NoPrices: "Contact for Pricing" scenario
 * - ComparisonActive: Products in comparison mode
 * - MixedProductTypes: Simple + Variable products
 * - Mobile/Tablet/Desktop: Responsive layouts
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductGrid } from './ProductGrid';

// Mock product data matching GetProductsWithFiltersQuery structure
const createMockProduct = (overrides: any = {}) => ({
  id: `cHJvZHVjdDo${overrides.databaseId || 1}`,
  databaseId: 101,
  name: 'Temperature Sensor TS-101',
  slug: 'temperature-sensor-ts-101',
  shortDescription: '<p>High-precision temperature sensor with stainless steel construction.</p>',
  __typename: 'SimpleProduct',
  price: '$149.00',
  regularPrice: '$149.00',
  salePrice: null,
  onSale: false,
  stockStatus: 'IN_STOCK',
  stockQuantity: 25,
  featuredImage: {
    node: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=TS-101',
      altText: 'Temperature Sensor TS-101',
    },
  },
  image: {
    sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=TS-101',
    altText: 'Temperature Sensor TS-101',
  },
  ...overrides,
});

const mockProducts = [
  createMockProduct({
    databaseId: 101,
    name: 'Temperature Sensor TS-101',
    slug: 'temperature-sensor-ts-101',
    price: '$149.00',
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=TS-101',
      altText: 'Temperature Sensor TS-101',
    },
  }),
  createMockProduct({
    databaseId: 102,
    name: 'Humidity Sensor HS-205',
    slug: 'humidity-sensor-hs-205',
    price: '$189.00',
    onSale: true,
    salePrice: '$159.00',
    regularPrice: '$189.00',
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=HS-205',
      altText: 'Humidity Sensor HS-205',
    },
    shortDescription: '<p>Advanced humidity sensor with IP65 protection rating.</p>',
  }),
  createMockProduct({
    databaseId: 103,
    name: 'Pressure Transducer PT-300',
    slug: 'pressure-transducer-pt-300',
    price: '$299.00',
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=PT-300',
      altText: 'Pressure Transducer PT-300',
    },
    shortDescription: '<p>Industrial-grade pressure transducer with 4-20mA output.</p>',
  }),
  createMockProduct({
    databaseId: 104,
    name: 'Air Quality Sensor AQS-400',
    slug: 'air-quality-sensor-aqs-400',
    price: '$249.00',
    stockStatus: 'OUT_OF_STOCK',
    stockQuantity: 0,
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=AQS-400',
      altText: 'Air Quality Sensor AQS-400',
    },
    shortDescription: '<p>CO2, VOC, and particulate matter monitoring sensor.</p>',
  }),
];

const meta: Meta<typeof ProductGrid> = {
  title: 'Components/Products/ProductGrid',
  component: ProductGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Production product grid with Quick View, Comparison, and advanced features. This is the actual product card used in product listings (different from basic ProductCard.tsx).',
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/en/products',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    products: {
      description: 'Array of products from GetProductsWithFiltersQuery',
    },
    locale: {
      control: 'select',
      options: ['en', 'es', 'fr', 'de'],
      description: 'Locale for product links',
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-50 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Product Grid Variations
// ============================================================================

/**
 * Default grid with 4 products
 */
export const Default: Story = {
  args: {
    products: mockProducts,
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Standard product grid with 4 products. Hover to reveal Quick View and Comparison buttons. Mix of in-stock, on-sale, and out-of-stock items.',
      },
    },
  },
};

/**
 * Empty state - no products found
 */
export const EmptyState: Story = {
  args: {
    products: [],
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Empty state with helpful suggestions when no products match filters. Includes icon, message, and actionable tips.',
      },
    },
  },
};

/**
 * Single product
 */
export const SingleProduct: Story = {
  args: {
    products: [mockProducts[0]],
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid with single product. Card still shows hover effects and comparison checkbox.',
      },
    },
  },
};

/**
 * Many products - full grid
 */
export const ManyProducts: Story = {
  args: {
    products: Array.from({ length: 12 }).map((_, i) =>
      createMockProduct({
        databaseId: 200 + i,
        name: `Sensor Model ${200 + i}`,
        slug: `sensor-${200 + i}`,
        price: `$${(99 + i * 25).toFixed(2)}`,
        onSale: i % 3 === 0,
        salePrice: i % 3 === 0 ? `$${((99 + i * 25) * 0.85).toFixed(2)}` : null,
        stockStatus: i % 5 === 0 ? 'OUT_OF_STOCK' : 'IN_STOCK',
        image: {
          sourceUrl: `https://placehold.co/600x600/1479BC/FFFFFF?text=S-${200 + i}`,
          altText: `Sensor ${200 + i}`,
        },
      }),
    ),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Full product grid (12 items) demonstrating responsive layout: 1 col mobile → 2 col tablet → 3/4/5 col desktop. Mix of sale and out-of-stock items.',
      },
    },
  },
};

// ============================================================================
// Product State Variations
// ============================================================================

/**
 * All products on sale
 */
export const WithSale: Story = {
  args: {
    products: mockProducts.map((p) => ({
      ...p,
      onSale: true,
      salePrice: `$${(parseFloat(p.price.replace('$', '')) * 0.8).toFixed(2)}`,
    })),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Products with sale badges (yellow BAPI accent gradient). Shows original price with strikethrough and sale price in primary blue.',
      },
    },
  },
};

/**
 * Out of stock products
 */
export const OutOfStock: Story = {
  args: {
    products: mockProducts.map((p) => ({
      ...p,
      stockStatus: 'OUT_OF_STOCK',
      stockQuantity: 0,
    })),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Products marked as out of stock. Stock badge is hidden. Purchase buttons should be disabled (handled by parent component).',
      },
    },
  },
};

/**
 * Products without images
 */
export const NoImages: Story = {
  args: {
    products: mockProducts.map((p) => ({
      ...p,
      image: null,
      featuredImage: null,
    })),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Products without images show placeholder with camera icon and "No Image" text. Maintains card structure and hover effects.',
      },
    },
  },
};

/**
 * Products without prices - contact for quote
 */
export const NoPrices: Story = {
  args: {
    products: mockProducts.map((p) => ({
      ...p,
      price: null,
      regularPrice: null,
      salePrice: null,
      onSale: false,
    })),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Products without pricing display "Contact for Pricing" message. Common for custom configurations or bulk orders.',
      },
    },
  },
};

/**
 * Products without descriptions
 */
export const NoDescriptions: Story = {
  args: {
    products: mockProducts.map((p) => ({
      ...p,
      shortDescription: null,
    })),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Products without short descriptions. Card shows only name, price, and badges. More compact vertical layout.',
      },
    },
  },
};

/**
 * Long product names
 */
export const LongNames: Story = {
  args: {
    products: mockProducts.map((p, i) => ({
      ...p,
      name: `Industrial Temperature and Humidity Sensor with Wireless Connectivity and Cloud Integration Model ${i + 101}`,
    })),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Products with very long names. Text is truncated with line-clamp-2, showing ellipsis (...) after second line to prevent card overflow.',
      },
    },
  },
};

// ============================================================================
// Variable Products
// ============================================================================

/**
 * Variable product with price range
 */
export const VariableProduct: Story = {
  args: {
    products: [
      createMockProduct({
        databaseId: 500,
        __typename: 'VariableProduct',
        name: 'Multi-Range Sensor System',
        slug: 'multi-range-sensor-system',
        price: '$299.00 - $599.00', // Price range for variable product
        regularPrice: '$299.00',
        salePrice: null,
        onSale: false,
        stockStatus: 'IN_STOCK',
        image: {
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=MRS',
          altText: 'Multi-Range Sensor System',
        },
        shortDescription:
          '<p>Configurable sensor system with multiple range and output options.</p>',
      }),
      ...mockProducts.slice(0, 3),
    ],
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Variable product displays price range (e.g., "$299.00 - $599.00"). Users select variations on product detail page.',
      },
    },
  },
};

/**
 * Mix of Simple and Variable products
 */
export const MixedProductTypes: Story = {
  args: {
    products: [
      createMockProduct({
        databaseId: 501,
        __typename: 'VariableProduct',
        name: 'Configurable Data Logger',
        slug: 'configurable-data-logger',
        price: '$399.00 - $899.00',
        stockStatus: 'IN_STOCK',
        image: {
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=CDL',
          altText: 'Configurable Data Logger',
        },
      }),
      ...mockProducts,
    ],
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Grid mixing SimpleProduct (fixed price) and VariableProduct (price range). ProductGrid handles both types seamlessly.',
      },
    },
  },
};

// ============================================================================
// Responsive Layouts
// ============================================================================

/**
 * Mobile view - single column
 */
export const Mobile: Story = {
  args: {
    products: mockProducts.slice(0, 3),
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Mobile viewport (375px). Cards stack in single column. Quick View/Comparison buttons still functional on tap/click.',
      },
    },
  },
};

/**
 * Tablet view - 2 columns
 */
export const Tablet: Story = {
  args: {
    products: mockProducts.concat(mockProducts.slice(0, 2)),
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet viewport (768px). 2-column grid layout (sm: breakpoint).',
      },
    },
  },
};

/**
 * Desktop view - 4 columns
 */
export const Desktop: Story = {
  args: {
    products: Array.from({ length: 8 }).map((_, i) =>
      createMockProduct({
        databaseId: 300 + i,
        name: `Desktop Product ${i + 1}`,
        slug: `desktop-product-${i + 1}`,
        price: `$${(149 + i * 50).toFixed(2)}`,
        image: {
          sourceUrl: `https://placehold.co/600x600/1479BC/FFFFFF?text=DP-${i + 1}`,
          altText: `Desktop Product ${i + 1}`,
        },
      }),
    ),
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Desktop viewport (1200px+). 4-column grid layout (xl: breakpoint).',
      },
    },
  },
};

/**
 * Wide desktop view - 5 columns
 */
export const WideDesktop: Story = {
  args: {
    products: Array.from({ length: 10 }).map((_, i) =>
      createMockProduct({
        databaseId: 400 + i,
        name: `Wide Desktop Product ${i + 1}`,
        slug: `wide-product-${i + 1}`,
        price: `$${(99 + i * 30).toFixed(2)}`,
        image: {
          sourceUrl: `https://placehold.co/600x600/1479BC/FFFFFF?text=WD-${i + 1}`,
          altText: `Wide Product ${i + 1}`,
        },
      }),
    ),
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Wide desktop viewport (1536px+). 5-column grid layout (2xl: breakpoint). Used on ultra-wide displays.',
      },
    },
  },
};

// ============================================================================
// Interaction States (Note: Requires user interaction in Storybook)
// ============================================================================

/**
 * Hover state demonstration
 */
export const HoverStates: Story = {
  args: {
    products: mockProducts.slice(0, 2),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          '**Hover to see:** Card lifts up (-translate-y), border turns primary blue, gradient overlay appears, image scales 110%, Quick View and Comparison buttons fade in.',
      },
    },
  },
};

/**
 * Loading state with shimmer
 */
export const LoadingImages: Story = {
  args: {
    products: mockProducts.map((p) => ({
      ...p,
      // Simulate slow-loading images with large URLs
      image: {
        sourceUrl: `https://placehold.co/1200x1200/1479BC/FFFFFF?text=${p.slug}&delay=2000`,
        altText: p.image?.altText,
      },
    })),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Images show shimmer animation while loading. Once loaded, images fade in with smooth transition. Simulated with slow placeholder URLs.',
      },
    },
  },
};

// ============================================================================
// Real-World Scenarios
// ============================================================================

/**
 * Search results scenario
 */
export const SearchResults: Story = {
  args: {
    products: Array.from({ length: 7 }).map((_, i) =>
      createMockProduct({
        databaseId: 600 + i,
        name: `Temperature Sensor TS-${600 + i}`,
        slug: `temperature-sensor-${600 + i}`,
        price: `$${(129 + i * 20).toFixed(2)}`,
        onSale: i % 4 === 0,
        salePrice: i % 4 === 0 ? `$${((129 + i * 20) * 0.85).toFixed(2)}` : null,
        image: {
          sourceUrl: `https://placehold.co/600x600/1479BC/FFFFFF?text=TS-${600 + i}`,
          altText: `Temperature Sensor ${600 + i}`,
        },
        shortDescription: '<p>High-precision sensor for HVAC monitoring.</p>',
      }),
    ),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Search results for "Temperature Sensor" query. 7 results with similar titles and descriptions.',
      },
    },
  },
};

/**
 * Category listing scenario
 */
export const CategoryListing: Story = {
  args: {
    products: [
      createMockProduct({
        databaseId: 701,
        name: 'Wall-Mount Temperature Sensor',
        slug: 'wall-mount-temp-sensor',
        price: '$129.00',
        image: {
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=WM-TS',
          altText: 'Wall-Mount Temperature Sensor',
        },
      }),
      createMockProduct({
        databaseId: 702,
        name: 'Duct-Mount Temperature Sensor',
        slug: 'duct-mount-temp-sensor',
        price: '$149.00',
        onSale: true,
        salePrice: '$129.00',
        image: {
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=DM-TS',
          altText: 'Duct-Mount Temperature Sensor',
        },
      }),
      createMockProduct({
        databaseId: 703,
        name: 'Outdoor Temperature Sensor',
        slug: 'outdoor-temp-sensor',
        price: '$179.00',
        image: {
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=OD-TS',
          altText: 'Outdoor Temperature Sensor',
        },
      }),
      createMockProduct({
        databaseId: 704,
        name: 'Industrial Temperature Sensor',
        slug: 'industrial-temp-sensor',
        price: '$249.00',
        stockStatus: 'OUT_OF_STOCK',
        image: {
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=IN-TS',
          altText: 'Industrial Temperature Sensor',
        },
      }),
    ],
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Category page listing: "Temperature Sensors" category. Related products with different mounting types and applications.',
      },
    },
  },
};

/**
 * Filtered results scenario
 */
export const FilteredResults: Story = {
  args: {
    products: [
      createMockProduct({
        databaseId: 801,
        name: 'Premium Wireless Sensor',
        slug: 'premium-wireless-sensor',
        price: '$399.00',
        onSale: true,
        salePrice: '$349.00',
        stockStatus: 'IN_STOCK',
        image: {
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=PWS',
          altText: 'Premium Wireless Sensor',
        },
      }),
      createMockProduct({
        databaseId: 802,
        name: 'Enterprise Wireless Logger',
        slug: 'enterprise-wireless-logger',
        price: '$599.00',
        stockStatus: 'IN_STOCK',
        image: {
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=EWL',
          altText: 'Enterprise Wireless Logger',
        },
      }),
    ],
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Filtered results: "Wireless" + "In Stock" filters applied. Only 2 products match criteria.',
      },
    },
  },
};
