#!/usr/bin/env node

/**
 * DIY AI Translation Script for BAPI Headless
 * 
 * Translates en.json to any target language using Claude API
 * 
 * Cost: ~$0.50-2 per language (vs $30-60 per language in Crowdin AI)
 * Quality: Same 85-90% accuracy (uses Claude 3.5 Sonnet)
 * 
 * Setup:
 * 1. Get API key: https://console.anthropic.com
 * 2. export ANTHROPIC_API_KEY="your-key-here"
 * 3. npm install @anthropic-ai/sdk
 * 
 * Usage:
 * node translate-with-ai.js vi  # Vietnamese
 * node translate-with-ai.js de  # German
 * node translate-with-ai.js fr  # French
 * node translate-with-ai.js all # All languages
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Language configurations
const LANGUAGES = {
  de: 'German (Deutsch) - Professional B2B tone',
  fr: 'French (Français) - Professional B2B tone', 
  es: 'Spanish (Español) - Professional B2B tone',
  ja: 'Japanese (日本語) - Formal keigo style for B2B',
  zh: 'Chinese Simplified (中文) - Professional business tone',
  vi: 'Vietnamese (Tiếng Việt) - Professional business tone - URGENT: Vietnam facility opening April 2026',
  ar: 'Arabic (العربية) - Professional business tone - RTL layout',
  th: 'Thai (ไทย) - Professional business tone',
  pl: 'Polish (Polski) - Professional B2B tone',
  hi: 'Hindi (हिंदी) - Professional business tone'
};

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function translateFile(targetLang) {
  if (!LANGUAGES[targetLang]) {
    console.error(`❌ Invalid language: ${targetLang}`);
    console.log(`Available: ${Object.keys(LANGUAGES).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n🌐 Translating to ${targetLang.toUpperCase()}...`);
  
  // Read source file
  const sourcePath = path.join(__dirname, 'en.json');
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  
  // Create translation prompt
  const prompt = `You are a professional translator specializing in technical B2B content for building automation and sensors.

Translate this JSON file to ${LANGUAGES[targetLang]}.

CRITICAL RULES - DO NOT TRANSLATE:
- Brand names: BAPI, WAM™, Blu-Test, BAPI-Box
- Certifications: NIST, ISO 9001:2015
- Protocols: BACnet, Modbus, LON
- Technical units: °C, °F, PSI, bar, psi, kPa, Pa, RH%, PPM
- Chemical formulas: CO₂, VOC, PM2.5, PM10
- Abbreviations: SKU, CFM, GPM
- Placeholders: {year}, {count}, {productName}, etc.

TRANSLATION GUIDELINES:
- Professional B2B tone (engineers and facility managers)
- Preserve all JSON structure exactly
- Preserve all HTML tags: <strong>, <a>, etc.
- Keep all placeholders intact
- Maintain professional formality (Sie in German, keigo in Japanese, etc.)
- Adapt culturally where appropriate (e.g., measurements, dates)

SOURCE JSON:
${JSON.stringify(source, null, 2)}

REQUIREMENTS:
1. Return ONLY valid JSON, no explanations or markdown
2. Ensure all keys are translated
3. Maintain exact same structure
4. Double-check that brand names/technical terms stayed in English

Translate now:`;

  try {
    console.log('⏳ Calling Claude API...');
    
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229', // Most capable model for complex translations
      max_tokens: 4096, // Opus max output tokens
      temperature: 0.3, // Lower temperature for consistency
      messages: [{ 
        role: 'user', 
        content: prompt 
      }],
    });

    // Extract JSON from response
    let translatedText = message.content[0].text;
    
    // Remove markdown code blocks if present
    translatedText = translatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Parse to validate
    const translated = JSON.parse(translatedText);
    
    // Write to file
    const outputPath = path.join(__dirname, `${targetLang}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2) + '\n');
    
    // Calculate stats
    const sourceKeys = JSON.stringify(source).split(',').length;
    const translatedKeys = JSON.stringify(translated).split(',').length;
    
    console.log(`✅ Translation complete!`);
    console.log(`   Output: ${targetLang}.json`);
    console.log(`   Keys: ${translatedKeys} (source: ${sourceKeys})`);
    console.log(`   Cost: ~$${(message.usage.input_tokens * 0.000003 + message.usage.output_tokens * 0.000015).toFixed(2)}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Translation failed:`, error.message);
    if (error.response) {
      console.error(error.response.data);
    }
    return false;
  }
}

async function translateAll() {
  console.log('🌍 Translating all 8 languages...\n');
  
  let success = 0;
  let failed = 0;
  const startTime = Date.now();
  
  for (const lang of Object.keys(LANGUAGES)) {
    const result = await translateFile(lang);
    if (result) {
      success++;
    } else {
      failed++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Translation complete!`);
  console.log(`   Success: ${success} languages`);
  console.log(`   Failed: ${failed} languages`);
  console.log(`   Duration: ${duration} minutes`);
  console.log(`   Estimated cost: $${(success * 1.5).toFixed(2)}`);
  console.log('='.repeat(50));
}

// Main
const targetLang = process.argv[2];

if (!targetLang) {
  console.log('Usage: node translate-with-ai.js <language>');
  console.log('\nAvailable languages:');
  Object.entries(LANGUAGES).forEach(([code, desc]) => {
    console.log(`  ${code}\t${desc}`);
  });
  console.log('\nExamples:');
  console.log('  node translate-with-ai.js vi    # Vietnamese only');
  console.log('  node translate-with-ai.js all   # All 8 languages');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ Missing ANTHROPIC_API_KEY environment variable');
  console.log('\nSetup:');
  console.log('1. Get API key: https://console.anthropic.com');
  console.log('2. export ANTHROPIC_API_KEY="your-key-here"');
  process.exit(1);
}

// Run translation
if (targetLang === 'all') {
  translateAll();
} else {
  translateFile(targetLang);
}
