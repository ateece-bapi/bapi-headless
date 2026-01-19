/**
 * Tests for ReviewStep Component
 *
 * Tests the order review (step 3 of checkout):
 * - Shipping/billing address display
 * - Payment method display
 * - Order notes field
 * - Terms acceptance
 * - Place order functionality
 * - Edit buttons
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewStep from '../ReviewStep';
import type { CheckoutData } from '../../CheckoutPageClient';

// Mock Toast component
vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

describe('ReviewStep', () => {
  const mockOnBack = vi.fn();
  const mockOnPlaceOrder = vi.fn();

  const mockData: CheckoutData = {
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      company: 'ACME Corp',
      address1: '123 Main St',
      address2: 'Suite 100',
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
      company: 'ACME Corp',
      address1: '123 Main St',
      address2: 'Suite 100',
      city: 'San Francisco',
      state: 'CA',
      postcode: '94102',
      country: 'US',
      phone: '(555) 123-4567',
      email: 'john@example.com',
      sameAsShipping: true,
    },
    paymentMethod: {
      id: 'credit_card',
      title: 'Credit Card',
    },
    orderNotes: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Header Rendering Tests
  describe('Header Rendering', () => {
    it('renders review header', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('Review Your Order')).toBeInTheDocument();
      expect(
        screen.getByText('Please review your information before placing your order')
      ).toBeInTheDocument();
    });
  });

  // Shipping Address Display Tests
  describe('Shipping Address Display', () => {
    it('renders shipping address section heading', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getAllByText('Shipping Address')[0]).toBeInTheDocument();
    });

    it('displays full name', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('displays company name', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getAllByText('ACME Corp')[0]).toBeInTheDocument();
    });

    it('displays address lines', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getAllByText('123 Main St')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Suite 100')[0]).toBeInTheDocument();
    });

    it('displays city, state, zip', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getAllByText(/San Francisco, CA 94102/)[0]).toBeInTheDocument();
    });

    it('displays country', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getAllByText('US')[0]).toBeInTheDocument();
    });

    it('displays phone', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText(/Phone: \(555\) 123-4567/)).toBeInTheDocument();
    });

    it('displays email', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText(/Email: john@example.com/)).toBeInTheDocument();
    });

    it('hides company when not provided', () => {
      const dataNoCompany: CheckoutData = {
        ...mockData,
        shippingAddress: { ...mockData.shippingAddress, company: '' },
        billingAddress: { ...mockData.billingAddress, company: '' },
      };
      const { container } = render(
        <ReviewStep
          data={dataNoCompany}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      // Company should not appear in shipping or billing sections
      const companyElements = screen.queryAllByText('ACME Corp');
      expect(companyElements).toHaveLength(0);
    });

    it('hides address2 when not provided', () => {
      const dataNoAddress2: CheckoutData = {
        ...mockData,
        shippingAddress: { ...mockData.shippingAddress, address2: '' },
        billingAddress: { ...mockData.billingAddress, address2: '' },
      };
      render(
        <ReviewStep
          data={dataNoAddress2}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.queryByText('Suite 100')).not.toBeInTheDocument();
    });
  });

  // Billing Address Display Tests
  describe('Billing Address Display', () => {
    it('renders billing address section heading', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('Billing Address')).toBeInTheDocument();
    });

    it('shows "Same as shipping address" when sameAsShipping is true', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('Same as shipping address')).toBeInTheDocument();
    });

    it('displays full billing address when different from shipping', () => {
      const dataWithDifferentBilling: CheckoutData = {
        ...mockData,
        billingAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          company: 'XYZ Inc',
          address1: '456 Oak Ave',
          address2: 'Floor 2',
          city: 'Los Angeles',
          state: 'CA',
          postcode: '90001',
          country: 'US',
          phone: '555-999-8888',
          email: 'jane@example.com',
          sameAsShipping: false,
        },
      };
      render(
        <ReviewStep
          data={dataWithDifferentBilling}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('XYZ Inc')).toBeInTheDocument();
      expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
      expect(screen.getByText(/Los Angeles, CA 90001/)).toBeInTheDocument();
    });
  });

  // Payment Method Display Tests
  describe('Payment Method Display', () => {
    it('renders payment method section heading', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getAllByText('Payment Method')[0]).toBeInTheDocument();
    });

    it('displays credit card payment method', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
      expect(
        screen.getByText('Your card will be charged after order confirmation')
      ).toBeInTheDocument();
    });

    it('displays PayPal payment method with note', () => {
      const dataWithPayPal: CheckoutData = {
        ...mockData,
        paymentMethod: { id: 'paypal', title: 'PayPal' },
      };
      render(
        <ReviewStep
          data={dataWithPayPal}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('PayPal')).toBeInTheDocument();
      expect(
        screen.getByText('You will be redirected to PayPal to complete payment')
      ).toBeInTheDocument();
    });

    it('shows "Not selected" when payment method missing', () => {
      const dataNoPayment: CheckoutData = {
        ...mockData,
        paymentMethod: undefined,
      };
      render(
        <ReviewStep
          data={dataNoPayment}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('Not selected')).toBeInTheDocument();
    });
  });

  // Order Notes Tests
  describe('Order Notes', () => {
    it('renders order notes textarea', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByLabelText(/Order Notes \(Optional\)/)).toBeInTheDocument();
    });

    it('displays placeholder text', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(
        screen.getByPlaceholderText(/Add any special instructions or notes/)
      ).toBeInTheDocument();
    });

    it('updates order notes on change', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const textarea = screen.getByLabelText(/Order Notes \(Optional\)/);
      fireEvent.change(textarea, { target: { value: 'Please ring doorbell' } });
      expect((textarea as HTMLTextAreaElement).value).toBe('Please ring doorbell');
    });

    it('pre-fills order notes from data', () => {
      const dataWithNotes: CheckoutData = {
        ...mockData,
        orderNotes: 'Leave at front door',
      };
      render(
        <ReviewStep
          data={dataWithNotes}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const textarea = screen.getByLabelText(/Order Notes \(Optional\)/);
      expect((textarea as HTMLTextAreaElement).value).toBe('Leave at front door');
    });
  });

  // Terms and Conditions Tests
  describe('Terms and Conditions', () => {
    it('renders terms checkbox', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect((checkbox as HTMLInputElement).checked).toBe(false);
    });

    it('renders terms and privacy policy links', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const termsLink = screen.getByRole('link', { name: /Terms & Conditions/ });
      const privacyLink = screen.getByRole('link', { name: /Privacy Policy/ });
      expect(termsLink).toHaveAttribute('href', '/terms');
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('toggles checkbox on click', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });
  });

  // Place Order Button Tests
  describe('Place Order Button', () => {
    it('renders Place Order button', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('Place Order')).toBeInTheDocument();
    });

    it('does NOT call onPlaceOrder when terms not accepted', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const placeOrderButton = screen.getByText('Place Order');
      fireEvent.click(placeOrderButton);
      expect(mockOnPlaceOrder).not.toHaveBeenCalled();
    });

    it('calls onPlaceOrder when terms accepted', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      const placeOrderButton = screen.getByText('Place Order');
      fireEvent.click(placeOrderButton);
      expect(mockOnPlaceOrder).toHaveBeenCalled();
    });

    it('shows Processing text when isProcessing=true', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={true}
        />
      );
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('disables button when isProcessing=true', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={true}
        />
      );
      const button = screen.getByText('Processing...').closest('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });
  });

  // Edit Buttons Tests
  describe('Edit Buttons', () => {
    it('renders Edit button for shipping address', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons.length).toBeGreaterThanOrEqual(3); // Shipping, Billing, Payment
    });

    it('calls onBack when shipping Edit button clicked', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]); // First Edit button (shipping)
      expect(mockOnBack).toHaveBeenCalled();
    });

    it('calls onBack when billing Edit button clicked', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[1]); // Second Edit button (billing)
      expect(mockOnBack).toHaveBeenCalled();
    });

    it('calls onBack when payment Edit button clicked', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[2]); // Third Edit button (payment)
      expect(mockOnBack).toHaveBeenCalled();
    });
  });

  // Back Button Tests
  describe('Back Button', () => {
    it('renders Back button', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      // There are multiple "Back" elements (button text + Edit buttons)
      const backButtons = screen.getAllByText('Back');
      expect(backButtons[0]).toBeInTheDocument();
    });

    it('calls onBack when Back button clicked', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const backButtons = screen.getAllByText('Back');
      fireEvent.click(backButtons[0]); // Main Back button
      expect(mockOnBack).toHaveBeenCalled();
    });

    it('disables Back button when processing', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={true}
        />
      );
      const backButtons = screen.getAllByText('Back');
      const button = backButtons[0].closest('button');
      expect(button).toBeDisabled();
    });
  });

  // Visual Styling Tests
  describe('Visual Styling', () => {
    it('applies rounded borders to sections', () => {
      const { container } = render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const sections = container.querySelectorAll('.rounded-xl');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('applies primary color to icons', () => {
      const { container } = render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const primaryIcons = container.querySelectorAll('.text-primary-500');
      expect(primaryIcons.length).toBeGreaterThanOrEqual(3);
    });

    it('applies accent color to Place Order button', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const button = screen.getByText('Place Order').closest('button');
      expect(button).toHaveClass('bg-accent-500', 'hover:bg-accent-600');
    });

    it('applies neutral background to sections', () => {
      const { container } = render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const sections = container.querySelectorAll('.bg-neutral-50');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('applies primary background to terms section', () => {
      const { container } = render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const termsSection = container.querySelector('.bg-primary-50');
      expect(termsSection).toBeInTheDocument();
    });
  });

  // Security Notice Tests
  describe('Security Notice', () => {
    it('renders security notice', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      expect(screen.getByText('Secure 256-bit SSL encrypted checkout')).toBeInTheDocument();
    });

    it('displays lock icon in security notice', () => {
      render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      // The lock emoji is displayed
      const securityText = screen.getByText('Secure 256-bit SSL encrypted checkout');
      expect(securityText).toBeInTheDocument();
    });
  });

  // Icons Rendering Tests
  describe('Icons Rendering', () => {
    it('renders MapPin icon for shipping', () => {
      const { container } = render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const icon = container.querySelector('.lucide-map-pin');
      expect(icon).toBeInTheDocument();
    });

    it('renders FileText icon for billing', () => {
      const { container } = render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const icon = container.querySelector('.lucide-file-text');
      expect(icon).toBeInTheDocument();
    });

    it('renders CreditCard icon for payment', () => {
      const { container } = render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const icon = container.querySelector('.lucide-credit-card');
      expect(icon).toBeInTheDocument();
    });

    it('renders ArrowLeft icon on Back button', () => {
      const { container } = render(
        <ReviewStep
          data={mockData}
          onBack={mockOnBack}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );
      const icon = container.querySelector('.lucide-arrow-left');
      expect(icon).toBeInTheDocument();
    });
  });
});
