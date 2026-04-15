/**
 * Mega-Menu Link Verification Script
 * 
 * Purpose: Verify all mega-menu category links point to valid WordPress categories
 * Run: pnpm tsx scripts/verify-megamenu-links.ts
 * 
 * This script:
 * 1. Extracts all category slugs from mega-menu config
 * 2. Queries WordPress GraphQL to verify each slug exists
 * 3. Reports broken links, product counts, and status
 * 4. Exits with code 1 if any links are broken (CI/CD integration)
 * 
 * Author: Senior Web Developer
 * Date: April 15, 2026
 */

import { getGraphQLClient } from '../src/lib/graphql/client';
import { getSdk } from '../src/lib/graphql/generated';

/**
 * All mega-menu category links to verify
 * Extracted from: web/src/components/layout/Header/config.ts
 */
const MEGA_MENU_LINKS = [
  // TEMPERATURE SENSORS (6 links)
  {
    category: 'Temperature',
    slug: 'temp-room-temp',
    label: 'Room & Wall Sensors',
    href: '/products/temperature-sensors/temp-room-temp',
    expectedProducts: 23,
  },
  {
    category: 'Temperature',
    slug: 'temp-duct',
    label: 'Duct Sensors',
    href: '/products/temperature-sensors/temp-duct',
    expectedProducts: 27,
  },
  {
    category: 'Temperature',
    slug: 'temp-immersion',
    label: 'Immersion & Well',
    href: '/products/temperature-sensors/temp-immersion',
    expectedProducts: 15,
  },
  {
    category: 'Temperature',
    slug: 'temp-outside-air',
    label: 'Outdoor Sensors',
    href: '/products/temperature-sensors/temp-outside-air',
    expectedProducts: 7,
  },
  {
    category: 'Temperature',
    slug: 'temp-averaging',
    label: 'Averaging Sensors',
    href: '/products/temperature-sensors/temp-averaging',
    expectedProducts: 17,
  },
  {
    category: 'Temperature',
    slug: 'temp-remote-probes-and-sensors',
    label: 'Remote Probes',
    href: '/products/temperature-sensors/temp-remote-probes-and-sensors',
    expectedProducts: 15,
  },

  // HUMIDITY SENSORS (2 unique links, 4 menu items point to these)
  {
    category: 'Humidity',
    slug: 'humidity-room',
    label: 'Room Humidity',
    href: '/products/humidity-sensors/humidity-room',
    expectedProducts: 15,
  },
  {
    category: 'Humidity',
    slug: 'humidity-non-room',
    label: 'Duct Humidity / Outdoor Humidity',
    href: '/products/humidity-sensors/humidity-non-room',
    expectedProducts: 19,
  },

  // PRESSURE SENSORS (3 links)
  {
    category: 'Pressure',
    slug: 'pressure-differential-transmitters',
    label: 'Differential Pressure',
    href: '/products/pressure-sensors/pressure-differential-transmitters',
    expectedProducts: 7,
  },
  {
    category: 'Pressure',
    slug: 'pressure-pickup-ports-and-probes',
    label: 'Static Pressure',
    href: '/products/pressure-sensors/pressure-pickup-ports-and-probes',
    expectedProducts: 18,
  },
  {
    category: 'Pressure',
    slug: 'pressure-differential-switch',
    label: 'Barometric (should be Differential Switch)',
    href: '/products/pressure-sensors/pressure-differential-switch',
    expectedProducts: 4,
  },

  // AIR QUALITY SENSORS (3 links)
  {
    category: 'Air Quality',
    slug: 'carbon-dioxide',
    label: 'CO₂ Sensors',
    href: '/products/air-quality-sensors/carbon-dioxide',
    expectedProducts: 7,
  },
  {
    category: 'Air Quality',
    slug: 'voc',
    label: 'VOC Sensors',
    href: '/products/air-quality-sensors/voc',
    expectedProducts: 10,
  },
  {
    category: 'Air Quality',
    slug: 'particulate',
    label: 'Particulate Matter',
    href: '/products/air-quality-sensors/particulate',
    expectedProducts: 2,
  },

  // WIRELESS SENSORS (1 main category - subcategory links currently broken)
  {
    category: 'Wireless',
    slug: 'bluetooth-wireless',
    label: 'Bluetooth Wireless (main category)',
    href: '/products/bluetooth-wireless',
    expectedProducts: 24,
  },

  // ACCESSORIES (flat structure - no subcategories)
  {
    category: 'Accessories',
    slug: 'accessories',
    label: 'Accessories (flat)',
    href: '/products/accessories',
    expectedProducts: 74,
  },

  // TEST INSTRUMENTS (flat structure - no subcategories)
  {
    category: 'Test Instruments',
    slug: 'test-instruments',
    label: 'Test Instruments (flat)',
    href: '/products/test-instruments',
    expectedProducts: 3,
  },
];

/**
 * Main verification function
 */
async function verifyMegaMenuLinks() {
  console.log('🔍 MEGA-MENU LINK VERIFICATION\n');
  console.log('Querying WordPress GraphQL for category existence...\n');

  const client = getGraphQLClient(['categories'], true); // Use GET for cacheability
  const sdk = getSdk(client);

  const results = await Promise.all(
    MEGA_MENU_LINKS.map(async (link) => {
      try {
        const data = await sdk.GetProductCategoryWithChildren({ slug: link.slug });

        const exists = !!data.productCategory;
        const actualCount = data.productCategory?.count || 0;
        const countMatch = actualCount === link.expectedProducts;
        const countDiff = actualCount - link.expectedProducts;

        return {
          category: link.category,
          label: link.label,
          slug: link.slug,
          href: link.href,
          status: exists ? '✅' : '❌',
          exists,
          expectedProducts: link.expectedProducts,
          actualProducts: actualCount,
          countMatch: countMatch ? '✅' : `⚠️ (${countDiff > 0 ? '+' : ''}${countDiff})`,
          wpName: data.productCategory?.name || 'N/A',
        };
      } catch (error: any) {
        return {
          category: link.category,
          label: link.label,
          slug: link.slug,
          href: link.href,
          status: '❌',
          exists: false,
          expectedProducts: link.expectedProducts,
          actualProducts: 0,
          countMatch: '❌',
          error: error.message,
          wpName: 'ERROR',
        };
      }
    })
  );

  // Display results table
  console.table(
    results.map((r) => ({
      Category: r.category,
      Label: r.label.slice(0, 30), // Truncate for readability
      Slug: r.slug.slice(0, 30),
      Exists: r.status,
      'Expected Count': r.expectedProducts,
      'Actual Count': r.actualProducts,
      'Count Match': r.countMatch,
      'WordPress Name': r.wpName.slice(0, 25),
    }))
  );

  // Summary statistics
  const broken = results.filter((r) => !r.exists);
  const countMismatches = results.filter((r) => r.exists && r.actualProducts !== r.expectedProducts);

  console.log('\n📊 SUMMARY:\n');
  console.log(`Total Links Verified: ${results.length}`);
  console.log(`✅ Valid Links: ${results.length - broken.length}`);
  console.log(`❌ Broken Links: ${broken.length}`);
  console.log(`⚠️  Product Count Mismatches: ${countMismatches.length}`);

  // Report broken links
  if (broken.length > 0) {
    console.error('\n❌ BROKEN LINKS DETECTED:\n');
    broken.forEach((link) => {
      console.error(`  - ${link.category}: "${link.label}"`);
      console.error(`    Slug: ${link.slug}`);
      console.error(`    Expected: ${link.href}`);
      console.error(`    Error: ${link.error || 'Category not found in WordPress'}\n`);
    });
  }

  // Report count mismatches
  if (countMismatches.length > 0) {
    console.warn('\n⚠️  PRODUCT COUNT MISMATCHES:\n');
    countMismatches.forEach((link) => {
      const diff = link.actualProducts - link.expectedProducts;
      console.warn(`  - ${link.category}: "${link.label}"`);
      console.warn(`    Expected: ${link.expectedProducts} products`);
      console.warn(`    Actual: ${link.actualProducts} products (${diff > 0 ? '+' : ''}${diff})\n`);
    });
    console.warn('Note: Product count differences may be due to:');
    console.warn('  - New products added since last audit');
    console.warn('  - Customer group visibility (B2B segmentation)');
    console.warn('  - Draft/unpublished products\n');
  }

  // Exit with error code if broken links found
  if (broken.length > 0) {
    console.error('❌ VERIFICATION FAILED - Fix broken links before deploying\n');
    process.exit(1);
  }

  console.log('✅ ALL MEGA-MENU LINKS VERIFIED\n');
  console.log('Next Steps:');
  console.log('  1. If count mismatches: Update expected counts in this script');
  console.log('  2. Run E2E tests: pnpm test:e2e');
  console.log('  3. Manual QA: Click through all mega-menu links\n');
}

// Run verification
verifyMegaMenuLinks().catch((error) => {
  console.error('❌ VERIFICATION SCRIPT ERROR:', error);
  process.exit(1);
});
