/**
 * Category & Subcategory Translation Mapping
 *
 * Maps WordPress product category and subcategory names to i18n translation keys.
 * WordPress returns English names like "Humidity Sensors", "Room", "Non-Room" which
 * need to be translated for non-English locales (German: "Feuchtigkeitssensoren", "Raum", "Nicht-Raum").
 *
 * Usage:
 *   const t = useTranslations('productsPage.categories');
 *   const key = getCategoryTranslationKey('Humidity Sensors');
 *   const translated = key ? t(`${key}.name`) : 'Humidity Sensors';
 */

/**
 * Maps WordPress category names (English) to i18n translation keys.
 * Structure: WordPress name → key for productsPage.categories.{key}.name
 */
export const CATEGORY_NAME_MAP: Record<string, string> = {
  // Main Categories (Level 1)
  'Temperature Sensors': 'temperatureSensors',
  'Humidity Sensors': 'humiditySensors',
  'Pressure Sensors': 'pressureSensors',
  'Air Quality Sensors': 'airQualitySensors',
  'Wireless Sensors': 'wirelessSensors',
  'Accessories': 'accessories',
  'Test Instruments': 'testInstruments',
  'ETA Line': 'etaLine',

  // Alternate casing variations (WordPress may return different formats)
  'temperature sensors': 'temperatureSensors',
  'humidity sensors': 'humiditySensors',
  'pressure sensors': 'pressureSensors',
  'air quality sensors': 'airQualitySensors',
  'wireless sensors': 'wirelessSensors',
  'accessories': 'accessories',
  'test instruments': 'testInstruments',
  'eta line': 'etaLine',
};

/**
 * Maps WordPress subcategory names (English) to i18n translation keys.
 * Structure: WordPress name → key for productsPage.subcategories.{key}.name
 *
 * WordPress subcategories include:
 * - Temperature: Room, Non-Room
 * - Humidity: Room, Non-Room
 * - Pressure: (no subcategories - types are Level 2)
 * - Wireless: Bluetooth Low Energy, WAM
 */
export const SUBCATEGORY_NAME_MAP: Record<string, string> = {
  // Common subcategories
  'Room': 'room',
  'Non-Room': 'nonRoom',

  // Wireless subcategories
  'Wireless System - Bluetooth Low Energy': 'bluetoothWireless',
  'WAM - Wireless Asset Monitoring': 'wamWireless',

  // Alternate casing
  'room': 'room',
  'non-room': 'nonRoom',
  'bluetooth low energy': 'bluetoothWireless',
  'wam': 'wamWireless',
};

/**
 * Gets the i18n translation key for a category name.
 * Returns the key to use with useTranslations('productsPage.categories').
 *
 * @param categoryName - WordPress category name (e.g., "Humidity Sensors")
 * @returns Translation key (e.g., "humiditySensors") or null if not found
 *
 * @example
 * const key = getCategoryTranslationKey('Humidity Sensors');
 * const t = useTranslations('productsPage.categories');
 * const translated = key ? t(`${key}.name`) : categoryName;
 * // German: "Feuchtigkeitssensoren"
 */
export function getCategoryTranslationKey(categoryName: string): string | null {
  if (!categoryName) return null;

  // Try exact match first
  if (CATEGORY_NAME_MAP[categoryName]) {
    return CATEGORY_NAME_MAP[categoryName];
  }

  // Try case-insensitive match
  const lowerName = categoryName.toLowerCase();
  const found = Object.entries(CATEGORY_NAME_MAP).find(
    ([key]) => key.toLowerCase() === lowerName
  );

  if (found) {
    return found[1];
  }

  // No mapping found - will use original name
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[i18n] ⚠️ No translation mapping for category: "${categoryName}"`);
  }
  return null;
}

/**
 * Gets the i18n translation key for a subcategory name.
 * Returns the key to use with useTranslations('productsPage.subcategories').
 *
 * @param subcategoryName - WordPress subcategory name (e.g., "Room", "Non-Room")
 * @returns Translation key (e.g., "room", "nonRoom") or null if not found
 *
 * @example
 * const key = getSubcategoryTranslationKey('Room');
 * const t = useTranslations('productsPage.subcategories');
 * const translated = key ? t(`${key}.name`) : subcategoryName;
 * // German: "Raum"
 */
export function getSubcategoryTranslationKey(subcategoryName: string): string | null {
  if (!subcategoryName) return null;

  // Try exact match first
  if (SUBCATEGORY_NAME_MAP[subcategoryName]) {
    return SUBCATEGORY_NAME_MAP[subcategoryName];
  }

  // Try case-insensitive match
  const lowerName = subcategoryName.toLowerCase();
  const found = Object.entries(SUBCATEGORY_NAME_MAP).find(
    ([key]) => key.toLowerCase() === lowerName
  );

  if (found) {
    return found[1];
  }

  // No mapping found - will use original name
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[i18n] ⚠️ No translation mapping for subcategory: "${subcategoryName}"`);
  }
  return null;
}

/**
 * Checks if a category has a translation mapping.
 * Pure function with no side effects.
 */
export function hasCategoryTranslation(categoryName: string): boolean {
  if (!categoryName) return false;

  if (CATEGORY_NAME_MAP[categoryName]) {
    return true;
  }

  const lowerName = categoryName.toLowerCase();
  return Object.keys(CATEGORY_NAME_MAP).some(
    (key) => key.toLowerCase() === lowerName
  );
}

/**
 * Checks if a subcategory has a translation mapping.
 * Pure function with no side effects.
 */
export function hasSubcategoryTranslation(subcategoryName: string): boolean {
  if (!subcategoryName) return false;

  if (SUBCATEGORY_NAME_MAP[subcategoryName]) {
    return true;
  }

  const lowerName = subcategoryName.toLowerCase();
  return Object.keys(SUBCATEGORY_NAME_MAP).some(
    (key) => key.toLowerCase() === lowerName
  );
}

/**
 * Returns all supported category names for debugging/auditing.
 */
export function getSupportedCategoryNames(): string[] {
  return Object.keys(CATEGORY_NAME_MAP);
}

/**
 * Returns all supported subcategory names for debugging/auditing.
 */
export function getSupportedSubcategoryNames(): string[] {
  return Object.keys(SUBCATEGORY_NAME_MAP);
}
