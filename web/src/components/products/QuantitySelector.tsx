'use client';

import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  /** Initial quantity value */
  initialQuantity?: number;
  /** Minimum allowed quantity (default: 1) */
  min?: number;
  /** Maximum allowed quantity based on stock */
  max?: number;
  /** Callback when quantity changes */
  onChange: (quantity: number) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Current stock status */
  stockStatus?: 'instock' | 'outofstock' | 'onbackorder' | null;
  /** Loading state during add to cart */
  loading?: boolean;
}

/**
 * Quantity selector with +/- buttons and manual input
 *
 * Features:
 * - Increment/decrement buttons
 * - Manual input with validation
 * - Stock availability constraints
 * - Min/max limits
 * - Disabled and loading states
 * - Accessible with keyboard
 *
 * @param initialQuantity - Starting quantity (default: 1)
 * @param min - Minimum quantity allowed (default: 1)
 * @param max - Maximum quantity allowed (based on stock)
 * @param onChange - Callback when quantity changes
 * @param disabled - Whether selector is disabled
 * @param stockStatus - Current stock status
 * @param loading - Loading state during operations
 */
export default function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max,
  onChange,
  disabled = false,
  stockStatus = 'instock',
  loading = false,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [inputValue, setInputValue] = useState(String(initialQuantity));
  const [error, setError] = useState<string | null>(null);

  const isOutOfStock = stockStatus === 'outofstock';
  const effectiveMax = max ?? 999;
  const effectiveMin = min < 1 ? 1 : min;

  // Update quantity and notify parent
  const updateQuantity = (newQuantity: number) => {
    let validQuantity = newQuantity;

    // Validate against min/max
    if (validQuantity < effectiveMin) {
      validQuantity = effectiveMin;
      setError(`Minimum quantity is ${effectiveMin}`);
    } else if (validQuantity > effectiveMax) {
      validQuantity = effectiveMax;
      setError(`Maximum quantity is ${effectiveMax}`);
    } else {
      setError(null);
    }

    setQuantity(validQuantity);
    setInputValue(String(validQuantity));
    onChange(validQuantity);

    // Clear error after 3 seconds
    if (error) {
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle increment
  const handleIncrement = () => {
    if (quantity < effectiveMax && !disabled && !loading && !isOutOfStock) {
      updateQuantity(quantity + 1);
    }
  };

  // Handle decrement
  const handleDecrement = () => {
    if (quantity > effectiveMin && !disabled && !loading && !isOutOfStock) {
      updateQuantity(quantity - 1);
    }
  };

  // Handle manual input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Only update if valid number
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      updateQuantity(num);
    }
  };

  // Handle input blur (validate and correct)
  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < effectiveMin) {
      updateQuantity(effectiveMin);
    } else if (num > effectiveMax) {
      updateQuantity(effectiveMax);
    } else {
      updateQuantity(num);
    }
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  // Reset when stock status changes
  useEffect(() => {
    if (isOutOfStock) {
      setQuantity(0);
      setInputValue('0');
    }
  }, [isOutOfStock]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* Decrement button */}
        <button
          onClick={handleDecrement}
          disabled={disabled || loading || quantity <= effectiveMin || isOutOfStock}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${
            disabled || loading || quantity <= effectiveMin || isOutOfStock
              ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-300'
              : 'border-neutral-300 bg-white text-neutral-700 hover:border-primary-500 hover:bg-primary-50'
          } `}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Quantity input */}
        <input
          type="number"
          min={effectiveMin}
          max={effectiveMax}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading || isOutOfStock}
          className={`h-10 w-16 rounded-lg border-2 text-center text-lg font-semibold transition-all ${
            disabled || loading || isOutOfStock
              ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400'
              : 'border-neutral-300 bg-white text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500'
          } /* Hide spinner arrows */ [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          aria-label="Quantity"
        />

        {/* Increment button */}
        <button
          onClick={handleIncrement}
          disabled={disabled || loading || quantity >= effectiveMax || isOutOfStock}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${
            disabled || loading || quantity >= effectiveMax || isOutOfStock
              ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-300'
              : 'border-neutral-300 bg-white text-neutral-700 hover:border-primary-500 hover:bg-primary-50'
          } `}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>

        {/* Loading spinner */}
        {loading && (
          <div className="ml-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Stock limit indicator */}
      {max && quantity >= max && (
        <p className="text-sm text-warning-600">Maximum available: {max}</p>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-error-600">{error}</p>}

      {/* Out of stock message */}
      {isOutOfStock && (
        <p className="text-sm font-medium text-error-600">This product is currently out of stock</p>
      )}
    </div>
  );
}
