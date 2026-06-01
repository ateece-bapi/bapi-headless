#!/usr/bin/env node
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pl', name: 'Polish' },
  { code: 'th', name: 'Thai' },
  { code: 'hi', name: 'Hindi' },
];

async function translateWamSection(sourceText, targetLanguage) {
  console.log(`\n🔄 Translating to ${targetLanguage}...`);
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: `You are a professional translator specializing in technical and marketing content for building automation, asset monitoring, and IoT systems.

Translate the following JSON section from English to ${targetLanguage}. This is for a WAM™ (Wireless Asset Monitoring) product landing page.

CRITICAL RULES:
1. Maintain ALL JSON structure exactly - same keys, same nesting
2. Translate ONLY the string values, never the keys
3. Preserve all technical terms accurately:
   - Product names: keep "WAM™", "BAPI" as-is
   - Technical terms: keep "IoT", "BACnet", "Modbus" as-is
   - Units: convert appropriately (°F to °C for metric locales, etc.)
   - Technical specs: maintain accuracy
4. Keep marketing tone professional but accessible
5. Preserve special characters and trademark symbols (™, ®)
6. Empty strings ("") should remain empty
7. Maintain industry-specific terminology for each vertical (restaurants, healthcare, greenhouses, etc.)
8. Return ONLY the translated JSON, no explanations

English source:
${sourceText}`,
      },
    ],
  });

  const translatedText = message.content[0].text;
  
  // Extract JSON from response (handle markdown code blocks)
  let jsonText = translatedText.trim();
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```json?\n?/, '').replace(/\n?```$/, '');
  }
  
  return JSON.parse(jsonText);
}

async function main() {
  console.log('🌍 Starting WAM landing page translation...\n');
  
  // Read English source
  const enPath = path.join(__dirname, '../web/messages/en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const wamSection = enData.wamLandingPage;
  const sourceText = JSON.stringify(wamSection, null, 2);
  
  console.log(`📝 Source section size: ${sourceText.length} characters`);
  console.log(`🎯 Translating to ${languages.length} languages\n`);
  
  // Translate to each language
  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    try {
      const translatedSection = await translateWamSection(sourceText, lang.name);
      
      // Read target language file
      const targetPath = path.join(__dirname, `../web/messages/${lang.code}.json`);
      const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
      
      // Update WAM section
      targetData.wamLandingPage = translatedSection;
      
      // Write back
      fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2) + '\n');
      
      console.log(`✅ ${lang.name} (${lang.code}) - Complete`);
      
      // Rate limiting - wait 1 second between requests (skip after last language)
      if (i < languages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Error translating to ${lang.name}:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('\n✨ All translations complete!');
  console.log('\n📋 Summary:');
  console.log(`   - English source: ${enPath}`);
  console.log(`   - Translated: ${languages.map(l => l.code).join(', ')}`);
  console.log(`   - Total languages: ${languages.length + 1} (including English)`);
}

main().catch(console.error);
