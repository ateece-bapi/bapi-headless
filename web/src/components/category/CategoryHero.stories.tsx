import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CategoryHero from './CategoryHero';

/**
 * CategoryHero Stories
 *
 * Phase 1 product navigation — renders the category header with breadcrumb
 * navigation and a blue-gradient hero section for every product category page.
 *
 * Stories cover:
 * - Full category with description, image, and product count
 * - Category with a long description (wrapping)
 * - Minimal category (name only, no description or count)
 * - Deep breadcrumb path (3 levels)
 * - Single product in category
 */

const meta: Meta<typeof CategoryHero> = {
  title: 'Components/Category/CategoryHero',
  component: CategoryHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hero header for category pages. Renders a blue gradient banner with category name, optional description, product count, and breadcrumb navigation. Breadcrumbs use the gradient variant for contrast on the dark background.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryHero>;

const baseBreadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
];

/** Full category with all fields populated. */
export const Default: Story = {
  args: {
    category: {
      name: 'Temperature Sensors',
      description:
        'High-accuracy temperature sensors for HVAC, building automation, and industrial control applications.',
      count: 42,
      image: null,
    },
    breadcrumbs: [
      ...baseBreadcrumbs,
      { label: 'Temperature Sensors' },
    ],
  },
};

/** Category with a long description that wraps across multiple lines. */
export const LongDescription: Story = {
  args: {
    category: {
      name: 'Humidity & Pressure Transmitters',
      description:
        'Precision humidity and pressure transmitters engineered for demanding HVAC and building automation environments. Suitable for duct, wall, and outdoor mounting with optional display options. Compliant with ASHRAE 90.1 and BACnet/Modbus communication protocols.',
      count: 78,
      image: null,
    },
    breadcrumbs: [
      ...baseBreadcrumbs,
      { label: 'Humidity & Pressure Transmitters' },
    ],
  },
};

/** Minimal — no description, no count. */
export const NameOnly: Story = {
  args: {
    category: {
      name: 'Accessories',
      description: null,
      count: null,
      image: null,
    },
    breadcrumbs: [
      ...baseBreadcrumbs,
      { label: 'Accessories' },
    ],
  },
};

/** Deep breadcrumb path (subcategory level). */
export const DeepBreadcrumb: Story = {
  args: {
    category: {
      name: 'Duct Temperature Sensors',
      description: 'Insertion-style temperature sensors for supply and return air duct monitoring.',
      count: 14,
      image: null,
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Temperature Sensors', href: '/products/temperature-sensors' },
      { label: 'Duct Temperature Sensors' },
    ],
  },
};

/** Edge case: single product in category. */
export const SingleProduct: Story = {
  args: {
    category: {
      name: 'Specialty Controllers',
      description: 'Custom-engineered controllers for specialized building automation applications.',
      count: 1,
      image: null,
    },
    breadcrumbs: [
      ...baseBreadcrumbs,
      { label: 'Specialty Controllers' },
    ],
  },
};
