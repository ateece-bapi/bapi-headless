import type { Meta, StoryObj } from '@storybook/nextjs';
import CheckoutWizard from './CheckoutWizard';
import { ToastProvider } from '../ui/Toast';
import type { CheckoutData } from './CheckoutPageClient';

/**
 * CheckoutWizard Stories
 *
 * Multi-step checkout wizard with progress indicator:
 * - Step 1: Shipping Information (address form with validation)
 * - Step 2: Payment Method (credit card via Stripe or PayPal)
 * - Step 3: Review & Place Order (summary with T&C checkbox)
 *
 * Stories demonstrate:
 * - All 3 steps with complete data flow
 * - Progress indicator states (pending, active, completed)
 * - Form validation and error states
 * - Responsive layouts (mobile, tablet, desktop)
 * - Processing states during order placement
 * - Empty vs filled form states
 * - Billing address toggle (same as shipping vs different)
 */

const meta: Meta<typeof CheckoutWizard> = {
  title: 'Components/Checkout/CheckoutWizard',
  component: CheckoutWizard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="min-h-screen bg-neutral-50 p-4">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Multi-step checkout wizard with 3 steps: Shipping (address collection), Payment (method selection with Stripe integration), and Review (order summary with T&C). Features progress indicator with completed step checkmarks, form validation, and responsive design. Used in `/checkout` route for finalizing customer orders.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckoutWizard>;

/**
 * Mock checkout data for stories
 */
const emptyCheckoutData: CheckoutData = {
  shippingAddress: {
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'US',
    phone: '',
    email: '',
  },
  billingAddress: {
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'US',
    phone: '',
    email: '',
    sameAsShipping: true,
  },
  paymentMethod: null,
  shippingMethod: null,
  orderNotes: '',
};

const filledShippingData: CheckoutData = {
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    company: 'ACME HVAC Solutions',
    address1: '1234 Main Street',
    address2: 'Suite 100',
    city: 'Minneapolis',
    state: 'MN',
    postcode: '55401',
    country: 'US',
    phone: '612-555-1234',
    email: 'john.doe@acme-hvac.com',
  },
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    company: 'ACME HVAC Solutions',
    address1: '1234 Main Street',
    address2: 'Suite 100',
    city: 'Minneapolis',
    state: 'MN',
    postcode: '55401',
    country: 'US',
    phone: '612-555-1234',
    email: 'john.doe@acme-hvac.com',
    sameAsShipping: true,
  },
  paymentMethod: null,
  shippingMethod: null,
  orderNotes: '',
};

const filledPaymentData: CheckoutData = {
  ...filledShippingData,
  paymentMethod: {
    id: 'credit_card',
    title: 'Credit Card',
  },
};

const filledReviewData: CheckoutData = {
  ...filledPaymentData,
  orderNotes: 'Please deliver to loading dock at rear entrance. Call 30 minutes before arrival.',
};

const differentBillingData: CheckoutData = {
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    company: 'ACME HVAC Solutions',
    address1: '1234 Main Street',
    address2: 'Suite 100',
    city: 'Minneapolis',
    state: 'MN',
    postcode: '55401',
    country: 'US',
    phone: '612-555-1234',
    email: 'john.doe@acme-hvac.com',
  },
  billingAddress: {
    firstName: 'Jane',
    lastName: 'Smith',
    company: 'ACME Billing Dept',
    address1: '5678 Oak Avenue',
    address2: 'Floor 3',
    city: 'St. Paul',
    state: 'MN',
    postcode: '55102',
    country: 'US',
    phone: '651-555-9876',
    email: 'billing@acme-hvac.com',
    sameAsShipping: false,
  },
  paymentMethod: {
    id: 'credit_card',
    title: 'Credit Card',
  },
  shippingMethod: null,
  orderNotes: '',
};

/**
 * Default story - Step 1 (Shipping) with empty form
 */
export const Step1ShippingEmpty: Story = {
  args: {
    currentStep: 1,
    checkoutData: emptyCheckoutData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 1 with empty shipping form. Shows all required fields (name, address, city, state, zip, country, phone, email). Validation triggers on submit. Progress indicator shows step 1 as active.',
      },
    },
  },
};

/**
 * Step 1 with pre-filled shipping information
 */
export const Step1ShippingFilled: Story = {
  args: {
    currentStep: 1,
    checkoutData: filledShippingData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 1 with complete shipping information. All fields pre-filled with valid B2B data including company name. Ready to proceed to payment step.',
      },
    },
  },
};

/**
 * Step 2 - Payment method selection
 */
export const Step2PaymentSelection: Story = {
  args: {
    currentStep: 2,
    checkoutData: filledShippingData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 2 showing payment method selection. Two options: Credit Card (Stripe Elements) and PayPal. Progress indicator shows steps 1 completed (green checkmark), step 2 active.',
      },
    },
  },
};

/**
 * Step 2 with credit card selected
 */
export const Step2CreditCardSelected: Story = {
  args: {
    currentStep: 2,
    checkoutData: filledPaymentData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 2 with credit card payment method selected. Stripe Elements form loads for card details entry (card number, expiry, CVC). Note: Stripe form is dynamically loaded and may show loading state in Storybook.',
      },
    },
  },
};

/**
 * Step 3 - Review order
 */
export const Step3ReviewOrder: Story = {
  args: {
    currentStep: 3,
    checkoutData: filledReviewData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 3 showing order review. Displays shipping address, billing address (same as shipping), payment method, and order notes. Includes Terms & Conditions checkbox. Progress indicator shows steps 1-2 completed (green checkmarks), step 3 active.',
      },
    },
  },
};

/**
 * Step 3 with different billing address
 */
export const Step3DifferentBilling: Story = {
  args: {
    currentStep: 3,
    checkoutData: differentBillingData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 3 with separate billing address. Shows shipping address (delivery location) and different billing address (accounts payable). Common B2B scenario where billing department has separate contact.',
      },
    },
  },
};

/**
 * Step 3 - Processing order placement
 */
export const Step3Processing: Story = {
  args: {
    currentStep: 3,
    checkoutData: filledReviewData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Step 3 during order placement. Place Order button shows loading spinner and is disabled. Back button is also disabled to prevent navigation during processing. Typically takes 2-5 seconds for payment processing and order creation.',
      },
    },
  },
};

/**
 * Mobile view - Step 1
 */
export const MobileStep1: Story = {
  args: {
    currentStep: 1,
    checkoutData: emptyCheckoutData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12pro',
    },
    docs: {
      description: {
        story:
          'Shipping step on mobile (390x844). Progress indicator stacks vertically with smaller step circles. Step descriptions hidden on small screens. Form inputs stack in single column.',
      },
    },
  },
};

/**
 * Mobile view - Step 2
 */
export const MobileStep2: Story = {
  args: {
    currentStep: 2,
    checkoutData: filledShippingData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12pro',
    },
    docs: {
      description: {
        story:
          'Payment step on mobile. Payment method cards stack vertically. Progress line shows completion of step 1.',
      },
    },
  },
};

/**
 * Mobile view - Step 3
 */
export const MobileStep3: Story = {
  args: {
    currentStep: 3,
    checkoutData: filledReviewData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12pro',
    },
    docs: {
      description: {
        story:
          'Review step on mobile. Address cards stack vertically with edit buttons. Order notes textarea full width. Place Order button spans full width.',
      },
    },
  },
};

/**
 * Tablet view - Step 2
 */
export const TabletStep2: Story = {
  args: {
    currentStep: 2,
    checkoutData: filledShippingData,
    onNext: () => console.log('Next clicked'),
    onBack: () => console.log('Back clicked'),
    onUpdateData: (data) => console.log('Data updated:', data),
    onPlaceOrder: () => console.log('Place order clicked'),
    isProcessing: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
    docs: {
      description: {
        story:
          'Payment step on tablet (768x1024). Payment method cards display in 2-column grid. Progress indicator shows full step descriptions.',
      },
    },
  },
};

/**
 * Complete wizard flow preview (all steps)
 */
export const AllStepsPreview: Story = {
  render: () => (
    <ToastProvider>
      <div className="space-y-8 bg-neutral-50 p-4">
        <div>
          <h3 className="mb-4 text-xl font-bold text-neutral-900">Step 1: Shipping</h3>
          <CheckoutWizard
            currentStep={1}
            checkoutData={filledShippingData}
            onNext={() => console.log('Next')}
            onBack={() => console.log('Back')}
            onUpdateData={() => console.log('Update')}
            onPlaceOrder={() => console.log('Place order')}
            isProcessing={false}
          />
        </div>
        <div>
          <h3 className="mb-4 text-xl font-bold text-neutral-900">Step 2: Payment</h3>
          <CheckoutWizard
            currentStep={2}
            checkoutData={filledPaymentData}
            onNext={() => console.log('Next')}
            onBack={() => console.log('Back')}
            onUpdateData={() => console.log('Update')}
            onPlaceOrder={() => console.log('Place order')}
            isProcessing={false}
          />
        </div>
        <div>
          <h3 className="mb-4 text-xl font-bold text-neutral-900">Step 3: Review</h3>
          <CheckoutWizard
            currentStep={3}
            checkoutData={filledReviewData}
            onNext={() => console.log('Next')}
            onBack={() => console.log('Back')}
            onUpdateData={() => console.log('Update')}
            onPlaceOrder={() => console.log('Place order')}
            isProcessing={false}
          />
        </div>
      </div>
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Visual overview of all 3 checkout steps side-by-side. Shows progression: empty form → payment selection → order review. Useful for design review and QA verification of complete user journey.',
      },
    },
  },
};
