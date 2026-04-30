#!/usr/bin/env node

/**
 * Translate Company Pages section to all languages
 * Based on sync-home-translations.js (proven working pattern)
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('❌ Error: ANTHROPIC_API_KEY environment variable is not set');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// Target languages (excluding English source)
const LANGUAGES = [
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

async function translateSubSection(targetLang, subSectionName, subSectionData) {
  const subSectionJson = JSON.stringify(subSectionData, null, 2);
  
  const prompt = `You are a professional translator specializing in B2B industrial automation and building management systems.

Translate the following JSON from English to ${targetLang}.

IMPORTANT RULES:
1. Preserve ALL JSON structure, keys, and formatting EXACTLY
2. Translate ONLY the string values, NOT the keys
3. Keep {placeholders} unchanged (e.g., {year}, {count}, {email})
4. Keep technical terms unchanged: BAPI, BACnet, Modbus, IoT, IP65, UL, ISO, CO2, PM2.5
5. Keep brand names unchanged: WAM™, Blu-Test™
6. Maintain HTML entities if present (e.g., &copy;, &trade;)
7. For ICU MessageFormat syntax like "{count, plural, =1 {item} other {items}}", translate text but preserve syntax

${subSectionJson}

Return ONLY the translated JSON object, no explanations.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4096, // Haiku's maximum
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract JSON from response - SIMPLE PROVEN PATTERN
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/); // Greedy match: first { to last }
    
    if (!jsonMatch) {
      console.error(`❌ No valid JSON found in Claude response for ${targetLang} (${subSectionName})`);
      console.error('Response preview:', responseText.substring(0, 500));
      return null;
    }

    const translated = JSON.parse(jsonMatch[0]);
    return translated;

  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function main() {
  const messagesDir = path.join(__dirname, '..', 'messages');
  
  // Load English source
  const enJsonPath = path.join(messagesDir, 'en.json');
  const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf-8'));
  
  if (!enData.companyPages) {
    console.error('❌ companyPages section not found in en.json');
    process.exit(1);
  }
  
  const companyPagesSection = enData.companyPages;
  
  // Define sub-sections to translate separately (stays within 4096 token limit)
  const subSections = Object.keys(companyPagesSection);
  
  console.log('📊 Company Pages Translation (Sub-section Strategy)');
  console.log('='.repeat(60));
  console.log(`   Sub-sections: ${subSections.join(', ')}`);
  console.log(`   Languages: ${LANGUAGES.length}`);
  console.log(`   Total translations: ${subSections.length * LANGUAGES.length}`);
  console.log('='.repeat(60));
  console.log();
  
  let totalSuccess = 0;
  let totalFail = 0;
  
  for (const lang of LANGUAGES) {
    console.log(`🌍 ${lang.nativeName} (${lang.code}):`);
    
    // Load existing language file
    const targetJsonPath = path.join(messagesDir, `${lang.code}.json`);
    const targetData = JSON.parse(fs.readFileSync(targetJsonPath, 'utf-8'));
    
    // Initialize companyPages if not exists
    if (!targetData.companyPages) {
      targetData.companyPages = {};
    }
    
    // Translate each sub-section
    for (const subSectionName of subSections) {
      process.stdout.write(`   • ${subSectionName}... `);
      
      const translated = await translateSubSection(
        lang.name,
        subSectionName,
        companyPagesSection[subSectionName]
      );
      
      if (translated) {
        targetData.companyPages[subSectionName] = translated;
        console.log('✅');
        totalSuccess++;
      } else {
        console.log('❌');
        totalFail++;
      }
      
      // Rate limiting - 1 second between API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Write updated file after all sub-sections
    fs.writeFileSync(targetJsonPath, JSON.stringify(targetData, null, 2) + '\n', 'utf-8');
    console.log();
  }
  
  console.log('='.repeat(60));
  console.log(`✅ Success: ${totalSuccess}/${subSections.length * LANGUAGES.length}`);
  if (totalFail > 0) {
    console.log(`❌ Failed: ${totalFail}/${subSections.length * LANGUAGES.length}`);
  }
  console.log('='.repeat(60));
  
  if (totalFail === 0) {
    console.log();
    console.log('✨ All Company Pages translations complete!');
    console.log('🧪 Test in browser: switch language selector on /company/about');
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
