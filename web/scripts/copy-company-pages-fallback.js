#!/usr/bin/env node

/**
 * Copy companyPages from Spanish to other languages as fallback
 * This ensures all languages work (showing Spanish text) until proper translations are done
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const LANGUAGES = ['de', 'fr', 'ja', 'zh', 'vi', 'ar', 'th', 'pl', 'hi'];

try {
  // Read Spanish (source) with companyPages
  const esPath = path.join(MESSAGES_DIR, 'es.json');
  const esData = JSON.parse(fs.readFileSync(esPath, 'utf8'));
  
  if (!esData.companyPages) {
    console.error('❌ companyPages not found in es.json');
    process.exit(1);
  }
  
  console.log('📋 Copying companyPages from es.json to other languages...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const lang of LANGUAGES) {
    try {
      const filePath = path.join(MESSAGES_DIR, `${lang}.json`);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Add companyPages section
      data.companyPages = esData.companyPages;
      
      // Write back with formatting
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      
      console.log(`✅  ${lang}.json - companyPages added`);
      successCount++;
    } catch (error) {
      console.error(`❌  ${lang}.json - Failed: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n============================================================`);
  console.log(`✅ Success: ${successCount}/${LANGUAGES.length}`);
  console.log(`❌ Failed: ${failCount}/${LANGUAGES.length}`);
  console.log(`============================================================`);
  console.log(`\n✨ Fallback complete! All languages now have companyPages.`);
  console.log(`Note: Text is in Spanish - translate later with proper script.`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
