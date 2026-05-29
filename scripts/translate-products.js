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

const LANGUAGES = {
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  ja: 'Japanese',
  zh: 'Chinese (Simplified)',
  vi: 'Vietnamese',
  ar: 'Arabic',
  th: 'Thai',
  pl: 'Polish',
  hi: 'Hindi',
};

// Read English source
const enPath = path.join(__dirname, '../web/messages/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const productsSection = enData.wirelessLandingPage.products;

async function translateProducts(targetLang, targetLangName) {
  console.log(`\nTranslating products section to ${targetLangName}...`);

  const prompt = `Translate this wireless sensor products JSON to ${targetLangName}.

CRITICAL RULES:
1. Keep ALL keys in English (outsideAir, quantum, duct, quantumSlim, immersion, thermobuffer)
2. Keep ALL property names in English (name, feature1, feature2, feature3)
3. Only translate the string VALUES
4. Preserve ALL technical terms: "Temperature", "Humidity", "IP66", "BAPI-Stat Quantum", "BAPI-Stat Quantum Slim"
5. Keep measurements EXACTLY as is: "4 to 18\"", "2-8\"", "2 or 4 attached chamber"
6. Keep quotes/escaping: "4 to 18\\"" stays as "4 to 18\\""
7. Return ONLY valid JSON with no markdown, no explanations

Source (English):
${JSON.stringify(productsSection, null, 2)}

Return the translated JSON now:`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const translatedText = message.content[0].text.trim();
  
  // Remove markdown code blocks if present
  let cleanJson = translatedText;
  if (translatedText.startsWith('```')) {
    cleanJson = translatedText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '').trim();
  }

  try {
    const translated = JSON.parse(cleanJson);
    return translated;
  } catch (error) {
    console.error(`Failed to parse JSON for ${targetLang}:`, error);
    console.error('Raw response:', translatedText);
    throw error;
  }
}

async function main() {
  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    try {
      const translated = await translateProducts(langCode, langName);
      
      // Read target file
      const targetPath = path.join(__dirname, `../web/messages/${langCode}.json`);
      const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
      
      // Update products section
      targetData.wirelessLandingPage.products = translated;
      
      // Write back
      fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2) + '\n');
      
      console.log(`✅ ${langName} complete`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed for ${langName}:`, error.message);
    }
  }
  
  console.log('\n✅ All translations complete!');
}

main().catch(console.error);
