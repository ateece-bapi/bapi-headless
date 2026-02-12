#!/usr/bin/env node

/**
 * Sync new menu sections to all language files
 * This script translates the 3 new sections (resources, support updates, company updates)
 * that were added to en.json but are missing in other language files.
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({
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
  pl: 'Polish'
};

// The new sections that need to be translated
const NEW_SECTIONS = {
  "resources": {
    "label": "Resources",
    "technicalDocumentation": {
      "title": "Technical Documentation",
      "applicationNotes": "Application Notes",
      "applicationNotesDesc": "Design guidance & best practices",
      "serviceBulletins": "Service Bulletins",
      "serviceBulletinsDesc": "Product updates & announcements",
      "datasheets": "Datasheets",
      "datasheetsDesc": "Complete product specifications",
      "sensorsOverview": "Sensors Overview",
      "sensorsOverviewDesc": "Compare sensor specifications"
    },
    "toolsGuides": {
      "title": "Tools & Guides",
      "catalog": "Product Catalog",
      "catalogDesc": "Complete catalog with pricing",
      "siteVerification": "Site Verification Tool",
      "siteVerificationDesc": "Wireless signal strength testing",
      "productSelector": "Product Selector",
      "productSelectorDesc": "Find the right sensor"
    },
    "learningCenter": {
      "title": "Learning Center",
      "videos": "Video Library",
      "videosDesc": "How-to videos & tutorials",
      "caseStudies": "Case Studies",
      "caseStudiesDesc": "Real-world success stories",
      "webinars": "Webinars",
      "webinarsDesc": "Live training sessions"
    },
    "featured": {
      "title": "Need Technical Documentation?",
      "description": "Access our complete library of application notes, datasheets, and technical resources to help you design and specify the perfect solution.",
      "cta": "Browse Resources"
    }
  },
  "supportUpdates": {
    "getHelp": {
      "title": "Get Help",
      "contactSupport": "Contact Support",
      "contactSupportDesc": "Talk to our engineers",
      "rmaRequest": "RMA Request",
      "rmaRequestDesc": "Return merchandise authorization",
      "whereToBuy": "Where to Buy",
      "whereToBuyDesc": "Find a distributor near you"
    },
    "existingCustomers": {
      "title": "For Existing Customers",
      "myAccount": "My Account",
      "myAccountDesc": "View orders & quotes",
      "orderStatus": "Order Status",
      "orderStatusDesc": "Track your shipments",
      "requestQuote": "Request a Quote",
      "requestQuoteDesc": "Get pricing for your project"
    },
    "featured": {
      "title": "Need Technical Support?",
      "description": "Our experienced engineering team is ready to help with product selection, specifications, and troubleshooting.",
      "cta": "Contact Support"
    }
  },
  "companyUpdates": {
    "aboutBapi": {
      "title": "About BAPI",
      "whyBapi": "Why BAPI",
      "whyBapiDesc": "Why choose BAPI sensors",
      "missionValues": "Mission & Values",
      "missionValuesDesc": "What drives us",
      "news": "News & Events",
      "newsDesc": "Latest announcements",
      "careers": "Careers",
      "careersDesc": "Join our team"
    },
    "getInTouch": {
      "title": "Get In Touch",
      "contactSales": "Contact Sales",
      "contactSalesDesc": "Talk to a rep",
      "whereToBuy": "Where to Buy",
      "whereToBuyDesc": "Find a distributor",
      "requestQuote": "Request a Quote",
      "requestQuoteDesc": "Get pricing"
    },
    "featured": {
      "title": "Ready to Transform Your Building Automation?",
      "description": "Connect with our team to discuss your project requirements and discover the perfect sensor solution.",
      "cta": "Contact Our Team"
    }
  }
};

async function translateSection(sectionName, sectionData, targetLanguage, languageName) {
  const prompt = `You are a professional translator for a building automation sensor company (BAPI).

Translate the following JSON object from English to ${languageName}. This is for a website navigation menu.

IMPORTANT RULES:
1. Maintain all JSON structure, keys, and formatting EXACTLY
2. Only translate the string VALUES (text after the colons)
3. Keep technical terms consistent with HVAC industry standards
4. Keep "BAPI" as "BAPI" (company name, don't translate)
5. Keep "WAM" as "WAM" (product name, don't translate)
6. Return ONLY the translated JSON, no explanations

Section: ${sectionName}

English JSON to translate:
${JSON.stringify(sectionData, null, 2)}

Respond with ONLY the translated JSON:`;

  const message = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4000,
    temperature: 0.3,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const response = message.content[0].text.trim();
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON found in response for ${languageName} - ${sectionName}`);
  }

  return JSON.parse(jsonMatch[0]);
}

async function syncLanguageFile(langCode, languageName) {
  console.log(`\n🌍 Processing ${languageName} (${langCode})...`);
  
  const filePath = path.join(__dirname, '../messages', `${langCode}.json`);
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Translate resources section
  console.log(`  📚 Translating resources section...`);
  const resourcesTranslated = await translateSection('resources', NEW_SECTIONS.resources, langCode, languageName);

  // Translate support updates
  console.log(`  🆘 Translating support updates...`);
  const supportUpdated = await translateSection('support updates', NEW_SECTIONS.supportUpdates, langCode, languageName);

  // Translate company updates  
  console.log(`  🏢 Translating company updates...`);
  const companyUpdated = await translateSection('company updates', NEW_SECTIONS.companyUpdates, langCode, languageName);

  // Update the file
  if (!existingData.megaMenu) {
    existingData.megaMenu = {};
  }
  existingData.megaMenu.resources = resourcesTranslated;
  existingData.megaMenu.support = {
    label: existingData.megaMenu.support?.label || supportUpdated.getHelp.title,
    ...supportUpdated
  };
  existingData.megaMenu.company = {
    label: existingData.megaMenu.company?.label || companyUpdated.aboutBapi.title,
    ...companyUpdated
  };

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2) + '\n', 'utf8');
  console.log(`  ✅ Updated ${langCode}.json`);

  // Small delay to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function main() {
  console.log('🚀 Starting menu section sync for all languages...\n');
  console.log('This will translate 3 new sections to 9 languages (~$2-3 cost)\n');

  for (const [langCode, languageName] of Object.entries(LANGUAGES)) {
    try {
      await syncLanguageFile(langCode, languageName);
    } catch (error) {
      console.error(`❌ Error processing ${languageName}:`, error.message);
    }
  }

  console.log('\n✨ Translation sync complete!');
}

main().catch(console.error);
