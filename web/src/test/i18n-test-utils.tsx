/**
 * Test utilities for components using next-intl
 */
import { ReactElement } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { render, RenderOptions } from '@testing-library/react';

// Mock English messages for tests - directly from en.json
const mockMessages = {
  cartPage: {
    meta: {
      title: 'Shopping Cart',
      description: 'Review your cart and proceed to checkout',
    },
    header: {
      title: 'Shopping Cart',
      continueShopping: 'Continue Shopping',
    },
    empty: {
      title: 'Your Cart is Empty',
      description: 'Add some products to your cart to get started.',
      button: 'Continue Shopping',
    },
    items: {
      title: 'Cart Items',
      clearCart: 'Clear Cart',
      clearConfirm: 'Are you sure you want to clear your cart?',
      noImage: 'No Image',
      remove: 'Remove',
      priceEach: '{price} each',
    },
    stock: {
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      onBackorder: 'On Backorder',
      available: '{count} available',
    },
    quantity: {
      decrease: 'Decrease quantity',
      increase: 'Increase quantity',
    },
    summary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      discount: 'Discount',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      calculatedAtCheckout: 'Calculated at checkout',
      proceedToCheckout: 'Proceed to Checkout',
      secureCheckout: 'Secure Checkout',
      sslEncrypted: '256-bit SSL encrypted',
    },
    coupon: {
      label: 'Have a coupon code?',
      placeholder: 'Enter code',
      apply: 'Apply',
      applying: 'Applying...',
      appliedCoupons: 'Applied Coupons:',
      remove: 'Remove coupon',
    },
    shipping: {
      freeShipping: '✓ Free shipping on orders over $500',
      standardShipping: 'Standard shipping: 3-5 business days',
    },
    toasts: {
      updated: 'Updated',
      cartUpdated: 'Cart updated successfully',
      removed: 'Removed',
      itemRemoved: 'Item removed from cart',
      cartCleared: 'Cart Cleared',
      allItemsRemoved: 'All items removed from cart',
      enterCode: 'Enter Code',
      enterCodeMessage: 'Please enter a coupon code',
      couponApplied: 'Coupon Applied',
      couponAppliedMessage: 'Coupon "{code}" applied successfully',
      couponRemoved: 'Coupon Removed',
      couponRemovedMessage: 'Coupon "{code}" removed',
    },
  },
  checkoutPage: {
    meta: {
      title: 'Checkout | BAPI',
      description: 'Complete your order',
    },
    header: {
      title: 'Checkout',
      stepsRemaining: 'Complete your order in {count} easy step',
      stepsRemainingPlural: 'Complete your order in {count} easy steps',
    },
    wizard: {
      steps: {
        shipping: {
          title: 'Shipping',
          description: 'Delivery address',
        },
        payment: {
          title: 'Payment',
          description: 'Payment method',
        },
        review: {
          title: 'Review',
          description: 'Place order',
        },
      },
    },
    shipping: {
      title: 'Shipping Address',
      firstName: 'First Name',
      lastName: 'Last Name',
      company: 'Company (Optional)',
      address: 'Address',
      addressPlaceholder: 'Street address',
      address2Placeholder: 'Apartment, suite, etc. (optional)',
      city: 'City',
      state: 'State',
      statePlaceholder: 'CA, NY, TX, etc.',
      zipCode: 'ZIP Code',
      zipCodePlaceholder: '12345',
      country: 'Country',
      phone: 'Phone',
      phonePlaceholder: '(555) 123-4567',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      countries: {
        us: 'United States',
        ca: 'Canada',
        mx: 'Mexico',
      },
      billingSameAsShipping: 'Billing address same as shipping address',
      continueButton: 'Continue to Payment',
      validation: {
        missingInfo: 'Missing Information',
        missingInfoMessage: 'Please fill in all required fields',
        invalidEmail: 'Invalid Email',
        invalidEmailMessage: 'Please enter a valid email address',
        invalidPhone: 'Invalid Phone',
        invalidPhoneMessage: 'Please enter a valid phone number',
      },
    },
    payment: {
      title: 'Payment Method',
      methods: {
        creditCard: {
          title: 'Credit Card',
          description: 'Pay with credit or debit card',
        },
        paypal: {
          title: 'PayPal',
          description: 'Pay with your PayPal account',
        },
      },
      cardDetails: {
        title: 'Card Details',
        settingUp: 'Setting up payment...',
        loadError: 'Unable to load payment form. Please refresh and try again.',
      },
      security: {
        title: 'Your payment is secure',
        description: 'Powered by Stripe with 256-bit SSL encryption',
      },
      paypal: {
        redirectMessage: 'You will be redirected to PayPal to complete your purchase securely after reviewing your order.',
        continueButton: 'Continue to Review',
      },
      back: 'Back',
      toasts: {
        setupFailed: 'Payment Setup Failed',
        setupError: 'Unable to initialize payment',
        paymentConfirmed: 'Payment Confirmed',
        paymentFailed: 'Payment Failed',
      },
    },
    review: {
      title: 'Review Your Order',
      description: 'Please review your information before placing your order',
      shippingAddress: 'Shipping Address',
      billingAddress: 'Billing Address',
      paymentMethod: 'Payment Method',
      sameAsShipping: 'Same as shipping address',
      notSelected: 'Not selected',
      edit: 'Edit',
      phone: 'Phone',
      email: 'Email',
      paymentNotes: {
        creditCard: 'Your card will be charged after order confirmation',
        paypal: 'You will be redirected to PayPal to complete payment',
      },
      orderNotes: {
        label: 'Order Notes (Optional)',
        placeholder: 'Add any special instructions or notes about your order...',
      },
      terms: {
        agree: 'I have read and agree to the',
        termsLink: 'Terms & Conditions',
        and: 'and',
        privacyLink: 'Privacy Policy',
      },
      placeOrder: 'Place Order',
      processing: 'Processing...',
      back: 'Back',
      security: 'Secure 256-bit SSL encrypted checkout',
      toasts: {
        acceptTerms: 'Accept Terms',
        acceptTermsMessage: 'Please accept the terms and conditions to continue',
      },
    },
    summary: {
      title: 'Order Summary',
      items: 'Items ({count})',
      noImage: 'No Image',
      qty: 'Qty',
      editCart: '← Edit Cart',
      subtotal: 'Subtotal',
      discount: 'Discount',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      calculatedAtCheckout: 'Calculated at checkout',
      secureCheckout: 'Secure Checkout',
    },
    toasts: {
      cartEmpty: 'Cart Empty',
      cartEmptyMessage: 'Your cart is empty. Add items before checking out.',
      orderPlaced: 'Order Placed!',
      orderPlacedMessage: 'Your order has been placed successfully.',
    },
  },
  productPage: {
    specifications: {
      title: 'Specifications',
      noSpecsAvailable: 'No specifications available for this product.',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      download: 'Download',
      downloadSpecs: 'Download Specifications',
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
// Export our wrapped render function as both render and renderWithIntl
export { renderWithIntl as render, renderWithIntl, mockMessages };
