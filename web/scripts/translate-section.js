#!/usr/bin/env node

/**
 * Universal Translation Script
 * 
 * Translates any section of en.json to all other languages using Claude API
 * 
 * Usage:
 *   node scripts/translate-section.js productPage
 *   node scripts/translate-section.js cart checkout
 *   node scripts/translate-section.js --section productPage --estimate
 * 
 * Features:
 *   - Translates specific sections (not entire file)
 *   - Preserves existing translations
 *   - Cost estimation before running
 *   - Progress tracking
 *   - Error handling and retry logic
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
config({ path: path.join(__dirname, '..', '.env') });

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const MODEL = 'claude-sonnet-4-20250514'; // Current model (April 2026)

// Target languages (excluding English source)
const LANGUAGES = [
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

/**
 * Extract section from JSON object using dot notation
 * @param {object} obj - Source object
 * @param {string} path - Dot notation path (e.g., "productPage.tabs")
 * @returns {object|null} - Extracted section or null
 */
function extractSection(obj, path) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  
  return current;
}

/**
 * Set section in JSON object using dot notation
 * @param {object} obj - Target object
 * @param {string} path - Dot notation path
 * @param {object} value - Value to set
 */
function setSection(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  // Create nested structure if needed
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
}

/**
 * Translate a section using Claude API
 */
async function translateSection(sectionName, sectionData, targetLanguage) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const prompt = `You are a professional translator specializing in B2B industrial automation and building management systems.

Translate the following JSON section from English to ${targetLanguage.name} (${targetLanguage.nativeName}).

IMPORTANT RULES:
1. Preserve ALL JSON structure, keys, and formatting EXACTLY as shown
2. Translate ONLY the string values, NOT the keys
3. Keep {placeholders}, {variable} syntax unchanged (e.g., {count}, {days}, {title})
4. Preserve technical terms: BAPI, BACnet, Modbus, IoT, CO2, PM2.5, IP65, UL, ISO
5. Keep brand names unchanged: WAM™, Blu-Test™
6. Maintain HTML entities if present (e.g., &copy;, &trade;)
7. For pluralization syntax like "{count, plural, =1 {1 item} other {# items}}", translate the text but keep the ICU syntax structure
8. Return ONLY the translated JSON, no explanations

SOURCE SECTION (${sectionName}):
${JSON.stringify(sectionData, null, 2)}

Translate to ${targetLanguage.name}:`;

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const translatedText = message.content[0].text;

  // Extract JSON from response - try multiple patterns
  let jsonText = translatedText;
  
  // Remove markdown code blocks if present
  const codeBlockMatch = translatedText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim();
  } else {
    // Try to extract just the JSON object/array
    const jsonMatch = translatedText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }
  }
  
  // Parse and return
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Failed to parse JSON for ${targetLanguage.name}: ${error.message}`);
  }
}

/**
 * Estimate translation cost
 */
function estimateCost(sectionData, languageCount) {
  const jsonString = JSON.stringify(sectionData);
  const charCount = jsonString.length;
  const tokensEstimate = Math.ceil(charCount / 3); // Rough estimate: ~3 chars per token
  const totalTokens = tokensEstimate * languageCount * 2; // Input + output
  
  // Claude Haiku pricing (as of Feb 2026)
  const inputCostPer1M = 0.25;
  const outputCostPer1M = 1.25;
  const estimatedCost = ((totalTokens / 1_000_000) * ((inputCostPer1M + outputCostPer1M) / 2));
  
  return {
    characters: charCount,
    tokensEstimate,
    languageCount,
    totalTokens,
    estimatedCost: estimatedCost.toFixed(3),
  };
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let sections = [];
  let estimateOnly = false;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--estimate') {
      estimateOnly = true;
    } else if (args[i] === '--section') {
      sections.push(args[++i]);
    } else {
      sections.push(args[i]);
    }
  }
  
  if (sections.length === 0) {
    console.error('Usage: node translate-section.js <section> [section2] [--estimate]');
    console.error('Example: node translate-section.js productPage');
    console.error('Example: node translate-section.js cart checkout --estimate');
    process.exit(1);
  }
  
  // Load English source
  const enPath = path.join(MESSAGES_DIR, 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  
  // Process each section
  for (const sectionName of sections) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Section: ${sectionName}`);
    console.log('='.repeat(60));
    
    // Extract section from English
    const sectionData = extractSection(enData, sectionName);
    
    if (!sectionData) {
      console.error(`❌ Section "${sectionName}" not found in en.json`);
      continue;
    }
    
    // Show cost estimate
    const cost = estimateCost(sectionData, LANGUAGES.length);
    console.log(`\n📊 Cost Estimate:`);
    console.log(`   Characters: ${cost.characters.toLocaleString()}`);
    console.log(`   Tokens (est): ${cost.tokensEstimate.toLocaleString()}`);
    console.log(`   Languages: ${cost.languageCount}`);
    console.log(`   Total tokens: ${cost.totalTokens.toLocaleString()}`);
    console.log(`   Estimated cost: $${cost.estimatedCost}`);
    
    if (estimateOnly) {
      console.log(`\n💡 Run without --estimate to execute translation`);
      continue;
    }
    
    // Translate to all languages
    console.log(`\n🚀 Translating to ${LANGUAGES.length} languages...\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const lang of LANGUAGES) {
      try {
        process.stdout.write(`   Translating ${lang.nativeName} (${lang.code})... `);
        
        const translated = await translateSection(sectionName, sectionData, lang);
        
        // Load existing language file
        const langPath = path.join(MESSAGES_DIR, `${lang.code}.json`);
        const langData = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
        
        // Update section in language file
        setSection(langData, sectionName, translated);
        
        // Write back to file
        fs.writeFileSync(langPath, JSON.stringify(langData, null, 2) + '\n', 'utf-8');
        
        console.log('✅');
        successCount++;
        
        // Rate limiting (avoid API throttling)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`❌ ${error.message}`);
        failCount++;
      }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Success: ${successCount}/${LANGUAGES.length}`);
    if (failCount > 0) {
      console.log(`❌ Failed: ${failCount}/${LANGUAGES.length}`);
    }
    console.log('='.repeat(60));
  }
  
  console.log(`\n✨ Translation complete!`);
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
