/**
 * ProductCard Storybook Stories
 * 
 * Documents the product card component with various content states and layouts.
 * 
 * **Component Features:**
 * - Responsive product card with link to detail page
 * - Product image with hover zoom and fallback icon
 * - Part number badge (top-right when present)
 * - Product name with animated yellow underline on hover
 * - Short description (HTML stripped, 120 char limit, line-clamp-2)
 * - Price display in primary blue
 * - "View Details" CTA with animated arrow
 * - Gradient background on hover
 * - Shadow and border transitions
 * - Decorative corner element
 * - Staggered grid animation via index prop
 * 
 * **Story Coverage:**
 * - Default: Complete product with all fields
 * - MissingImage: Placeholder Package icon
 * - NoPartNumber: Without badge
 * - NoPrice: Contact for quote scenario
 * - NoDescription: Minimal product info
 * - LongTitle: Text truncation with line-clamp-2
 * - LongDescription: 120 char limit + truncation
 * - ProductGrid: Multiple cards with staggered animation
 * - MobileView: Responsive single-column layout
 * - TabletView: 2-column grid layout
 * - DesktopView: 3-4 column grid layout
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductCard } from './ProductCard';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/Products/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Product card component for grid listings. Links to product detail page with hover animations, image zoom, and responsive design.',
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
    name: {
      control: 'text',
      description: 'Product name',
    },
    slug: {
      control: 'text',
      description: 'Product URL slug',
    },
    partNumber: {
      control: 'text',
      description: 'Part number (displayed in badge)',
    },
    price: {
      control: 'text',
      description: 'Product price (formatted string)',
    },
    shortDescription: {
      control: 'text',
      description: 'Product description (HTML stripped, truncated to 120 chars)',
    },
    index: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Animation delay index (50ms per index)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Product Variations
// ============================================================================

/**
 * Default product card with all fields populated
 */
export const Default: Story = {
  args: {
    id: 'cHJvZHVjdDox',
    name: 'Temperature Sensor Model TS-101',
    slug: 'temperature-sensor-ts-101',
    partNumber: 'TS-101-SS',
    price: '$149.00',
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=TS-101',
      altText: 'Temperature Sensor TS-101',
    },
    shortDescription:
      '<p>High-precision temperature sensor with stainless steel construction. Ideal for HVAC monitoring and industrial applications. Range: -40°C to 100°C.</p>',
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete product card with image, part number badge, description, and price. Demonstrates all features including hover effects.',
      },
    },
  },
};

/**
 * Product without image - shows Package icon placeholder
 */
export const MissingImage: Story = {
  args: {
    id: 'cHJvZHVjdDoy',
    name: 'Humidity Sensor Model HS-205',
    slug: 'humidity-sensor-hs-205',
    partNumber: 'HS-205-IP65',
    price: '$189.00',
    image: null,
    shortDescription:
      'Advanced humidity sensor with IP65 protection. Perfect for outdoor and harsh environment monitoring.',
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Product card without image displays Package icon placeholder (20x20 lucide icon in gray-300). Maintains card structure and hover animations.',
      },
    },
  },
};

/**
 * Product without part number - no badge displayed
 */
export const NoPartNumber: Story = {
  args: {
    id: 'cHJvZHVjdDoz',
    name: 'Pressure Transducer PT-300',
    slug: 'pressure-transducer-pt-300',
    partNumber: null,
    price: '$299.00',
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=PT-300',
      altText: 'Pressure Transducer PT-300',
    },
    shortDescription:
      'Industrial-grade pressure transducer with 4-20mA output. Suitable for hydraulic and pneumatic systems.',
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Product card without part number. Top-right badge is hidden when partNumber is null or undefined.',
      },
    },
  },
};

/**
 * Product without price - contact for quote scenario
 */
export const NoPrice: Story = {
  args: {
    id: 'cHJvZHVjdDo0',
    name: 'Multi-Parameter Sensor System MPS-5000',
    slug: 'multi-parameter-sensor-mps-5000',
    partNumber: 'MPS-5K-PRO',
    price: null,
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=MPS-5000',
      altText: 'Multi-Parameter Sensor System',
    },
    shortDescription:
      'Enterprise-grade sensor system measuring temperature, humidity, pressure, and air quality simultaneously. Custom configurations available.',
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Product card without price display. Used for "Contact for Quote" products or custom configurations. Price section is hidden.',
      },
    },
  },
};

/**
 * Product without description - minimal info
 */
export const NoDescription: Story = {
  args: {
    id: 'cHJvZHVjdDo1',
    name: 'Air Quality Sensor AQS-400',
    slug: 'air-quality-sensor-aqs-400',
    partNumber: 'AQS-400-CO2',
    price: '$249.00',
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=AQS-400',
      altText: 'Air Quality Sensor',
    },
    shortDescription: null,
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Product card without description. Shows only name, part number, price, and image. More compact vertical layout.',
      },
    },
  },
};

/**
 * Long product name - tests line-clamp-2 truncation
 */
export const LongTitle: Story = {
  args: {
    id: 'cHJvZHVjdDo2',
    name: 'Industrial Temperature and Humidity Sensor with Wireless Connectivity and Cloud Integration for Building Automation Systems',
    slug: 'industrial-temp-humidity-sensor-wireless-cloud',
    partNumber: 'ITH-WC-BA-5000',
    price: '$399.00',
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=ITH-WC',
      altText: 'Wireless Sensor',
    },
    shortDescription:
      'Advanced sensor with wireless capability and cloud integration for real-time monitoring.',
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Product card with very long name. Text is truncated with line-clamp-2, showing ellipsis (...) after second line.',
      },
    },
  },
};

/**
 * Long description - tests 120 char limit and line-clamp-2
 */
export const LongDescription: Story = {
  args: {
    id: 'cHJvZHVjdDo3',
    name: 'Wireless Data Logger DL-360',
    slug: 'wireless-data-logger-dl-360',
    partNumber: 'DL-360-WIFI',
    price: '$599.00',
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=DL-360',
      altText: 'Wireless Data Logger',
    },
    shortDescription:
      '<p>Professional-grade wireless data logger with 16-channel input capability, real-time cloud synchronization, battery backup power supply, mobile app integration for iOS and Android, email and SMS alerts, customizable logging intervals, CSV export functionality, and enterprise-level security features including encrypted communications and user access controls.</p>',
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Product card with lengthy description. HTML is stripped, text truncated to 120 characters, and displayed with line-clamp-2 (max 2 lines visible).',
      },
    },
  },
};

/**
 * Premium high-value product
 */
export const PremiumProduct: Story = {
  args: {
    id: 'cHJvZHVjdDo4',
    name: 'Building Management System BMS-Pro',
    slug: 'building-management-system-bms-pro',
    partNumber: 'BMS-PRO-ENT',
    price: '$2,499.00',
    image: {
      sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=BMS-PRO',
      altText: 'Building Management System',
    },
    shortDescription:
      'Enterprise building management system with AI-powered analytics, predictive maintenance, and comprehensive integration capabilities.',
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'High-value premium product card. Tests large price formatting (comma thousand separator).',
      },
    },
  },
};

// ============================================================================
// Real-World Layout Stories
// ============================================================================

/**
 * Product grid - 4 cards with staggered animation
 */
export const ProductGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProductCard
        id="prod-1"
        name="Temperature Sensor TS-101"
        slug="temperature-sensor-ts-101"
        partNumber="TS-101-SS"
        price="$149.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=TS-101',
          altText: 'Temperature Sensor',
        }}
        shortDescription="High-precision temperature sensor with stainless steel construction."
        index={0}
      />
      <ProductCard
        id="prod-2"
        name="Humidity Sensor HS-205"
        slug="humidity-sensor-hs-205"
        partNumber="HS-205-IP65"
        price="$189.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=HS-205',
          altText: 'Humidity Sensor',
        }}
        shortDescription="Advanced humidity sensor with IP65 protection rating."
        index={1}
      />
      <ProductCard
        id="prod-3"
        name="Pressure Transducer PT-300"
        slug="pressure-transducer-pt-300"
        partNumber="PT-300-IND"
        price="$299.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=PT-300',
          altText: 'Pressure Transducer',
        }}
        shortDescription="Industrial-grade pressure transducer with 4-20mA output."
        index={2}
      />
      <ProductCard
        id="prod-4"
        name="Air Quality Sensor AQS-400"
        slug="air-quality-sensor-aqs-400"
        partNumber="AQS-400-CO2"
        price="$249.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=AQS-400',
          altText: 'Air Quality Sensor',
        }}
        shortDescription="CO2, VOC, and particulate matter monitoring sensor."
        index={3}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Product grid demonstrating responsive layout (1 col mobile, 2 col tablet, 3-4 col desktop) with staggered card animations based on index prop.',
      },
    },
  },
};

/**
 * Mobile view - single column layout
 */
export const MobileView: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <ProductCard
        id="prod-mobile-1"
        name="Temperature Sensor TS-101"
        slug="temperature-sensor-ts-101"
        partNumber="TS-101-SS"
        price="$149.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=TS-101',
          altText: 'Temperature Sensor',
        }}
        shortDescription="High-precision temperature sensor with stainless steel construction."
        index={0}
      />
      <ProductCard
        id="prod-mobile-2"
        name="Humidity Sensor HS-205"
        slug="humidity-sensor-hs-205"
        partNumber="HS-205-IP65"
        price="$189.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=HS-205',
          altText: 'Humidity Sensor',
        }}
        shortDescription="Advanced humidity sensor with IP65 protection."
        index={1}
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'padded',
    docs: {
      description: {
        story: 'Product cards in mobile viewport (375px). Full-width cards stacked vertically.',
      },
    },
  },
};

/**
 * Tablet view - 2 column grid
 */
export const TabletView: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <ProductCard
        id="prod-tablet-1"
        name="Temperature Sensor TS-101"
        slug="temperature-sensor-ts-101"
        partNumber="TS-101-SS"
        price="$149.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=TS-101',
          altText: 'Temperature Sensor',
        }}
        shortDescription="High-precision temperature sensor."
        index={0}
      />
      <ProductCard
        id="prod-tablet-2"
        name="Humidity Sensor HS-205"
        slug="humidity-sensor-hs-205"
        partNumber="HS-205-IP65"
        price="$189.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=HS-205',
          altText: 'Humidity Sensor',
        }}
        shortDescription="Advanced humidity sensor."
        index={1}
      />
      <ProductCard
        id="prod-tablet-3"
        name="Pressure Transducer PT-300"
        slug="pressure-transducer-pt-300"
        partNumber="PT-300-IND"
        price="$299.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=PT-300',
          altText: 'Pressure Transducer',
        }}
        shortDescription="Industrial-grade transducer."
        index={2}
      />
      <ProductCard
        id="prod-tablet-4"
        name="Air Quality Sensor AQS-400"
        slug="air-quality-sensor-aqs-400"
        partNumber="AQS-400-CO2"
        price="$249.00"
        image={{
          sourceUrl: 'https://placehold.co/600x600/1479BC/FFFFFF?text=AQS-400',
          altText: 'Air Quality Sensor',
        }}
        shortDescription="CO2 and VOC monitoring."
        index={3}
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    layout: 'padded',
    docs: {
      description: {
        story: 'Product cards in tablet viewport (768px). 2-column grid with 4px gap.',
      },
    },
  },
};

/**
 * Desktop view - 3 column grid
 */
export const DesktopView: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCard
          key={`prod-desk-${i}`}
          id={`prod-desk-${i}`}
          name={`Product ${i + 1}`}
          slug={`product-${i + 1}`}
          partNumber={`PRD-${String(i + 1).padStart(3, '0')}`}
          price={`$${(99 + i * 50).toFixed(2)}`}
          image={{
            sourceUrl: `https://placehold.co/600x600/1479BC/FFFFFF?text=PRD-${i + 1}`,
            altText: `Product ${i + 1}`,
          }}
          shortDescription={`High-quality product ${i + 1} for industrial applications.`}
          index={i}
        />
      ))}
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    layout: 'padded',
    docs: {
      description: {
        story:
          'Product cards in desktop viewport (1200px). 3-column grid with 24px gap. Demonstrates staggered animation across 6 products.',
      },
    },
  },
};

/**
 * Compact list view - alternative layout
 */
export const CompactListView: Story = {
  render: () => (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={`prod-list-${i}`} className="w-full max-w-2xl">
          <ProductCard
            id={`prod-list-${i}`}
            name={`Sensor Model ${i + 101}`}
            slug={`sensor-${i + 101}`}
            partNumber={`SEN-${i + 101}`}
            price={`$${(149 + i * 50).toFixed(2)}`}
            image={{
              sourceUrl: `https://placehold.co/400x400/1479BC/FFFFFF?text=SEN-${i + 101}`,
              altText: `Sensor ${i + 101}`,
            }}
            shortDescription="Compact sensor for space-constrained applications."
            index={i}
          />
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Product cards in compact list view. Max-w-2xl constraint creates narrower cards suitable for sidebar or list layouts.',
      },
    },
  },
};
