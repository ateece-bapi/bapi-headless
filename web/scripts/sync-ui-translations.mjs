#!/usr/bin/env node

/**
 * Translate UI section (language change toast) from en.json to all languages
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
  { code: 'hi', name: 'Hindi' },
];

/**
 * Translates the UI section for a specific language
 * @param {string} targetLang - Target language code (e.g., 'de', 'fr')
 * @param {string} targetLangName - Target language name (e.g., 'German', 'French')
 * @returns {Promise<void>}
 */
async function translateUiSection(targetLang, targetLangName) {
  const enJsonPath = path.join(__dirname, '../messages/en.json');
  const targetJsonPath = path.join(__dirname, `../messages/${targetLang}.json`);

  console.log(`\n🔄 Translating UI section for ${targetLangName} (${targetLang})...`);

  // Read source and target files
  const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
  const targetData = JSON.parse(fs.readFileSync(targetJsonPath, 'utf8'));

  if (!enData.ui) {
    console.error('❌ No UI section found in en.json');
    return;
  }

  // Prepare translation prompt
  const uiJson = JSON.stringify(enData.ui, null, 2);
  const prompt = `Translate this JSON object from English to ${targetLangName}. 
This is for UI notifications in a B2B e-commerce platform.

The {language} placeholder should be preserved as-is (it's a variable that will be replaced at runtime).

Preserve all JSON structure, keys, and formatting. Only translate the string values.
Keep the {language} placeholder exactly as-is: {language}

User-facing text should be translated naturally and professionally.

${uiJson}

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

    const translatedUi = JSON.parse(jsonMatch[0]);

    // Update target file
    targetData.ui = translatedUi;
    fs.writeFileSync(targetJsonPath, JSON.stringify(targetData, null, 2) + '\n', 'utf8');

    console.log(`✅ Successfully translated UI section for ${targetLangName}`);
  } catch (error) {
    console.error(`❌ Error translating ${targetLang}:`, error.message);
  }
}

/**
 * Main execution - translates UI section for all languages
 */
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required');
    console.error('💡 Set it in your .env file or export it:');
    console.error('   export ANTHROPIC_API_KEY=your_key_here');
    process.exit(1);
  }

  console.log('🚀 Starting UI section translation for all languages...');
  console.log('📝 Section: Language change toast notification');
  console.log('🌍 Languages: English → German, French, Spanish, Japanese, Chinese, Vietnamese, Arabic, Thai, Polish, Hindi\n');

  for (const lang of languages) {
    await translateUiSection(lang.code, lang.name);
    // Rate limiting: wait 1 second between API calls
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\n✨ All UI translations completed!');
  console.log('💡 Next step: Test language switching in browser and verify toast shows in new language\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
