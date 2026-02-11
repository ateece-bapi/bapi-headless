#!/usr/bin/env node

/**
 * Translate homepage section from en.json to all 9 languages
 * Uses Claude API (Haiku model) for cost-effective translations
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

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

async function translateHomeSection(targetLang, targetLangName) {
  const enJsonPath = path.join(__dirname, '../messages/en.json');
  const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
  
  const homeSection = enData.home;

  const prompt = `Translate this JSON structure from English to ${targetLangName}.
Preserve all JSON keys exactly as they are. Only translate the values.
Maintain the same structure and formatting.

English JSON:
${JSON.stringify(homeSection, null, 2)}

Return ONLY the translated JSON, nothing else.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    let translatedText = message.content[0].text.trim();
    
    // Remove markdown code blocks if present
    translatedText = translatedText.replace(/^```json\s*\n?/gm, '');
    translatedText = translatedText.replace(/^```\s*\n?/gm, '');
    translatedText = translatedText.trim();

    return JSON.parse(translatedText);
  } catch (error) {
    console.error(`Error translating to ${targetLangName}:`, error.message);
    throw error;
  }
}

async function updateLanguageFile(langCode, translatedHome) {
  const filePath = path.join(__dirname, `../messages/${langCode}.json`);
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Add or update home section
  existingData.home = translatedHome;
  
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2) + '\n');
  console.log(`✅ Updated ${langCode}.json`);
}

async function main() {
  console.log('🚀 Starting homepage translation...\n');
  
  for (const lang of languages) {
    console.log(`📝 Translating to ${lang.name} (${lang.code})...`);
    const translatedHome = await translateHomeSection(lang.code, lang.name);
    await updateLanguageFile(lang.code, translatedHome);
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✨ All translations completed!');
  console.log('💰 Estimated cost: ~$0.50-1.00 (9 languages × small JSON)');
}

main().catch(console.error);
