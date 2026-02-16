import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// ES modules don't have __dirname, so create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config();

/**
 * Syncs footer translations across all locale files
 * Ensures consistent footer content (links, copyright, contact info) across languages
 * 
 * @description Reads the English footer as the source of truth and propagates
 * structure to other locales while preserving translated text
 */
async function syncFooterTranslations() {
  const localesDir = path.join(__dirname, '../messages');
  const sourceLocale = 'en.json';
  const sourcePath = path.join(localesDir, sourceLocale);

  // Read source English footer
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`);
    process.exit(1);
  }

  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const sourceFooter = sourceData.footer;

  if (!sourceFooter) {
    console.error('❌ No footer section found in source locale');
    process.exit(1);
  }

  // Get all locale files
  const localeFiles = fs.readdirSync(localesDir).filter((file) => {
    return file.endsWith('.json') && file !== sourceLocale;
  });

  console.log(`\n🔄 Syncing footer translations from ${sourceLocale}...\n`);

  let updatedCount = 0;

  for (const localeFile of localeFiles) {
    const localePath = path.join(localesDir, localeFile);
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));

    // Preserve existing translations, add new keys from source
    if (!localeData.footer) {
      localeData.footer = {};
    }

    // Deep merge: keep existing translations, add missing keys
    localeData.footer = mergeFooterStructure(sourceFooter, localeData.footer);

    // Write updated locale file
    fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n', 'utf8');

    console.log(`✅ Updated ${localeFile}`);
    updatedCount++;
  }

  console.log(`\n✨ Successfully synced ${updatedCount} locale file(s)\n`);
}

/**
 * Deep merges footer structure while preserving existing translations
 * @param {Object} source - Source footer structure (English)
 * @param {Object} target - Target footer with existing translations
 * @returns {Object} Merged footer object
 */
function mergeFooterStructure(source, target) {
  const merged = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively merge nested objects
      merged[key] = mergeFooterStructure(value, merged[key] || {});
    } else if (!(key in merged)) {
      // Add missing keys from source (will need translation)
      merged[key] = value;
    }
    // Keep existing translated values
  }

  return merged;
}

// Run the sync
syncFooterTranslations().catch((error) => {
  console.error('❌ Error syncing footer translations:', error);
  process.exit(1);
});