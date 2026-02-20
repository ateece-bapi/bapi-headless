import type { Meta, StoryObj } from '@storybook/nextjs';
import CheckoutSummary from './CheckoutSummary';

/**
 * CheckoutSummary Stories
 *
 * Cart summary sidebar displayed during checkout:
 * - Cart items with thumbnails, quantities, prices
 * - Subtotal, tax, shipping, discount, total
 * - Edit cart link to return to cart page
 * - Sticky positioning on desktop
 * - Secure checkout badge
 *
 * Stories demonstrate:
 * - Single item vs multiple items
 * - With/without product images
 * - Calculated shipping/tax vs TBD
 * - Discount applied scenarios
 * - Scrollable items list (5+ items)
 * - Mobile responsive layout
 */

const meta: Meta<typeof CheckoutSummary> = {
  title: 'Components/Checkout/CheckoutSummary',
  component: CheckoutSummary,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-50 p-4">
        <div className="mx-auto max-w-md">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Order summary component displayed in checkout sidebar. Shows cart items, pricing breakdown (subtotal, tax, shipping, discounts), and secure checkout indicator. Sticky on desktop, collapses on mobile. Includes edit cart link to return to `/cart` page. Updated in real-time as checkout progresses.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckoutSummary>;

/**
 * Mock cart data for stories
 */
const singleItemCart = {
  subtotal: '$299.00',
  totalTax: '$0.00',
  shippingTotal: '$0.00',
  discountTotal: '$0.00',
  total: '$299.00',
  contents: {
    itemCount: 1,
    nodes: [
      {
        key: 'item-1',
        quantity: 1,
        total: '$299.00',
        product: {
          node: {
            name: 'BA/T10K-O-BB Room Temperature Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_T-O-BB_Wall_Mount_Temp_Sensors__79839.jpg',
              altText: 'BA/T10K-O-BB Room Temperature Sensor',
            },
          },
        },
        variation: null,
      },
    ],
  },
};

const multipleItemsCart = {
  subtotal: '$1,847.00',
  totalTax: '$147.76',
  shippingTotal: '$25.00',
  discountTotal: '$0.00',
  total: '$2,019.76',
  contents: {
    itemCount: 3,
    nodes: [
      {
        key: 'item-1',
        quantity: 2,
        total: '$598.00',
        product: {
          node: {
            name: 'BA/T10K-O-BB Room Temperature Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_T-O-BB_Wall_Mount_Temp_Sensors__79839.jpg',
              altText: 'BA/T10K-O-BB Room Temperature Sensor',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-2',
        quantity: 1,
        total: '$549.00',
        product: {
          node: {
            name: 'BA/H-WD-O Wall Mount Humidity Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_H-WD-O_Wall_Mount_Humidity_Sensor__48280.jpg',
              altText: 'BA/H-WD-O Wall Mount Humidity Sensor',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-3',
        quantity: 5,
        total: '$700.00',
        product: {
          node: {
            name: 'BA/10K-3-O-D Duct Temperature Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_10K-3-O-D_Duct_Temp_Sensor__13794.jpg',
              altText: 'BA/10K-3-O-D Duct Temperature Sensor',
            },
          },
        },
        variation: null,
      },
    ],
  },
};

const withDiscountCart = {
  subtotal: '$1,249.00',
  totalTax: '$99.92',
  shippingTotal: '$15.00',
  discountTotal: '$124.90',
  total: '$1,239.02',
  contents: {
    itemCount: 2,
    nodes: [
      {
        key: 'item-1',
        quantity: 3,
        total: '$897.00',
        product: {
          node: {
            name: 'BA/T10K-O-BB Room Temperature Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_T-O-BB_Wall_Mount_Temp_Sensors__79839.jpg',
              altText: 'BA/T10K-O-BB Room Temperature Sensor',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-2',
        quantity: 1,
        total: '$352.00',
        product: {
          node: {
            name: 'BA/CO2-O-BB CO2 Sensor',
            image: null,
          },
        },
        variation: null,
      },
    ],
  },
};

const manyItemsCart = {
  subtotal: '$3,456.00',
  totalTax: '$276.48',
  shippingTotal: '$45.00',
  discountTotal: '$0.00',
  total: '$3,777.48',
  contents: {
    itemCount: 8,
    nodes: [
      {
        key: 'item-1',
        quantity: 2,
        total: '$598.00',
        product: {
          node: {
            name: 'BA/T10K-O-BB Room Temperature Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_T-O-BB_Wall_Mount_Temp_Sensors__79839.jpg',
              altText: 'BA/T10K-O-BB Room Temperature Sensor',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-2',
        quantity: 1,
        total: '$549.00',
        product: {
          node: {
            name: 'BA/H-WD-O Wall Mount Humidity Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_H-WD-O_Wall_Mount_Humidity_Sensor__48280.jpg',
              altText: 'BA/H-WD-O Wall Mount Humidity Sensor',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-3',
        quantity: 3,
        total: '$420.00',
        product: {
          node: {
            name: 'BA/10K-3-O-D Duct Temperature Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_10K-3-O-D_Duct_Temp_Sensor__13794.jpg',
              altText: 'BA/10K-3-O-D Duct Temperature Sensor',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-4',
        quantity: 1,
        total: '$352.00',
        product: {
          node: {
            name: 'BA/CO2-O-BB CO2 Sensor',
            image: null,
          },
        },
        variation: null,
      },
      {
        key: 'item-5',
        quantity: 2,
        total: '$478.00',
        product: {
          node: {
            name: 'BA/P-WD-O Pressure Transducer',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_P-WD-O_Pressure_Transducer__52381.jpg',
              altText: 'BA/P-WD-O Pressure Transducer',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-6',
        quantity: 5,
        total: '$325.00',
        product: {
          node: {
            name: 'BA/RH-WD-O Humidity Sensor with Display',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_RH-WD-O_Humidity_Sensor__92847.jpg',
              altText: 'BA/RH-WD-O Humidity Sensor with Display',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-7',
        quantity: 1,
        total: '$189.00',
        product: {
          node: {
            name: 'BA/10K-2-O-W Waterproof Temperature Sensor',
            image: null,
          },
        },
        variation: null,
      },
      {
        key: 'item-8',
        quantity: 10,
        total: '$545.00',
        product: {
          node: {
            name: 'BA/T10K-O-R Averaging Temperature Sensor',
            image: null,
          },
        },
        variation: null,
      },
    ],
  },
};

const withVariationCart = {
  subtotal: '$1,598.00',
  totalTax: '$127.84',
  shippingTotal: '$20.00',
  discountTotal: '$0.00',
  total: '$1,745.84',
  contents: {
    itemCount: 2,
    nodes: [
      {
        key: 'item-1',
        quantity: 2,
        total: '$598.00',
        product: {
          node: {
            name: 'BA/T10K-O-BB Room Temperature Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_T-O-BB_Wall_Mount_Temp_Sensors__79839.jpg',
              altText: 'BA/T10K-O-BB Room Temperature Sensor',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-2',
        quantity: 1,
        total: '$1,000.00',
        product: {
          node: {
            name: 'BA/10K Configurable Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_10K_Configurable_Sensor__78234.jpg',
              altText: 'BA/10K Configurable Sensor',
            },
          },
        },
        variation: {
          node: {
            name: 'Range: 0-100°F, Output: 4-20mA, Material: Stainless Steel',
            image: null,
          },
        },
      },
    ],
  },
};

const earlyCheckoutCart = {
  subtotal: '$549.00',
  totalTax: '$0.00',
  shippingTotal: '$0.00',
  discountTotal: '$0.00',
  total: '$549.00',
  contents: {
    itemCount: 1,
    nodes: [
      {
        key: 'item-1',
        quantity: 1,
        total: '$549.00',
        product: {
          node: {
            name: 'BA/H-WD-O Wall Mount Humidity Sensor',
            image: {
              sourceUrl:
                'https://bapihvac.com/wp-content/uploads/2018/08/BA_H-WD-O_Wall_Mount_Humidity_Sensor__48280.jpg',
              altText: 'BA/H-WD-O Wall Mount Humidity Sensor',
            },
          },
        },
        variation: null,
      },
    ],
  },
};

/**
 * Default story - Single item in cart
 */
export const SingleItem: Story = {
  args: {
    cart: singleItemCart,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Single item in cart. Shows product thumbnail, name, quantity, price. Totals section shows subtotal and total (no tax/shipping yet). Displays "Edit Cart" link and secure checkout badge.',
      },
    },
  },
};

/**
 * Multiple items with calculated totals
 */
export const MultipleItems: Story = {
  args: {
    cart: multipleItemsCart,
  },
  parameters: {
    docs: {
      description: {
        story:
          '3 items in cart with calculated shipping and tax. Shows full pricing breakdown: subtotal ($1,847), shipping ($25), tax ($147.76), total ($2,019.76). All items have product images.',
      },
    },
  },
};

/**
 * Cart with discount applied
 */
export const WithDiscount: Story = {
  args: {
    cart: withDiscountCart,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cart with 10% discount applied ($124.90 off). Shows discount line in green with minus sign. One product missing image (shows "No image" placeholder). Final total reflects discount.',
      },
    },
  },
};

/**
 * Many items requiring scroll
 */
export const ManyItems: Story = {
  args: {
    cart: manyItemsCart,
  },
  parameters: {
    docs: {
      description: {
        story:
          '8 items in cart, exceeding max-height (16rem). Items section becomes scrollable. Shows mix of products with/without images. Total of $3,777.48 with shipping and tax.',
      },
    },
  },
};

/**
 * Cart with product variation
 */
export const WithVariation: Story = {
  args: {
    cart: withVariationCart,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cart containing variable product with selected attributes (Range, Output, Material). Variation details displayed in smaller text below product name.',
      },
    },
  },
};

/**
 * Early checkout - No shipping/tax calculated yet
 */
export const EarlyCheckout: Story = {
  args: {
    cart: earlyCheckoutCart,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 1 of checkout before shipping address entered. Shipping and tax show "$0.00" or "Calculated at checkout". Total equals subtotal until address provided.',
      },
    },
  },
};

/**
 * Mobile view
 */
export const Mobile: Story = {
  args: {
    cart: multipleItemsCart,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12pro',
    },
    docs: {
      description: {
        story:
          'Mobile layout (390px width). Summary takes full width, no longer sticky. Items scroll if many. Font sizes slightly reduced for mobile readability.',
      },
    },
  },
};

/**
 * Tablet view
 */
export const Tablet: Story = {
  args: {
    cart: multipleItemsCart,
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
    docs: {
      description: {
        story:
          'Tablet layout (768px width). Summary sidebar at fixed max-width (28rem). Sticky positioning active. Optimized for two-column checkout layout (wizard left, summary right).',
      },
    },
  },
};
