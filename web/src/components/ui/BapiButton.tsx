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
      'shadow-lg hover:shadow-xl',
      'transform hover:-translate-y-0.5',
      // Font smoothing for crisp text
      'antialiased',
      className
    );

    const colorStyles = {
      blue: clsx(
        'bg-primary-600 hover:bg-primary-700',
        'text-white',
        'focus:ring-primary-600/50',
        'shadow-primary-600/30 hover:shadow-primary-600/40'
      ),
      yellow: clsx(
        'bg-accent-500 hover:bg-accent-600',
        'text-gray-900',
        'focus:ring-accent-500/50',
        'shadow-accent-500/30 hover:shadow-accent-500/40'
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