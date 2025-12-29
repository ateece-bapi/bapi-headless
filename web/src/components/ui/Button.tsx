/**
 * Modern Button Component with Class Variance Authority
 * 
 * Example of using CVA for type-safe, variant-based styling.
 * Replaces the existing BapiButton with a more modern approach.
 * 
 * Usage:
 * <Button variant="primary" size="lg" onClick={...}>Click Me</Button>
 * <Button variant="accent" size="sm" fullWidth>Add to Cart</Button>
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const buttonVariants = cva(
  // Base styles applied to all buttons
  [
    'inline-flex items-center justify-center',
    'rounded-xl font-bold',
    'transition-all duration-normal',
    'focus:outline-none focus:ring-4 focus:ring-offset-2',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-600 hover:bg-primary-700',
          'text-white',
          'shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40',
          'focus:ring-primary-600/50',
        ],
        accent: [
          'bg-accent-500 hover:bg-accent-600',
          'text-neutral-900',
          'shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40',
          'focus:ring-accent-500/50',
        ],
        outline: [
          'border-2 border-primary-600',
          'text-primary-600 hover:text-white',
          'hover:bg-primary-600',
          'focus:ring-primary-600/50',
        ],
        ghost: [
          'text-primary-600 hover:text-primary-700',
          'hover:bg-primary-50',
          'focus:ring-primary-600/50',
        ],
        danger: [
          'bg-error-500 hover:bg-error-600',
          'text-white',
          'shadow-lg shadow-error-500/30 hover:shadow-xl hover:shadow-error-500/40',
          'focus:ring-error-500/50',
        ],
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Whether the button should take up full width of its container
   */
  fullWidth?: boolean;
  /**
   * Additional CSS classes to apply
   */
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
