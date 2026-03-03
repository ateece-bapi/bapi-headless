const fs = require('fs');
const path = require('path');

// Read English translations
const enPath = path.join(__dirname, '../messages/en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Language files to update
const languages = ['de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar', 'th', 'pl', 'hi'];

console.log('Syncing account translations (dashboard, profile, orders, favorites, quotes, settings)...\n');

languages.forEach(lang => {
  const langPath = path.join(__dirname, `../messages/${lang}.json`);
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  
  // Copy the account section from English
  if (!langData.account) {
    langData.account = {};
  }
  langData.account.dashboard = en.account.dashboard;
  langData.account.profile = en.account.profile;
  langData.account.orders = en.account.orders;
  langData.account.favorites = en.account.favorites;
  langData.account.quotes = en.account.quotes;
  langData.account.settings = en.account.settings;
  
  // Write back
  fs.writeFileSync(langPath, JSON.stringify(langData, null, 2) + '\n', 'utf8');
  console.log(`✓ Updated ${lang}.json`);
});

console.log('\n✅ All language files updated successfully!');
