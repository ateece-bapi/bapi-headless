/**
 * Products confirmed by Sales/Product Management (Asana, Sept 2026) that must NOT display
 * the sitewide "CE/RoHS Certified" trust badge, because the product itself is not
 * CE-certified and/or RoHS-compliant. Keyed by product slug (lowercase).
 */
const HIDE_COMPLIANCE_BADGE_SLUGS: ReadonlySet<string> = new Set([
  'thermowell-2',
  'remote-probe-extreme-temperature-sensor-platinum-rtd-2',
  'immersion-extreme-temperature-sensor-platinum-rtd-2',
  'surface-temperature-sensor',
  'concave-remote-probe-temperature-transmitter-with-colored-cable',
  'concave-remote-probe-temperature-sensors-with-colored-cable',
  'decora-low-profile-room-temperature-sensor-2',
  'differential-pressure-switch',
  'room-pressure-pickup-ports',
  'silicone-rubber-tubing-50-foot-roll',
  'tubing-with-surge-damper',
  'pressure-surge-damper',
  'duct-total-pressure-probes-6-3-5',
  'duct-pitot-pressure-probe-assembly-6-or-3-5',
  'duct-static-pressure-probe-6-and-probe-assemblies',
  'outside-pressure-pickup-port',
  'room-pressure-pickup-ports-with-temperature-sensor',
  'digital-co-and-no2-sensor',
  'carbon-monoxide-rough-service-with-optional-bacnet',
  'co2-24-7-bapi-stat-quantum-prime-co2-temp-and-humidity-sensor-constant-occupancy',
  'co2-24-7-bapi-stat-quantum-prime-carbon-dioxide-temp-and-humidity-sensor-without-display-constant-occupancy',
  'voc-sensor-verification-kit',
  'voc-bapi-stat-quantum-prime-voc-temp-and-humidity-sensor-without-display',
  'voc-bapi-stat-quantum-prime-voc-temp-and-humidity-sensor',
  'setpoint-output-module-som-for-wireless-system',
  'voltage-output-module-vom-for-wireless-system',
  'resistance-output-module-rom-for-wireless-system',
  'wireless-digital-output-module',
  'bacnet-ip-module',
]);

/**
 * Category slugs where every product in the category must have the CE/RoHS badge hidden
 * (Wireless Accessories and the full ETA Line), rather than maintaining a per-product list.
 */
const HIDE_COMPLIANCE_BADGE_CATEGORY_SLUGS: ReadonlySet<string> = new Set([
  'wireless-accessories',
  'eta-line',
]);

/**
 * Exceptions within a hidden category: these Wireless Accessories products ARE actually
 * CE certified, so the badge must still show even though the rest of the category hides it.
 */
const SHOW_COMPLIANCE_BADGE_SLUGS: ReadonlySet<string> = new Set([
  'water-leak-detector-with-a-rope-sensor',
  'blu-test-wireless-remote-temperature-piercing-tip',
  'door-monitor-alarm-dma',
  'blu-test-bluetooth-testing-probe-suite',
  'water-leak-detector-in-a-bapi-box-2',
]);

/** Determine whether the sitewide CE/RoHS trust badge should be hidden for this product. */
export function shouldHideComplianceBadge(
  slug: string | null | undefined,
  categorySlugs: ReadonlyArray<string | null | undefined> = []
): boolean {
  const normalizedSlug = slug?.toLowerCase();

  if (normalizedSlug && SHOW_COMPLIANCE_BADGE_SLUGS.has(normalizedSlug)) return false;
  if (normalizedSlug && HIDE_COMPLIANCE_BADGE_SLUGS.has(normalizedSlug)) return true;

  return categorySlugs.some(
    (categorySlug) => !!categorySlug && HIDE_COMPLIANCE_BADGE_CATEGORY_SLUGS.has(categorySlug.toLowerCase())
  );
}
