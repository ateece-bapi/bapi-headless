/**
 * CartButton Storybook Stories
 *
 * Documents the cart button with item count badge variations.
 *
 * **Component Features:**
 * - Shopping cart icon (24x24px SVG)
 * - Item count badge (only visible when cart has items)
 * - Badge positioning (absolute top-right)
 * - Badge styling (red background, white text, rounded-full)
 * - Click handler to open cart drawer
 * - Hover state transition
 * - Accessibility (aria-label for screen readers)
 *
 * **Story Coverage:**
 * - EmptyCart: No badge (0 items)
 * - SingleItem: Badge shows "1"
 * - FewItems: Badge shows "5"
 * - ManyItems: Badge shows "15"
 * - LargeQuantity: Badge shows "99"
 * - ExtraLargeQuantity: Badge shows "150" (tests overflow)
 *
 * **Real-World Contexts:**
 * - HeaderPrimary: In main navigation bar
 * - HeaderMobile: Mobile hamburger menu
 * - FloatingAction: Sticky floating button (mobile)
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CartButton from './CartButton';

const meta: Meta<typeof CartButton> = {
  title: 'Components/Cart/CartButton',
  component: CartButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Cart button with item count badge. Displays shopping cart icon and opens cart drawer on click. Badge appears only when cart has items.',
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Mock Hooks with Different Item Counts
// ============================================================================

/**
 * Empty cart mock (no badge should appear)
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
  items: [],
  isEmpty: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 1,
  subtotal: 49.0,
});

/**
 * Few items cart mock (5)
 */
const mockFewItemsCart = () => ({
  items: [],
  isEmpty: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 5,
  subtotal: 245.0,
});

/**
 * Many items cart mock (15)
 */
const mockManyItemsCart = () => ({
  items: [],
  isEmpty: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 15,
  subtotal: 735.0,
});

/**
 * Large quantity cart mock (99)
 */
const mockLargeQuantityCart = () => ({
  items: [],
  isEmpty: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 99,
  subtotal: 4851.0,
});

/**
 * Extra large quantity cart mock (150)
 */
const mockExtraLargeQuantityCart = () => ({
  items: [],
  isEmpty: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 150,
  subtotal: 7350.0,
});

/**
 * Cart drawer mock (for openCart handler)
 */
const mockCartDrawer = () => ({
  isOpen: false,
  openCart: () => {
    // No-op for Storybook mock
  },
  closeCart: () => {},
  toggleCart: () => {},
});

// ============================================================================
// Basic Badge Variations
// ============================================================================

/**
 * Empty cart - no badge displayed
 */
export const EmptyCart: Story = {
  args: {
    useCart: mockEmptyCart,
    useCartDrawer: mockCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cart button with 0 items. Badge is hidden when cart is empty. Only the cart icon is visible.',
      },
    },
  },
};

/**
 * Single item - badge shows "1"
 */
export const SingleItem: Story = {
  args: {
    useCart: mockSingleItemCart,
    useCartDrawer: mockCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Cart button with 1 item. Badge appears with "1" in red circle at top-right corner.',
      },
    },
  },
};

/**
 * Few items - badge shows "5"
 */
export const FewItems: Story = {
  args: {
    useCart: mockFewItemsCart,
    useCartDrawer: mockCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cart button with 5 items. Badge displays single-digit number comfortably within circular badge.',
      },
    },
  },
};

/**
 * Many items - badge shows "15"
 */
export const ManyItems: Story = {
  args: {
    useCart: mockManyItemsCart,
    useCartDrawer: mockCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cart button with 15 items. Badge displays double-digit number. Tests badge width handling.',
      },
    },
  },
};

/**
 * Large quantity - badge shows "99"
 */
export const LargeQuantity: Story = {
  args: {
    useCart: mockLargeQuantityCart,
    useCartDrawer: mockCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Cart button with 99 items. Maximum double-digit display before potential overflow.',
      },
    },
  },
};

/**
 * Extra large quantity - badge shows "150"
 */
export const ExtraLargeQuantity: Story = {
  args: {
    useCart: mockExtraLargeQuantityCart,
    useCartDrawer: mockCartDrawer,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cart button with 150 items. Tests triple-digit overflow handling. Badge may become elliptical or require width adjustment.',
      },
    },
  },
};

// ============================================================================
// Real-World Context Stories
// ============================================================================

/**
 * Header primary navigation - desktop
 */
export const HeaderPrimary: Story = {
  args: {
    useCart: mockManyItemsCart,
    useCartDrawer: mockCartDrawer,
  },
  decorators: [
    (Story) => (
      <div className="flex h-16 items-center justify-between bg-white px-6 shadow">
        <div className="text-xl font-bold text-primary-600">BAPI</div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-neutral-700 hover:text-primary-600">
            Products
          </a>
          <a href="#" className="text-neutral-700 hover:text-primary-600">
            Support
          </a>
          <a href="#" className="text-neutral-700 hover:text-primary-600">
            Company
          </a>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Cart button in primary desktop navigation. Positioned in header next to main navigation links.',
      },
    },
  },
};

/**
 * Header mobile menu
 */
export const HeaderMobile: Story = {
  args: {
    useCart: mockFewItemsCart,
    useCartDrawer: mockCartDrawer,
  },
  decorators: [
    (Story) => (
      <div className="flex h-14 items-center justify-between bg-white px-4 shadow">
        <button className="text-neutral-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="text-lg font-bold text-primary-600">BAPI</div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Cart button in mobile header (375px viewport). Positioned on right side next to hamburger menu icon.',
      },
    },
  },
};

/**
 * Floating action button - mobile scroll
 */
export const FloatingAction: Story = {
  args: {
    useCart: mockManyItemsCart,
    useCartDrawer: mockCartDrawer,
  },
  decorators: [
    (Story) => (
      <div className="relative h-screen w-full overflow-auto bg-neutral-100">
        {/* Page content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-900">Product Page</h1>
          <div className="mt-4 space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white p-4 shadow">
                <h3 className="font-semibold">Product {i + 1}</h3>
                <p className="mt-2 text-neutral-600">Product description and details...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating cart button */}
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-primary-600 p-4 text-white shadow-lg transition hover:bg-primary-700">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Cart button as floating action button on mobile. Fixed position at bottom-right with circular primary-colored background. Remains visible during scroll.',
      },
    },
  },
};

/**
 * Dark background variant
 */
export const DarkBackground: Story = {
  args: {
    useCart: mockFewItemsCart,
    useCartDrawer: mockCartDrawer,
  },
  decorators: [
    (Story) => (
      <div className="flex h-16 items-center justify-between bg-neutral-900 px-6">
        <div className="text-xl font-bold text-white">BAPI</div>
        <div className="flex items-center gap-6 text-white">
          <a href="#" className="hover:text-primary-300">
            Products
          </a>
          <a href="#" className="hover:text-primary-300">
            Support
          </a>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story:
          'Cart button on dark background. Icon inherits text color (white) and badge maintains high contrast with red background.',
      },
    },
  },
};
