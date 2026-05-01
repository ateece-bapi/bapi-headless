#!/usr/bin/env node
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const messagesDir = path.join(__dirname, '../messages');

const MODEL = 'claude-sonnet-4-20250514';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ar', name: 'العربية' },
  { code: 'th', name: 'ไทย' },
  { code: 'pl', name: 'Polski' },
  { code: 'hi', name: 'हिन्दी' },
];

// Keys to translate (from megaMenu.products.airQuality section)
const AIR_QUALITY_KEYS = {
  nitrogenDioxide: "Nitrogen Dioxide",
  nitrogenDioxideDesc: "NO₂ gas detection",
  carbonMonoxide: "Carbon Monoxide",
  carbonMonoxideDesc: "CO gas detection",
  refrigerantLeak: "Refrigerant Leak Detection",
  refrigerantLeakDesc: "Refrigerant leak sensors"
};

async function translateKeys(targetLanguage, languageName) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `Translate these Air Quality sensor subcategory names and descriptions from English to ${languageName}.

Maintain technical accuracy and preserve special characters like ₂ (subscript 2) in chemical formulas.

English JSON:
${JSON.stringify(AIR_QUALITY_KEYS, null, 2)}

Return ONLY valid JSON with the same keys but translated values. No markdown, no explanations, just the JSON object.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const responseText = message.content[0].text.trim();
  
  // Remove markdown code blocks if present
  const jsonText = responseText
    .replace(/^```json\s*/m, '')
    .replace(/^```\s*/m, '')
    .replace(/```$/m, '')
    .trim();

  return JSON.parse(jsonText);
}

async function updateLocaleFile(languageCode, translatedKeys) {
  const filePath = path.join(messagesDir, `${languageCode}.json`);
  const content = await fs.readFile(filePath, 'utf-8');
  const json = JSON.parse(content);

  // Insert into megaMenu.products.airQuality section
  if (!json.megaMenu) json.megaMenu = {};
  if (!json.megaMenu.products) json.megaMenu.products = {};
  if (!json.megaMenu.products.airQuality) json.megaMenu.products.airQuality = {};

  // Add the new keys
  Object.assign(json.megaMenu.products.airQuality, translatedKeys);

  // Write back with proper formatting
  await fs.writeFile(filePath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
}

async function main() {
  console.log('🌐 Translating Air Quality subcategory keys...\n');
  
  let successCount = 0;
  const errors = [];

  for (const lang of LANGUAGES) {
    try {
      process.stdout.write(`   Translating ${lang.name} (${lang.code})... `);
      
      const translated = await translateKeys(lang.code, lang.name);
      await updateLocaleFile(lang.code, translated);
      
      console.log('✅');
      successCount++;
    } catch (error) {
      console.log('❌');
      errors.push({ language: lang.name, error: error.message });
    }
  }

  console.log('\n' + '='.repeat(60));
  if (successCount === LANGUAGES.length) {
    console.log(`✅ Success: ${successCount}/${LANGUAGES.length}`);
  } else {
    console.log(`⚠️  Partial: ${successCount}/${LANGUAGES.length}`);
    console.log('\nErrors:');
    errors.forEach(({ language, error }) => {
      console.log(`  - ${language}: ${error}`);
    });
  }
  console.log('='.repeat(60));
}

main().catch(console.error);
