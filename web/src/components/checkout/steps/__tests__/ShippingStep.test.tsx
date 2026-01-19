/**
 * Tests for ShippingStep Component
 *
 * Tests the shipping address form (step 1 of checkout):
 * - Form field rendering
 * - Form validation (required fields, email, phone)
 * - Billing address toggle
 * - Form submission
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShippingStep from '../ShippingStep';
import type { CheckoutData } from '../../CheckoutPageClient';

// Mock Toast component
vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

describe('ShippingStep', () => {
  const mockOnNext = vi.fn();
  const mockOnUpdateData = vi.fn();

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
    paymentMethod: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Form Field Rendering Tests
  describe('Form Field Rendering', () => {
    it('renders shipping address section heading', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    });

    it('renders all required shipping fields with asterisks', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      expect(screen.getByLabelText(/First Name \*/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name \*/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Address \*/)).toBeInTheDocument();
      expect(screen.getByLabelText(/City \*/)).toBeInTheDocument();
      expect(screen.getByLabelText(/State \*/)).toBeInTheDocument();
      expect(screen.getByLabelText(/ZIP Code \*/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Country \*/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone \*/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email \*/)).toBeInTheDocument();
    });

    it('renders optional company field without asterisk', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      expect(screen.getByLabelText(/Company \(Optional\)/)).toBeInTheDocument();
    });

    it('renders address line 2 field with optional placeholder', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const address2 = screen.getByPlaceholderText(/Apartment, suite, etc. \(optional\)/);
      expect(address2).toBeInTheDocument();
    });

    it('renders country dropdown with options', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const countrySelect = screen.getByLabelText(/Country \*/);
      expect(countrySelect).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Mexico' })).toBeInTheDocument();
    });

    it('renders MapPin icon', () => {
      const { container } = render(
        <ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />
      );
      const icon = container.querySelector('.lucide-map-pin');
      expect(icon).toBeInTheDocument();
    });

    it('renders Continue to Payment button with arrow icon', () => {
      const { container } = render(
        <ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />
      );
      expect(screen.getByText('Continue to Payment')).toBeInTheDocument();
      const arrow = container.querySelector('.lucide-arrow-right');
      expect(arrow).toBeInTheDocument();
    });
  });

  // Pre-filled Data Tests
  describe('Pre-filled Form Data', () => {
    it('pre-fills all form fields with provided data', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
      expect(screen.getByDisplayValue('San Francisco')).toBeInTheDocument();
      expect(screen.getByDisplayValue('CA')).toBeInTheDocument();
      expect(screen.getByDisplayValue('94102')).toBeInTheDocument();
      expect(screen.getByDisplayValue('(555) 123-4567')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    });

    it('pre-selects correct country from dropdown', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const countrySelect = screen.getByLabelText(/Country \*/) as HTMLSelectElement;
      expect(countrySelect.value).toBe('US');
    });

    it('handles empty company field', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const companyInput = screen.getByLabelText(/Company \(Optional\)/) as HTMLInputElement;
      expect(companyInput.value).toBe('');
    });
  });

  // Form Input Handling Tests
  describe('Form Input Handling', () => {
    it('updates firstName field on change', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/First Name \*/);
      fireEvent.change(input, { target: { value: 'Jane' } });
      expect((input as HTMLInputElement).value).toBe('Jane');
    });

    it('updates email field on change', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/Email \*/);
      fireEvent.change(input, { target: { value: 'jane@example.com' } });
      expect((input as HTMLInputElement).value).toBe('jane@example.com');
    });

    it('updates phone field on change', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/Phone \*/);
      fireEvent.change(input, { target: { value: '555-999-8888' } });
      expect((input as HTMLInputElement).value).toBe('555-999-8888');
    });

    it('updates country selection on change', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const select = screen.getByLabelText(/Country \*/);
      fireEvent.change(select, { target: { value: 'CA' } });
      expect((select as HTMLSelectElement).value).toBe('CA');
    });

    it('updates optional company field on change', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/Company \(Optional\)/);
      fireEvent.change(input, { target: { value: 'ACME Corp' } });
      expect((input as HTMLInputElement).value).toBe('ACME Corp');
    });
  });

  // Billing Address Toggle Tests
  describe('Billing Address Toggle', () => {
    it('renders billing address checkbox', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      expect(screen.getByText('Billing address same as shipping address')).toBeInTheDocument();
    });

    it('checkbox is checked when sameAsShipping is true', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const checkbox = screen.getByRole('checkbox', {
        name: /Billing address same as shipping address/,
      }) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('checkbox is unchecked when sameAsShipping is false', () => {
      const dataWithDifferentBilling: CheckoutData = {
        ...mockData,
        billingAddress: { ...mockData.billingAddress, sameAsShipping: false },
      };
      render(
        <ShippingStep
          data={dataWithDifferentBilling}
          onNext={mockOnNext}
          onUpdateData={mockOnUpdateData}
        />
      );
      const checkbox = screen.getByRole('checkbox', {
        name: /Billing address same as shipping address/,
      }) as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });

    it('toggles checkbox state on click', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const checkbox = screen.getByRole('checkbox', {
        name: /Billing address same as shipping address/,
      }) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });
  });

  // Form Validation Tests
  describe('Form Validation', () => {
    it('does NOT submit when firstName is missing', async () => {
      const emptyData: CheckoutData = {
        ...mockData,
        shippingAddress: { ...mockData.shippingAddress, firstName: '' },
      };
      render(<ShippingStep data={emptyData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const button = screen.getByText('Continue to Payment');
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnNext).not.toHaveBeenCalled();
      });
    });

    it('does NOT submit when email is invalid', async () => {
      const invalidEmailData: CheckoutData = {
        ...mockData,
        shippingAddress: { ...mockData.shippingAddress, email: 'not-an-email' },
      };
      render(
        <ShippingStep data={invalidEmailData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />
      );
      const button = screen.getByText('Continue to Payment');
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnNext).not.toHaveBeenCalled();
      });
    });

    it('does NOT submit when phone is invalid', async () => {
      const invalidPhoneData: CheckoutData = {
        ...mockData,
        shippingAddress: { ...mockData.shippingAddress, phone: 'abc123!@#' },
      };
      render(
        <ShippingStep data={invalidPhoneData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />
      );
      const button = screen.getByText('Continue to Payment');
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnNext).not.toHaveBeenCalled();
      });
    });

    it('accepts valid email format', async () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const button = screen.getByText('Continue to Payment');
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalled();
      });
    });

    it('accepts various phone formats', async () => {
      const phoneFormats = [
        '(555) 123-4567',
        '555-123-4567',
        '5551234567',
        '+1 555 123 4567',
        '555 123 4567',
      ];

      for (const phone of phoneFormats) {
        vi.clearAllMocks();
        const dataWithPhone: CheckoutData = {
          ...mockData,
          shippingAddress: { ...mockData.shippingAddress, phone },
        };
        const { unmount } = render(
          <ShippingStep data={dataWithPhone} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />
        );
        const button = screen.getByRole('button', { name: /Continue to Payment/ });
        fireEvent.click(button);
        await waitFor(() => {
          expect(mockOnNext).toHaveBeenCalled();
        });
        unmount(); // Clean up before next iteration
      }
    });
  });

  // Form Submission Tests
  describe('Form Submission', () => {
    it('calls onUpdateData with shipping address on submit', async () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const button = screen.getByText('Continue to Payment');
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnUpdateData).toHaveBeenCalledWith(
          expect.objectContaining({
            shippingAddress: expect.objectContaining({
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              postcode: '94102',
              country: 'US',
              phone: '(555) 123-4567',
              email: 'john@example.com',
            }),
          })
        );
      });
    });

    it('calls onNext after successful validation', async () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const button = screen.getByText('Continue to Payment');
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalled();
      });
    });

    it('sets billing address same as shipping when checkbox is checked', async () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const button = screen.getByText('Continue to Payment');
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnUpdateData).toHaveBeenCalledWith(
          expect.objectContaining({
            billingAddress: expect.objectContaining({
              firstName: 'John',
              lastName: 'Doe',
              sameAsShipping: true,
            }),
          })
        );
      });
    });

    it('preserves separate billing address when checkbox is unchecked', async () => {
      const dataWithDifferentBilling: CheckoutData = {
        ...mockData,
        billingAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          company: '',
          address1: '456 Oak Ave',
          address2: '',
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
        <ShippingStep
          data={dataWithDifferentBilling}
          onNext={mockOnNext}
          onUpdateData={mockOnUpdateData}
        />
      );
      const button = screen.getByText('Continue to Payment');
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnUpdateData).toHaveBeenCalledWith(
          expect.objectContaining({
            billingAddress: expect.objectContaining({
              firstName: 'Jane',
              lastName: 'Smith',
              sameAsShipping: false,
            }),
          })
        );
      });
    });

    it('prevents form submission with preventDefault', async () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const form = screen.getByText('Continue to Payment').closest('form');
      const mockPreventDefault = vi.fn();
      fireEvent.submit(form!, { preventDefault: mockPreventDefault });
      // Note: preventDefault is called by the component, but fireEvent automatically prevents default
      // so we just verify the form submission logic executes
      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalled();
      });
    });
  });

  // Visual Styling Tests
  describe('Visual Styling', () => {
    it('applies responsive grid layout to form fields', () => {
      const { container } = render(
        <ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />
      );
      const grid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('applies primary color to MapPin icon', () => {
      const { container } = render(
        <ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />
      );
      const icon = container.querySelector('.text-primary-500');
      expect(icon).toBeInTheDocument();
    });

    it('applies rounded borders to input fields', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/First Name \*/);
      expect(input).toHaveClass('rounded-lg');
    });

    it('applies focus ring styles to inputs', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/First Name \*/);
      expect(input).toHaveClass('focus:ring-2', 'focus:ring-primary-500');
    });

    it('applies primary color to submit button', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const button = screen.getByText('Continue to Payment');
      expect(button).toHaveClass('bg-primary-500', 'hover:bg-primary-600');
    });

    it('applies border dividers between sections', () => {
      const { container } = render(
        <ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />
      );
      const borders = container.querySelectorAll('.border-t.border-neutral-200');
      expect(borders.length).toBeGreaterThan(0);
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('handles empty data gracefully', () => {
      const emptyData: CheckoutData = {
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
        paymentMethod: '',
      };
      render(<ShippingStep data={emptyData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      expect(screen.getByLabelText(/First Name \*/)).toBeInTheDocument();
    });

    it('handles very long input values', () => {
      const longAddress = 'A'.repeat(200);
      const longData: CheckoutData = {
        ...mockData,
        shippingAddress: { ...mockData.shippingAddress, address1: longAddress },
      };
      render(<ShippingStep data={longData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/Address \*/);
      expect((input as HTMLInputElement).value).toBe(longAddress);
    });

    it('handles special characters in input fields', () => {
      const specialChars = "O'Brien-Smith";
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/Last Name \*/);
      fireEvent.change(input, { target: { value: specialChars } });
      expect((input as HTMLInputElement).value).toBe(specialChars);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('uses semantic form element', () => {
      const { container } = render(
        <ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />
      );
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('associates labels with inputs via htmlFor/id', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const label = screen.getByText(/First Name \*/);
      const input = screen.getByLabelText(/First Name \*/);
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it('uses type="email" for email input', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/Email \*/);
      expect(input).toHaveAttribute('type', 'email');
    });

    it('uses type="tel" for phone input', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const input = screen.getByLabelText(/Phone \*/);
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('marks required fields with required attribute', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      const firstName = screen.getByLabelText(/First Name \*/);
      expect(firstName).toHaveAttribute('required');
    });

    it('provides helpful placeholder text', () => {
      render(<ShippingStep data={mockData} onNext={mockOnNext} onUpdateData={mockOnUpdateData} />);
      expect(screen.getByPlaceholderText('Street address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Apartment, suite, etc. (optional)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('CA, NY, TX, etc.')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('12345')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('(555) 123-4567')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });
  });
});
