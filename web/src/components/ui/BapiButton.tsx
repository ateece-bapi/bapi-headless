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
        'bg-[#0054b6] hover:bg-[#003d85]',
        'text-white',
        'focus:ring-[#0054b6]/50',
        'shadow-[#0054b6]/30 hover:shadow-[#0054b6]/40'
      ),
      yellow: clsx(
        'bg-[#ffc843] hover:bg-[#ffb700]',
        'text-gray-900',
        'focus:ring-[#ffc843]/50',
        'shadow-[#ffc843]/30 hover:shadow-[#ffc843]/40'
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