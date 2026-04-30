#!/usr/bin/env node

/**
 * Test Claude API connectivity and available models
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env') });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

console.log('🔍 Testing Claude API...\n');
console.log(`API Key present: ${ANTHROPIC_API_KEY ? '✅ Yes' : '❌ No'}`);
console.log(`API Key prefix: ${ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.substring(0, 20) + '...' : 'N/A'}\n`);

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not found in environment');
  process.exit(1);
}

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// Try different model names
const modelsToTest = [
  'claude-3-5-sonnet-20240620',
  'claude-3-5-sonnet-latest',
  'claude-3-5-sonnet-20241022',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
];

console.log('📋 Testing models:\n');

for (const model of modelsToTest) {
  try {
    process.stdout.write(`   ${model}... `);
    
    const message = await client.messages.create({
      model: model,
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: 'Translate "Hello" to Spanish. Reply with just the translation.',
        },
      ],
    });
    
    const translation = message.content[0].text;
    console.log(`✅ Works! (Response: "${translation.trim()}")`);
    
    // If we find a working model, use it
    console.log(`\n🎉 SUCCESS! Use this model: ${model}\n`);
    break;
    
  } catch (error) {
    if (error.status === 404) {
      console.log(`❌ 404 Not Found`);
    } else if (error.status === 401) {
      console.log(`❌ 401 Unauthorized (API key issue)`);
      console.log('\n⚠️  API key may be invalid or expired\n');
      break;
    } else if (error.status === 429) {
      console.log(`❌ 429 Rate Limited`);
    } else {
      console.log(`❌ ${error.status || 'Unknown'}: ${error.message}`);
    }
  }
  
  // Rate limiting
  await new Promise(resolve => setTimeout(resolve, 500));
}

console.log('\n✨ Test complete\n');
