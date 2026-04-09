/**
 * Product Attribute Translation Mapping
 * 
 * Maps WooCommerce product attribute labels to i18n translation keys
 * for display in product configurators and selectors.
 * 
 * Strategy: Following Belimo's B2B approach
 * - Translate attribute NAMES (labels) for better UX
 * - Keep attribute VALUES technical (0-10V, 4-20mA, etc.)
 * 
 * Usage:
 *   import { getAttributeTranslationKey } from '@/lib/productAttributeTranslations';
 *   const t = useTranslations('productPage.productAttributes');
 *   const key = getAttributeTranslationKey(attribute.label);
 *   const translatedLabel = key !== attribute.label ? t(key) : attribute.label;
 */

/**
 * Mapping of WordPress attribute labels to translation keys
 * Based on actual WooCommerce product attributes from WordPress
 */
const ATTRIBUTE_LABEL_MAP: Record<string, string> = {
  // Temperature Sensors
  'Temperature Application': 'temperature.application',
  'APPLICATION': 'temperature.application', // All-caps from filters
  'Room Enclosure Style': 'temperature.roomEnclosure',
  'Temperature Room Enclosure': 'temperature.roomEnclosure',
  'Temperature Sensor/Output': 'temperature.sensorOutput',
  'Temperature Sensor Output': 'temperature.sensorOutput',
  'Temperature Sensor': 'temperature.sensorOutput', // Title case variation (WordPress sends this)
  'TEMPERATURE SENSOR': 'temperature.sensorOutput', // All-caps variation
  'SENSOR OUTPUT': 'temperature.sensorOutput', // Generic all-caps
  'Temp Setpoint and Override': 'temperature.setpointOverride',
  'TEMP SETPOINT AND OVERRIDE': 'temperature.setpointOverride', // All-caps
  'Optional Temp Sensor & Output': 'temperature.optionalSensorOutput',
  'OPTIONAL INPUT SENSOR & OUTPUT': 'temperature.optionalSensorOutput', // All-caps variation
  
  // Humidity Sensors
  'Humidity Application': 'humidity.application',
  'HUMIDITY APPLICATION': 'humidity.application', // All-caps
  'Humidity Room Enclosure': 'humidity.roomEnclosure',
  'HUMIDITY ROOM ENCLOSURE': 'humidity.roomEnclosure', // All-caps
  'Humidity Sensor Output': 'humidity.sensorOutput',
  'HUMIDITY SENSOR OUTPUT': 'humidity.sensorOutput', // All-caps
  'HUMIDITY OUTPUT': 'humidity.sensorOutput', // All-caps variation
  'Humidity Output': 'humidity.sensorOutput', // Title case variation (WordPress sends this)
  'Optional Temp & Humidity': 'humidity.optionalTempHumidity',
  
  // Pressure Sensors
  'Pressure Application': 'pressure.application',
  'Pressure Sensor Style': 'pressure.sensorStyle',
  
  // Air Quality Sensors
  'Air Quality Application': 'airQuality.application',
  'Air Quality Sensor Type': 'airQuality.sensorType',
  
  // Wireless Sensors
  'Wireless Application': 'wireless.application',
  
  // General/Common Attributes
  'Display': 'general.display',
  'DISPLAY': 'general.display', // All-caps
  'Voltage Range': 'general.voltage',
  'Current Output': 'general.current',
  'Mounting Type': 'general.mounting',
  'Enclosure Type': 'general.enclosure',
  'Communication Protocol': 'general.protocol',
  'Certifications': 'general.certification',
};

/**
 * Get translation key for a product attribute label
 * 
 * @param label - Raw attribute label from WordPress (e.g., "Temperature Application")
 * @returns Translation key (e.g., "temperature.application") or original label if no mapping exists
 * 
 * @example
 * const key = getAttributeTranslationKey('Temperature Application');
 * // Returns: 'temperature.application'
 * 
 * const t = useTranslations('productPage.productAttributes');
 * const translated = t(key); // German: "Temperaturanwendung"
 */
export function getAttributeTranslationKey(label: string): string {
  // Check exact match first
  if (label in ATTRIBUTE_LABEL_MAP) {
    return ATTRIBUTE_LABEL_MAP[label];
  }
  
  // Try case-insensitive match
  const lowercaseLabel = label.toLowerCase();
  const matchingKey = Object.keys(ATTRIBUTE_LABEL_MAP).find(
    (key) => key.toLowerCase() === lowercaseLabel
  );
  
  if (matchingKey) {
    return ATTRIBUTE_LABEL_MAP[matchingKey];
  }
  
  // No mapping found - log warning in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[i18n] ⚠️ No translation mapping for attribute label: "${label}". ` +
      `Add to ATTRIBUTE_LABEL_MAP in productAttributeTranslations.ts`
    );
  }
  
  // Return the original label as fallback
  // This ensures functionality even for unmapped attributes
  return label;
}

/**
 * Check if an attribute label has a translation mapping
 * 
 * @param label - Attribute label to check
 * @returns true if translation exists, false otherwise
 */
export function hasAttributeTranslation(label: string): boolean {
  return getAttributeTranslationKey(label) !== label;
}

/**
 * Get all supported attribute labels
 * Useful for auditing which attributes are translated
 * 
 * @returns Array of all supported attribute labels
 */
export function getSupportedAttributeLabels(): string[] {
  return Object.keys(ATTRIBUTE_LABEL_MAP);
}
