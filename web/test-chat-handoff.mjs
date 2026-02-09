#!/usr/bin/env node

/**
 * Test Chat Handoff Flow
 * Tests the complete chat handoff with email notification
 */

const API_URL = 'http://localhost:3000/api/chat/handoff';

// For testing: override the recipient email to send to your Gmail instead of sales team
const TEST_RECIPIENT_EMAIL = 'andrewteece@gmail.com';

const testHandoff = {
  name: 'John Smith',
  email: 'andrewteece@gmail.com', // Your Gmail for testing
  phone: '+1-555-123-4567',
  topic: 'sales', // Will trigger high urgency
  _testRecipient: TEST_RECIPIENT_EMAIL, // Override for testing
  message: 'I need a quote for 50 BA/10K-3 Temperature Sensors for a new HVAC system installation.',
  conversationContext: JSON.stringify([
    {
      role: 'user',
      content: 'Hi, I need help selecting temperature sensors for my building.',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
    },
    {
      role: 'assistant',
      content: 'I\'d be happy to help! Can you tell me about your specific requirements?',
      timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    },
    {
      role: 'user',
      content: 'I need sensors for a 100,000 sq ft commercial building with 50 zones.',
      timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    },
    {
      role: 'assistant',
      content: 'For that size, I recommend the BA/10K-3 series. Would you like a detailed quote?',
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
      role: 'user',
      content: 'Yes please, I\'d like to speak with someone from your sales team.',
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
  ]),
  language: 'en',
};

async function testChatHandoff() {
  console.log('🧪 Testing Chat Handoff with Email Notification\n');
  console.log('📋 Test Data:');
  console.log(`   Name: ${testHandoff.name}`);
  console.log(`   Email: ${testHandoff.email}`);
  console.log(`   Phone: ${testHandoff.phone}`);
  console.log(`   Topic: ${testHandoff.topic} (High Priority)`);
  console.log(`   Message: ${testHandoff.message}`);
  console.log(`   Chat Context: ${JSON.parse(testHandoff.conversationContext).length} messages\n`);

  try {
    console.log('📤 Sending handoff request...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testHandoff),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Handoff request successful!');
      console.log(`   Handoff ID: ${data.handoffId}`);
      console.log(`   Message: ${data.message}`);
      console.log('\n📧 Check the following for email delivery:');
      console.log(`   1. Recipient: ${testHandoff.email} (your test email)`);
      console.log('   2. Subject: "Chat Handoff Request - sales"');
      console.log('   3. Email should contain:');
      console.log('      - High priority banner (red)');
      console.log('      - Customer information table');
      console.log('      - Chat transcript with 5 messages');
      console.log('      - "Reply to Customer" button');
      console.log('\n💾 Handoff also saved to: data/chat-handoffs.json');
    } else {
      console.error('❌ Handoff request failed');
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('❌ Request error:', error.message);
  }
}

testChatHandoff();
