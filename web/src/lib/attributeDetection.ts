/**
 * Smart attribute type detection for optimal UI rendering
 * Enterprise B2B variation system
 */

import type { ProductAttribute } from '@/types/variations';

export type AttributeUIType = 
  | 'color-swatch'    // Visual color picker
  | 'binary-toggle'   // Yes/No, On/Off switches
  | 'radio-group'     // 2-4 options, radio buttons
  | 'dropdown';       // 5+ options, dropdown select

/**
 * Detects the optimal UI component for an attribute
 * Based on attribute name, option count, and option patterns
 */
export function detectAttributeType(attribute: ProductAttribute): AttributeUIType {
  const name = attribute.name.toLowerCase();
  const label = attribute.label.toLowerCase();
  const optionCount = attribute.options?.length || 0;
  
  // Color attributes - use swatches
  if (name.includes('color') || label.includes('color')) {
    return 'color-swatch';
  }
  
  // Binary choices - use toggle
  if (optionCount === 2) {
    const options = attribute.options.map(o => o.toLowerCase());
    const isBinary = 
      (options.includes('yes') && options.includes('no')) ||
      (options.includes('display') && options.includes('no display')) ||
      (options.includes('included') && options.includes('not included')) ||
      options.some(o => o.startsWith('with ') || o.startsWith('without '));
    
    if (isBinary) {
      return 'binary-toggle';
    }
  }
  
  // Small set of options - use radio group
  if (optionCount >= 2 && optionCount <= 4) {
    // Check if options are short (good for radio display)
    const allShort = attribute.options.every(opt => opt.length <= 50);
    if (allShort) {
      return 'radio-group';
    }
  }
  
  // Default to dropdown for complex selections
  return 'dropdown';
}

/**
 * Extracts a short display label from long option text
 * Example: "Standard Range (10 ranges from -5 to +5 WC)" → "Standard Range"
 */
export function getShortLabel(option: string): string {
  // Remove content in parentheses
  const withoutParens = option.replace(/\([^)]*\)/g, '').trim();
  
  // Take first part before dash or comma
  const parts = withoutParens.split(/[-–—,]/);
  
  return parts[0].trim();
}

/**
 * Detects if an option represents a "positive" choice
 * Used for binary toggles to determine which is "on"
 */
export function isPositiveOption(option: string): boolean {
  const lower = option.toLowerCase();
  return (
    lower === 'yes' ||
    lower === 'display' ||
    lower === 'included' ||
    lower.startsWith('with ') ||
    lower.startsWith('included ')
  );
}

/**
 * Gets color value from color name for swatch rendering
 * Maps common color names to hex values
 */
export function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    'bright white': '#FFFFFF',
    'off white': '#F5F5DC',
    'cloud white': '#F0F0F0',
    'white': '#FFFFFF',
    'black': '#000000',
    'gray': '#808080',
    'grey': '#808080',
    'silver': '#C0C0C0',
    'red': '#DC2626',
    'blue': '#1479BC', // BAPI Blue
    'green': '#16A34A',
    'yellow': '#FFC843', // BAPI Yellow
    'orange': '#EA580C',
    'brown': '#92400E',
    'beige': '#D2B48C',
    'tan': '#D2B48C',
  };
  
  const normalized = colorName.toLowerCase().trim();
  
  // Direct match
  if (colorMap[normalized]) {
    return colorMap[normalized];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  // Default gray for unknown colors
  return '#9CA3AF';
}
