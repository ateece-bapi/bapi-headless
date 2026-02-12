#!/usr/bin/env node

/**
 * Translate megaMenu.products section to all languages missing it
 * Batch translation script for remaining incomplete language files
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Languages that need the products section translated
const LANGUAGES = {
  th: 'Thai',
  es: 'Spanish',
  fr: 'French',
  ja: 'Japanese',
  zh: 'Chinese (Simplified)',
  de: 'German',
  ar: 'Arabic',
};

const sourceTextFromEn = {
  "label": "Products",
  "temperature": {
    "title": "Temperature",
    "roomWallSensors": "Room & Wall Sensors",
    "roomWallSensorsDesc": "High-accuracy temperature sensing",
    "ductSensors": "Duct Sensors",
    "ductSensorsDesc": "Duct-mounted transmitters",
    "immersionWell": "Immersion & Well",
    "immersionWellDesc": "Liquid temperature measurement",
    "outdoorSensors": "Outdoor Sensors",
    "outdoorSensorsDesc": "Weather-resistant sensing"
  },
  "humidity": {
    "title": "Humidity",
    "roomHumidity": "Room Humidity",
    "roomHumidityDesc": "Wall-mount RH sensors",
    "ductHumidity": "Duct Humidity",
    "ductHumidityDesc": "Supply & return air RH",
    "outdoorHumidity": "Outdoor Humidity",
    "outdoorHumidityDesc": "Weather-resistant RH",
    "comboSensors": "Combo Sensors",
    "comboSensorsDesc": "Temperature + humidity"
  },
  "pressure": {
    "title": "Pressure",
    "differential": "Differential Pressure",
    "differentialDesc": "Room & filter monitoring",
    "static": "Static Pressure",
    "staticDesc": "Duct static transmitters",
    "barometric": "Barometric",
    "barometricDesc": "Atmospheric pressure"
  },
  "airQuality": {
    "title": "Air Quality",
    "co2": "CO₂ Sensors",
    "co2Desc": "Carbon dioxide monitoring",
    "voc": "VOC Sensors",
    "vocDesc": "Volatile organic compounds",
    "particulate": "Particulate Matter",
    "particulateDesc": "PM2.5 and PM10"
  },
  "wireless": {
    "title": "Wireless",
    "wamTemperature": "WAM Temperature",
    "wamTemperatureDesc": "Wireless temp sensors",
    "wamHumidity": "WAM Humidity",
    "wamHumidityDesc": "Wireless RH sensors",
    "wamDoorSensors": "WAM Door Sensors",
    "wamDoorSensorsDesc": "Open/close monitoring",
    "cloudPlatform": "Cloud Platform",
    "cloudPlatformDesc": "24/7 remote monitoring"
  },
  "accessories": {
    "title": "Accessories",
    "mounting": "Mounting Hardware",
    "mountingDesc": "Plates, boxes, brackets",
    "enclosures": "Enclosures",
    "enclosuresDesc": "BAPI-Box & covers",
    "cables": "Cables & Connectors",
    "cablesDesc": "Wiring accessories"
  },
  "testInstruments": {
    "title": "Test Instruments",
    "bluTestTemperature": "Blu-Test Temperature",
    "bluTestTemperatureDesc": "NIST-traceable reference",
    "bluTestHumidity": "Blu-Test Humidity",
    "bluTestHumidityDesc": "Temp + RH reference",
    "bluTestPressure": "Blu-Test Pressure",
    "bluTestPressureDesc": "Digital manometer"
  },
  "featured": {
    "title": "WAM™ Wireless Asset Monitoring",
    "description": "24/7 remote monitoring with instant alerts. Protect your valuable assets from power outages and equipment failures. No wiring required - get up and running in minutes.",
    "cta": "Learn More",
    "wamTitle": "WAM™ Wireless Asset Monitoring",
    "wamDescription": "24/7 remote monitoring with instant alerts. Protect your valuable assets from power outages and equipment failures. No wiring required - get up and running in minutes.",
    "wamCta": "Learn More",
    "wamBadge": "Premium Solution"
  },
  "badges": {
    "popular": "Popular",
    "new": "New",
    "premium": "Premium"
  }
};

async function translateLanguage(langCode, langName) {
  console.log(`\n🔄 Translating megaMenu.products to ${langName} (${langCode})...`);

  try {
    const message = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `Translate this JSON object to ${langName} for a building automation e-commerce website.

**CRITICAL RULES:**
1. Keep ALL JSON keys in English (e.g., "label", "temperature", "roomWallSensors")
2. Only translate the STRING VALUES (text after the colon)
3. Preserve all punctuation, special characters, and formatting
4. Keep brand names like "WAM™", "Blu-Test", "BAPI-Box", "NIST" unchanged
5. Maintain technical accuracy for HVAC and building automation terms
6. Keep "CO₂" subscript formatting exact
7. Do not add or remove any keys
8. Output ONLY valid JSON, no explanations or markdown

JSON to translate:

${JSON.stringify(sourceTextFromEn, null, 2)}`,
        },
      ],
    });

    let translatedText = message.content[0].text;

    // Remove markdown code blocks if present
    translatedText = translatedText.replace(/^```json\s*\n?/gm, '');
    translatedText = translatedText.replace(/^```\s*\n?/gm, '');
    translatedText = translatedText.trim();

    // Parse to validate JSON
    const translatedObj = JSON.parse(translatedText);

    console.log(`✅ ${langName} translation complete and validated!`);

    // Save to output file
    const outputPath = path.join(__dirname, `products-translated-${langCode}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translatedObj, null, 2), 'utf-8');
    console.log(`📝 Saved to: ${outputPath}`);

    return translatedObj;
  } catch (error) {
    console.error(`❌ ${langName} translation failed:`, error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response, null, 2));
    }
    throw error;
  }
}

async function updateLanguageFile(langCode, translatedProducts) {
  const filePath = path.join(__dirname, '..', 'messages', `${langCode}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Add products section to megaMenu
    if (!data.megaMenu) {
      data.megaMenu = {};
    }
    data.megaMenu.products = translatedProducts;

    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`✅ Updated ${langCode}.json with products section`);
  } catch (error) {
    console.error(`❌ Failed to update ${langCode}.json:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🌍 Translating megaMenu.products section for all missing languages...\n');
  console.log(`Languages to translate: ${Object.keys(LANGUAGES).join(', ')}\n`);

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    try {
      const translated = await translateLanguage(langCode, langName);
      await updateLanguageFile(langCode, translated);
      
      // Small delay between translations to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`\n❌ Stopping due to error with ${langName}`);
      process.exit(1);
    }
  }

  console.log('\n✅ All translations complete!');
  console.log('\nℹ️  Next steps:');
  console.log('  1. Review the updated messages/*.json files');
  console.log('  2. Test each language in the UI');
  console.log('  3. Commit and push the changes');
}

main().catch(console.error);
