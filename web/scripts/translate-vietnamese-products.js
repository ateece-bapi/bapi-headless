#!/usr/bin/env node

/**
 * Translate megaMenu.products section to Vietnamese
 * Single language translation script for Vietnamese locale
 * 
 * @requires ANTHROPIC_API_KEY environment variable
 * Cost: ~$0.15-0.30 for Vietnamese (Claude Haiku model)
 */

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules don't have __dirname, so create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Get the source products data from en.json to ensure we always translate
 * the current canonical version instead of hardcoded text that can drift.
 * 
 * @returns {Object} The megaMenu.products section from en.json
 * @throws {Error} If megaMenu.products not found in en.json
 */
function getSourceProducts() {
  const enPath = path.join(__dirname, '..', 'messages', 'en.json');
  const enContent = fs.readFileSync(enPath, 'utf-8');
  const enData = JSON.parse(enContent);
  
  if (!enData.megaMenu?.products) {
    throw new Error('megaMenu.products not found in en.json');
  }
  
  return enData.megaMenu.products;
}

/**
 * Translates the products section to Vietnamese using Claude API
 * 
 * @param {Object} sourceProducts - English products data to translate
 * @returns {Promise<Object>} Translated products object in Vietnamese
 * @throws {Error} If translation or validation fails
 */
async function translateToVietnamese(sourceProducts) {
  console.log('\n🇻🇳 Translating megaMenu.products to Vietnamese (vi)...');

  try {
    const message = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `Translate this JSON object to Vietnamese for a building automation e-commerce website.

**CRITICAL RULES:**
1. Keep ALL JSON keys in English (e.g., "label", "temperature", "roomWallSensors")
2. Only translate the STRING VALUES (text after the colon)
3. Preserve all punctuation, special characters, and formatting
4. Keep brand names like "WAM™", "Blu-Test", "BAPI-Box", "NIST" unchanged
5. Maintain technical accuracy for HVAC and building automation terms
6. Keep "CO₂" subscript formatting exact
7. Use formal Vietnamese suitable for technical/business context
8. Do not add or remove any keys
9. Output ONLY valid JSON, no explanations or markdown

JSON to translate:

${JSON.stringify(sourceProducts, null, 2)}`,
        },
      ],
    });

    let translatedText = message.content[0].text;

    // Remove markdown code blocks if present
    translatedText = translatedText.replace(/^```json\s*\n?/gm, '');
    translatedText = translatedText.replace(/^```\s*\n?/gm, '');
    translatedText = translatedText.trim();

    // Parse to validate JSON
    const translatedObj = JSON.parse(translatedText);

    console.log('✅ Vietnamese translation complete and validated!');

    // Save to output file for review
    const outputPath = path.join(__dirname, 'products-translated-vi.json');
    fs.writeFileSync(outputPath, JSON.stringify(translatedObj, null, 2), 'utf-8');
    console.log(`📝 Saved to: ${outputPath}`);

    return translatedObj;
  } catch (error) {
    console.error('❌ Vietnamese translation failed:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response, null, 2));
    }
    throw error;
  }
}

/**
 * Updates vi.json with the translated products section
 * 
 * @param {Object} translatedProducts - Translated products object
 * @throws {Error} If file update fails
 */
async function updateVietnameseFile(translatedProducts) {
  const filePath = path.join(__dirname, '..', 'messages', 'vi.json');
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Add products section to megaMenu
    if (!data.megaMenu) {
      data.megaMenu = {};
    }
    data.megaMenu.products = translatedProducts;

    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log('✅ Updated vi.json with products section');
  } catch (error) {
    console.error('❌ Failed to update vi.json:', error.message);
    throw error;
  }
}

/**
 * Main execution - translates products section to Vietnamese
 */
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('🌏 Starting Vietnamese translation for megaMenu.products...\n');

  try {
    // Read source products from en.json to ensure consistency
    const sourceProducts = getSourceProducts();
    console.log('✅ Loaded source products from en.json\n');

    // Translate to Vietnamese
    const translated = await translateToVietnamese(sourceProducts);
    
    // Update vi.json file
    await updateVietnameseFile(translated);

    console.log('\n✅ Vietnamese translation complete!');
    console.log('\nℹ️  Next steps:');
    console.log('  1. Review messages/vi.json for accuracy');
    console.log('  2. Test Vietnamese locale in the UI');
    console.log('  3. Commit and push the changes');
  } catch (error) {
    console.error('\n❌ Translation failed');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});