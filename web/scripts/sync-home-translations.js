#!/usr/bin/env node

/**
 * Translate homepage section from en.json to all 9 languages
 * Uses Claude API (Haiku model) for cost-effective translations
 * 
 * @requires ANTHROPIC_API_KEY environment variable
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

// ES modules don't have __dirname, so create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const languages = [
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'th', name: 'Thai' },
  { code: 'pl', name: 'Polish' },
];

/**
 * Translates the homepage section for a specific language
 * @param {string} targetLang - Target language code (e.g., 'de', 'fr')
 * @param {string} targetLangName - Target language name (e.g., 'German', 'French')
 * @returns {Promise<void>}
 */
async function translateHomeSection(targetLang, targetLangName) {
  const enJsonPath = path.join(__dirname, '../messages/en.json');
  const targetJsonPath = path.join(__dirname, `../messages/${targetLang}.json`);

  console.log(`\n🔄 Translating homepage for ${targetLangName} (${targetLang})...`);

  // Read source and target files
  const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
  const targetData = JSON.parse(fs.readFileSync(targetJsonPath, 'utf8'));

  if (!enData.home) {
    console.error('❌ No home section found in en.json');
    return;
  }

  // Prepare translation prompt
  const homeJson = JSON.stringify(enData.home, null, 2);
  const prompt = `Translate this JSON object from English to ${targetLangName}. 
Preserve all JSON structure, keys, and formatting. Only translate the string values.
For technical terms (product names, units like "PSI", "CFM"), keep them in English.

${homeJson}

Return ONLY the translated JSON object, no explanations.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract JSON from response
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error(`❌ No valid JSON found in Claude response for ${targetLang}`);
      return;
    }

    const translatedHome = JSON.parse(jsonMatch[0]);

    // Update target file
    targetData.home = translatedHome;
    fs.writeFileSync(targetJsonPath, JSON.stringify(targetData, null, 2) + '\n', 'utf8');

    console.log(`✅ Successfully translated homepage for ${targetLangName}`);
  } catch (error) {
    console.error(`❌ Error translating ${targetLang}:`, error.message);
  }
}

/**
 * Main execution - translates homepage for all languages
 */
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('🚀 Starting homepage translation for all languages...\n');

  for (const lang of languages) {
    await translateHomeSection(lang.code, lang.name);
    // Rate limiting: wait 1 second between API calls
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\n✨ All translations completed!\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});