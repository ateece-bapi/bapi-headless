/**
 * Material Symbol Component
 * 
 * A React wrapper for Google Material Symbols font icons.
 * Provides a component API that matches MUI Icons for drop-in compatibility.
 * 
 * Design specifications per UI/UX team:
 * - Variant: Rounded
 * - Weight: 400
 * - Fill: 0 (no fill/outline)
 * - Optical Size: 24
 * 
 * Usage:
 * <MaterialSymbol icon="menu" className="h-6 w-6 text-primary-500" />
 */

import React from 'react';

export interface MaterialSymbolProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> {
  /**
   * The Material Symbol icon name (e.g., 'menu', 'search', 'shopping_cart')
   * Names use snake_case as defined by Google Material Symbols
   */
  icon: string;
  
  /**
   * CSS class name (PRIMARY STYLING METHOD)
   * Use Tailwind classes for size, color, spacing, etc.
   * Example: className="h-6 w-6 text-primary-500 mb-4"
   */
  className?: string;
  
  /**
   * Inline styles (use sparingly, prefer Tailwind classes)
   */
  style?: React.CSSProperties;
  
  /**
   * ARIA label for accessibility (RECOMMENDED for icon-only buttons)
   */
  'aria-label'?: string;
  
  /**
   * ARIA hidden (default: true for decorative icons)
   * Accepts boolean or string to match standard HTML behavior
   */
  'aria-hidden'?: boolean | 'true' | 'false';
}

/**
 * MaterialSymbol component
 * 
 * Renders a Material Symbol icon using the variable font.
 * The icon name should match Google's Material Symbols naming (snake_case).
 * 
 * CSS font-variation-settings are applied globally in globals.css:
 * - 'FILL' 0 (outline style)
 * - 'wght' 400 (normal weight)
 * - 'GRAD' 0 (normal grade)
 * - 'opsz' 24 (24dp optical size)
 */
export const MaterialSymbol = React.forwardRef<HTMLSpanElement, MaterialSymbolProps>(
  (
    {
      icon,
      className = '',
      style,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden = true,
      role,
      ...rest
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`material-symbols-rounded ${className}`}
        style={style}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        role={role}
        {...rest}
      >
        {icon}
      </span>
    );
  }
);

MaterialSymbol.displayName = 'MaterialSymbol';

/**
 * Create a Material Symbol icon component with a specific icon name
 * This factory function generates components that match the MUI Icons API
 * 
 * @param iconName - The Material Symbol icon name (snake_case)
 * @param displayName - Optional display name for React DevTools
 * @returns A React component that renders the specified icon
 * 
 * Example:
 * const MenuIcon = createMaterialSymbolIcon('menu', 'MenuIcon');
 */
export function createMaterialSymbolIcon(
  iconName: string,
  displayName?: string
): React.ForwardRefExoticComponent<
  Omit<MaterialSymbolProps, 'icon'> & React.RefAttributes<HTMLSpanElement>
> {
  const IconComponent = React.forwardRef<
    HTMLSpanElement,
    Omit<MaterialSymbolProps, 'icon'>
  >((props, ref) => {
    return <MaterialSymbol ref={ref} icon={iconName} {...props} />;
  });

  IconComponent.displayName = displayName || `MaterialSymbol(${iconName})`;

  return IconComponent;
}
