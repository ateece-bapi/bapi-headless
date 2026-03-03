#!/usr/bin/env node

/**
 * Translate auth section (sign-in page) from en.json to all languages
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
 * Translates the auth section for a specific language
 * @param {string} targetLang - Target language code (e.g., 'de', 'fr')
 * @param {string} targetLangName - Target language name (e.g., 'German', 'French')
 * @returns {Promise<void>}
 */
async function translateAuthSection(targetLang, targetLangName) {
  const enJsonPath = path.join(__dirname, '../messages/en.json');
  const targetJsonPath = path.join(__dirname, `../messages/${targetLang}.json`);

  console.log(`\n🔄 Translating auth section for ${targetLangName} (${targetLang})...`);

  // Read source and target files
  const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
  const targetData = JSON.parse(fs.readFileSync(targetJsonPath, 'utf8'));

  if (!enData.auth) {
    console.error('❌ No auth section found in en.json');
    return;
  }

  // Prepare translation prompt
  const authJson = JSON.stringify(enData.auth, null, 2);
  const prompt = `Translate this JSON object from English to ${targetLangName}. 
This is for a sign-in/authentication page in a B2B e-commerce platform.

Preserve all JSON structure, keys, and formatting. Only translate the string values.
Keep these technical terms in English:
- 2FA (Two-Factor Authentication)
- WordPress

User-facing text should be translated naturally and professionally.

${authJson}

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

    const translatedAuth = JSON.parse(jsonMatch[0]);

    // Update target file
    targetData.auth = translatedAuth;
    fs.writeFileSync(targetJsonPath, JSON.stringify(targetData, null, 2) + '\n', 'utf8');

    console.log(`✅ Successfully translated auth section for ${targetLangName}`);
  } catch (error) {
    console.error(`❌ Error translating ${targetLang}:`, error.message);
  }
}

/**
 * Main execution - translates auth section for all languages
 */
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required');
    console.error('💡 Set it in your .env file or export it:');
    console.error('   export ANTHROPIC_API_KEY=your_key_here');
    process.exit(1);
  }

  console.log('🚀 Starting auth section translation for all languages...');
  console.log('📝 Section: Sign-in page (form, errors, security notices)');
  console.log('🌍 Languages: English → German, French, Spanish, Japanese, Chinese, Vietnamese, Arabic, Thai, Polish, Hindi\n');

  for (const lang of languages) {
    await translateAuthSection(lang.code, lang.name);
    // Rate limiting: wait 1 second between API calls
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\n✨ All auth translations completed!');
  console.log('💡 Next step: Test sign-in page in browser (http://localhost:3000/de/sign-in, /es/sign-in, etc.)\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
