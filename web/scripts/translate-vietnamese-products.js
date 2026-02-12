#!/usr/bin/env node

/**
 * Translate megaMenu.products section to Vietnamese
 * This section was missing from the initial Vietnamese translation
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const sourceText = `    "products": {
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
    },`;

async function translate() {
  console.log('🔄 Translating megaMenu.products to Vietnamese...\n');

  const message = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Translate this JSON section to Vietnamese for a building automation e-commerce website.

**CRITICAL RULES:**
1. Keep ALL JSON keys in English (e.g., "products", "temperature", "roomWallSensors")
2. Only translate the STRING VALUES (text after the colon)
3. Preserve all punctuation, special characters, and formatting
4. Keep brand names like "WAM™", "Blu-Test", "BAPI-Box", "NIST" unchanged
5. Maintain technical accuracy for HVAC and building automation terms
6. Keep "CO₂" subscript formatting exact
7. Do not add or remove any keys
8. Output ONLY the translated JSON, no explanations

Example of correct translation:
"label": "Products" → "label": "Sản phẩm"
"roomWallSensors": "Room & Wall Sensors" → "roomWallSensors": "Cảm biến Phòng & Tường"

JSON to translate:

${sourceText}`,
      },
    ],
  });

  const translatedText = message.content[0].text;
  console.log('✅ Translation complete!\n');
  console.log(translatedText);

  // Save to file for review
  const outputPath = path.join(__dirname, 'vietnamese-products-translated.json');
  await fs.writeFile(outputPath, translatedText, 'utf-8');
  console.log(`\n📝 Saved to: ${outputPath}`);
}

// Run the translation
translate().catch(console.error);
