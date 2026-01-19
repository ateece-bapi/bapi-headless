import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuantitySelector from '../QuantitySelector';

describe('QuantitySelector Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default quantity of 1', () => {
      render(<QuantitySelector onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity') as HTMLInputElement;
      expect(input.value).toBe('1');
    });

    it('renders with custom initial quantity', () => {
      render(<QuantitySelector initialQuantity={5} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity') as HTMLInputElement;
      expect(input.value).toBe('5');
    });

    it('renders increment button', () => {
      render(<QuantitySelector onChange={mockOnChange} />);
      expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
    });

    it('renders decrement button', () => {
      render(<QuantitySelector onChange={mockOnChange} />);
      expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
    });

    it('renders quantity input field', () => {
      render(<QuantitySelector onChange={mockOnChange} />);
      expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    });
  });

  describe('Increment Functionality', () => {
    it('increments quantity when plus button clicked', () => {
      render(<QuantitySelector initialQuantity={1} onChange={mockOnChange} />);
      const incrementButton = screen.getByLabelText('Increase quantity');
      
      fireEvent.click(incrementButton);
      
      expect(mockOnChange).toHaveBeenCalledWith(2);
    });

    it('increments quantity multiple times', () => {
      render(<QuantitySelector initialQuantity={1} onChange={mockOnChange} />);
      const incrementButton = screen.getByLabelText('Increase quantity');
      
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      
      expect(mockOnChange).toHaveBeenLastCalledWith(4);
    });

    it('respects maximum quantity limit', () => {
      render(<QuantitySelector initialQuantity={9} max={10} onChange={mockOnChange} />);
      const incrementButton = screen.getByLabelText('Increase quantity');
      
      fireEvent.click(incrementButton); // Should reach max (10)
      fireEvent.click(incrementButton); // Should be blocked
      
      expect(mockOnChange).toHaveBeenLastCalledWith(10);
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('disables increment button at maximum quantity', () => {
      render(<QuantitySelector initialQuantity={10} max={10} onChange={mockOnChange} />);
      const incrementButton = screen.getByLabelText('Increase quantity');
      
      expect(incrementButton).toBeDisabled();
    });

    it('shows maximum available message at limit', () => {
      render(<QuantitySelector initialQuantity={10} max={10} onChange={mockOnChange} />);
      expect(screen.getByText('Maximum available: 10')).toBeInTheDocument();
    });
  });

  describe('Decrement Functionality', () => {
    it('decrements quantity when minus button clicked', () => {
      render(<QuantitySelector initialQuantity={5} onChange={mockOnChange} />);
      const decrementButton = screen.getByLabelText('Decrease quantity');
      
      fireEvent.click(decrementButton);
      
      expect(mockOnChange).toHaveBeenCalledWith(4);
    });

    it('decrements quantity multiple times', () => {
      render(<QuantitySelector initialQuantity={5} onChange={mockOnChange} />);
      const decrementButton = screen.getByLabelText('Decrease quantity');
      
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      
      expect(mockOnChange).toHaveBeenLastCalledWith(3);
    });

    it('respects minimum quantity limit (default 1)', () => {
      render(<QuantitySelector initialQuantity={1} onChange={mockOnChange} />);
      const decrementButton = screen.getByLabelText('Decrease quantity');
      
      fireEvent.click(decrementButton); // Should be blocked at min
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('respects custom minimum quantity', () => {
      render(<QuantitySelector initialQuantity={5} min={5} onChange={mockOnChange} />);
      const decrementButton = screen.getByLabelText('Decrease quantity');
      
      fireEvent.click(decrementButton); // Should be blocked
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('disables decrement button at minimum quantity', () => {
      render(<QuantitySelector initialQuantity={1} onChange={mockOnChange} />);
      const decrementButton = screen.getByLabelText('Decrease quantity');
      
      expect(decrementButton).toBeDisabled();
    });
  });

  describe('Manual Input', () => {
    it('allows manual quantity input', () => {
      render(<QuantitySelector initialQuantity={1} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '7' } });
      
      expect(mockOnChange).toHaveBeenCalledWith(7);
    });

    it('validates input on blur (corrects below minimum)', () => {
      render(<QuantitySelector initialQuantity={5} min={3} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.blur(input);
      
      expect(mockOnChange).toHaveBeenLastCalledWith(3);
    });

    it('validates input on blur (corrects above maximum)', () => {
      render(<QuantitySelector initialQuantity={5} max={10} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '99' } });
      fireEvent.blur(input);
      
      expect(mockOnChange).toHaveBeenLastCalledWith(10);
    });

    it('handles invalid input (non-numeric)', () => {
      render(<QuantitySelector initialQuantity={5} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.blur(input);
      
      // Should reset to minimum
      expect(mockOnChange).toHaveBeenLastCalledWith(1);
    });

    it('handles empty input on blur', () => {
      render(<QuantitySelector initialQuantity={5} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);
      
      // Should reset to minimum
      expect(mockOnChange).toHaveBeenLastCalledWith(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('increments on ArrowUp key', () => {
      render(<QuantitySelector initialQuantity={5} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      
      expect(mockOnChange).toHaveBeenCalledWith(6);
    });

    it('decrements on ArrowDown key', () => {
      render(<QuantitySelector initialQuantity={5} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      
      expect(mockOnChange).toHaveBeenCalledWith(4);
    });

    it('respects limits on keyboard navigation', () => {
      render(<QuantitySelector initialQuantity={1} min={1} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.keyDown(input, { key: 'ArrowDown' }); // Should be blocked
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('disables all controls when disabled prop is true', () => {
      render(<QuantitySelector initialQuantity={5} disabled={true} onChange={mockOnChange} />);
      
      expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
      expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
      expect(screen.getByLabelText('Quantity')).toBeDisabled();
    });

    it('does not call onChange when disabled', () => {
      render(<QuantitySelector initialQuantity={5} disabled={true} onChange={mockOnChange} />);
      const incrementButton = screen.getByLabelText('Increase quantity');
      
      fireEvent.click(incrementButton);
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      const { container } = render(<QuantitySelector initialQuantity={5} loading={true} onChange={mockOnChange} />);
      
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('disables controls when loading', () => {
      render(<QuantitySelector initialQuantity={5} loading={true} onChange={mockOnChange} />);
      
      expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
      expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
      expect(screen.getByLabelText('Quantity')).toBeDisabled();
    });
  });

  describe('Stock Status', () => {
    it('allows quantity changes when in stock', () => {
      render(<QuantitySelector initialQuantity={1} stockStatus="instock" onChange={mockOnChange} />);
      const incrementButton = screen.getByLabelText('Increase quantity');
      
      fireEvent.click(incrementButton);
      
      expect(mockOnChange).toHaveBeenCalledWith(2);
    });

    it('disables controls when out of stock', () => {
      render(<QuantitySelector initialQuantity={1} stockStatus="outofstock" onChange={mockOnChange} />);
      
      expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
      expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
      expect(screen.getByLabelText('Quantity')).toBeDisabled();
    });

    it('shows out of stock message', () => {
      render(<QuantitySelector initialQuantity={1} stockStatus="outofstock" onChange={mockOnChange} />);
      
      expect(screen.getByText('This product is currently out of stock')).toBeInTheDocument();
    });

    it('resets quantity to 0 when out of stock', () => {
      render(<QuantitySelector initialQuantity={5} stockStatus="outofstock" onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity') as HTMLInputElement;
      
      expect(input.value).toBe('0');
    });

    it('allows quantity changes when on backorder', () => {
      render(<QuantitySelector initialQuantity={1} stockStatus="onbackorder" onChange={mockOnChange} />);
      const incrementButton = screen.getByLabelText('Increase quantity');
      
      fireEvent.click(incrementButton);
      
      expect(mockOnChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Error Messages', () => {
    it('shows error when exceeding maximum', () => {
      render(<QuantitySelector initialQuantity={9} max={10} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '15' } });
      
      expect(screen.getByText('Maximum quantity is 10')).toBeInTheDocument();
    });

    it('shows error when below minimum', () => {
      render(<QuantitySelector initialQuantity={5} min={2} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '1' } });
      
      expect(screen.getByText('Minimum quantity is 2')).toBeInTheDocument();
    });

    it('clears error after validation', async () => {
      render(<QuantitySelector initialQuantity={5} max={10} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '15' } });
      expect(screen.getByText('Maximum quantity is 10')).toBeInTheDocument();
      
      // Blur triggers validation and correction
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.queryByText('Maximum quantity is 10')).not.toBeInTheDocument();
      });
    });
  });

  describe('Min/Max Validation', () => {
    it('uses default min of 1 when not specified', () => {
      render(<QuantitySelector initialQuantity={1} onChange={mockOnChange} />);
      const decrementButton = screen.getByLabelText('Decrease quantity');
      
      expect(decrementButton).toBeDisabled();
    });

    it('uses default max of 999 when not specified', () => {
      render(<QuantitySelector initialQuantity={998} onChange={mockOnChange} />);
      const incrementButton = screen.getByLabelText('Increase quantity');
      
      expect(incrementButton).not.toBeDisabled();
    });

    it('enforces minimum of 1 even if min prop is less', () => {
      render(<QuantitySelector initialQuantity={1} min={0} onChange={mockOnChange} />);
      const decrementButton = screen.getByLabelText('Decrease quantity');
      
      fireEvent.click(decrementButton);
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels on buttons', () => {
      render(<QuantitySelector onChange={mockOnChange} />);
      
      expect(screen.getByLabelText('Increase quantity')).toHaveAttribute('aria-label');
      expect(screen.getByLabelText('Decrease quantity')).toHaveAttribute('aria-label');
    });

    it('has proper ARIA label on input', () => {
      render(<QuantitySelector onChange={mockOnChange} />);
      
      expect(screen.getByLabelText('Quantity')).toHaveAttribute('aria-label');
    });

    it('properly disables buttons with visual feedback', () => {
      render(<QuantitySelector initialQuantity={1} onChange={mockOnChange} />);
      const decrementButton = screen.getByLabelText('Decrease quantity');
      
      expect(decrementButton).toBeDisabled();
      expect(decrementButton.className).toContain('cursor-not-allowed');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero initial quantity', () => {
      render(<QuantitySelector initialQuantity={0} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity') as HTMLInputElement;
      
      // Should be corrected to minimum (1)
      expect(input.value).toBe('0');
    });

    it('handles very large numbers', () => {
      render(<QuantitySelector initialQuantity={1} max={100} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '999999' } });
      fireEvent.blur(input);
      
      expect(mockOnChange).toHaveBeenLastCalledWith(100);
    });

    it('handles negative numbers', () => {
      render(<QuantitySelector initialQuantity={5} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '-5' } });
      fireEvent.blur(input);
      
      // Should reset to minimum
      expect(mockOnChange).toHaveBeenLastCalledWith(1);
    });

    it('handles decimal numbers', () => {
      render(<QuantitySelector initialQuantity={5} onChange={mockOnChange} />);
      const input = screen.getByLabelText('Quantity');
      
      fireEvent.change(input, { target: { value: '5.5' } });
      
      // parseInt should truncate to 5
      expect(mockOnChange).toHaveBeenCalledWith(5);
    });
  });
});
