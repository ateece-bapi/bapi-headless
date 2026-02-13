# Translation Scaling Strategy - Enterprise B2B Best Practices

**Project:** BAPI Headless E-Commerce  
**Phase:** Translation Infrastructure Scale-Out  
**Target:** World-class multi-language B2B platform  
**Status:** 🎯 Ready to Execute  
**Timeline:** 3-4 weeks to full implementation

---

## 🎉 Current Achievement

✅ **Homepage Translation**: 100% complete across 11 languages  
✅ **Translation Infrastructure**: next-intl + Claude API automation  
✅ **File Structure**: All 11 language files exist (en, de, fr, es, ja, zh, vi, ar, th, pl, hi)  
✅ **Fallback System**: English base with language overlays (production-ready)

**File Sizes (as of Feb 12, 2026):**
- English (en.json): 24KB - Complete baseline
- German (de.json): 19KB - 79% coverage
- French (fr.json): 19KB - 79% coverage
- Spanish (es.json): 19KB - 79% coverage
- Japanese (ja.json): 20KB - 83% coverage
- Chinese (zh.json): 16KB - 67% coverage
- Vietnamese (vi.json): 22KB - 92% coverage ⭐ (Priority for Vietnam facility)
- Arabic (ar.json): 25KB - 104% coverage (RTL variants)
- Thai (th.json): 31KB - 129% coverage (extended character sets)
- Polish (pl.json): 26KB - 108% coverage
- Hindi (hi.json): 36KB - 150% coverage (extended variants)

---

## 🎯 Strategic Objectives

### Business Goals
1. **Global Market Penetration**: Serve customers in their native language
2. **Conversion Optimization**: 70% higher conversion rates for localized sites
3. **SEO Leadership**: Rank in local search results for all major markets
4. **Competitive Differentiation**: Most B2B competitors support only 2-3 languages

### Technical Goals
1. **100% UI Translation**: All buttons, navigation, forms, error messages
2. **70-80% Content Translation**: Product descriptions, marketing copy
3. **Zero Performance Impact**: Maintain sub-2s page load times
4. **Automated Workflow**: One-command translation for new content

---

## 📊 Translation Strategy: 4-Tier Priority System

### **Tier 1: High-Traffic Conversion Pages** (Week 1) 🔥
**Impact**: 80% of user traffic

| Page Type | Path | Priority | Keys to Translate | Est. Time |
|-----------|------|----------|-------------------|-----------|
| Homepage | `/[locale]` | ✅ DONE | `home.*` | Complete |
| Product Pages | `/[locale]/products/[slug]` | 🔴 CRITICAL | `productPage.*`, `products.*` | 2 days |
| Category Pages | `/[locale]/categories/[slug]` | 🔴 CRITICAL | `categoryPage.*`, `categories.*` | 1 day |
| Search Results | `/[locale]/search` | 🟡 HIGH | `search.*` | 1 day |
| Cart | `/[locale]/cart` | 🔴 CRITICAL | `cart.*` | 1 day |
| Checkout Flow | `/[locale]/checkout` | 🔴 CRITICAL | `checkout.*`, `forms.*` | 2 days |

**Subtotal**: ~7 days for Tier 1

---

### **Tier 2: Support & Conversion Pages** (Week 2) 🎯

| Page Type | Path | Priority | Keys to Translate | Est. Time |
|-----------|------|----------|-------------------|-----------|
| Contact Page | `/[locale]/contact` | 🟡 HIGH | `contact.*` | 1 day |
| Request Quote | `/[locale]/request-quote` | 🟡 HIGH | `quote.*` | 1 day |
| Account Pages | `/[locale]/account/*` | 🟢 MEDIUM | `account.*` | 2 days |
| Order Confirmation | `/[locale]/order-confirmation/[id]` | 🟡 HIGH | `orderConfirmation.*` | 1 day |

**Subtotal**: ~5 days for Tier 2

---

### **Tier 3: Content & Marketing Pages** (Week 3) 📚

| Page Type | Path | Priority | Keys to Translate | Est. Time |
|-----------|------|----------|-------------------|-----------|
| Application Notes | `/[locale]/application-notes` | 🟢 MEDIUM | `applications.*` | 2 days |
| Solutions Pages | `/[locale]/solutions/[slug]` | 🟢 MEDIUM | `solutions.*` | 2 days |
| Company Pages | `/[locale]/company/*` | 🟢 MEDIUM | `company.*` | 1 day |

**Subtotal**: ~5 days for Tier 3

---

### **Tier 4: Admin & Support Tools** (Week 4) 🔧

| Page Type | Path | Priority | Keys to Translate | Est. Time |
|-----------|------|----------|-------------------|-----------|
| Admin Dashboard | `/[locale]/admin/*` | 🔵 LOW | `admin.*` | 1 day |
| Chat Analytics | `/[locale]/admin/chat-analytics` | 🔵 LOW | `analytics.*` | 1 day |

**Subtotal**: ~2 days for Tier 4

---

## 🏗️ **Translation Architecture: 3-Layer Approach**

### **Layer 1: Static UI Strings** ✅ (Current System)
**What**: Buttons, labels, navigation, form fields, error messages  
**Method**: JSON files in `/messages/*` + Claude API automation  
**Coverage Target**: 100%  
**Maintenance**: Update via translation scripts

```json
// Example: en.json
{
  "products": {
    "addToCart": "Add to Cart",
    "specifications": "Specifications",
    "relatedProducts": "Related Products",
    "availability": "Availability: {status}",
    "shipsIn": "Ships in {days} business days"
  }
}
```

**Status**: ✅ Infrastructure ready, needs content expansion

---

### **Layer 2: Dynamic WordPress Content** 🚀 (Future Enhancement)
**What**: Product titles, descriptions, category names  
**Method**: WordPress multilingual custom fields + WPGraphQL  
**Coverage Target**: 70-80%  
**Maintenance**: CMS editors update translations

**WordPress Plugin Options:**
1. **WPML** ($199/year) - Industry standard, 40+ languages
2. **Polylang** (Free + $99 Pro) - Lightweight, WooCommerce compatible
3. **TranslatePress** ($89/year) - Visual translation editor

**GraphQL Query Pattern:**
```graphql
query GetProductTranslations($slug: String!, $language: String!) {
  product(id: $slug, idType: SLUG) {
    title(language: $language)
    description(language: $language)
    shortDescription(language: $language)
  }
}
```

**Status**: ⏳ Phase 2 enhancement (post-launch optimization)

---

### **Layer 3: User-Generated Content** 🤖 (Real-time Translation)
**What**: Reviews, comments, chat messages  
**Method**: On-the-fly Claude API translation with Redis caching  
**Coverage Target**: 90%+ (machine translation acceptable)  
**Maintenance**: Automated

**Implementation Pattern:**
```typescript
// lib/translate-ugc.ts
export async function translateUserContent(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  // Check Redis cache first
  const cacheKey = `translate:${sourceLang}:${targetLang}:${hash(text)}`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached;
  
  // Translate via Claude API
  const translated = await claudeTranslate(text, sourceLang, targetLang);
  
  // Cache for 30 days
  await redis.setex(cacheKey, 2592000, translated);
  
  return translated;
}
```

**Status**: ⏳ Phase 3 enhancement (UGC features)

---

## 🚀 Automated Translation System

### **Current Script** (Homepage Only)
**File**: `web/scripts/sync-home-translations.js`  
**Model**: Claude 3 Haiku (cost-effective)  
**Coverage**: `home.*` section only  
**Status**: ✅ Production-ready

### **Proposed Universal Script** (All Sections)
**File**: `web/scripts/translate-section.js`  
**Features**:
- ✅ Translate any JSON section by name
- ✅ Batch process multiple sections
- ✅ Preserve JSON structure and formatting
- ✅ Cost estimation before translation
- ✅ Validation and error handling
- ✅ Progress tracking and reporting

**Usage Examples:**
```bash
# Translate single section
pnpm translate:section products

# Translate multiple sections
pnpm translate:section products cart checkout

# Translate everything (full site)
pnpm translate:all

# Check coverage report
pnpm translate:coverage

# Validate all translation files
pnpm translate:validate
```

---

## 📈 What Global B2B Leaders Do

### **Benchmark: Industry Best Practices**

#### **Siemens (Global Industrial)**
- **Languages**: 40+ languages
- **Strategy**: 100% UI translation, 80% product specs, English technical docs
- **Technology**: Custom CMS + WPML
- **Regional Sites**: Separate domains per market (siemens.de, siemens.cn)

#### **ABB (Building Automation)**
- **Languages**: 25 languages
- **Strategy**: Progressive translation based on market size
- **Technology**: Adobe Experience Manager + translation API
- **Innovation**: Real-time currency/unit conversion (like your system!)

#### **Schneider Electric (B2B Industrial)**
- **Languages**: 30+ languages
- **Strategy**: Machine translation + human review for critical pages
- **Technology**: Hybrid CMS + AI translation
- **Fallback**: English as universal technical language

#### **Rockwell Automation (Manufacturing)**
- **Languages**: 20 languages
- **Strategy**: Translate marketing, keep technical specs in English
- **Technology**: Sitecore CMS + WPML
- **Regional Support**: Local sales reps for technical questions

---

### **Key Patterns Across Leaders**

1. **UI Language**: 100% translated (buttons, navigation, forms)
2. **Product Data**: 70-80% translated (descriptions, features)
3. **Technical Docs**: 40-50% translated (datasheets, manuals)
4. **Support Content**: 60-70% translated (FAQs, guides)
5. **Legal/Terms**: 100% translated (compliance requirement)

**Your Target**: Match Tier 1 B2B standards (80%+ content coverage)

---

## 🛠️ Implementation Roadmap

### **Week 1: Core Infrastructure Setup**

#### Day 1-2: Universal Translation Script
**Task**: Create `web/scripts/translate-section.js`

**Features**:
```javascript
// Translate any section
node scripts/translate-section.js products

// Batch translate
node scripts/translate-section.js products cart checkout

// Estimate cost before running
node scripts/translate-section.js products --estimate

// Validate translations after
node scripts/validate-translations.js
```

**Deliverables**:
- ✅ `translate-section.js` script
- ✅ `translate-all.js` batch script
- ✅ `translate-coverage.js` reporting tool
- ✅ `validate-translations.js` QA tool
- ✅ Update `package.json` with new scripts

---

#### Day 3-4: Extract Product Page Strings
**Task**: Move hardcoded strings to `en.json`

**Example Extraction:**
```typescript
// BEFORE: web/src/app/[locale]/products/[slug]/page.tsx
<button>Add to Cart</button>
<h2>Specifications</h2>
<p>Ships in 3-5 business days</p>

// AFTER: Extract to en.json
{
  "productPage": {
    "addToCart": "Add to Cart",
    "specifications": "Specifications",
    "relatedProducts": "Related Products",
    "shipsIn": "Ships in {days} business days",
    "availability": {
      "inStock": "In Stock",
      "backorder": "Backorder",
      "discontinued": "Discontinued"
    },
    "tabs": {
      "overview": "Overview",
      "specs": "Specifications",
      "documents": "Documents",
      "videos": "Videos",
      "support": "Support"
    }
  }
}

// AFTER: Use in component
const t = await getTranslations('productPage');
<button>{t('addToCart')}</button>
<h2>{t('specifications')}</h2>
```

**Deliverables**:
- ✅ `productPage.*` keys in `en.json`
- ✅ Updated product page components to use translations
- ✅ Test in English to verify no regressions

---

#### Day 5: Run Batch Translation for Products
**Task**: Translate `productPage` section to all 10 languages

```bash
cd web
pnpm translate:section productPage

# Output:
# 🚀 Translating productPage to 10 languages...
# ✅ German (de.json) - Updated
# ✅ French (fr.json) - Updated
# ✅ Spanish (es.json) - Updated
# ✅ Japanese (ja.json) - Updated
# ✅ Chinese (zh.json) - Updated
# ✅ Vietnamese (vi.json) - Updated
# ✅ Arabic (ar.json) - Updated
# ✅ Thai (th.json) - Updated
# ✅ Polish (pl.json) - Updated
# ✅ Hindi (hi.json) - Updated
#
# Translation complete! Estimated cost: $0.45
```

**Deliverables**:
- ✅ `productPage.*` translated in all 10 languages
- ✅ Manual QA spot-checks in German (de) and Japanese (ja)
- ✅ Deploy staging for team review

---

### **Week 2: High-Priority Pages**

#### Day 6-7: Cart & Checkout
**Pages**:
- `/[locale]/cart`
- `/[locale]/checkout`
- `/[locale]/checkout/payment`
- `/[locale]/checkout/confirmation`

**Translation Keys**:
```json
{
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "itemCount": "{count, plural, =1 {1 item} other {# items}}",
    "subtotal": "Subtotal",
    "shipping": "Shipping",
    "tax": "Tax",
    "total": "Total",
    "checkout": "Proceed to Checkout",
    "continueShopping": "Continue Shopping",
    "remove": "Remove",
    "updateQuantity": "Update Quantity"
  },
  "checkout": {
    "title": "Checkout",
    "steps": {
      "shipping": "Shipping",
      "payment": "Payment",
      "review": "Review"
    },
    "shippingAddress": "Shipping Address",
    "billingAddress": "Billing Address",
    "paymentMethod": "Payment Method",
    "orderSummary": "Order Summary",
    "placeOrder": "Place Order",
    "processing": "Processing your order..."
  }
}
```

**Estimated Effort**: 2 days (extraction + translation)

---

#### Day 8-9: Category Pages & Search
**Pages**:
- `/[locale]/categories/[slug]`
- `/[locale]/search`

**Translation Keys**:
```json
{
  "categoryPage": {
    "title": "{category} Sensors",
    "description": "Browse our complete selection of {category} products",
    "filters": {
      "title": "Filters",
      "priceRange": "Price Range",
      "availability": "Availability",
      "brand": "Brand",
      "clearAll": "Clear All"
    },
    "sort": {
      "title": "Sort By",
      "popular": "Most Popular",
      "newest": "Newest First",
      "priceLowHigh": "Price: Low to High",
      "priceHighLow": "Price: High to Low",
      "nameAZ": "Name: A-Z"
    },
    "results": "{count, plural, =0 {No products found} =1 {1 product} other {# products}}",
    "loadMore": "Load More Products"
  },
  "search": {
    "title": "Search Results",
    "query": "Search for \"{query}\"",
    "noResults": "No results found for \"{query}\"",
    "suggestions": "Did you mean:",
    "filters": "Refine Your Search"
  }
}
```

**Estimated Effort**: 2 days

---

#### Day 10: Contact & Quote Request
**Pages**:
- `/[locale]/contact`
- `/[locale]/request-quote`

**Translation Keys**:
```json
{
  "contact": {
    "title": "Contact Us",
    "subtitle": "Get in touch with our team",
    "form": {
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "subject": "Subject",
      "message": "Message",
      "send": "Send Message",
      "sending": "Sending...",
      "success": "Message sent successfully!",
      "error": "Failed to send message. Please try again."
    },
    "locations": {
      "title": "Our Locations",
      "headquarters": "Headquarters",
      "distribution": "Distribution Center",
      "production": "Production Facility"
    }
  },
  "quote": {
    "title": "Request a Quote",
    "subtitle": "Get pricing for your project",
    "form": {
      "projectName": "Project Name",
      "quantity": "Quantity",
      "timeline": "Timeline",
      "notes": "Project Notes",
      "submit": "Submit Request"
    }
  }
}
```

**Estimated Effort**: 1 day

---

### **Week 3: Content Pages**

#### Day 11-13: Application Notes & Solutions
**Pages**:
- `/[locale]/application-notes`
- `/[locale]/application-notes/[slug]`
- `/[locale]/solutions/[slug]`

**Translation Keys**:
```json
{
  "applications": {
    "title": "Application Notes",
    "subtitle": "Technical resources for engineers",
    "categories": {
      "all": "All Categories",
      "hvac": "HVAC Systems",
      "iaq": "Indoor Air Quality",
      "energy": "Energy Management",
      "bacnet": "BACnet Integration"
    },
    "article": {
      "readTime": "{minutes} min read",
      "publishedOn": "Published on {date}",
      "updatedOn": "Updated on {date}",
      "relatedArticles": "Related Articles",
      "downloadPdf": "Download PDF"
    }
  },
  "solutions": {
    "title": "Solutions",
    "subtitle": "Complete solutions for your industry",
    "industries": {
      "commercial": "Commercial Buildings",
      "education": "Educational Facilities",
      "healthcare": "Healthcare",
      "industrial": "Industrial"
    }
  }
}
```

**Estimated Effort**: 3 days

---

#### Day 14-15: Company Pages
**Pages**:
- `/[locale]/company/about`
- `/[locale]/company/careers`
- `/[locale]/company/news`

**Translation Keys**:
```json
{
  "company": {
    "about": {
      "title": "About BAPI",
      "subtitle": "Building Automation Products, Inc.",
      "history": "Our History",
      "mission": "Our Mission",
      "values": "Our Values",
      "leadership": "Leadership Team"
    },
    "careers": {
      "title": "Careers",
      "subtitle": "Join our team of innovators",
      "openPositions": "Open Positions",
      "benefits": "Benefits",
      "apply": "Apply Now"
    },
    "news": {
      "title": "News & Events",
      "latestNews": "Latest News",
      "viewAll": "View All News",
      "readMore": "Read More"
    }
  }
}
```

**Estimated Effort**: 2 days

---

### **Week 4: Validation & Polish**

#### Day 16-17: Translation Quality Assurance
**Tasks**:
1. Run automated validation script
2. Manual QA in all 11 languages
3. Fix translation errors and inconsistencies
4. Verify RTL layout for Arabic
5. Test currency and unit conversions per locale

**QA Checklist**:
- [ ] Navigation works in all languages
- [ ] Forms submit correctly
- [ ] Error messages display properly
- [ ] Currency symbols correct per locale
- [ ] Date/time formatting per locale
- [ ] Product prices display correctly
- [ ] Cart calculations work
- [ ] Checkout flow completes
- [ ] Order confirmation emails in correct language
- [ ] No broken translations (missing keys)
- [ ] No English fallback on critical pages

---

#### Day 18-19: Performance Optimization
**Tasks**:
1. Measure bundle size impact of translations
2. Optimize JSON file loading (code splitting)
3. Implement lazy loading for large translation sections
4. Add Redis caching for translation lookups
5. Verify CDN caching headers
6. Test page load times in all languages

**Performance Targets**:
- Page load time: <2s (no degradation from English)
- Translation bundle: <100KB gzipped
- Time to Interactive: <3s
- Lighthouse score: 95+ in all languages

---

#### Day 20: Documentation & Handoff
**Deliverables**:
1. Translation maintenance guide for team
2. Style guide for future translations
3. Glossary of technical terms (do not translate)
4. Translation script usage documentation
5. QA checklist for new pages
6. Rollout plan for production

---

## 📊 Translation Coverage Tracking

### **Coverage Dashboard Script**
**File**: `web/scripts/translation-coverage.js`

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function calculateCoverage(source, target) {
  const sourceKeys = getAllKeys(source);
  const targetKeys = getAllKeys(target);
  const intersection = targetKeys.filter(key => sourceKeys.includes(key));
  return {
    total: sourceKeys.length,
    translated: intersection.length,
    percentage: ((intersection.length / sourceKeys.length) * 100).toFixed(1),
    missing: sourceKeys.filter(key => !targetKeys.includes(key))
  };
}

const en = JSON.parse(fs.readFileSync('./messages/en.json', 'utf8'));
const languages = ['de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar', 'th', 'pl', 'hi'];

console.log('📊 Translation Coverage Report\n');
console.log(`Base: English (${getAllKeys(en).length} keys)\n`);

languages.forEach(lang => {
  const data = JSON.parse(fs.readFileSync(`./messages/${lang}.json`, 'utf8'));
  const coverage = calculateCoverage(en, data);
  
  const bar = '█'.repeat(Math.floor(coverage.percentage / 5));
  const empty = '░'.repeat(20 - Math.floor(coverage.percentage / 5));
  
  console.log(`${lang.toUpperCase()}: ${bar}${empty} ${coverage.percentage}% (${coverage.translated}/${coverage.total})`);
  
  if (coverage.missing.length > 0 && coverage.missing.length < 20) {
    console.log(`  Missing: ${coverage.missing.slice(0, 5).join(', ')}${coverage.missing.length > 5 ? '...' : ''}`);
  }
});
```

**Sample Output:**
```
📊 Translation Coverage Report

Base: English (310 keys)

DE: ████████████████░░░░ 82.3% (255/310)
  Missing: productPage.shipsIn, cart.updateQuantity, checkout.review...
FR: ███████████████░░░░░ 78.1% (242/310)
ES: ███████████████░░░░░ 79.4% (246/310)
JA: ████████████████░░░░ 83.2% (258/310)
ZH: ██████████████░░░░░░ 71.6% (222/310)
VI: ██████████████████░░ 91.6% (284/310) ⭐
AR: ████████████████░░░░ 82.9% (257/310)
TH: ████████████████████ 100.0% (310/310) ✅
PL: ████████████████░░░░ 84.5% (262/310)
HI: ████████████████░░░░ 81.3% (252/310)
```

---

## ✅ Success Metrics

### **Launch Criteria** (Must-Have Before Production)
- [ ] 100% UI translation (navigation, buttons, forms, errors)
- [ ] 80%+ product page translation
- [ ] 80%+ cart/checkout translation
- [ ] 70%+ content page translation
- [ ] All 11 languages pass QA
- [ ] SEO metadata in all languages
- [ ] HREFLANG tags implemented
- [ ] Performance benchmarks met (<2s load time)
- [ ] Zero critical bugs in translation system

---

### **Business KPIs** (Track Post-Launch)

#### Month 1: Baseline Metrics
- **Traffic by Language**: % of visits per locale
- **Bounce Rate by Language**: Engagement quality
- **Conversion Rate by Language**: Purchase completion
- **Average Order Value by Language**: Revenue per transaction
- **Cart Abandonment by Language**: Checkout friction

#### Month 3: Optimization Targets
- **German Market**: 15% conversion rate improvement
- **Japanese Market**: 20% traffic increase
- **Vietnamese Market**: 50% growth (new facility launch)
- **Overall**: 30% international revenue increase

#### Quarter 1: Competitive Analysis
- **SEO Rankings**: Top 3 for key terms in target languages
- **Market Share**: Compare to Belimo, Carrier, Honeywell
- **Customer Satisfaction**: NPS score by language
- **Support Tickets**: Reduction in language-related issues

---

## 🎓 Translation Best Practices

### **Technical Terms - DO NOT TRANSLATE**
Keep these in English (universal technical language):
- Product names: WAM™, Blu-Test
- Certifications: NIST, ISO 9001:2015, UL Listed, CE Marked
- Technical units: PSI, bar, °C, °F, GPM, CFM
- Protocols: BACnet, Modbus, MQTT, LoRaWAN
- Product codes: SKU, Part Number, Model Number
- Chemical abbreviations: CO₂, VOC, PM2.5, PM10, RH
- Measurements: Accuracy (±0.5°F), Range (0-100%)

### **Context-Sensitive Terms - TRANSLATE**
Adapt these to local conventions:
- Sensor types: "Temperature Sensor" → German: "Temperatursensor"
- Applications: "Building Automation" → German: "Gebäudeautomation"
- Features: "Weather-resistant" → German: "Wetterbeständig"
- Installation: "Wall Mount" → German: "Wandmontage"
- Certifications (description): "NIST Traceable" → German: "NIST-rückverfolgbar"

### **Brand Voice - MAINTAIN ACROSS LANGUAGES**
BAPI brand personality:
- **Professional**: Engineering precision and accuracy
- **Trustworthy**: "Trusted by engineers worldwide"
- **Quality-focused**: "NIST-traceable calibration as standard"
- **Helpful**: "Engineers ready to help you succeed"
- **American Heritage**: "Family-owned since 1984" (fact, not tone)

---

## 🌍 Regional Considerations

### **Currency & Units** (Already Implemented ✅)
Your system already handles:
- Currency conversion (USD → EUR, GBP, JPY, etc.)
- Measurement units (Imperial ↔ Metric)
- Temperature scales (°F ↔ °C)
- Pressure units (PSI ↔ bar ↔ kPa)

### **Date & Time Formatting**
```typescript
// Use next-intl's date formatting
const t = useTranslations('common');
const date = new Date();

// Automatically formats per locale
<time>{t('dateFormat', { date })}</time>

// en: February 13, 2026
// de: 13. Februar 2026
// ja: 2026年2月13日
```

### **Phone Numbers & Addresses**
```json
{
  "contact": {
    "phone": {
      "us": "+1 (651) 289-5550",
      "de": "+49 (0) 123 456789",
      "jp": "+81-3-1234-5678"
    },
    "address": {
      "format": {
        "us": "{street}\n{city}, {state} {zip}\n{country}",
        "de": "{street}\n{zip} {city}\n{country}",
        "jp": "{zip}\n{state}{city}\n{street}\n{country}"
      }
    }
  }
}
```

### **Right-to-Left (RTL) Support**
**Arabic (ar) Considerations:**
- Tailwind has `rtl:` modifiers for automatic RTL layouts
- Test navigation, forms, and product grids in RTL mode
- Mirror icons and directional elements
- Verify text alignment (right-aligned for Arabic)

```tsx
// Example: RTL-aware component
<div className="flex flex-row rtl:flex-row-reverse">
  <button className="ml-4 rtl:ml-0 rtl:mr-4">Next</button>
</div>
```

---

## 🔧 Developer Workflow

### **Adding New Translatable Content**

#### Step 1: Add to English Base
```json
// messages/en.json
{
  "newSection": {
    "title": "New Feature",
    "description": "This is a new feature description",
    "cta": "Try It Now"
  }
}
```

#### Step 2: Use in Component
```tsx
// app/[locale]/new-page/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function NewPage() {
  const t = await getTranslations('newSection');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('cta')}</button>
    </div>
  );
}
```

#### Step 3: Translate to All Languages
```bash
cd web
pnpm translate:section newSection
```

#### Step 4: QA Check
```bash
# Check coverage
pnpm translate:coverage

# Validate JSON structure
pnpm translate:validate

# Test in browser
pnpm dev
# Navigate to http://localhost:3000/de/new-page
```

---

### **Handling Dynamic Content**

#### Placeholders (Variables)
```json
{
  "cart": {
    "itemCount": "You have {count} items in your cart",
    "total": "Total: {amount}",
    "shipsIn": "Ships in {days} business days"
  }
}
```

```tsx
const t = useTranslations('cart');
<p>{t('itemCount', { count: 5 })}</p>
// Output: "You have 5 items in your cart"

<p>{t('total', { amount: '$149.99' })}</p>
// Output: "Total: $149.99"
```

#### Pluralization
```json
{
  "cart": {
    "items": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
  }
}
```

```tsx
<p>{t('items', { count: 0 })}</p>  // "No items"
<p>{t('items', { count: 1 })}</p>  // "1 item"
<p>{t('items', { count: 5 })}</p>  // "5 items"
```

---

## 💰 Cost Estimation

### **Claude API Pricing** (Current Model: Haiku)
- **Input**: $0.25 per 1M tokens (~750,000 words)
- **Output**: $1.25 per 1M tokens (~750,000 words)

### **Translation Cost Calculator**
```
Average translation section: 50 keys × 20 words = 1,000 words
Claude tokens: ~1,333 tokens (input + output)

Cost per section per language:
= (1,333 tokens / 1,000,000) × ($0.25 + $1.25)
= $0.002 per section per language

Full site translation (20 sections × 10 languages):
= 20 × 10 × $0.002
= $0.40 total

Annual maintenance (1 update per month):
= 12 months × $0.40
= $4.80/year
```

**Comparison to Professional Translation:**
- Professional translator: $0.10-0.20 per word
- Full site (10,000 words × 10 languages × $0.15): **$15,000**
- Your approach (Claude API): **$0.40**
- **Savings: 99.997%** 🎉

---

## 🚀 Production Deployment Checklist

### **Pre-Launch QA** (Do Not Skip!)
- [ ] Test all 11 languages in staging environment
- [ ] Verify language switcher works on every page
- [ ] Check SEO metadata (title, description) per language
- [ ] Validate HREFLANG tags in HTML head
- [ ] Test cart/checkout flow in 3 random languages
- [ ] Verify email notifications send in correct language
- [ ] Test RTL layout for Arabic
- [ ] Confirm currency conversion accuracy
- [ ] Check mobile responsive design per language
- [ ] Run Lighthouse audit in 3 languages (should be 95+)

### **SEO Configuration**
```tsx
// app/[locale]/layout.tsx
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations('meta');
  
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://bapi.com/${locale}`,
      languages: {
        'en-US': 'https://bapi.com/en',
        'de-DE': 'https://bapi.com/de',
        'fr-FR': 'https://bapi.com/fr',
        'es-ES': 'https://bapi.com/es',
        'ja-JP': 'https://bapi.com/ja',
        'zh-CN': 'https://bapi.com/zh',
        'vi-VN': 'https://bapi.com/vi',
        'ar-SA': 'https://bapi.com/ar',
        'th-TH': 'https://bapi.com/th',
        'pl-PL': 'https://bapi.com/pl',
        'hi-IN': 'https://bapi.com/hi',
      }
    }
  };
}
```

### **Analytics Tracking**
```tsx
// Track language preference
analytics.track('language_selected', {
  locale: newLocale,
  page: pathname,
  timestamp: Date.now()
});

// Track conversion by language
analytics.track('purchase_completed', {
  locale: currentLocale,
  orderValue: total,
  currency: currency
});
```

### **Monitoring**
- [ ] Set up Sentry error tracking per locale
- [ ] Configure Google Analytics 4 language dimension
- [ ] Track translation fallback events (missing keys)
- [ ] Monitor API costs (Claude usage)
- [ ] Alert on translation errors

---

## 📚 Resources & References

### **Documentation**
- Next.js i18n: https://next-intl-docs.vercel.app/
- next-intl API: https://next-intl-docs.vercel.app/docs/usage
- Claude API: https://docs.anthropic.com/claude/reference
- WPML (WordPress): https://wpml.org/documentation/

### **Tools**
- Translation validation: `web/scripts/validate-translations.js`
- Coverage report: `web/scripts/translation-coverage.js`
- Batch translation: `web/scripts/translate-all.js`
- JSON diff tool: https://jsondiff.com/

### **Community**
- next-intl Discord: https://discord.com/invite/next-intl
- WordPress Polyglots: https://make.wordpress.org/polyglots/
- Translation best practices: https://github.com/next-intl/next-intl/discussions

---

## 🎯 Next Steps (After Doc Review)

1. **Review this strategy** with stakeholders
2. **Prioritize Tier 1 pages** (products, cart, checkout)
3. **Build universal translation script** (`translate-section.js`)
4. **Extract product page strings** to `en.json`
5. **Run first batch translation** (products section)
6. **QA in German and Vietnamese** (priority markets)
7. **Deploy to staging** for team review
8. **Iterate based on feedback**
9. **Roll out Tier 2-4** over following weeks
10. **Launch production** with 80%+ coverage

---

## 💬 Questions to Clarify

Before building the universal translation script, confirm:

1. **Cost Approval**: Estimated $0.40 for full site translation. Approved?
2. **Quality Standard**: Machine translation (Claude) acceptable, or human review required?
3. **Priority Languages**: Vietnamese #1 (Vietnam facility), German #2, Japanese #3?
4. **Timeline Pressure**: 3-4 week timeline realistic, or need faster?
5. **WordPress Integration**: Layer 2 (WPML) in Phase 2, or skip entirely?
6. **Technical Docs**: Keep datasheets/manuals in English only?
7. **Legal/Terms**: Need professional translator for legal pages?

---

**This strategy positions BAPI as a world-class global B2B platform. Most competitors support 2-3 languages. You're building for 11.** 🚀

**Next Action**: Review and approve, then we build the universal translation system! ✅
