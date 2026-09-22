export type WarrantyType = 'standard' | 'lifetime' | 'two-year';

/**
 * Products confirmed by Sales/Product Management (Asana, Sept 2026) to carry BAPI's
 * lifetime limited warranty instead of the sitewide default 5-year warranty.
 * Keyed by product slug (lowercase, as returned by WPGraphQL).
 */
const LIFETIME_WARRANTY_SLUGS: ReadonlySet<string> = new Set([
  'submersible-averaging-temperature-sensor',
  'duct-averaging-temperature-sensor-flexible-2',
  'duct-averaging-temperature-sensor-rigid-2',
  'submersible-duct-temperature-sensor-2',
  'duct-temperature-sensor-2',
  'replacement-temperature-probes',
  'immersion-extreme-temperature-sensor-platinum-rtd-2',
  'thermowell-2',
  'immersion-temperature-sensor-stainless-steel-fitting-2',
  'immersion-temperature-sensor-nylon-fitting-2',
  'outside-air-temperature-sensor-2',
  'surface-temperature-sensor',
  'remote-temperature-sensor-2',
  'remote-probe-temperature-sensor-2',
  'concave-remote-probe-temperature-sensors-with-colored-cable',
  'strap-temperature-sensor-2',
  'thermobuffer-temperature-sensor-2',
  'bapi-stat-quantum-slim-temperature-sensor-2',
  'bapi-stat-quantum-temperature-sensor-without-display-optional-setpoint-and-override',
  'button-sensor-low-profile-room-temperature-sensor-2',
  'delta-style-temperature-sensor-without-display-optional-setpoint-and-override',
  'room-pressure-pickup-ports',
  'outside-pressure-pickup-port',
  'room-pressure-pickup-ports-with-temperature-sensor',
  // 'wall-plate-temperature-sensor-with-optional-override-pushbutton' — not yet migrated from bapihvac.com
]);

/** Products confirmed to carry a 2-year warranty instead of the sitewide default. */
const TWO_YEAR_WARRANTY_SLUGS: ReadonlySet<string> = new Set([
  'refrigerant-leak-detector-and-transmitter',
]);

/** Look up the correct warranty type for a product, falling back to the sitewide 5-year default. */
export function getProductWarrantyType(slug: string | null | undefined): WarrantyType {
  if (!slug) return 'standard';

  const normalizedSlug = slug.toLowerCase();

  if (LIFETIME_WARRANTY_SLUGS.has(normalizedSlug)) return 'lifetime';
  if (TWO_YEAR_WARRANTY_SLUGS.has(normalizedSlug)) return 'two-year';

  return 'standard';
}
