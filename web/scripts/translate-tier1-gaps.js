#!/usr/bin/env node

/**
 * Translate Tier 1 Core UI Gaps
 * 
 * Fills in missing translations for Tier 1 sections across all languages:
 * - common, nav, products, region, units, errors, auth, cart, checkout, forms, accessibility
 * 
 * Usage:
 *   node translate-tier1-gaps.js th     # Translate Thai only
 *   node translate-tier1-gaps.js all    # Translate all languages with gaps
 *   node translate-tier1-gaps.js --dry-run  # Preview what would be translated
 */

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const messagesDir = path.join(__dirname, '../messages');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TIER1_SECTIONS = [
  'common', 'nav', 'products', 'region', 'units', 
  'errors', 'auth', 'cart', 'checkout', 'forms', 'accessibility'
];

const LANGUAGES = {
  th: { name: 'Thai (ไทย)', tone: 'Professional business tone, respectful' },
  es: { name: 'Spanish (Español)', tone: 'Professional B2B tone' },
  fr: { name: 'French (Français)', tone: 'Professional B2B tone' },
  ja: { name: 'Japanese (日本語)', tone: 'Formal keigo style for B2B' },
  zh: { name: 'Chinese Simplified (中文)', tone: 'Professional business tone' },
  de: { name: 'German (Deutsch)', tone: 'Professional B2B tone, use Sie form' },
  ar: { name: 'Arabic (العربية)', tone: 'Professional business tone, RTL layout' },
  vi: { name: 'Vietnamese (Tiếng Việt)', tone: 'Professional business tone' },
};

// Languages with known complete Tier 1 translations
const COMPLETE_LANGUAGES = ['en', 'pl', 'hi'];

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getMissingKeys(enData, targetData, section) {
  const enKeys = getAllKeys(enData[section] || {}, section);
  const targetKeys = getAllKeys(targetData[section] || {}, section);
  return enKeys.filter(k => !targetKeys.includes(k));
}

function extractMissingSections(enData, targetData) {
  const missing = {};
  
  TIER1_SECTIONS.forEach(section => {
    const missingKeys = getMissingKeys(enData, targetData, section);
    if (missingKeys.length > 0) {
      missing[section] = enData[section];
    }
  });
  
  return missing;
}

async function translateSection(sectionName, sectionContent, targetLang) {
  const langConfig = LANGUAGES[targetLang];
  console.log(`   📝 Translating ${sectionName} (${Object.keys(sectionContent || {}).length} keys)...`);

  const prompt = `You are a professional translator for building automation and sensor products (B2B technical content).

Translate this JSON section from English to ${langConfig.name}.
Use ${langConfig.tone}.

CRITICAL RULES - DO NOT TRANSLATE:
- Brand names: BAPI, WAM™, Blu-Test, BAPI-Box
- Certifications: NIST, ISO 9001:2015, UL, CE
- Protocols: BACnet, Modbus, LON, MQTT
- Technical units: °C, °F, PSI, bar, kPa, Pa, RH%, PPM, CFM, GPM
- Chemical formulas: CO₂, VOC, PM2.5, PM10
- Abbreviations: SKU, RMA, B2B
- Placeholders: {year}, {count}, {productName}, etc.
- HTML tags: <strong>, <a>, <br>, etc.

IMPORTANT:
1. Preserve ALL JSON keys EXACTLY (only translate values)
2. Keep all placeholders intact: {variable}
3. Maintain professional B2B tone
4. Return ONLY valid JSON (no markdown, no explanations)
5. Ensure proper character encoding

Section to translate:
${JSON.stringify(sectionContent, null, 2)}

Return the translated JSON:`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0].text.trim();
    
    // Extract JSON from response
    let cleaned = response;
    
    // Remove markdown code blocks
    if (response.includes('```')) {
      cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    // Extract JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const translated = JSON.parse(jsonMatch[0]);
    console.log(`   ✅ Success`);
    return translated;
    
  } catch (error) {
    console.error(`   ❌ Error translating ${sectionName}: ${error.message}`);
    return null;
  }
}

async function translateLanguage(locale, dryRun = false) {
  console.log(`\n🌐 Processing ${locale.toUpperCase()} (${LANGUAGES[locale].name})`);
  
  // Load files
  const enPath = path.join(messagesDir, 'en.json');
  const targetPath = path.join(messagesDir, `${locale}.json`);
  
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  
  // Find missing sections
  const missingSections = extractMissingSections(enData, targetData);
  const sectionNames = Object.keys(missingSections);
  
  if (sectionNames.length === 0) {
    console.log(`   ✅ No missing Tier 1 sections!`);
    return;
  }
  
  console.log(`   📊 Found ${sectionNames.length} sections with missing translations:`);
  sectionNames.forEach(section => {
    const missing = getMissingKeys(enData, targetData, section);
    console.log(`      - ${section}: ${missing.length} keys`);
  });
  
  if (dryRun) {
    console.log(`   🔍 Dry run - skipping translation`);
    return;
  }
  
  // Translate each missing section
  console.log(`\n   🚀 Starting translation...`);
  const newData = { ...targetData };
  
  for (const section of sectionNames) {
    const translated = await translateSection(section, missingSections[section], locale);
    
    if (translated) {
      newData[section] = translated;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Write updated file
  fs.writeFileSync(targetPath, JSON.stringify(newData, null, 2) + '\n', 'utf8');
  console.log(`\n   💾 Updated ${locale}.json`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const targetLang = args.find(arg => !arg.startsWith('--'));
  
  console.log('🌍 Tier 1 Core UI Translation Gap Filler');
  console.log('=========================================\n');
  
  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    console.log('\nSet it in web/.env:');
    console.log('ANTHROPIC_API_KEY=your-key-here');
    process.exit(1);
  }
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  // Determine which languages to process
  let languagesToProcess = [];
  
  if (!targetLang || targetLang === 'all') {
    languagesToProcess = Object.keys(LANGUAGES);
    console.log(`Processing all languages with gaps: ${languagesToProcess.join(', ')}\n`);
  } else if (LANGUAGES[targetLang]) {
    languagesToProcess = [targetLang];
  } else {
    console.error(`❌ Unknown language: ${targetLang}`);
    console.log(`Available: ${Object.keys(LANGUAGES).join(', ')}, all`);
    process.exit(1);
  }
  
  // Process each language
  for (const locale of languagesToProcess) {
    await translateLanguage(locale, dryRun);
  }
  
  console.log('\n✅ Translation complete!');
  console.log('\nNext steps:');
  console.log('1. Review translations in web/messages/*.json');
  console.log('2. Test the application: cd web && pnpm dev');
  console.log('3. Commit: git add web/messages/*.json && git commit -m "feat(i18n): Complete Tier 1 translations"');
}

main().catch(console.error);
