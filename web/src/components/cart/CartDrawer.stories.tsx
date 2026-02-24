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
import CartDrawer from './CartDrawer';
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
          <p className="mt-2 text-neutral-600">
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
// Mock Hooks with Different Cart States
// ============================================================================

/**
 * Empty cart mock
 */
const mockEmptyCart = () => ({
  items: [],
  isEmpty: true,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
});

/**
 * Single item cart mock
 */
const mockSingleItemCart = () => ({
  items: [createCartItem()],
  isEmpty: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 1,
  subtotal: 49.0,
});

/**
 * Multiple items cart mock
 */
const mockMultipleItemsCart = () => ({
  items: [
    createCartItem({
      id: 'prod-1',
      databaseId: 101,
      name: 'Temperature Sensor Model 101',
      price: '$49.00',
      numericPrice: 49.0,
      quantity: 2,
    }),
    createCartItem({
      id: 'prod-2',
      databaseId: 102,
      name: 'Humidity Sensor Model 205',
      slug: 'humidity-sensor-205',
      price: '$89.00',
      numericPrice: 89.0,
      quantity: 1,
      image: {
        sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=Humidity',
        altText: 'Humidity Sensor',
      },
    }),
    createCartItem({
      id: 'prod-3',
      databaseId: 103,
      name: 'Pressure Transducer PT-300',
      slug: 'pressure-transducer-300',
      price: '$129.00',
      numericPrice: 129.0,
      quantity: 3,
      image: {
        sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=Pressure',
        altText: 'Pressure Transducer',
      },
    }),
  ],
  isEmpty: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 6,
  subtotal: 49.0 * 2 + 89.0 + 129.0 * 3,
});

/**
 * Many items cart mock (tests scrolling)
 */
const mockManyItemsCart = () => {
  const items: CartItem[] = Array.from({ length: 10 }, (_, i) =>
    createCartItem({
      id: `prod-${i + 1}`,
      databaseId: 100 + i,
      name: `Product ${i + 1}`,
      slug: `product-${i + 1}`,
      price: `$${(29 + i * 10).toFixed(2)}`,
      quantity: (i % 3) + 1,
    })
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + price * item.quantity;
  }, 0);

  return {
    items,
    isEmpty: false,
    addItem: () => {},
    removeItem: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    totalItems,
    subtotal,
  };
};

/**
 * Cart with variable products
 */
const mockVariableProductsCart = () => ({
  items: [
    createCartItem({
      id: 'prod-var-1',
      databaseId: 201,
      name: 'Temperature Sensor - Industrial',
      slug: 'temp-sensor-industrial',
      price: '$149.00',
      numericPrice: 149.0,
      quantity: 1,
      variationId: 2011,
      variationName: 'Stainless Steel, 0-100°C',
      variationSku: 'TS-IND-SS-100',
      selectedAttributes: {
        material: 'Stainless Steel',
        range: '0-100°C',
        output: '4-20mA',
      },
    }),
    createCartItem({
      id: 'prod-var-2',
      databaseId: 202,
      name: 'Pressure Transducer - Heavy Duty',
      slug: 'pressure-transducer-hd',
      price: '$299.00',
      numericPrice: 299.0,
      quantity: 2,
      variationId: 2021,
      variationName: 'Titanium, 0-500PSI',
      variationSku: 'PT-HD-TI-500',
      selectedAttributes: {
        material: 'Titanium',
        'pressure-range': '0-500 PSI',
        connection: '1/4" NPT',
      },
      image: {
        sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=Pressure+HD',
        altText: 'Heavy Duty Pressure Transducer',
      },
    }),
  ],
  isEmpty: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 3,
  subtotal: 149.0 + 299.0 * 2,
});

/**
 * High value cart mock
 */
const mockHighValueCart = () => ({
  items: [
    createCartItem({
      id: 'prod-premium-1',
      databaseId: 301,
      name: 'Multi-Parameter Sensor System MPS-5000',
      slug: 'mps-5000',
      price: '$2,499.00',
      numericPrice: 2499.0,
      quantity: 1,
      partNumber: 'MPS-5K-PRO',
      image: {
        sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=MPS-5000',
        altText: 'Multi-Parameter Sensor System',
      },
    }),
    createCartItem({
      id: 'prod-premium-2',
      databaseId: 302,
      name: 'Data Logger with Cloud Integration DL-360',
      slug: 'data-logger-dl-360',
      price: '$1,899.00',
      numericPrice: 1899.0,
      quantity: 2,
      partNumber: 'DL-360-CLOUD',
      image: {
        sourceUrl: 'https://placehold.co/400x400/1479BC/FFFFFF?text=DL-360',
        altText: 'Cloud Data Logger',
      },
    }),
  ],
  isEmpty: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 3,
  subtotal: 2499.0 + 1899.0 * 2,
});

/**
 * Cart drawer open/close mock
 */
const mockCartDrawerOpen = () => ({
  isOpen: true,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
});

const mockCartDrawerClosed = () => ({
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
});

// ============================================================================
// Stories
// ============================================================================

/**
 * Empty cart - shows "Your cart is empty" message
 */
export const EmptyCart: Story = {
  args: {
    useCart: mockEmptyCart,
    useCartDrawer: mockCartDrawerOpen,
  },
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
  args: {
    useCart: mockSingleItemCart,
    useCartDrawer: mockCartDrawerOpen,
  },
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
  args: {
    useCart: mockMultipleItemsCart,
    useCartDrawer: mockCartDrawerOpen,
  },
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
  args: {
    useCart: mockManyItemsCart,
    useCartDrawer: mockCartDrawerOpen,
  },
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
  args: {
    useCart: mockVariableProductsCart,
    useCartDrawer: mockCartDrawerOpen,
  },
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
  args: {
    useCart: mockHighValueCart,
    useCartDrawer: mockCartDrawerOpen,
  },
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
 * Closed drawer - demonstrates closed state (not visible)
 */
export const ClosedDrawer: Story = {
  args: {
    useCart: mockMultipleItemsCart,
    useCartDrawer: mockCartDrawerClosed,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Drawer in closed state (returns null). Used to show the drawer can be hidden. In real app, this is controlled by user interaction.',
      },
    },
  },
};

/**
 * Mobile viewport - optimized for mobile devices
 */
export const MobileView: Story = {
  args: {
    useCart: mockMultipleItemsCart,
    useCartDrawer: mockCartDrawerOpen,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
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
  args: {
    useCart: mockManyItemsCart,
    useCartDrawer: mockCartDrawerOpen,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'Cart drawer on tablet viewport (768px). Shows optimal drawer width (max-w-md) and spacing for medium screens.',
      },
    },
  },
};
