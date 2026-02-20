import type { Meta, StoryObj } from '@storybook/nextjs';
import AddToCartButton from './AddToCartButton';
import { mockProductForClient, makeProductForClient } from '../../../test/msw/fixtures';
import type { CartItem } from '@/store';

/**
 * Add to Cart Button Component
 *
 * The primary action button for adding products to the shopping cart.
 * Features loading states, success animations, error handling, and accessibility.
 *
 * ## Key Features
 * - **Loading State**: Spinner animation during async operations
 * - **Success Animation**: Checkmark with 2-second duration
 * - **Error Handling**: Toast notifications for failures
 * - **Disabled State**: For out-of-stock products
 * - **Accessibility**: ARIA labels and live regions for screen readers
 * - **Cart Integration**: Optional auto-open cart drawer on add
 *
 * ## States
 * 1. **Default**: Ready to add to cart
 * 2. **Loading**: Shows spinner, disabled interaction
 * 3. **Success**: Shows checkmark for 2 seconds
 * 4. **Disabled**: Out of stock or missing required options
 * 5. **Error**: Shows error toast (not visually different from default)
 */
const meta = {
  title: 'Cart/AddToCartButton',
  component: AddToCartButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Primary action button for adding products to cart with loading, success, and error states. Integrates with cart store and toast notifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    quantity: {
      control: { type: 'number', min: 1, max: 99 },
      description: 'Quantity to add to cart',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    showCartOnAdd: {
      control: 'boolean',
      description: 'Open cart drawer after successful add',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button (out of stock)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'External loading state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    successDuration: {
      control: { type: 'number', min: 500, max: 5000, step: 500 },
      description: 'Success animation duration (ms)',
      table: {
        defaultValue: { summary: '2000' },
      },
    },
  },
} satisfies Meta<typeof AddToCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock product for stories
const testProduct: Omit<CartItem, 'quantity'> = {
  id: mockProductForClient.id,
  databaseId: mockProductForClient.databaseId,
  name: mockProductForClient.name,
  slug: mockProductForClient.slug,
  price: mockProductForClient.price,
  image: mockProductForClient.image
    ? {
        sourceUrl: mockProductForClient.image.sourceUrl,
        altText: mockProductForClient.image.altText || undefined,
      }
    : null,
};

// Mock hooks for stories
const mockUseCart = () => ({
  items: [],
  isEmpty: true,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
});

const mockUseCartDrawer = () => ({
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
});

// ============================================================================
// Basic States
// ============================================================================

/**
 * Default state - ready to add product to cart
 * Click to trigger add action
 */
export const Default: Story = {
  args: {
    product: testProduct,
    quantity: 1,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
};

/**
 * Loading state - shows spinner during async operation
 * Button is disabled during loading
 */
export const Loading: Story = {
  args: {
    product: testProduct,
    loading: true,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows animated spinner when adding product to cart. Button is disabled to prevent double-clicks.',
      },
    },
  },
};

/**
 * Disabled state - out of stock product
 * Shows "Out of Stock" text, button is not clickable
 */
export const OutOfStock: Story = {
  args: {
    product: testProduct,
    disabled: true,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for out-of-stock products. Clicking shows a warning toast.',
      },
    },
  },
};

/**
 * No cart drawer open on add
 * Cart doesn't open automatically after adding
 */
export const NoCartDrawer: Story = {
  args: {
    product: testProduct,
    showCartOnAdd: false,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Cart drawer does not open after adding. Useful for product listing pages where user may add multiple items.',
      },
    },
  },
};

// ============================================================================
// Quantity Variants
// ============================================================================

/**
 * Add single item (default quantity)
 */
export const SingleQuantity: Story = {
  args: {
    product: testProduct,
    quantity: 1,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
};

/**
 * Add multiple items at once
 */
export const MultipleQuantity: Story = {
  args: {
    product: testProduct,
    quantity: 5,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Add 5 units at once. Useful for bulk purchases or when integrated with quantity selector.',
      },
    },
  },
};

/**
 * Large quantity order
 */
export const BulkQuantity: Story = {
  args: {
    product: testProduct,
    quantity: 25,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk order of 25 units. Common for B2B customers ordering commercial quantities.',
      },
    },
  },
};

// ============================================================================
// Product Variants
// ============================================================================

/**
 * High-priced product
 */
export const HighPriceProduct: Story = {
  args: {
    product: makeProductForClient({
      name: 'Premium Wireless Temperature Sensor',
      price: '$1,249.00',
    }) as Omit<CartItem, 'quantity'>,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Premium product with high price point. Success message includes product name.',
      },
    },
  },
};

/**
 * Product with long name
 */
export const LongProductName: Story = {
  args: {
    product: makeProductForClient({
      name: 'Building Automation Humidity & Temperature Sensor with NIST Calibration Certificate',
    }) as Omit<CartItem, 'quantity'>,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Product with long descriptive name. ARIA label includes full product name for accessibility.',
      },
    },
  },
};

/**
 * Low stock product (not disabled, but urgent)
 */
export const LowStockProduct: Story = {
  args: {
    product: makeProductForClient({
      name: 'Temperature Sensor BA/T10K-3-U',
      stockStatus: 'LOW_STOCK',
    }) as Omit<CartItem, 'quantity'>,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Product with low stock. Button remains enabled but could show urgency indicator elsewhere.',
      },
    },
  },
};

// ============================================================================
// Custom Styling
// ============================================================================

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    product: testProduct,
    className: 'w-full',
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Full-width button for mobile layouts or prominent CTAs. Uses w-full class.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Compact button (smaller padding)
 */
export const Compact: Story = {
  args: {
    product: testProduct,
    className: 'py-2 px-4 text-sm',
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact variant for product cards or tight layouts. Smaller padding and text.',
      },
    },
  },
};

/**
 * Large button (prominent CTA)
 */
export const Large: Story = {
  args: {
    product: testProduct,
    className: 'py-4 px-8 text-lg',
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large prominent button for product detail pages. Increased padding and text size.',
      },
    },
  },
};

// ============================================================================
// Success Duration Variants
// ============================================================================

/**
 * Quick success (1 second)
 */
export const QuickSuccess: Story = {
  args: {
    product: testProduct,
    successDuration: 1000,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Success animation lasts 1 second instead of default 2 seconds. Faster feedback cycle.',
      },
    },
  },
};

/**
 * Extended success (4 seconds)
 */
export const ExtendedSuccess: Story = {
  args: {
    product: testProduct,
    successDuration: 4000,
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Success animation lasts 4 seconds. Gives user more time to see confirmation.',
      },
    },
  },
};

// ============================================================================
// Real-World Scenarios
// ============================================================================

/**
 * Product card integration
 */
export const InProductCard: Story = {
  args: {
    product: testProduct,
    className: 'w-full',
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  decorators: [
    (Story) => (
      <div className="w-80 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-3">
          <div className="mb-2 h-48 rounded bg-neutral-100" />
          <h3 className="mb-1 text-lg font-semibold text-neutral-900">
            BA/T10K-3-U Temperature Sensor
          </h3>
          <p className="mb-2 text-sm text-neutral-600">10K Type III Thermistor</p>
          <div className="mb-3 text-xl font-bold text-primary-500">$49.00</div>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Button integrated into a product card. Full-width layout with proper spacing.',
      },
    },
  },
};

/**
 * Product detail page (with quantity selector)
 */
export const WithQuantitySelector: Story = {
  args: {
    product: testProduct,
    quantity: 1,
    className: 'flex-1',
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  decorators: [
    (Story) => (
      <div className="flex items-stretch gap-3">
        <div className="flex items-center rounded-lg border border-neutral-300">
          <button className="px-3 py-2 hover:bg-neutral-50" type="button">−</button>
          <input
            type="number"
            value="1"
            readOnly
            className="w-16 border-x border-neutral-300 py-2 text-center"
          />
          <button className="px-3 py-2 hover:bg-neutral-50" type="button">+</button>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Button alongside quantity selector on product detail page. Flexible width to fill available space.',
      },
    },
  },
};

/**
 * Mobile layout (sticky bottom)
 */
export const MobileStickyBottom: Story = {
  args: {
    product: testProduct,
    className: 'w-full',
    useCart: mockUseCart,
    useCartDrawer: mockUseCartDrawer,
  },
  decorators: [
    (Story) => (
      <div className="relative h-96 w-full max-w-md rounded-lg border-2 border-neutral-300">
        {/* Simulate mobile viewport */}
        <div className="h-full overflow-y-auto pb-20">
          <div className="p-4">
            <h2 className="mb-2 text-2xl font-bold">Product Title</h2>
            <div className="mb-4 text-2xl font-bold text-primary-500">$49.00</div>
            <p className="text-neutral-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Product description
              would appear here with all the technical details and specifications...
            </p>
          </div>
        </div>
        {/* Sticky bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 bg-white p-4 shadow-lg">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Mobile layout with sticky bottom bar. Button remains accessible while user scrolls product details.',
      },
    },
  },
};
