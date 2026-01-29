import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'blue' | 'yellow';
type ButtonElement = 'button' | 'a';

interface BaseButtonProps {
  children: React.ReactNode;
  color?: ButtonVariant;
  className?: string;
}

interface ButtonAsButton extends BaseButtonProps {
  as?: 'button';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

interface ButtonAsLink extends BaseButtonProps {
  as: 'a';
  href: string;
}

type BapiButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * BapiButton - Official BAPI brand button component
 * 
 * Implements 2026 BAPI Brand Guide specifications:
 * - Yellow buttons: Black text, NO text shadow, gradient background with drop shadow
 * - Blue buttons: White text WITH slight text shadow, gradient background with drop shadow
 * - Official gradients: #f89623 → #ffc843 (yellow), #044976 → #1479bc (blue)
 */
const BapiButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, BapiButtonProps>(
  ({ children, color = 'blue', className, ...props }, ref) => {
    const baseStyles = clsx(
      'inline-flex items-center justify-center',
      'px-8 py-4',
      'text-lg font-bold',
      'rounded-xl',
      'transition-all duration-300 ease-out',
      'focus:outline-none focus:ring-4 focus:ring-offset-2',
      'active:scale-95',
      'transform',
      // Font smoothing for crisp text
      'antialiased',
      className
    );

    const colorStyles = {
      blue: clsx(
        'btn-bapi-primary', // Uses official gradient + text shadow
        'focus:ring-primary-600/50'
      ),
      yellow: clsx(
        'btn-bapi-accent', // Uses official gradient + NO text shadow
        'focus:ring-accent-500/50'
      ),
    };

    const combinedStyles = clsx(baseStyles, colorStyles[color]);

    if (props.as === 'a') {
      const { href } = props;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={combinedStyles}
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          {children}
        </a>
      );
    }

    const { onClick, type = 'button' } = props as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        onClick={onClick}
        className={combinedStyles}
        style={{
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {children}
      </button>
    );
  }
);

BapiButton.displayName = 'BapiButton';

export default BapiButton;