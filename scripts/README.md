# Translation Scripts

## DIY AI Translation (Recommended)

Translate all 8 languages for **$5-20** instead of paying Crowdin $250-500 for AI credits.

### Quick Start

```bash
# 1. Get Claude API key
# Sign up at https://console.anthropic.com
# Add $20 credit (you'll only use ~$10-15)

# 2. Set API key
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# 3. Install dependencies
cd /home/ateece/bapi-headless/scripts
npm install @anthropic-ai/sdk

# 4. Translate Vietnamese first (URGENT)
node translate-with-ai.js vi

# 5. Translate all other languages
node translate-with-ai.js all
```

### What It Does

1. ✅ Reads `web/messages/en.json` (310+ translation keys)
2. ✅ Sends to Claude 3.5 Sonnet with translation instructions
3. ✅ Preserves brand names (BAPI, WAM™) and technical terms
4. ✅ Uses professional B2B tone for engineers
5. ✅ Writes to `web/messages/{lang}.json`
6. ✅ Validates JSON structure

### Cost Comparison

| Method | Time | Cost | Quality |
|--------|------|------|---------|
| **DIY Claude** | 1 hour | **$5-20** | 85-90% |
| Crowdin AI | 10 min | $350-600 | 85-90% |
| Human Translation | 7-10 days | $1,800-2,100 | 95%+ |

### Usage Examples

```bash
# Translate one language
node translate-with-ai.js vi  # Vietnamese
node translate-with-ai.js de  # German
node translate-with-ai.js fr  # French

# Translate all 8 languages
node translate-with-ai.js all

# Check output
cat ../web/messages/vi.json
```

### After Translation

1. **Test locally**:
```bash
cd ../web
pnpm run dev
# Visit http://localhost:3000/vi to test Vietnamese
```

2. **Review quality**:
   - Check homepage tagline sounds natural
   - Verify technical terms stayed in English (BAPI, WAM™, CO₂)
   - Check professional tone (not casual)

3. **Upload to Crowdin** (optional):
   - Go to your Crowdin project
   - Upload translated files
   - Use Crowdin for Translation Memory and GitHub sync

4. **Commit to repo**:
```bash
git add web/messages/*.json
git commit -m "feat(i18n): Add AI-translated content for 8 languages"
git push origin main
```

### Troubleshooting

**Error: Missing ANTHROPIC_API_KEY**
```bash
export ANTHROPIC_API_KEY="your-key-here"
```

**Error: Cannot find module '@anthropic-ai/sdk'**
```bash
npm install @anthropic-ai/sdk
```

**JSON parsing error**
- Claude rarely makes JSON errors, but if it happens:
- Re-run the translation
- Check the output file manually

### Advanced: Batch Translation

Create a shell script for all languages:

```bash
#!/bin/bash
# translate-all.sh

languages=("vi" "de" "fr" "es" "ja" "zh" "ar" "th")

for lang in "${languages[@]}"; do
  echo "Translating $lang..."
  node translate-with-ai.js $lang
  sleep 2  # Rate limiting
done

echo "✅ All translations complete!"
```

### Why This Is Better Than Crowdin AI

1. **98% cheaper**: $5-20 vs $350-600
2. **Full control**: Edit prompt for better quality
3. **No vendor lock-in**: Own your translation workflow
4. **Same model**: Claude 3.5 Sonnet (Crowdin uses same)
5. **Instant**: No waiting for Crowdin credits

### Still Use Crowdin For

- ✅ Translation Memory (free)
- ✅ GitHub integration (free)
- ✅ Glossary management (free)
- ✅ Team collaboration (Pro plan)
- ❌ Skip the AI credits purchase

---

**Total Cost**: $5-20 AI + $99/mo Crowdin Pro = **Saves $250-500** vs Crowdin AI
