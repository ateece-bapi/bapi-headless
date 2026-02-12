# Crowdin Translation Setup Guide - BAPI Headless

**Project:** BAPI Headless E-Commerce Translation  
**Deadline:** March 10, 2026 (deliver all 8 languages)  
**Highest Priority:** Vietnamese (Vietnam facility opening April 2026)

---

## Phase 1: Account Setup (30 minutes)

### 1. Create Crowdin Account

1. Go to [crowdin.com](https://crowdin.com)
2. Click **"Sign Up"**
3. Choose **"Team"** plan ($99/month - 14-day free trial)
   - Unlimited projects
   - GitHub integration
   - Translation Memory
   - Glossary support
   - 10 team members

### 2. Create New Project

1. Click **"Create Project"**
2. **Project Name:** `BAPI Headless E-Commerce`
3. **Source Language:** English
4. **Target Languages:** Select all 9:
   - 🇩🇪 German (Deutsch)
   - 🇫🇷 French (Français)
   - 🇪🇸 Spanish (Español)
   - 🇯🇵 Japanese (日本語)
   - 🇨🇳 Chinese Simplified (中文)
   - 🇻🇳 Vietnamese (Tiếng Việt) - **HIGHEST PRIORITY**
   - 🇸🇦 Arabic (العربية)
   - 🇹🇭 Thai (ไทย)
   - 🇵🇱 Polish (Polski)

5. **Project Type:** Web Application (JSON)
6. Click **"Create"**

---

## Phase 2: Upload Source Files (15 minutes)

### 1. Upload English Base File

1. In your project, click **"Upload Files"**
2. Select: `/home/ateece/bapi-headless/web/messages/en.json`
3. **File Name:** Keep as `en.json`
4. **Parser:** JSON (auto-detected)
5. Click **"Upload"**

**Result:** Crowdin will parse 310+ translation keys from 14 namespaces.

### 2. Configure JSON Structure

1. Go to **Settings → Files**
2. Select `en.json`
3. **Export Pattern:** `messages/%two_letters_code%.json`
   - This will generate: `de.json`, `fr.json`, `es.json`, etc.
4. **Nested JSON Keys:** Enable (for sections.products.links.allSensors)
5. Click **"Save"**

---

## Phase 3: Upload Glossary & Context (20 minutes)

### 1. Create Glossary

1. Go to **Settings → Glossary**
2. Click **"Import from file"**
3. Convert TECHNICAL-GLOSSARY.md to CSV format:

```csv
Term,Translation,Part of Speech,Description
BAPI,BAPI,Proper Noun,Company name - KEEP IN ENGLISH
WAM,WAM,Trademark,Wireless Accessory Manager™ - KEEP IN ENGLISH
Temperature Sensor,DO NOT TRANSLATE,Noun,Translate this term in target language
°C,°C,Unit,Keep as-is (universal)
BACnet,BACnet,Standard,Building automation standard - KEEP IN ENGLISH
ISO 9001:2015,ISO 9001:2015,Standard,KEEP IN ENGLISH
```

4. Upload CSV
5. Click **"Import"**

**Shortcut:** Download pre-formatted CSV:
```bash
cd /home/ateece/bapi-headless/docs
# Create glossary.csv from TECHNICAL-GLOSSARY.md
```

### 2. Add Screenshots (In-Context)

1. Go to **Editor** → Select any key
2. Click **"Add Screenshot"**
3. Upload screenshots from your staging site:
   - Homepage: `screenshot-en-home.png`
   - Footer: `screenshot-en-footer.png`
   - Products: `screenshot-en-products.png`
   - Navigation: `screenshot-en-nav.png`

4. Mark regions on screenshot where text appears
5. Link translation keys to screenshot regions

**Pro Tip:** This helps translators see context and improves quality 30-40%.

### 3. Add Translator Instructions

1. Go to **Settings → Translation Instructions**
2. Paste this:

```markdown
# BAPI Translation Guidelines

## Project Overview
Building automation sensor e-commerce website. Audience: B2B engineers and facility managers.

## Tone & Style
- Professional, technical B2B language
- Formal tone (use Sie in German, usted in Spanish, keigo in Japanese)
- Preserve brand names and technical terms (see Glossary)

## HIGHEST PRIORITY: Vietnamese 🇻🇳
We are opening a facility in Vietnam in April 2026. Vietnamese translations are URGENT.

## Do NOT Translate
- BAPI (company name)
- WAM™ (trademark)
- BACnet, Modbus, LON (protocols)
- NIST, ISO 9001:2015 (standards)
- CO₂, VOC, PM2.5, PM10 (chemical formulas)
- All measurement units (°C, °F, bar, PSI, RH%, PPM)
- SKU codes

## Context-Dependent
- "Made in USA" → Translate based on target market preference
- "Premium" badge → Use local equivalent
- Marketing taglines → Adapt culturally, not literal

## Placeholders
- {year} → Keep as-is (dynamic value)
- {count} → Keep as-is (pluralization)

## Reference Documents
- Technical Glossary: See project files
- Brand Guidelines: Professional B2B tone
```

---

## Phase 4: Hire Translators (1-2 hours)

### Option A: Crowdin Vendors (Recommended)

1. Go to **Tools → Order Translation**
2. Select **"Crowdin Vendors"**
3. Choose vendor by:
   - **Rating:** 4.5+ stars
   - **Specialization:** Technical, Software, E-commerce
   - **Price:** $0.08-0.15/word
4. Mark **Vietnamese as URGENT** (fast-track)
5. Estimated cost: ~$1,800-2,100 for all 8 languages
6. Delivery: 7-10 business days

### Option B: Your Own Translators

1. Go to **Settings → Members → Invite**
2. Send invite to translators with email
3. Assign languages:
   - Translator 1 → German
   - Translator 2 → French/Spanish
   - Translator 3 → Vietnamese (PRIORITY)
   - Translator 4 → Japanese/Chinese
   - Translator 5 → Arabic
4. Set permissions: **Translator** (not Manager)

### Option C: Community Translation (Free but Slower)

1. Go to **Settings → Translation → Workflow**
2. Enable **"Crowdsourcing"**
3. Post project on Crowdin community forums
4. **Not recommended for BAPI** - too slow for April deadline

### Option D: AI Translation (Fast but Extra Cost)

Crowdin offers AI-powered translation using GPT-4, Claude, and other LLMs for high-quality technical translations.

**⚠️ IMPORTANT:** AI translation in Crowdin is **pay-per-use** (separate from Pro plan subscription).

**Why AI Translation for BAPI:**
- ✅ **Speed:** Translate all 8 languages in minutes (vs 7-10 days for human)
- ⚠️ **Cost:** ~$350-600 total (Pro subscription + AI credits)
- ✅ **Quality:** 85-90% accurate for technical B2B content
- ✅ **Context-Aware:** Uses glossary and translation memory
- ✅ **Human Review:** Can add human proofreading after AI translation

**Alternative:** See Option E below for free AI translation using Claude API directly.

**Setup AI Translation:**

1. **Enable AI Provider** (Requires Payment):
   - Go to **Settings → Integrations → AI**
   - Choose provider:
     - **Crowdin AI** (GPT-4 based) - Best for technical content
     - **DeepL Pro** - Best for European languages (DE, FR, ES)
     - **Google Cloud Translation** - Good all-rounder
   - **NOTE:** AI translation is pay-per-use, separate from Pro plan subscription
   - You'll need to add payment method and purchase AI credits

2. **Configure AI Settings**:
   - Enable **"Use Glossary"** ✅ (ensures BAPI, WAM™, etc. stay in English)
   - Enable **"Use Translation Memory"** ✅
   - Set **Tone:** "Professional/Technical"
   - Set **Domain:** "Technology/E-commerce"

3. **Pre-Translate with AI**:
   - Go to **Tools → Pre-Translation**
   - Select all 8 languages
   - Choose **AI Translation** (not Machine Translation)
   - Click **"Pre-Translate"**
   - Wait 5-10 minutes for completion

4. **Review AI Output** (Optional but Recommended):
   - Review Vietnamese FIRST (highest priority)
   - Check for:
     - Brand names preserved (BAPI, WAM™)
     - Technical terms correct (see glossary)
     - Tone professional (not casual)
     - Units preserved (°C, PSI, bar)
   - Approve translations or request human review

**Cost Breakdown:**
- **Crowdin Pro Plan:** $99/month (subscription - does NOT include AI credits)
- **AI Translation:** ~$0.02-0.04/word (pay-per-use, separate charge)
- 310 keys × 8 languages × ~5 words/key = ~12,400 words
- **AI credits needed:** ~$250-500 (purchased separately from Crowdin)
- Optional human review: +$500-800 (only review, not full translation)
- **Total First Month:** $99 (Pro) + $250-500 (AI) + optional review = ~$350-1,400

**Hybrid Approach (Best Quality + Speed):**
1. Use AI translation for initial pass (1 hour)
2. Mark Vietnamese as **URGENT** for human review (1-2 days)
3. Spot-check other languages (2-3 hours)
4. Total cost: ~$700-1,000 | Total time: 3-4 days

**Delivery Timeline:**
- **AI Translation:** Same day (5-10 minutes per language)
- **AI + Human Review:** 3-4 days (vs 7-10 days full human)
- **Perfect for April 10 deadline** ✅

### Option E: DIY AI Translation (Cheapest) ⭐ RECOMMENDED

Use Claude API or ChatGPT directly to translate your `en.json` file, then upload to Crowdin.

**Why DIY AI:**
- ✅ **Cost:** ~$5-20 total (Claude API charges)
- ✅ **Control:** Full control over prompts and glossary
- ✅ **Speed:** 5-10 minutes per language
- ✅ **Quality:** Same 85-90% as Crowdin AI (uses same models)
- ✅ **No Vendor Lock-in:** Own your translation workflow

**How to Do It:**

1. **Get API Access:**
   - Sign up at [console.anthropic.com](https://console.anthropic.com) (Claude)
   - Or [platform.openai.com](https://platform.openai.com) (ChatGPT)
   - Add $20 credit (will only use ~$5-20 total)

2. **Create Translation Script:**
```bash
cd /home/ateece/bapi-headless/web/messages
# Create translate.js script (see below)
node translate.js en.json vi
```

3. **Translation Script Example:**
```javascript
// translate.js - Simple AI translation script
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function translateFile(sourceFile, targetLang) {
  const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  
  const prompt = `Translate this JSON file to ${targetLang}.
RULES:
- Keep these in English: BAPI, WAM™, BACnet, CO₂, VOC, PM2.5, PM10, ISO 9001:2015
- Keep units: °C, °F, PSI, bar, RH%
- Professional B2B tone for engineers
- Preserve JSON structure and placeholders like {year}, {count}

${JSON.stringify(source, null, 2)}

Return ONLY valid JSON, no explanations.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const translated = JSON.parse(message.content[0].text);
  fs.writeFileSync(`${targetLang}.json`, JSON.stringify(translated, null, 2));
  console.log(`✅ Translated to ${targetLang}.json`);
}

// Usage: node translate.js en.json vi
translateFile(process.argv[2], process.argv[3]);
```

4. **Translate All Languages:**
```bash
node translate.js en.json vi  # Vietnamese first
node translate.js en.json de  # German
node translate.js en.json fr  # French
node translate.js en.json es  # Spanish
node translate.js en.json ja  # Japanese
node translate.js en.json zh  # Chinese
node translate.js en.json ar  # Arabic
node translate.js en.json th  # Thai
```

5. **Upload to Crowdin:**
   - Go to Crowdin project
   - Upload each translated file manually
   - Or use Crowdin CLI to sync automatically

**Cost Comparison:**
- **Crowdin AI:** $99/month + $250-500 AI credits = **$350-600**
- **DIY Claude:** $0/month + $5-20 API usage = **$5-20** ✅
- **Savings:** ~$330-580 (98% cheaper!)

**Pro Tip:** You can still use Crowdin for free features (Translation Memory, GitHub sync, download) and just skip the AI payment.

---

## Phase 5: GitHub Integration (30 minutes)

### 1. Install Crowdin GitHub App

1. Go to **Settings → Integrations → GitHub**
2. Click **"Install GitHub App"**
3. Select repository: `ateece-bapi/bapi-headless`
4. Authorize access

### 2. Configure Sync Settings

```yaml
# crowdin.yml (auto-generated, review settings)
project_id: "your-project-id"
api_token: "your-api-token"
base_path: "web"

files:
  - source: /messages/en.json
    translation: /messages/%two_letters_code%.json
    update_option: update_as_unapproved
```

### 3. Two-Way Sync

**Crowdin → GitHub:**
- When translations approved → Auto-create PR
- PR updates `messages/de.json`, `messages/vi.json`, etc.
- You review and merge

**GitHub → Crowdin:**
- When you update `en.json` → Auto-syncs to Crowdin
- New keys appear for translation
- Keeps everything in sync

---

## Phase 6: Translation Workflow (Ongoing)

### Week 1 (Feb 3-7): Upload & Assign

1. ✅ Upload `en.json` (310+ keys)
2. ✅ Configure glossary
3. ✅ Add screenshots
4. ✅ Hire translators
5. ✅ Mark Vietnamese as URGENT

### Week 2 (Feb 10-14): Translation in Progress

1. Monitor progress: **Dashboard → Progress by Language**
2. Vietnamese should complete first (URGENT flag)
3. Review first 50 strings in Editor (quality check)
4. Provide feedback to translators if needed

### Week 3 (Feb 17-21): Review & Approve

1. **Editor → Language** → Review translations
2. Check for:
   - Brand names preserved (BAPI, WAM™)
   - Technical terms correct (see glossary)
   - Placeholders intact ({year}, {count})
   - Professional B2B tone
3. Click **"Approve"** or **"Request Changes"**

### Week 4 (Feb 24-28): Download & Deploy

1. Click **"Build & Download"**
2. Select **"All Languages"**
3. Download ZIP file
4. Extract to `/home/ateece/bapi-headless/web/messages/`
5. Test on staging: `/de`, `/fr`, `/vi`, etc.
6. Commit to `feat/phase1-translations` branch

---

## Phase 7: Testing Translations (1-2 days)

### Automated Tests

```bash
cd /home/ateece/bapi-headless/web

# Check all translation files are valid JSON
for file in messages/*.json; do
  echo "Validating $file..."
  node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))"
done

# Check for missing keys (compare to en.json)
pnpm run test:translations  # Add this script if needed
```

### Manual Tests

**For Each Language:**
1. Visit `http://localhost:3000/de` (or /fr, /es, /ja, /zh, /vi, /ar)
2. Check:
   - ✅ Navigation translated
   - ✅ Footer sections translated
   - ✅ Contact info correct
   - ✅ No missing keys showing
   - ✅ Placeholders replaced: © 2026 (not © {year})
   - ✅ Professional tone maintained

**Vietnamese Priority Checklist:**
- ✅ Vietnam facility mentioned correctly
- ✅ Address format appropriate
- ✅ Currency: VND (₫)
- ✅ Diacritics correct (Tiếng Việt not Tieng Viet)
- ✅ Formal business tone

**Arabic Special Checks:**
- ✅ RTL layout working
- ✅ Text right-aligned
- ✅ Icons/logos not mirrored
- ✅ Numbers displayed correctly

---

## Phase 8: Continuous Updates

### When You Update en.json

1. Edit `web/messages/en.json` with new keys
2. Commit to GitHub
3. **Crowdin auto-syncs** new keys (via GitHub integration)
4. Translators notified of new strings
5. Translate → Approve → Auto-PR → Merge

### Translation Memory (TM)

Crowdin automatically builds Translation Memory:
- "Temperature Sensor" translated once → Reused across all future projects
- Saves 30-50% on future translations
- Ensures consistency

---

## Pricing Breakdown

### Crowdin Platform
- Team Plan: $99/month
- 14-day free trial (start now, cancel after Phase 1 if needed)

### Translation Costs

**Via Crowdin Vendors:**
- English source: ~2,500 words (310 keys × 8 words avg)
- 7 target languages: 2,500 × 7 = 17,500 words
- Rate: $0.10/word average
- **Total: ~$1,750**

**Total Cost: ~$1,850 for Phase 1** (vs $2,500-4,000 Smartling)

---

## Success Metrics

**By March 10, 2026:**
- ✅ All 8 languages 100% translated
- ✅ Vietnamese completed FIRST (Vietnam facility priority)
- ✅ Translation quality: 95%+ accuracy
- ✅ No missing keys or errors
- ✅ Professional B2B tone maintained
- ✅ All technical terms correct

**Go-Live April 10:**
- ✅ 9 languages live (EN + 8 translations)
- ✅ Language switcher working
- ✅ Fallback system tested
- ✅ Vietnam facility launch ready 🇻🇳

---

## Pro Tips

### 1. Mark High-Priority Strings
In Crowdin Editor, you can flag keys as:
- 🔴 **High Priority**: Vietnam facility text, CTAs, checkout
- 🟡 **Medium**: Product descriptions, footer
- 🟢 **Low**: Marketing copy, blog content

### 2. Use Pre-Translation
Crowdin can pre-translate using:
- **AI Translation** (GPT-4/Claude) - ⭐ **RECOMMENDED** - Fast, accurate, context-aware
- Translation Memory (from previous work)
- Machine Translation (Google/DeepL) - Legacy option, less sophisticated than AI
- Then human translators review/edit (faster + cheaper)

**Best Practice:** Use AI Translation for initial pass, then human review for critical content (Vietnam facility, checkout flow).

### 3. Set Up Webhooks
Get notified when translations complete:
1. **Settings → Integrations → Webhooks**
2. Add webhook URL: `https://bapi-headless.vercel.app/api/translations-ready`
3. Trigger: "Translation approved"
4. Auto-deploy to staging

### 4. Quality Assurance Checks
Enable built-in QA:
- **Settings → Quality Assurance**
- ✅ Check placeholders ({year})
- ✅ Check HTML/Markdown tags
- ✅ Check leading/trailing spaces
- ✅ Check duplicate translations

---

## Support & Resources

- **Crowdin Help Center**: [support.crowdin.com](https://support.crowdin.com)
- **Live Chat**: Available in Crowdin dashboard
- **GitHub Integration**: [support.crowdin.com/github-integration](https://support.crowdin.com/github-integration)
- **JSON File Format**: [support.crowdin.com/file-formats/json](https://support.crowdin.com/file-formats/json)

---

## Next Steps

**Today (Feb 11):**
1. ✅ Sign up for Crowdin (14-day free trial)
2. ✅ Create project
3. ✅ Upload `en.json`
4. ✅ Add Thai as 9th language

**This Week (Feb 11 - Feb 14):**
1. ✅ Add glossary (technical terms)
2. ✅ Add screenshots (context)
3. ✅ Choose translation method

**Option A: DIY AI Translation ⭐ CHEAPEST (1 day)**
- **Feb 11 Evening**: Set up Claude API (~30 min)
- **Feb 11 Night**: Run translation script for all 8 languages (~1 hour)
- **Feb 12**: Upload to Crowdin, spot-check quality
- **Feb 13**: Human review Vietnamese if needed
- **Total Cost:** ~$5-20 (Claude API only)

**Option B: Crowdin AI Translation (3-4 days)**
- **Feb 11**: Purchase AI credits (~$250-500)
- **Feb 11 Evening**: Run AI pre-translation (10 minutes)
- **Feb 12-13**: Human review Vietnamese (URGENT for Vietnam facility)
- **Feb 14**: Spot-check other languages, download files
- **Total Cost:** ~$350-600 (Pro + AI credits)

**Option C: Human Translation (7-10 days)**
- **Week of Feb 17**: Hire translators, begin translations
- **Week of Feb 24**: Review and approve
- **By March 3**: Download and test all 8 languages
- **Total Cost:** ~$1,800-2,100

**Both Options:**
- **April 10**: 🚀 Go live with 9 languages!

---

**Questions?** Check the Crowdin dashboard or contact support via live chat.

**Ready to start?** → [crowdin.com/signup](https://crowdin.com/signup) 🚀
