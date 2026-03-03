#!/usr/bin/env node

/**
 * Translate account pages section from en.json to all languages
 * Uses Claude API (Haiku model) for cost-effective translations
 * 
 * Translates: dashboard, profile, orders, favorites, quotes, settings
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
 * Translates a specific account subsection for a specific language
 * @param {string} section - The subsection name (e.g., 'dashboard', 'profile')
 * @param {object} sectionData - The JSON data to translate
 * @param {string} targetLang - Target language code (e.g., 'de', 'fr')
 * @param {string} targetLangName - Target language name (e.g., 'German', 'French')
 * @returns {Promise<object|null>} - Translated section or null on error
 */
async function translateAccountSubsection(section, sectionData, targetLang, targetLangName) {
  const sectionJson = JSON.stringify(sectionData, null, 2);
  const prompt = `Translate this JSON object from English to ${targetLangName}. 
This is the "${section}" section of an account dashboard in a B2B e-commerce platform.

Preserve all JSON structure, keys, and formatting. Only translate the string values.
Keep these in English:
- Technical terms (2FA, NIST, ISO)
- Product names
- Status codes (pending, processing, completed, etc.)
- User-facing text should be translated naturally

${sectionJson}

Return ONLY the translated JSON object, no explanations.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096, // Haiku's maximum
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
      console.error(`   ❌ No valid JSON found in Claude response for ${section}`);
      return null;
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`   ❌ Error translating ${section}:`, error.message);
    return null;
  }
}

/**
 * Translates the account section for a specific language
 * @param {string} targetLang - Target language code (e.g., 'de', 'fr')
 * @param {string} targetLangName - Target language name (e.g., 'German', 'French')
 * @returns {Promise<void>}
 */
async function translateAccountSection(targetLang, targetLangName) {
  const enJsonPath = path.join(__dirname, '../messages/en.json');
  const targetJsonPath = path.join(__dirname, `../messages/${targetLang}.json`);

  console.log(`\n🔄 Translating account pages for ${targetLangName} (${targetLang})...`);

  // Read source and target files
  const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
  const targetData = JSON.parse(fs.readFileSync(targetJsonPath, 'utf8'));

  if (!enData.account) {
    console.error('❌ No account section found in en.json');
    return;
  }

  // Initialize account section if it doesn't exist
  if (!targetData.account) {
    targetData.account = {};
  }

  // Translate each subsection separately (to stay within token limits)
  const subsections = ['dashboard', 'profile', 'orders', 'favorites', 'quotes', 'settings'];
  
  for (const subsection of subsections) {
    if (!enData.account[subsection]) {
      console.log(`   ⚠️  Subsection "${subsection}" not found, skipping...`);
      continue;
    }

    console.log(`   📄 Translating ${subsection}...`);
    const translated = await translateAccountSubsection(
      subsection,
      enData.account[subsection],
      targetLang,
      targetLangName
    );

    if (translated) {
      targetData.account[subsection] = translated;
      console.log(`   ✅ ${subsection} translated successfully`);
    } else {
      console.log(`   ⚠️  ${subsection} translation failed, keeping English fallback`);
      targetData.account[subsection] = enData.account[subsection];
    }

    // Rate limiting between subsections
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Write updated file
  fs.writeFileSync(targetJsonPath, JSON.stringify(targetData, null, 2) + '\n', 'utf8');

  console.log(`✅ Account pages for ${targetLangName} completed!`);
}

/**
 * Main execution - translates account pages for all languages
 */
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required');
    console.error('💡 Set it in your .env file or export it:');
    console.error('   export ANTHROPIC_API_KEY=your_key_here');
    process.exit(1);
  }

  console.log('🚀 Starting account pages translation for all languages...');
  console.log('📝 Sections: dashboard, profile, orders, favorites, quotes, settings');
  console.log('🌍 Languages: English → German, French, Spanish, Japanese, Chinese, Vietnamese, Arabic, Thai, Polish, Hindi\n');

  for (const lang of languages) {
    await translateAccountSection(lang.code, lang.name);
    // Rate limiting: wait 1 second between API calls
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\n✨ All account pages translations completed!');
  console.log('💡 Next step: Test in browser (http://localhost:3000/de/account, /es/account, etc.)\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
