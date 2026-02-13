/**
 * Test utilities for components using next-intl
 */
import { ReactElement } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { render, RenderOptions } from '@testing-library/react';

// Mock English messages for tests
const mockMessages = {
  cartPage: {
    items: {
      title: 'Cart Items',
      empty: 'Your cart is empty',
      clearCart: 'Clear Cart',
      removeItem: 'Remove',
      noImage: 'No image',
      qty: 'Qty',
    },
    summary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      discount: 'Discount',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      calculatedAtCheckout: 'Calculated at checkout',
      coupon: {
        label: 'Have a coupon code?',
        placeholder: 'Enter code',
        apply: 'Apply',
        applying: 'Applying...',
      },
      checkout: 'Proceed to Checkout',
      continueShoppingButton: 'Continue Shopping',
    },
  },
  checkoutPage: {
    meta: {
      title: 'Checkout',
      description: 'Complete your purchase',
    },
    header: {
      title: 'Checkout',
      stepsRemaining: 'step remaining',
      stepsRemainingPlural: 'steps remaining',
    },
    wizard: {
      steps: {
        shipping: {
          title: 'Shipping',
          description: 'Address details',
        },
        payment: {
          title: 'Payment',
          description: 'Payment method',
        },
        review: {
          title: 'Review',
          description: 'Order review',
        },
      },
    },
    shipping: {
      title: 'Shipping Information',
      description: 'Enter your shipping address',
      firstName: 'First Name',
      lastName: 'Last Name',
      company: 'Company',
      companyPlaceholder: 'Optional',
      address: 'Address',
      addressPlaceholder: 'Street address',
      address2: 'Apartment, suite, etc.',
      address2Placeholder: 'Optional',
      city: 'City',
      state: 'State / Province',
      zipCode: 'ZIP / Postal Code',
      country: 'Country',
      phone: 'Phone',
      phonePlaceholder: '(555) 123-4567',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      countries: {
        us: 'United States',
        ca: 'Canada',
        mx: 'Mexico',
      },
      billingSameAsShipping: 'Billing address same as shipping',
      continueButton: 'Continue to Payment',
      validation: {
        missingInfo: 'Missing Information',
        fillAllFields: 'Please fill in all required fields',
        invalidEmail: 'Invalid Email',
        validEmailRequired: 'Please enter a valid email address',
        invalidPhone: 'Invalid Phone',
        validPhoneRequired: 'Please enter a valid phone number',
      },
    },
    payment: {
      title: 'Payment Method',
      description: 'Select your payment method',
      creditCard: {
        title: 'Credit Card',
        description: 'Pay securely with credit or debit card',
      },
      paypal: {
        title: 'PayPal',
        description: 'Fast and secure PayPal checkout',
        redirectMessage: 'You will be redirected to PayPal to complete your purchase',
        continueButton: 'Continue with PayPal',
      },
      cardDetails: {
        title: 'Card Details',
        settingUp: 'Setting up secure payment...',
        loadError: 'Failed to load payment form',
      },
      security: {
        title: 'Secure Payment',
        description: 'Your payment information is encrypted and secure',
      },
      back: 'Back to Shipping',
      toasts: {
        setupFailed: 'Payment Setup Failed',
        setupFailedMessage: 'Unable to initialize payment. Please try again.',
        paymentConfirmed: 'Payment Confirmed',
        paymentFailed: 'Payment Failed',
      },
    },
    review: {
      title: 'Review Your Order',
      description: 'Please review your order before placing it',
      shippingAddress: 'Shipping Address',
      billingAddress: 'Billing Address',
      paymentMethod: 'Payment Method',
      phone: 'Phone',
      email: 'Email',
      edit: 'Edit',
      sameAsShipping: 'Same as shipping',
      notSelected: 'Not selected',
      paymentNotes: {
        creditCard: 'Your card will be charged when you place the order',
        paypal: 'You will complete payment through PayPal',
      },
      orderNotes: {
        label: 'Order Notes',
        placeholder: 'Add any special instructions for your order (optional)',
      },
      terms: {
        agree: 'I agree to the',
        termsLink: 'Terms & Conditions',
        and: 'and',
        privacyLink: 'Privacy Policy',
      },
      back: 'Back to Payment',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      security: '🔒 Secure checkout',
      toasts: {
        acceptTerms: 'Accept Terms',
        acceptTermsMessage: 'Please accept the terms and conditions',
      },
    },
    summary: {
      title: 'Order Summary',
      items: 'item',
      itemsPlural: 'items',
      noImage: 'No image',
      qty: 'Qty',
      editCart: 'Edit Cart',
      subtotal: 'Subtotal',
      discount: 'Discount',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      calculatedAtCheckout: 'Calculated at checkout',
      secureCheckout: '🔒 Secure Checkout',
    },
    toasts: {
      cartEmpty: 'Cart is Empty',
      cartEmptyMessage: 'Please add items to your cart before checking out',
      paymentFailed: 'Payment Failed',
      orderPlaced: 'Order Placed!',
      orderPlacedMessage: 'Your order has been successfully placed',
    },
  },
};

interface AllTheProvidersProps {
  children: React.ReactNode;
  locale?: string;
  messages?: typeof mockMessages;
}

/**
 * Test wrapper that provides NextIntlClientProvider context
 */
function AllTheProviders({ children, locale = 'en', messages = mockMessages }: AllTheProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * Custom render function that wraps components with necessary providers
 */
function renderWithIntl(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { locale?: string; messages?: typeof mockMessages }
) {
  const { locale, messages, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders locale={locale} messages={messages}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithIntl as render, mockMessages };
