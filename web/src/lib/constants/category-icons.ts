/**
 * Category Icon Mapping
 * Maps product category slugs to their corresponding BAPI brand icons
 */

export const CATEGORY_ICONS: Record<string, string> = {
  'temperature-sensors': '/images/icons/Temperature_Icon.webp',
  'humidity-sensors': '/images/icons/Humidity_Icon.webp',
  'pressure-sensors': '/images/icons/Pressure_Icon.webp',
  'air-quality-sensors': '/images/icons/AirQuality_Icon.webp',
  'wireless-sensors': '/images/icons/Wireless_Icon.webp',
  'bluetooth-wireless': '/images/icons/Wireless_Icon.webp', // WordPress slug variant
  'accessories': '/images/icons/Accessories_Icon.webp',
  'test-instruments': '/images/icons/Test_Instruments_Icon.webp',
  'eta-line': '/images/icons/Sensors_Icon.webp',
};

/**
 * Get category icon path by category slug
 * Handles parent category slugs and returns appropriate BAPI brand icon
 */
export function getCategoryIcon(categorySlug: string): string {
  return CATEGORY_ICONS[categorySlug] || '/images/icons/Sensors_Icon.webp'; // Default to generic sensors icon
}

/**
 * Get category icon name for alt text
 */
export function getCategoryIconName(categorySlug: string): string {
  const names: Record<string, string> = {
    'temperature-sensors': 'Temperature Sensors',
    'humidity-sensors': 'Humidity Sensors',
    'pressure-sensors': 'Pressure Sensors',
    'air-quality-sensors': 'Air Quality Sensors',
    'wireless-sensors': 'Wireless Sensors',
    'bluetooth-wireless': 'Wireless Sensors',
    'accessories': 'Accessories',
    'test-instruments': 'Test Instruments',
    'eta-line': 'ETA Line',
  };
  return names[categorySlug] || 'Product Category';
}
