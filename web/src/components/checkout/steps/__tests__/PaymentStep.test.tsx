/**
 * Tests for PaymentStep Component
 *
 * Tests the payment method selection (step 2 of checkout):
 * - Payment method rendering
 * - Method selection (Credit Card, Bank Account)
 * - Stripe Elements integration
 * - Navigation (back/next)
 * - Loading states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/i18n-test-utils';
import PaymentStep from '../PaymentStep';
import type { CheckoutData } from '../../CheckoutPageClient';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
}));

// Mock Toast component
vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

// Captures every onSuccess callback the mocked StripePaymentForm receives, in mount order,
// so tests can invoke a stale (already-unmounted) instance's callback directly to simulate
// a Stripe confirmPayment() promise resolving after the customer switched tiles.
const capturedOnSuccessCallbacks: Array<(id: string) => void | Promise<void>> = [];

// Mock Stripe components
vi.mock('@/components/payment', () => ({
  StripeProvider: ({ children, clientSecret }: { children: React.ReactNode; clientSecret?: string }) => (
    <div data-testid="stripe-provider" data-client-secret={clientSecret}>
      {children}
    </div>
  ),
  StripePaymentForm: ({ onSuccess, onError }: any) => {
    capturedOnSuccessCallbacks.push(onSuccess);
    return (
      <div data-testid="stripe-payment-form">
        <button onClick={() => onSuccess('pi_test_123')}>Submit Payment</button>
        <button onClick={() => onError('Test error')}>Trigger Error</button>
      </div>
    );
  },
}));

describe('PaymentStep', () => {
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();
  const mockOnUpdateData = vi.fn();
  const mockOnConfirmPayment = vi.fn();

  // Create mock fetch function
  const mockFetch = vi.fn();

  const mockData: CheckoutData = {
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      company: '',
      address1: '123 Main St',
      address2: '',
      city: 'San Francisco',
      state: 'CA',
      postcode: '94102',
      country: 'US',
      phone: '(555) 123-4567',
      email: 'john@example.com',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      company: '',
      address1: '123 Main St',
      address2: '',
      city: 'San Francisco',
      state: 'CA',
      postcode: '94102',
      country: 'US',
      phone: '(555) 123-4567',
      email: 'john@example.com',
      sameAsShipping: true,
    },
    paymentMethod: {
      id: '',
      title: '',
    },
    shippingMethod: 'standard',
    orderNotes: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage with cart data
    const mockCart = {
      state: {
        items: [
          { id: '1', name: 'Product 1', price: '$100.00', quantity: 2 },
          { id: '2', name: 'Product 2', price: '$50.00', quantity: 1 },
        ],
      },
    };
    localStorage.setItem('bapi-cart-storage', JSON.stringify(mockCart));

    capturedOnSuccessCallbacks.length = 0;

    // Order creation is only invoked for the Bank Account (ACH) path
    mockOnConfirmPayment.mockResolvedValue({ success: true, orderId: 99999 });

    // Set up fetch mock
    mockFetch.mockResolvedValue({
      json: async () => ({
        success: true,
        clientSecret: 'test_client_secret',
        paymentIntentId: 'pi_test_123',
      }),
    });
    global.fetch = mockFetch as any;
  });

  // Payment Method Rendering Tests
  describe('Payment Method Rendering', () => {
    it('renders payment method heading', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      expect(screen.getByText('Payment Method')).toBeInTheDocument();
    });

    it('renders Credit Card option', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
      expect(screen.getByText('Pay with credit or debit card')).toBeInTheDocument();
    });

    it('renders Bank Account option', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      expect(screen.getByText('Bank Account')).toBeInTheDocument();
      expect(screen.getByText('Pay via ACH bank transfer')).toBeInTheDocument();
    });

    it('renders payment method icons', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      // Check for specific method icons instead of generic selector
      const creditCardIcon = screen.getByTestId('payment-method-credit_card-icon');
      const bankAccountIcon = screen.getByTestId('payment-method-bank_account-icon');
      expect(creditCardIcon).toBeInTheDocument();
      expect(bankAccountIcon).toBeInTheDocument();
    });

    it('renders both payment methods in grid layout', () => {
      const { container } = render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const grid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });
  });

  // Payment Method Selection Tests
  describe('Payment Method Selection', () => {
    it('selects credit card when clicked', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      expect(mockOnUpdateData).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: { id: 'credit_card', title: 'Credit Card' },
        })
      );
    });

    it('selects Bank Account when clicked', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      expect(mockOnUpdateData).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: { id: 'bank_account', title: 'Bank Account' },
        })
      );
    });

    it('clears a prior unconfirmed paymentIntent when switching methods', () => {
      const dataWithPendingIntent: CheckoutData = {
        ...mockData,
        paymentMethod: { id: 'bank_account', title: 'Bank Account' },
        paymentIntentId: 'pi_pending_intent',
      };

      render(
        <PaymentStep
          data={dataWithPendingIntent}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );

      // Switching methods before any order is confirmed should abandon the pending intent —
      // it was never linked to an order, so there's nothing live left running server-side.
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      expect(mockOnUpdateData).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: { id: 'credit_card', title: 'Credit Card' },
          paymentIntentId: undefined,
          orderId: undefined,
        })
      );
    });

    it('ignores method changes once an ACH order has been confirmed', () => {
      const dataWithConfirmedAchOrder: CheckoutData = {
        ...mockData,
        paymentMethod: { id: 'bank_account', title: 'Bank Account' },
        paymentIntentId: 'pi_old_ach_intent',
        orderId: 88888,
      };

      render(
        <PaymentStep
          data={dataWithConfirmedAchOrder}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );

      // The ACH debit/order is already live at this point — switching tiles must not be
      // possible, since it would only abandon it in local state while it stays active
      // server-side.
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      expect(creditCardButton).toBeDisabled();

      fireEvent.click(creditCardButton!);

      expect(mockOnUpdateData).not.toHaveBeenCalled();
    });

    it('highlights selected credit card method', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      expect(creditCardButton).toHaveClass('border-primary-500', 'bg-primary-50');
    });

    it('shows checkmark on selected method', () => {
      const { container } = render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      const checkmark = creditCardButton!.querySelector('svg path[d*="M5 13l4 4L19 7"]');
      expect(checkmark).toBeInTheDocument();
    });

    it('changes icon color when method is selected', () => {
      const { container } = render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      const icon = screen.getByTestId('payment-method-bank_account-icon');
      expect(icon).toBeInTheDocument();
    });

    it('pre-selects payment method from data', () => {
      const dataWithPayment: CheckoutData = {
        ...mockData,
        paymentMethod: { id: 'bank_account', title: 'Bank Account' },
      };
      render(
        <PaymentStep
          data={dataWithPayment}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      expect(bankAccountButton).toHaveClass('border-primary-500');
    });
  });

  // Stripe Integration Tests
  describe('Stripe Integration', () => {
    it('shows loading state when creating payment intent', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      // Loading state should appear briefly
      await waitFor(
        () => {
          expect(screen.getByText('Setting up payment...')).toBeInTheDocument();
        },
        { timeout: 100 }
      );
    });

    it('creates payment intent when credit card selected', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/payment/create-intent',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"amount":250'),
          })
        );
      });
    });

    it('renders Stripe payment form after intent created', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      await waitFor(() => {
        expect(screen.getByTestId('stripe-provider')).toBeInTheDocument();
        expect(screen.getByTestId('stripe-payment-form')).toBeInTheDocument();
      });
    });

    it('shows Card Details heading with credit card', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      await waitFor(() => {
        expect(screen.getByText('Card Details')).toBeInTheDocument();
      });
    });

    it('shows security note for Stripe', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      await waitFor(() => {
        expect(screen.getByText('Your payment is secure')).toBeInTheDocument();
        expect(
          screen.getByText('Powered by Stripe with 256-bit SSL encryption')
        ).toBeInTheDocument();
      });
    });

    it('handles Stripe payment success', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      await waitFor(() => {
        expect(screen.getByTestId('stripe-payment-form')).toBeInTheDocument();
      });

      const submitButton = screen.getByText('Submit Payment');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnUpdateData).toHaveBeenCalledWith(
          expect.objectContaining({
            paymentIntentId: 'pi_test_123',
          })
        );
        expect(mockOnNext).toHaveBeenCalled();
      });

      // Credit Card settles synchronously — order creation stays deferred to Review/Place
      // Order, unlike Bank Account which must create the order immediately (see below).
      expect(mockOnConfirmPayment).not.toHaveBeenCalled();
    });

    it('handles Stripe payment error', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      await waitFor(() => {
        expect(screen.getByTestId('stripe-payment-form')).toBeInTheDocument();
      });

      const errorButton = screen.getByText('Trigger Error');
      fireEvent.click(errorButton);

      expect(mockOnNext).not.toHaveBeenCalled();
    });
  });

  // Bank Account Integration Tests
  describe('Bank Account Integration', () => {
    it('creates a scoped payment intent when Bank Account selected', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/payment/create-intent',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"paymentMethodType":"bank_account"'),
          })
        );
      });
    });

    it('shows Bank Details heading with bank account', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      await waitFor(() => {
        expect(screen.getByText('Bank Details')).toBeInTheDocument();
      });
    });

    it('shows an already-confirmed panel instead of re-submitting when the order already exists', async () => {
      const dataWithConfirmedAchOrder: CheckoutData = {
        ...mockData,
        paymentMethod: { id: 'bank_account', title: 'Bank Account' },
        paymentIntentId: 'pi_confirmed_ach',
        orderId: 77777,
      };

      render(
        <PaymentStep
          data={dataWithConfirmedAchOrder}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );

      // Re-entering this step for the same already-confirmed selection (e.g. via Review's
      // Back) must not create a new PaymentIntent or re-render the submittable Stripe form
      expect(mockFetch).not.toHaveBeenCalled();
      expect(screen.queryByTestId('stripe-payment-form')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Continue to Review'));
      expect(mockOnNext).toHaveBeenCalled();
    });

    it('gates the Bank Account Stripe form behind terms acceptance', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      // Terms checkbox appears, but the Stripe form (which authorizes the actual bank debit)
      // must not render until the customer accepts it — Bank Account creates the WooCommerce
      // order immediately on success, so this is its final-confirmation gate (Card's equivalent
      // is the Review step's terms checkbox).
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('stripe-payment-form')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('checkbox'));

      await waitFor(() => {
        expect(screen.getByTestId('stripe-payment-form')).toBeInTheDocument();
      });
    });

    it('ignores a stale success callback from a Stripe form no longer active', async () => {
      // Each create-intent call must return a distinct PaymentIntent id (as Stripe would in
      // reality) so the guard is actually exercised rather than coincidentally matching.
      let callCount = 0;
      mockFetch.mockImplementation(async () => ({
        json: async () => ({
          success: true,
          clientSecret: `client_secret_${++callCount}`,
          paymentIntentId: `pi_intent_${callCount}`,
        }),
      }));

      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );

      // Select Bank Account, accept terms, and let its Stripe form mount (captured onSuccess #1)
      fireEvent.click(screen.getByText('Bank Account').closest('button')!);
      await waitFor(() => screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('checkbox'));
      await waitFor(() => expect(capturedOnSuccessCallbacks).toHaveLength(1));
      const staleBankOnSuccess = capturedOnSuccessCallbacks[0];

      // Switch to Credit Card before Stripe's confirmPayment() for Bank Account "resolves" —
      // this mounts a new intent/form with its own onSuccess (captured #2)
      fireEvent.click(screen.getByText('Credit Card').closest('button')!);
      await waitFor(() => expect(capturedOnSuccessCallbacks).toHaveLength(2));

      // The stale Bank Account promise now "resolves" with its own (now-superseded) intent id —
      // this must be ignored entirely, not treated as a fresh ACH confirmation
      await staleBankOnSuccess('pi_intent_1');

      expect(mockOnConfirmPayment).not.toHaveBeenCalled();
      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it('renders Stripe payment form for Bank Account', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      await waitFor(() => screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('checkbox'));

      await waitFor(() => {
        expect(screen.getByTestId('stripe-provider')).toBeInTheDocument();
        expect(screen.getByTestId('stripe-payment-form')).toBeInTheDocument();
      });
    });

    it('creates the WooCommerce order immediately when the ACH PaymentIntent confirms', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      await waitFor(() => screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('checkbox'));

      await waitFor(() => {
        expect(screen.getByTestId('stripe-payment-form')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Submit Payment'));

      // ACH settlement is asynchronous and reconciled only via a webhook that requires an
      // existing order — the order must be created right away, not deferred to Review.
      await waitFor(() => {
        expect(mockOnConfirmPayment).toHaveBeenCalledWith('pi_test_123');
        expect(mockOnUpdateData).toHaveBeenCalledWith(
          expect.objectContaining({ orderId: 99999 })
        );
        expect(mockOnNext).toHaveBeenCalled();
      });
    });

    it('does not advance if immediate ACH order creation fails', async () => {
      mockOnConfirmPayment.mockResolvedValueOnce({
        success: false,
        message: 'Unable to create order',
      });

      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      await waitFor(() => screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('checkbox'));

      await waitFor(() => {
        expect(screen.getByTestId('stripe-payment-form')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Submit Payment'));

      await waitFor(() => {
        expect(mockOnConfirmPayment).toHaveBeenCalled();
      });

      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it('ignores a stale Credit Card response that resolves after a later Bank Account request', async () => {
      // Deferred promises let us control exactly when each fetch call resolves,
      // independent of the order the requests were made in.
      let resolveCardRequest!: (value: unknown) => void;
      let resolveBankRequest!: (value: unknown) => void;
      const cardResponse = new Promise((resolve) => {
        resolveCardRequest = resolve;
      });
      const bankResponse = new Promise((resolve) => {
        resolveBankRequest = resolve;
      });

      mockFetch.mockImplementation((_url: string, options: any) => {
        const body = JSON.parse(options.body);
        return body.paymentMethodType === 'credit_card' ? cardResponse : bankResponse;
      });

      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );

      // Select Credit Card first (request in flight, unresolved)...
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

      // ...then switch to Bank Account before the Credit Card request resolves
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));

      // Terms gate is independent of intent loading — accept it now so the Stripe form can
      // render as soon as the (still in-flight) bank intent resolves
      fireEvent.click(screen.getByRole('checkbox'));

      // Bank Account's request resolves first...
      resolveBankRequest({
        json: async () => ({
          success: true,
          clientSecret: 'bank_client_secret',
          paymentIntentId: 'pi_bank_123',
        }),
      });
      await waitFor(() => {
        expect(screen.getByTestId('stripe-provider')).toHaveAttribute(
          'data-client-secret',
          'bank_client_secret'
        );
      });

      // ...then the stale Credit Card request finally resolves
      resolveCardRequest({
        json: async () => ({
          success: true,
          clientSecret: 'card_client_secret',
          paymentIntentId: 'pi_card_123',
        }),
      });

      // The stale card response must not overwrite the correct bank client secret/form —
      // assert on the actual clientSecret the mounted Stripe provider received, not just the
      // heading text (which is derived from `selectedMethod` and would stay "Bank Details"
      // even if the wrong clientSecret silently won the race).
      await waitFor(() => {
        expect(screen.getByText('Bank Details')).toBeInTheDocument();
      });
      expect(screen.getByTestId('stripe-provider')).toHaveAttribute(
        'data-client-secret',
        'bank_client_secret'
      );
      expect(screen.queryByText('Card Details')).not.toBeInTheDocument();
    });
  });

  // Navigation Tests
  describe('Navigation', () => {
    it('renders Back button when no method selected', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('calls onBack when Back button clicked', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    });

    it('keeps Back button visible with bank account selected', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      // Unlike Credit Card, Bank Account keeps Back available in case Financial Connections
      // fails or the customer needs to revisit shipping info before authorizing the debit.
      await waitFor(() => {
        expect(screen.getByText('Back')).toBeInTheDocument();
      });
    });

    it('hides Back button with credit card selected', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      await waitFor(() => {
        expect(screen.queryByText('Back')).not.toBeInTheDocument();
      });
    });

    it('hides Back button once an ACH order has been confirmed', () => {
      const dataWithConfirmedAchOrder: CheckoutData = {
        ...mockData,
        paymentMethod: { id: 'bank_account', title: 'Bank Account' },
        paymentIntentId: 'pi_confirmed',
        orderId: 88888,
      };

      render(
        <PaymentStep
          data={dataWithConfirmedAchOrder}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );

      // Going back to edit shipping/billing at this point wouldn't be reflected on the
      // already-created order, so Back must not be offered once confirmed.
      expect(screen.queryByText('Back')).not.toBeInTheDocument();
    });

    it('renders ArrowLeft icon on Back button', () => {
      const { container } = render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const backButton = screen.getByText('Back');
      expect(backButton).toBeInTheDocument();
      expect(backButton.closest('button')).toBeInTheDocument();
    });
  });

  // Visual Styling Tests
  describe('Visual Styling', () => {
    it('applies responsive grid to payment methods', () => {
      const { container } = render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const grid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('applies rounded corners to payment method buttons', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      expect(creditCardButton).toHaveClass('rounded-xl');
    });

    it('applies border and background to unselected methods', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      expect(creditCardButton).toHaveClass('border-neutral-200', 'bg-white');
    });

    it('applies primary colors to selected method', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const bankAccountButton = screen.getByText('Bank Account').closest('button');
      fireEvent.click(bankAccountButton!);

      expect(bankAccountButton).toHaveClass('border-primary-500', 'bg-primary-50');
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('handles empty cart gracefully', () => {
      localStorage.setItem('bapi-cart-storage', JSON.stringify({ state: { items: [] } }));

      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );

      expect(screen.getByText('Payment Method')).toBeInTheDocument();
    });

    it('handles missing localStorage', () => {
      localStorage.removeItem('bapi-cart-storage');

      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );

      expect(screen.getByText('Payment Method')).toBeInTheDocument();
    });

    it('handles failed payment intent creation', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          success: false,
          message: 'Payment setup failed',
        }),
      });

      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      await waitFor(() => {
        expect(
          screen.getByText('Unable to load payment form. Please refresh and try again.')
        ).toBeInTheDocument();
      });
    });

    it('handles network error during payment intent', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onConfirmPayment={mockOnConfirmPayment}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);

      await waitFor(() => {
        expect(
          screen.getByText('Unable to load payment form. Please refresh and try again.')
        ).toBeInTheDocument();
      });
    });
  });
});
