#!/bin/bash
# Quick translation script - translates all 8 languages using your existing Claude API key

set -e  # Exit on error

echo "🌍 BAPI AI Translation - Using your existing Claude API key"
echo ""

# Check if we're in the right directory
if [ ! -f "../web/.env" ]; then
  echo "❌ Error: Must run from /scripts directory"
  echo "   cd /home/ateece/bapi-headless/scripts"
  exit 1
fi

# Load API key from web/.env
echo "📋 Loading ANTHROPIC_API_KEY from web/.env..."
source ../web/.env
export ANTHROPIC_API_KEY

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "❌ ANTHROPIC_API_KEY not found in web/.env"
  exit 1
fi

echo "✅ API key loaded (${ANTHROPIC_API_KEY:0:20}...)"
echo ""

# Copy en.json if not present
if [ ! -f "en.json" ]; then
  echo "📄 Copying en.json from web/messages..."
  cp ../web/messages/en.json .
fi

# Check if @anthropic-ai/sdk is installed
if [ ! -d "../web/node_modules/@anthropic-ai" ]; then
  echo "📦 Installing @anthropic-ai/sdk in web directory..."
  cd ../web
  pnpm add @anthropic-ai/sdk
  cd ../scripts
  echo ""
fi

# Translate all languages
echo "🚀 Starting translation..."
echo ""

languages=("vi" "de" "fr" "es" "ja" "zh" "ar" "th" "pl" "hi")

for lang in "${languages[@]}"; do
  if [ -f "${lang}.json" ]; then
    echo "⏭️  Skipping $lang (already exists)"
  else
    echo "🌐 Translating $lang..."
    node translate-with-ai.js $lang
  fi
done

echo ""
echo "✅ All translations complete!"
echo ""

# Copy files back to web/messages
echo "📋 Copying translated files to web/messages/..."
for lang in "${languages[@]}"; do
  if [ -f "${lang}.json" ]; then
    cp "${lang}.json" ../web/messages/
    echo "   ✅ ${lang}.json"
  fi
done

echo ""
echo "🎉 Done! Translated files are in web/messages/"
echo ""
echo "Next steps:"
echo "1. Test locally: cd ../web && pnpm run dev"
echo "2. Visit http://localhost:3000/vi to test Vietnamese"
echo "3. Commit: git add web/messages/*.json && git commit -m 'feat(i18n): Add AI translations'"
