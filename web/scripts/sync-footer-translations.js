#!/usr/bin/env node
/**
 * Sync Footer Translations
 * Translates the footer section from English to other languages using Claude Haiku API
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

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

async function translateFooterSection(targetLang, targetLangName) {
  const enJsonPath = path.join(__dirname, '../messages/en.json');
  const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
  
  const footerSection = enData.footer;

  const prompt = `Translate this JSON structure from English to ${targetLangName}.
Preserve all JSON keys exactly as they are. Only translate the values.
Maintain the same structure and formatting.
Keep proper nouns like "BAPI", "Building Automation Products, Inc.", "BACnet", "ISO", "UL", "USA" untranslated.
Keep the address "750 N Royal Ave, Gays Mills, WI 54631" untranslated.
Keep phone number "(608) 735-4800" and email "sales@bapihvac.com" untranslated.
Keep "{year}" placeholder in copyright text exactly as is.

English JSON:
${JSON.stringify(footerSection, null, 2)}

Return ONLY the translated JSON, nothing else.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
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

async function updateLanguageFile(langCode, translatedFooter) {
  const filePath = path.join(__dirname, `../messages/${langCode}.json`);
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Update only the footer section
  existingData.footer = translatedFooter;
  
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2) + '\n');
  console.log(`✅ Updated ${langCode}.json`);
}

async function main() {
  console.log('🚀 Starting footer translation...\n');
  
  const failedLanguages = [];
  
  for (const lang of languages) {
    console.log(`📝 Translating to ${lang.name} (${lang.code})...`);
    try {
      const translatedFooter = await translateFooterSection(lang.code, lang.name);
      await updateLanguageFile(lang.code, translatedFooter);
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to translate ${lang.name}:`, error.message);
      failedLanguages.push(lang.name);
    }
  }
  
  console.log('\n✨ Translation process completed!');
  if (failedLanguages.length > 0) {
    console.log(`⚠️  Failed languages: ${failedLanguages.join(', ')}`);
    console.log('💡 Tip: Re-run the script to retry failed languages');
  }
  console.log('💰 Estimated cost: ~$0.50-1.00 (9 languages × footer JSON)');
}

main().catch(console.error);
