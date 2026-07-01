/**
 * CartDrawer Storybook Stories
 *
 * Demonstrates the shopping cart slide-out drawer with various content states.
 *
 * **Component Features:**
 * - Slide-out drawer animation from right side
 * - Semi-transparent backdrop with subtle gradient
 * - Empty cart state with messaging
 * - Cart item list with images, prices, quantities
 * - Quantity controls (+ / - buttons)
 * - Remove item functionality
 * - Subtotal calculation display
 * - View Cart and Proceed to Checkout CTAs
 * - Variation details display (for variable products)
 * - Part number / SKU display
 *
 * **Story Coverage:**
 * - EmptyCart: Shows empty state messaging
 * - SingleItem: One product with all details
 * - MultipleItems: 3 items with different quantities
 * - ManyItems: 10 items to test scrolling
 * - WithVariations: Variable products with selected attributes
 * - HighValueCart: Premium products with high subtotal
 * - MobileView: Optimized for mobile viewport
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import CartDrawer from './CartDrawer';
import { useCartStore } from '@/store';
import type { CartItem } from '@/store';

const meta: Meta<typeof CartDrawer> = {
  title: 'Components/Cart/CartDrawer',
  component: CartDrawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Shopping cart drawer that slides in from the right side. Displays cart items, allows quantity adjustments, and provides quick access to cart/checkout pages.',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative h-screen w-full bg-neutral-100">
        {/* Simulated page content */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-neutral-900">Product Page</h1>
          <p className="mt-2 text-neutral-700">
            Cart drawer appears as an overlay on the right side when opened.
          </p>
        </div>

        {/* CartDrawer rendered here */}
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Mock Data Helpers
// ============================================================================

/**
 * Create mock cart item from product fixture
 */
const createCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'cHJvZHVjdDox',
  databaseId: 101,
  name: 'Temperature Sensor Model 101',
  slug: 'temperature-sensor-101',
  price: '$49.00',
  numericPrice: 49.0,
  quantity: 1,
  image: {
    sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=Sensor',
    altText: 'Temperature Sensor',
  },
  ...overrides,
});

// ============================================================================
// Store state helpers
// CartDrawer reads directly from the Zustand store (no injectable hooks).
// Use useCartStore.setState() in story decorators to control cart state.
// ============================================================================

/** Set the Zustand store to the desired state before each story renders. */
const setStoreState = (items: CartItem[], isOpen = true) => {
  useCartStore.setState({ items, isOpen });
};

const singleItem = [createCartItem()];

const multipleItems: CartItem[] = [
  createCartItem({ id: 'prod-1', databaseId: 101, name: 'Temperature Sensor Model 101', price: '$49.00', numericPrice: 49.0, quantity: 2 }),
  createCartItem({ id: 'prod-2', databaseId: 102, name: 'Humidity Sensor Model 205', slug: 'humidity-sensor-205', price: '$89.00', numericPrice: 89.0, quantity: 1, image: { sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=Humidity', altText: 'Humidity Sensor' } }),
  createCartItem({ id: 'prod-3', databaseId: 103, name: 'Pressure Transducer PT-300', slug: 'pressure-transducer-300', price: '$129.00', numericPrice: 129.0, quantity: 3, image: { sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=Pressure', altText: 'Pressure Transducer' } }),
];

const manyItems: CartItem[] = Array.from({ length: 10 }, (_, i) =>
  createCartItem({ id: `prod-${i + 1}`, databaseId: 100 + i, name: `Product ${i + 1}`, slug: `product-${i + 1}`, price: `$${(29 + i * 10).toFixed(2)}`, quantity: (i % 3) + 1 })
);

const variableItems: CartItem[] = [
  createCartItem({ id: 'prod-var-1', databaseId: 201, name: 'Temperature Sensor - Industrial', slug: 'temp-sensor-industrial', price: '$149.00', numericPrice: 149.0, quantity: 1, variationId: 2011, variationName: 'Stainless Steel, 0-100°C', variationSku: 'TS-IND-SS-100', selectedAttributes: { material: 'Stainless Steel', range: '0-100°C', output: '4-20mA' } }),
  createCartItem({ id: 'prod-var-2', databaseId: 202, name: 'Pressure Transducer - Heavy Duty', slug: 'pressure-transducer-hd', price: '$299.00', numericPrice: 299.0, quantity: 2, variationId: 2021, variationSku: 'PT-HD-TI-500', selectedAttributes: { material: 'Titanium', 'pressure-range': '0-500 PSI', connection: '1/4" NPT' }, image: { sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=Pressure+HD', altText: 'Heavy Duty Pressure Transducer' } }),
];

const highValueItems: CartItem[] = [
  createCartItem({ id: 'prod-premium-1', databaseId: 301, name: 'Multi-Parameter Sensor System MPS-5000', slug: 'mps-5000', price: '$2,499.00', numericPrice: 2499.0, quantity: 1, partNumber: 'MPS-5K-PRO', image: { sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=MPS-5000', altText: 'Multi-Parameter Sensor System' } }),
  createCartItem({ id: 'prod-premium-2', databaseId: 302, name: 'Data Logger with Cloud Integration DL-360', slug: 'data-logger-dl-360', price: '$1,899.00', numericPrice: 1899.0, quantity: 2, partNumber: 'DL-360-CLOUD', image: { sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=DL-360', altText: 'Cloud Data Logger' } }),
];

// ============================================================================
// Stories
// ============================================================================

/**
 * Empty cart - shows "Your cart is empty" message
 */
export const EmptyCart: Story = {
  decorators: [(Story) => { setStoreState([]); return <Story />; }],
  parameters: {
    docs: {
      description: {
        story:
          'Empty cart state with centered messaging. No footer or items displayed when cart is empty.',
      },
    },
  },
};

/**
 * Single item - one product with full details
 */
export const SingleItem: Story = {
  decorators: [(Story) => { setStoreState(singleItem); return <Story />; }],
  parameters: {
    docs: {
      description: {
        story:
          'Cart with a single item showing product image, name, price, quantity controls, and remove button.',
      },
    },
  },
};

/**
 * Multiple items - 3 different products with varying quantities
 */
export const MultipleItems: Story = {
  decorators: [(Story) => { setStoreState(multipleItems); return <Story />; }],
  parameters: {
    docs: {
      description: {
        story:
          'Cart with multiple items (6 total units across 3 products). Shows subtotal calculation and checkout CTAs.',
      },
    },
  },
};

/**
 * Many items - 10 products to test scrolling behavior
 */
export const ManyItems: Story = {
  decorators: [(Story) => { setStoreState(manyItems); return <Story />; }],
  parameters: {
    docs: {
      description: {
        story:
          'Cart with 10 items demonstrating scrollable content area. Header and footer remain fixed while items scroll.',
      },
    },
  },
};

/**
 * Variable products - items with selected attributes displayed
 */
export const WithVariations: Story = {
  decorators: [(Story) => { setStoreState(variableItems); return <Story />; }],
  parameters: {
    docs: {
      description: {
        story:
          'Cart showing variable products with selected attributes (material, range, output). Variation SKUs are displayed below product names.',
      },
    },
  },
};

/**
 * High value cart - premium products with large subtotal
 */
export const HighValueCart: Story = {
  decorators: [(Story) => { setStoreState(highValueItems); return <Story />; }],
  parameters: {
    docs: {
      description: {
        story:
          'Cart with high-value items ($6,297 subtotal). Shows part numbers for industrial products and handles large price formatting.',
      },
    },
  },
};

/**
 * Closed drawer - demonstrates closed state (component returns null)
 */
export const ClosedDrawer: Story = {
  decorators: [(Story) => { setStoreState(multipleItems, false); return <Story />; }],
  parameters: {
    docs: {
      description: {
        story:
          'Drawer in closed state (returns null). In real app, this is controlled by user interaction.',
      },
    },
  },
};

/**
 * Mobile viewport - optimized for mobile devices
 */
export const MobileView: Story = {
  decorators: [(Story) => { setStoreState(multipleItems); return <Story />; }],
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Cart drawer on mobile viewport (375px). Drawer takes full width on smaller screens with responsive padding and font sizes.',
      },
    },
  },
};

/**
 * Tablet viewport - mid-size screen
 */
export const TabletView: Story = {
  decorators: [(Story) => { setStoreState(manyItems); return <Story />; }],
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    docs: {
      description: {
        story:
          'Cart drawer on tablet viewport (768px). Shows optimal drawer width (max-w-md) and spacing for medium screens.',
      },
    },
  },
};

// ============================================================================
// Interaction Tests
// ============================================================================

/**
 * Interaction test: close button dismisses the drawer.
 * Verifies that clicking "Close cart" removes the dialog from the DOM.
 */
export const CloseButton: Story = {
  decorators: [(Story) => { setStoreState(singleItem); return <Story />; }],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Drawer is open — dialog should be present
    const dialog = canvas.getByRole('dialog', { name: /shopping cart/i });
    expect(dialog).toBeInTheDocument();

    // Click the close button
    await userEvent.click(canvas.getByRole('button', { name: /close cart/i }));

    // Dialog should be gone after store updates isOpen: false
    await waitFor(() => {
      expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interaction test: clicking the close (✕) button sets `isOpen: false` in the Zustand store, causing the component to return null and the dialog to be removed from the DOM.',
      },
    },
  },
};

/**
 * Interaction test: increase quantity button updates the count.
 * Verifies the + button calls updateQuantity and the display reflects the change.
 */
export const IncreaseQuantity: Story = {
  decorators: [(Story) => { setStoreState([createCartItem({ quantity: 1 })]); return <Story />; }],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial quantity should be 1
    expect(canvas.getByText('1')).toBeInTheDocument();

    // Click the increase button
    await userEvent.click(canvas.getByRole('button', { name: /increase quantity/i }));

    // Quantity should now be 2
    await waitFor(() => {
      expect(canvas.getByText('2')).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interaction test: clicking + increments the item quantity via Zustand `updateQuantity`. The displayed count updates immediately after store re-renders the component.',
      },
    },
  },
};

/**
 * Interaction test: remove item empties the cart.
 * Verifies the Remove button calls removeItem and the empty cart message appears.
 */
export const RemoveItem: Story = {
  decorators: [(Story) => { setStoreState([createCartItem({ quantity: 1 })]); return <Story />; }],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Item should be visible
    expect(canvas.getByText('Temperature Sensor Model 101')).toBeInTheDocument();

    // Click Remove
    await userEvent.click(canvas.getByRole('button', { name: /remove/i }));

    // Cart should now show empty state
    await waitFor(() => {
      expect(canvas.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interaction test: clicking Remove calls Zustand `removeItem`. With a single item, the cart becomes empty and the empty-cart message is displayed.',
      },
    },
  },
};
