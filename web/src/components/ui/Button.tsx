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
    'duration-normal transition-all',
    'focus:outline-none focus:ring-4 focus:ring-offset-2',
    'active:scale-95',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent-500 hover:bg-accent-600',
          'text-neutral-900',
          'shadow-accent-500/30 hover:shadow-accent-500/40 shadow-lg hover:shadow-xl',
          'focus:ring-accent-500/50',
        ],
        accent: [
          'bg-accent-500 hover:bg-accent-600',
          'text-neutral-900',
          'shadow-accent-500/30 hover:shadow-accent-500/40 shadow-lg hover:shadow-xl',
          'focus:ring-accent-500/50',
        ],
        outline: [
          'border-primary-600 border-2',
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
          'shadow-error-500/30 hover:shadow-error-500/40 shadow-lg hover:shadow-xl',
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
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
