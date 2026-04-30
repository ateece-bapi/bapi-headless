#!/usr/bin/env node
/**
 * Sync Mega-Menu Translation Keys
 * 
 * Purpose: Add missing mega-menu keys from en.json to all other locale files
 * Context: PR review feedback - all three navigation PRs only updated en.json
 * 
 * Affected sections:
 * - megaMenu.products.wireless (4 keys from Wireless PR)
 * - megaMenu.products.testInstruments (2 keys from Test Instruments PR)
 * - megaMenu.products.etaLine (3 keys from ETA PR)
 * 
 * Strategy: Use English values as placeholders (acceptable for Phase 1 launch)
 * Phase 2: Replace with proper translations from localization team
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../messages');

// New keys to sync (from en.json)
const NEW_KEYS = {
  megaMenu: {
    products: {
      wireless: {
        roomSensors: "Room Sensors",
        roomSensorsDesc: "Temperature & humidity sensors for indoor environments",
        nonRoomSensors: "Industrial Sensors",
        nonRoomSensorsDesc: "Duct, outside air, and specialized applications",
        gateway: "Gateway",
        gatewayDesc: "Wireless gateway for sensor connectivity",
        wirelessAccessories: "Accessories",
        wirelessAccessoriesDesc: "Mounting & installation accessories"
      },
      testInstruments: {
        allTestInstruments: "All Test Instruments",
        allTestInstrumentsDesc: "NIST-traceable temperature, humidity, and pressure references"
      },
      etaLine: {
        title: "ETA Line",
        allEtaLine: "All ETA Products",
        allEtaLineDesc: "Modular I/O and control solutions for building automation"
      }
    }
  }
};

// Locale files to update (all except en.json)
const LOCALES = ['ar', 'de', 'es', 'fr', 'hi', 'ja', 'pl', 'th', 'vi', 'zh'];

/**
 * Deep merge objects - adds missing keys without overwriting existing ones
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (!(key in result)) {
      // Only add if key doesn't exist (preserve existing translations)
      result[key] = source[key];
    }
  }
  
  return result;
}

/**
 * Sync keys to a single locale file
 */
function syncLocaleFile(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${locale}.json`);
    return false;
  }
  
  try {
    // Read current content
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Count keys before
    const keysBefore = countKeys(data);
    
    // Merge new keys
    const updated = deepMerge(data, NEW_KEYS);
    
    // Count keys after
    const keysAfter = countKeys(updated);
    const keysAdded = keysAfter - keysBefore;
    
    // Write back with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
    
    console.log(`✅ ${locale.toUpperCase()}: Added ${keysAdded} keys (${keysBefore} → ${keysAfter})`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${locale}.json:`, error.message);
    return false;
  }
}

/**
 * Count total keys in nested object
 */
function countKeys(obj, count = 0) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      count = countKeys(obj[key], count);
    } else {
      count++;
    }
  }
  return count;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Syncing Mega-Menu Translation Keys\n');
  console.log('📦 Sections to sync:');
  console.log('  - wireless (8 keys)');
  console.log('  - testInstruments (2 keys)');
  console.log('  - etaLine (3 keys)');
  console.log('  Total: 13 new keys\n');
  
  let successCount = 0;
  let failCount = 0;
  
  LOCALES.forEach(locale => {
    if (syncLocaleFile(locale)) {
      successCount++;
    } else {
      failCount++;
    }
  });
  
  console.log(`\n✨ Sync complete!`);
  console.log(`✅ Success: ${successCount} files`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} files`);
    process.exit(1);
  }
  
  console.log('\n📝 Note: Using English placeholders for Phase 1 launch');
  console.log('🔄 Phase 2: Replace with proper translations from localization team\n');
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { deepMerge, countKeys };
