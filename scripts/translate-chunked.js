#!/usr/bin/env node

/**
 * Chunked AI Translation for BAPI Headless
 * 
 * Translates large JSON files by processing each top-level key separately
 * Works with Claude Haiku (4096 token limit)
 */

const Anthropic = require('../web/node_modules/@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const LANGUAGES = {
  de: 'German (Deutsch) - Professional B2B tone',
  fr: 'French (Français) - Professional B2B tone',
  es: 'Spanish (Español) - Professional B2B tone',
  ja: 'Japanese (日本語) - Formal keigo style for B2B',
  zh: 'Chinese Simplified (中文) - Professional business tone',
  vi: 'Vietnamese (Tiếng Việt) - Professional business tone - URGENT',
  ar: 'Arabic (العربية) - Professional business tone - RTL layout',
  th: 'Thai (ไทย) - Professional business tone',
  pl: 'Polish (Polski) - Professional business tone'
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function translateChunk(chunkData, targetLang, chunkName) {
  const prompt = `Translate this JSON to ${LANGUAGES[targetLang]}.

CRITICAL - DO NOT TRANSLATE:
- BAPI, WAM™, Blu-Test, BAPI-Box
- NIST, ISO 9001:2015, BACnet
- °C, °F, PSI, bar, RH%, PPM
- CO₂, VOC, PM2.5, PM10
- Placeholders: {year}, {count}, etc.

Professional B2B tone for engineers. Return ONLY valid JSON:

${JSON.stringify(chunkData, null, 2)}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4096,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  });

  let text = message.content[0].text.replace(/``json\n?/g, '').replace(/```\n?/g, '');
  return JSON.parse(text);
}

async function translateFile(targetLang) {
  console.log(`\n🌐 Translating to ${targetLang.toUpperCase()}...`);
  
  const sourcePath = path.join(__dirname, 'en.json');
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  
  const result = {};
  const keys = Object.keys(source);
  let totalCost = 0;
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    process.stdout.write(`   ${i + 1}/${keys.length} ${key}...`);
    
    try {
      const translated = await translateChunk(source[key], targetLang, key);
      result[key] = translated;
      console.log(' ✅');
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(` ❌ ${error.message}`);
      result[key] = source[key]; // Fallback to English
    }
  }
  
  const outputPath = path.join(__dirname, `${targetLang}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  
  console.log(`✅ ${targetLang}.json complete!`);
  return true;
}

async function translateAll() {
  console.log('🌍 Translating all 8 languages (chunked mode)...\n');
  
  for (const lang of Object.keys(LANGUAGES)) {
    await translateFile(lang);
  }
  
  console.log('\n🎉 All translations complete!');
}

// Main
const targetLang = process.argv[2];

if (!targetLang) {
  console.log('Usage: node translate-chunked.js <language>');
  console.log('\nAvailable: ' + Object.keys(LANGUAGES).join(', '));
  console.log('Example: node translate-chunked.js vi');
  console.log('         node translate-chunked.js all');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not set');
  process.exit(1);
}

if (targetLang === 'all') {
  translateAll();
} else if (LANGUAGES[targetLang]) {
  translateFile(targetLang);
} else {
  console.error(`❌ Invalid language: ${targetLang}`);
  process.exit(1);
}
