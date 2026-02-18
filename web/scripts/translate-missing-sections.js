#!/usr/bin/env node
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Missing sections per language (Vietnamese already done, only zh and hi remaining)
const missingTranslations = [
  { locale: 'zh', language: 'Chinese (中文)', sections: ['careers', 'whyBapi'] },
  { locale: 'hi', language: 'Hindi (हिन्दी)', sections: ['whyBapi'] },
];

async function translateSection(sectionName, sectionContent, targetLanguage) {
  console.log(`   Translating ${sectionName}...`);

  const prompt = `Translate this JSON object from English to ${targetLanguage}. 
CRITICAL RULES:
1. Preserve ALL keys EXACTLY as they are (do not translate keys)
2. Only translate the string VALUES
3. Return ONLY the translated JSON object
4. Ensure all quotes are properly escaped
5. Do not use any special formatting or markdown

Input JSON:
${JSON.stringify(sectionContent, null, 2)}

Output the translated JSON:`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096, // Haiku's maximum
      temperature: 0.3, // Lower temperature for more consistent JSON
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const response = message.content[0].text.trim();

    // Try multiple extraction strategies
    let translatedSection = null;

    // Strategy 1: Simple greedy regex
    let jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        translatedSection = JSON.parse(jsonMatch[0]);
        return translatedSection;
      } catch (e) {
        // Continue to next strategy
      }
    }

    // Strategy 2: Remove markdown code blocks if present
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        translatedSection = JSON.parse(jsonMatch[0]);
        return translatedSection;
      } catch (e) {
        // Continue to next strategy
      }
    }

    // Strategy 3: Try to fix common Unicode issues
    if (jsonMatch) {
      try {
        // Replace problematic Unicode escapes
        const fixed = jsonMatch[0]
          .replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
            try {
              return String.fromCharCode(parseInt(match.slice(2), 16));
            } catch {
              return match;
            }
          });
        translatedSection = JSON.parse(fixed);
        return translatedSection;
      } catch (e) {
        console.error(`   ❌ Parse error: ${e.message}`);
        console.error(`   First 200 chars: ${jsonMatch[0].substring(0, 200)}`);
      }
    }

    throw new Error('Could not extract valid JSON from response');
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('\n🔧 Translating Missing Sections');
  console.log('============================================================\n');

  const messagesDir = path.join(__dirname, '..', 'messages');
  const enPath = path.join(messagesDir, 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  let successCount = 0;
  let failCount = 0;

  for (const { locale, language, sections } of missingTranslations) {
    console.log(`🌍 ${language} (${locale}):`);

    const localePath = path.join(messagesDir, `${locale}.json`);
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));

    if (!localeData.companyPages) {
      localeData.companyPages = {};
    }

    for (const sectionName of sections) {
      const sectionContent = enData.companyPages[sectionName];

      if (!sectionContent) {
        console.log(`   ⚠️  Section ${sectionName} not found in English`);
        continue;
      }

      const translated = await translateSection(sectionName, sectionContent, language);

      if (translated) {
        localeData.companyPages[sectionName] = translated;
        console.log(`   ✅ ${sectionName} translated`);
        successCount++;
      } else {
        console.log(`   ❌ ${sectionName} failed`);
        failCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Write updated file
    fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n', 'utf8');
    console.log(`   💾 Updated ${locale}.json\n`);
  }

  console.log('============================================================');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('============================================================\n');
}

main().catch(console.error);
