/**
 * Sync News Translation Keys
 * 
 * Translates new news.* keys added to en.json for PR feedback fixes:
 * - news.dateUnavailable
 * - news.readMore
 * - news.readMoreAriaLabel
 * 
 * Only translates missing keys, preserves existing translations.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Languages to translate (all except English)
const LANGUAGES = [
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'th', name: 'Thai' },
  { code: 'pl', name: 'Polish' },
  { code: 'hi', name: 'Hindi' },
];

// Source text from en.json
const SOURCE_KEYS = {
  dateUnavailable: 'Date unavailable',
  readMore: 'Read More',
  readMoreAriaLabel: 'Read more about {title}',
};

async function translateNewsKeys(languageCode, languageName) {
  console.log(`\n🌍 Translating news keys to ${languageName}...`);

  const prompt = `Translate these news-related UI strings to ${languageName}. Maintain a professional B2B tone suitable for building automation industry.

IMPORTANT: Keep {title} placeholder EXACTLY as-is (do not translate).

Source (English):
- dateUnavailable: "${SOURCE_KEYS.dateUnavailable}"
- readMore: "${SOURCE_KEYS.readMore}"
- readMoreAriaLabel: "${SOURCE_KEYS.readMoreAriaLabel}"

Provide ONLY the translations in this JSON format (no markdown, no code blocks):
{
  "dateUnavailable": "...",
  "readMore": "...",
  "readMoreAriaLabel": "..."
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0].text.trim();
    
    // Clean up markdown code blocks if present
    const jsonStr = content.replace(/^```(?:json)?\n?/gm, '').replace(/\n?```$/gm, '').trim();
    
    const translations = JSON.parse(jsonStr);
    console.log(`✅ Translated ${languageName}`);
    return translations;
  } catch (error) {
    console.error(`❌ Error translating ${languageName}:`, error.message);
    throw error;
  }
}

async function updateLanguageFile(languageCode, translations) {
  const filePath = path.join(__dirname, '..', 'messages', `${languageCode}.json`);
  
  // Read existing file
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContent);
  
  // Check if news section exists
  if (!data.news) {
    console.error(`❌ ${languageCode}.json missing news section!`);
    return;
  }
  
  // Add new keys (only if they don't exist)
  let updated = false;
  if (!data.news.dateUnavailable) {
    data.news.dateUnavailable = translations.dateUnavailable;
    updated = true;
  }
  if (!data.news.readMore) {
    data.news.readMore = translations.readMore;
    updated = true;
  }
  if (!data.news.readMoreAriaLabel) {
    data.news.readMoreAriaLabel = translations.readMoreAriaLabel;
    updated = true;
  }
  
  if (updated) {
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`✅ Updated ${languageCode}.json`);
  } else {
    console.log(`⏭️  ${languageCode}.json already has all keys`);
  }
}

async function main() {
  console.log('🚀 Starting news translation sync...');
  console.log(`📝 Keys to translate: dateUnavailable, readMore, readMoreAriaLabel`);
  
  for (const lang of LANGUAGES) {
    try {
      const translations = await translateNewsKeys(lang.code, lang.name);
      await updateLanguageFile(lang.code, translations);
      
      // Rate limiting (1 second between API calls)
      if (LANGUAGES.indexOf(lang) < LANGUAGES.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to process ${lang.name}, continuing with next language...`);
      continue;
    }
  }
  
  console.log('\n✅ News translation sync complete!');
}

main();
