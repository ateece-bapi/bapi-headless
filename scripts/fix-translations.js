#!/usr/bin/env node

/**
 * Fix missing translations - retry failed sections
 */

const Anthropic = require('../web/node_modules/@anthropic-ai/sdk');
const fs = require('fs');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function translateSection(lang, section, data) {
  const langNames = {
    fr: 'French (Français)',
    ja: 'Japanese (日本語)'
  };
  
  const prompt = `Translate to ${langNames[lang]}. Professional B2B tone.

DO NOT TRANSLATE: BAPI, WAM™, BACnet, CO₂, VOC, °C, °F, PSI, bar, RH%, PM2.5, ISO 9001:2015

CRITICAL: Return ONLY the JSON object, no explanations, no "Voici...", no "以下は...", no markdown.

${JSON.stringify(data, null, 2)}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4096,
    temperature: 0.1,
    messages: [{ 
      role: 'user', 
      content: prompt 
    }],
  });

  let text = message.content[0].text.trim();
  
  // Remove any explanatory text before JSON
  const jsonStart = text.indexOf('{');
  if (jsonStart > 0) {
    text = text.substring(jsonStart);
  }
  
  // Remove markdown
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  return JSON.parse(text);
}

async function fixLanguage(lang, missingSections) {
  console.log(`\n🔧 Fixing ${lang.toUpperCase()}...`);
  
  const enData = JSON.parse(fs.readFileSync('en.json', 'utf8'));
  const targetData = JSON.parse(fs.readFileSync(`${lang}.json`, 'utf8'));
  
  for (const section of missingSections) {
    process.stdout.write(`   ${section}...`);
    try {
      const translated = await translateSection(lang, section, enData[section]);
      targetData[section] = translated;
      console.log(' ✅');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch(e) {
      console.log(` ❌ ${e.message}`);
    }
  }
  
  fs.writeFileSync(`${lang}.json`, JSON.stringify(targetData, null, 2) + '\n');
  console.log(`✅ ${lang}.json fixed!`);
}

async function main() {
  await fixLanguage('fr', ['nav', 'megaMenu', 'products', 'home', 'footer', 'region', 'checkout']);
  await fixLanguage('ja', ['megaMenu', 'products', 'home', 'footer']);
  console.log('\n🎉 All fixes complete!');
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not set');
  process.exit(1);
}

main();
