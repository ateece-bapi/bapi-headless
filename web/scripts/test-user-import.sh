#!/bin/bash

# Test User Import Script
# Tests the bulk import with a single test email

echo "🧪 Testing bulk import with single user..."
echo ""
echo "Choose a test mode:"
echo "1. Import without sending email (safe)"
echo "2. Import WITH email sending (you'll receive password setup email)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
  echo "📋 Testing import WITHOUT emails..."
  TEST_EMAIL="your@email.com" node scripts/bulk-import-users.mjs
elif [ "$choice" == "2" ]; then
  echo "📧 Testing import WITH emails..."
  read -p "Enter your email address: " email
  TEST_EMAIL="$email" SEND_EMAILS=true node scripts/bulk-import-users.mjs
else
  echo "❌ Invalid choice"
  exit 1
fi
