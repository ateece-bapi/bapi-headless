#!/usr/bin/env node

/**
 * Try alternate Claude API approaches
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env') });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

console.log('🔍 Trying alternative approaches...\n');

// Check if SDK has model constants
console.log('📋 Checking SDK for model constants:');
console.log('Anthropic object keys:', Object.keys(Anthropic).filter(k => k.toLowerCase().includes('model') || k.toLowerCase().includes('claude')));
console.log('');

// Try with just "claude-3-5-sonnet" without date
const modelsToTry = [
  'claude-3-5-sonnet',
  'claude-3-sonnet',
  'claude-3-haiku',
  'claude-3-opus',
  'claude-sonnet-4-20250514', // Future model naming?
  'claude-sonnet-3.5',
];

for (const model of modelsToTry) {
  try {
    process.stdout.write(`   Trying "${model}"... `);
    
    const message = await client.messages.create({
      model: model,
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Say "test"' }],
    });
    
    console.log(`✅ SUCCESS! Response: "${message.content[0].text.trim()}"`);
    console.log(`\n🎉 Working model found: ${model}\n`);
    process.exit(0);
    
  } catch (error) {
    console.log(`❌ ${error.status || 'Error'}: ${error.message?.substring(0, 60) || 'Unknown'}`);
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
}

console.log('\n⚠️  All models failed. Checking API key validity...\n');

// Try a simple API call that should work regardless of model
try {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'test' }],
    }),
  });
  
  const data = await response.json();
  console.log('Raw API Response Status:', response.status);
  console.log('Raw API Response:', JSON.stringify(data, null, 2));
  
} catch (error) {
  console.log('Fetch error:', error.message);
}
