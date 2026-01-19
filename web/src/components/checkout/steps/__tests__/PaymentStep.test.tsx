/**
 * Tests for PaymentStep Component
 *
 * Tests the payment method selection (step 2 of checkout):
 * - Payment method rendering
 * - Method selection (Credit Card, PayPal)
 * - Stripe Elements integration
 * - Navigation (back/next)
 * - Loading states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentStep from '../PaymentStep';
import type { CheckoutData } from '../../CheckoutPageClient';

// Mock Toast component
vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

// Mock Stripe components
vi.mock('@/components/payment', () => ({
  StripeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stripe-provider">{children}</div>
  ),
  StripePaymentForm: ({ onSuccess, onError }: any) => (
    <div data-testid="stripe-payment-form">
      <button onClick={() => onSuccess('pi_test_123')}>Submit Payment</button>
      <button onClick={() => onError('Test error')}>Trigger Error</button>
    </div>
  ),
}));

describe('PaymentStep', () => {
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();
  const mockOnUpdateData = vi.fn();
  
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
    
    // Set up fetch mock
    mockFetch.mockResolvedValue({
      json: async () => ({
        success: true,
        clientSecret: 'test_client_secret',
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
        />
      );
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
      expect(screen.getByText('Pay with credit or debit card')).toBeInTheDocument();
    });

    it('renders PayPal option', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      expect(screen.getByText('PayPal')).toBeInTheDocument();
      expect(screen.getByText('Pay with your PayPal account')).toBeInTheDocument();
    });

    it('renders payment method icons', () => {
      const { container } = render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      const creditCardIcon = container.querySelector('.lucide-credit-card');
      const paypalIcon = container.querySelector('.lucide-banknote');
      expect(creditCardIcon).toBeInTheDocument();
      expect(paypalIcon).toBeInTheDocument();
    });

    it('renders both payment methods in grid layout', () => {
      const { container } = render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
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

    it('selects PayPal when clicked', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      const paypalButton = screen.getByText('PayPal').closest('button');
      fireEvent.click(paypalButton!);
      
      expect(mockOnUpdateData).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: { id: 'paypal', title: 'PayPal' },
        })
      );
    });

    it('highlights selected credit card method', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
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
        />
      );
      const paypalButton = screen.getByText('PayPal').closest('button');
      fireEvent.click(paypalButton!);
      
      const icon = paypalButton!.querySelector('.lucide-banknote');
      expect(icon).toHaveClass('text-primary-500');
    });

    it('pre-selects payment method from data', () => {
      const dataWithPayment: CheckoutData = {
        ...mockData,
        paymentMethod: { id: 'paypal', title: 'PayPal' },
      };
      render(
        <PaymentStep
          data={dataWithPayment}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      const paypalButton = screen.getByText('PayPal').closest('button');
      expect(paypalButton).toHaveClass('border-primary-500');
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
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);
      
      // Loading state should appear briefly
      await waitFor(() => {
        expect(screen.getByText('Setting up payment...')).toBeInTheDocument();
      }, { timeout: 100 });
    });

    it('creates payment intent when credit card selected', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
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
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);
      
      await waitFor(() => {
        expect(screen.getByText('Your payment is secure')).toBeInTheDocument();
        expect(screen.getByText('Powered by Stripe with 256-bit SSL encryption')).toBeInTheDocument();
      });
    });

    it('handles Stripe payment success', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
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
    });

    it('handles Stripe payment error', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
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

  // PayPal Integration Tests
  describe('PayPal Integration', () => {
    it('shows PayPal info when PayPal selected', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      const paypalButton = screen.getByText('PayPal').closest('button');
      fireEvent.click(paypalButton!);
      
      expect(
        screen.getByText(/You will be redirected to PayPal/)
      ).toBeInTheDocument();
    });

    it('shows Continue to Review button for PayPal', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      const paypalButton = screen.getByText('PayPal').closest('button');
      fireEvent.click(paypalButton!);
      
      expect(screen.getByText('Continue to Review')).toBeInTheDocument();
    });

    it('calls onNext when Continue to Review clicked', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      const paypalButton = screen.getByText('PayPal').closest('button');
      fireEvent.click(paypalButton!);
      
      const continueButton = screen.getByText('Continue to Review');
      fireEvent.click(continueButton);
      
      expect(mockOnNext).toHaveBeenCalled();
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
        />
      );
      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalled();
    });

    it('shows Back button with PayPal selected', () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      const paypalButton = screen.getByText('PayPal').closest('button');
      fireEvent.click(paypalButton!);
      
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('hides Back button with credit card selected', async () => {
      render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      const creditCardButton = screen.getByText('Credit Card').closest('button');
      fireEvent.click(creditCardButton!);
      
      await waitFor(() => {
        expect(screen.queryByText('Back')).not.toBeInTheDocument();
      });
    });

    it('renders ArrowLeft icon on Back button', () => {
      const { container } = render(
        <PaymentStep
          data={mockData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
        />
      );
      const backButton = screen.getByText('Back').closest('button');
      const icon = backButton!.querySelector('.lucide-arrow-left');
      expect(icon).toBeInTheDocument();
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
        />
      );
      const paypalButton = screen.getByText('PayPal').closest('button');
      fireEvent.click(paypalButton!);
      
      expect(paypalButton).toHaveClass('border-primary-500', 'bg-primary-50');
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
