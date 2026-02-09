#!/usr/bin/env node

/**
 * Test script for AWS SES email sending via Next.js API route
 * Usage: node scripts/test-email.mjs <recipient-email>
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const testEmail = async (recipientEmail) => {
  console.log('🧪 Testing email send to:', recipientEmail);
  console.log('📧 Using API endpoint:', `${BASE_URL}/api/send-email`);
  
  const emailData = {
    to: recipientEmail,
    subject: 'Test Email from BAPI Headless',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1479BC;">BAPI Email Test</h1>
          <p>This is a test email from the BAPI Headless Next.js application.</p>
          <p>If you received this, the AWS SES integration is working correctly!</p>
          <hr style="border: 1px solid #97999B; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            Sent via AWS SES from the Next.js /api/send-email endpoint<br />
            Region: us-east-2<br />
            Timestamp: ${new Date().toISOString()}
          </p>
        </body>
      </html>
    `,
    text: 'This is a test email from BAPI Headless. If you received this, AWS SES integration is working!',
  };

  try {
    const response = await fetch(`${BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('Response:', result);
    } else {
      console.error('❌ Email send failed');
      console.error('Status:', response.status);
      console.error('Error:', result);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.error('Make sure your dev server is running (pnpm dev)');
  }
};

// Get recipient email from command line args
const recipientEmail = process.argv[2];

if (!recipientEmail) {
  console.error('❌ Please provide a recipient email address');
  console.error('Usage: node scripts/test-email.mjs <recipient-email>');
  console.error('Example: node scripts/test-email.mjs test@example.com');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(recipientEmail)) {
  console.error('❌ Invalid email format:', recipientEmail);
  process.exit(1);
}

testEmail(recipientEmail);
