import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './Button';
import { MousePointerClick, ShoppingCart, Download, Trash2 } from 'lucide-react';

/**
 * Modern Button component using Class Variance Authority (CVA)
 *
 * This replaces the legacy BapiButton with a more maintainable,
 * type-safe approach to variant-based styling.
 *
 * ## BAPI Brand Guidelines
 * - **Primary (Blue)**: Main actions, navigation (~30% usage)
 * - **Accent (Yellow)**: High-priority CTAs like "Add to Cart" (~10% usage)
 * - **Outline/Ghost**: Secondary actions
 * - **Danger (Red)**: Destructive actions
 */
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible button component with multiple variants, sizes, and states. Built with CVA for type-safe variant management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'accent', 'outline', 'ghost', 'danger'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Button size',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether button takes full container width',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Variants
// ============================================================================

/**
 * Primary BAPI Blue variant - main actions and navigation
 * Use for: Proceed to checkout, submit forms, primary CTAs
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
};

/**
 * BAPI Yellow Accent variant - high-priority CTAs
 * Use for: Add to Cart, special offers, important conversions
 */
export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Add to Cart',
  },
};

/**
 * Outline variant - secondary actions
 * Use for: Cancel, secondary CTAs, alternative paths
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Learn More',
  },
};

/**
 * Ghost variant - tertiary actions
 * Use for: Close, dismiss, low-priority actions
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Cancel',
  },
};

/**
 * Danger variant - destructive actions
 * Use for: Delete, remove, irreversible actions
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete Item',
  },
};

// ============================================================================
// Sizes
// ============================================================================

/**
 * Small size button
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Medium size button (default)
 */
export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

/**
 * Large size button
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

/**
 * Extra large size button
 */
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large',
  },
};

// ============================================================================
// With Icons
// ============================================================================

/**
 * Button with leading icon - Add to Cart pattern
 */
export const WithLeadingIcon: Story = {
  args: {
    variant: 'accent',
    size: 'lg',
    children: (
      <>
        <ShoppingCart className="h-5 w-5" />
        <span>Add to Cart</span>
      </>
    ),
    className: 'gap-2',
  },
};

/**
 * Button with trailing icon - External link pattern
 */
export const WithTrailingIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <span>Download Specs</span>
        <Download className="h-5 w-5" />
      </>
    ),
    className: 'gap-2',
  },
};

/**
 * Icon-only button
 */
export const IconOnly: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: <MousePointerClick className="h-5 w-5" />,
    'aria-label': 'Click action',
  },
};

/**
 * Danger button with icon
 */
export const DangerWithIcon: Story = {
  args: {
    variant: 'danger',
    children: (
      <>
        <Trash2 className="h-4 w-4" />
        <span>Remove Item</span>
      </>
    ),
    className: 'gap-2',
  },
};

// ============================================================================
// States
// ============================================================================

/**
 * Disabled state - prevents user interaction
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Disabled accent variant
 */
export const DisabledAccent: Story = {
  args: {
    variant: 'accent',
    children: 'Out of Stock',
    disabled: true,
  },
};

/**
 * Loading state with icon
 */
export const Loading: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: (
      <>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <span>Processing...</span>
      </>
    ),
    className: 'gap-2',
  },
};

// ============================================================================
// Layout
// ============================================================================

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Full width accent button - typical checkout CTA
 */
export const FullWidthAccent: Story = {
  args: {
    variant: 'accent',
    size: 'lg',
    fullWidth: true,
    children: 'Proceed to Checkout',
  },
  parameters: {
    layout: 'padded',
  },
};

// ============================================================================
// Real-World Examples
// ============================================================================

/**
 * Product page - Add to Cart
 */
export const ProductAddToCart: Story = {
  args: {
    variant: 'accent',
    size: 'lg',
    children: (
      <>
        <ShoppingCart className="h-5 w-5" />
        <span>Add to Cart</span>
      </>
    ),
    className: 'gap-3',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Primary CTA for product pages. BAPI Yellow accent draws attention to conversion action.',
      },
    },
  },
};

/**
 * Checkout flow - Primary CTA
 */
export const CheckoutCTA: Story = {
  args: {
    variant: 'primary',
    size: 'xl',
    fullWidth: true,
    children: 'Complete Purchase',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Final checkout button. BAPI Blue inspires trust for payment actions.',
      },
    },
  },
};

/**
 * Secondary action - View Details
 */
export const SecondaryAction: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    children: 'View Details',
  },
  parameters: {
    docs: {
      description: {
        story: "Secondary action that doesn't compete with primary CTAs.",
      },
    },
  },
};

// ============================================================================
// Variant Comparison Grid
// ============================================================================

/**
 * All variants side-by-side for visual comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div className="text-sm text-neutral-600">
        <p>
          <strong>Primary:</strong> BAPI Blue - main actions
        </p>
        <p>
          <strong>Accent:</strong> BAPI Yellow - high-priority CTAs
        </p>
        <p>
          <strong>Outline:</strong> Secondary actions
        </p>
        <p>
          <strong>Ghost:</strong> Tertiary actions
        </p>
        <p>
          <strong>Danger:</strong> Destructive actions
        </p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * All sizes side-by-side for visual comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
