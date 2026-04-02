# Product Cards - Phase 1 Pre-Review Analysis

**Date:** April 2, 2026  
**Purpose:** Heuristic analysis, analytics review, competitive benchmarking, and user journey mapping  
**For:** Matt (UI/UX Designer) - Pre-Storybook review context  

---

## 📋 Table of Contents

1. [Heuristic Analysis (Nielsen's 10)](#1-heuristic-analysis-nielsens-10)
2. [Analytics Setup & Data Gaps](#2-analytics-setup--data-gaps)
3. [Competitive Benchmarking](#3-competitive-benchmarking)
4. [User Journey Mapping](#4-user-journey-mapping)
5. [Critical Design Issues Found](#5-critical-design-issues-found)
6. [Recommendations for Matt](#6-recommendations-for-matt)

---

## 1. Heuristic Analysis (Nielsen's 10)

### Methodology
Evaluated both ProductCard implementations against [Nielsen Norman Group's 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/).

| Heuristic | Basic ProductCard | Advanced ProductCard (Production) | Winner | Priority |
|-----------|------------------|-----------------------------------|---------|----------|
| **1. Visibility of System Status** | ⚠️ No loading states | ✅ Shimmer effect during image load | **Advanced** | HIGH |
| **2. Match System & Real World** | ✅ "View Details" natural language | ✅ "Quick View", "Compare" familiar | **Tie** | - |
| **3. User Control & Freedom** | ❌ No comparison/undo | ✅ Toggle comparison on/off | **Advanced** | HIGH |
| **4. Consistency & Standards** | ⚠️ Inconsistent with production | ✅ Used site-wide | **Advanced** | CRITICAL |
| **5. Error Prevention** | ✅ Graceful null handling | ✅ Disables comparison when full | **Tie** | - |
| **6. Recognition vs Recall** | ⚠️ Generic card | ✅ Sale/Stock badges reduce recall | **Advanced** | MEDIUM |
| **7. Flexibility & Efficiency** | ✅ List view for power users | ❌ Grid only | **Basic** | MEDIUM |
| **8. Aesthetic & Minimalist** | ⚠️ Decorative corner unnecessary | ✅ Cleaner, functional badges | **Advanced** | LOW |
| **9. Error Recovery** | ✅ Handles missing images | ✅ Better fallback UI | **Advanced** | LOW |
| **10. Help & Documentation** | ❌ No tooltips/hints | ⚠️ Quick View/Compare not explained | **Neither** | MEDIUM |

### Detailed Findings

#### ✅ **Heuristic #1: Visibility of System Status**
**Winner: Advanced ProductCard**

**Basic ProductCard Issues:**
- No visual feedback during image loading
- No indication of card state (default, hover, active)
- Part number appears/disappears without context

**Advanced ProductCard Strengths:**
- ✅ Shimmer effect shows loading progress
- ✅ Intersection observer provides scroll-based reveal
- ✅ Stock badge shows inventory status
- ✅ Sale badge shows promotional state

**Recommendation:** Add shimmer loading to Basic ProductCard if kept.

---

#### ⚠️ **Heuristic #3: User Control & Freedom**
**Winner: Advanced ProductCard**

**Basic ProductCard Issues:**
- ❌ No way to "save for later" or compare
- ❌ Once you leave card, you lose context
- ❌ Must navigate away to see product details

**Advanced ProductCard Strengths:**
- ✅ Comparison checkbox gives control (add/remove anytime)
- ✅ Quick View allows non-committal peek
- ✅ Hover reveals actions without forcing choice

**Critical Gap:** Neither card has "Add to Wishlist" or "Save for Later" - common in B2B browsing.

---

#### 🚨 **Heuristic #4: Consistency & Standards** 
**Winner: Advanced ProductCard** ⚡ **CRITICAL ISSUE**

**Basic ProductCard Issues:**
- ❌ Not used anywhere in production
- ❌ Different visual language (decorative corner, yellow underline)
- ❌ Inconsistent badge positioning vs Advanced
- ❌ Creates cognitive load for users

**Advanced ProductCard Strengths:**
- ✅ Used site-wide in production
- ✅ Consistent with broader design system
- ✅ Matches user expectations from previous visits

**Impact:** Having TWO different card designs violates consistency principle and confuses users.

**RECOMMENDATION:** **Consolidate immediately.** This is the #1 issue.

---

#### ⚠️ **Heuristic #6: Recognition Rather Than Recall**
**Winner: Advanced ProductCard**

**Basic ProductCard Issues:**
- Users must remember if they saw this product before
- No visual cues for product state (new, sale, popular)
- Price alone doesn't communicate value

**Advanced ProductCard Strengths:**
- ✅ Sale badge = immediate recognition of discount
- ✅ Stock badge = availability at a glance
- ✅ Comparison checkbox shows selected state
- ❌ Missing: "Recently Viewed" indicator
- ❌ Missing: "Popular" or "Best Seller" badges

**Recommendation:** Add "New", "Popular", "Top Rated" badge system.

---

#### ✅ **Heuristic #7: Flexibility & Efficiency of Use**
**Winner: Basic ProductCard**

**Basic ProductCard Strengths:**
- ✅ List view mode for dense information scanning
- ✅ Part number badge for power users who search by SKU
- ✅ Faster scanning in list mode (horizontal layout)

**Advanced ProductCard Weaknesses:**
- ❌ Grid-only forces visual scanning
- ❌ No way to change density/layout
- ❌ No keyboard shortcuts for comparison

**Critical Missing Features (Both):**
- Keyboard navigation (arrow keys to move between cards)
- Bulk actions (compare multiple via keyboard)
- Quick add-to-cart from card (without opening product page)

**Recommendation:** Add list view toggle to Advanced ProductCard.

---

#### ⚠️ **Heuristic #8: Aesthetic & Minimalist Design**
**Winner: Advanced ProductCard**

**Basic ProductCard Issues:**
- 🎨 Decorative corner element serves no function
- 🎨 Yellow underline animation is stylistic, not functional
- 🎨 Drop shadow on image is redundant with card shadow

**Advanced ProductCard Issues:**
- ⚠️ Quick View + Comparison buttons overlap on small screens
- ⚠️ Sale + Stock badges stack, can take significant space
- ⚠️ Gradient CTA button is heavier than needed

**Violations:**
- Basic: **3 decorative elements** that don't aid understanding
- Advanced: **2 potential clutter points** (button overlap, badge stack)

**Recommendation:** 
- Remove decorative corner from Basic
- Limit badges to max 2 visible (priority: Sale > New > Stock)
- Consider icon-only Quick View button to save space

---

#### ⚠️ **Heuristic #10: Help & Documentation**
**Winner: Neither** 🚨 **Both Fail**

**Missing Contextual Help:**
- ❌ What does "Quick View" do? (tooltip needed)
- ❌ How many products can I compare? (3-4 limit not shown until full)
- ❌ What does "Contact for Pricing" mean? (Who to contact? How?)
- ❌ Part number badge has no explanation (why does it sometimes show?)

**Recommendation:** Add tooltips/hints:
```typescript
<Tooltip content="View key specs without leaving this page">
  <QuickViewButton />
</Tooltip>

<Tooltip content="Compare up to 4 products side-by-side">
  <ComparisonCheckbox />
</Tooltip>
```

---

## 2. Analytics Setup & Data Gaps

### ✅ Current Analytics Implementation

**Found in Codebase:**
```typescript
// web/src/components/analytics/AnalyticsClient.tsx
@vercel/analytics/react - Vercel Analytics
@vercel/speed-insights/next - Speed Insights
```

**We HAVE:**
- ✅ Vercel Analytics enabled (page views, unique visitors)
- ✅ Speed Insights (Core Web Vitals)
- ✅ Chat analytics system (`web/src/lib/chat/analytics.ts`)

**Status:** Analytics infrastructure exists but...

### 🚨 **CRITICAL DATA GAPS**

**We DON'T have tracking for:**
- ❌ Product card click-through rate (CTR)
- ❌ Quick View usage rate
- ❌ Product Comparison completion rate
- ❌ Sale badge vs non-sale CTR comparison
- ❌ Stock badge impact on conversion
- ❌ Hover-to-click time (engagement depth)
- ❌ Mobile vs Desktop card interaction differences
- ❌ List view vs Grid view preference
- ❌ Part number badge clicks (if clickable)
- ❌ "Contact for Pricing" CTA effectiveness

### 📊 **Analytics We NEED Before Design Decisions**

**Priority: HIGH** 🔥
1. **Product Card CTR by Type**
   - Basic vs Advanced (if A/B testing)
   - With sale badge vs without
   - With Quick View vs without

2. **Feature Usage Rates**
   - Quick View open rate (% of card hovers)
   - Comparison checkbox usage (% of sessions)
   - Comparison completion rate (% who compare → decide)

3. **Error/Friction Points**
   - Comparison limit reached (how often users hit max)
   - "Contact for Pricing" vs direct price (which converts better)
   - Mobile Quick View failures (too small to tap?)

**Priority: MEDIUM** ⚠️
4. **Engagement Metrics**
   - Time hovering on cards
   - Scroll depth through product grids
   - Repeat views of same product (indecision signal)

5. **Device/Context Differences**
   - Mobile vs Desktop behavior
   - Tablet comparison usage
   - Touch vs mouse interaction patterns

### 🔧 **Recommended Analytics Implementation**

**Add to ProductCard components:**

```typescript
// Basic tracking
onClick={() => {
  trackEvent('product_card_click', {
    product_id: product.id,
    product_name: product.name,
    card_type: 'advanced', // or 'basic'
    has_sale_badge: isOnSale,
    has_stock_badge: isInStock,
    viewport: 'desktop', // or 'mobile', 'tablet'
  });
}}

// Quick View tracking
onQuickViewClick={() => {
  trackEvent('quick_view_opened', {
    product_id: product.id,
    trigger: 'button_click', // or 'keyboard_shortcut'
  });
}}

// Comparison tracking
onComparisonToggle={(isAdding) => {
  trackEvent(isAdding ? 'comparison_added' : 'comparison_removed', {
    product_id: product.id,
    comparison_count: currentComparisonCount,
  });
}}
```

### 📈 **Success Metrics to Establish**

**Before making design changes, establish baseline:**

| Metric | Current (Unknown) | Target | Measurement |
|--------|------------------|--------|-------------|
| Product Card CTR | ❓ | 25-35% | Vercel Analytics |
| Quick View Usage | ❓ | 10-15% of hovers | Custom event |
| Comparison Completion | ❓ | 5-8% of sessions | Funnel analysis |
| Sale Badge Lift | ❓ | 1.5x CTR boost | A/B test |
| Mobile vs Desktop Gap | ❓ | <10% difference | Device segmentation |

**ACTION REQUIRED:** Implement analytics BEFORE Matt's design review so decisions are data-informed.

---

## 3. Competitive Benchmarking

### Based on Existing Belimo Analysis

From [COMPETITOR-ANALYSIS-BELIMO.md](./COMPETITOR-ANALYSIS-BELIMO.md):

#### 🏆 **What Belimo Does Well (Product Cards)**

**✅ Clear Visual Hierarchy:**
- Product image dominates (70% of card space)
- Title immediately below image
- Price/CTA clearly separated

**✅ Strong Trust Signals:**
- Certifications badges (UL 2075, ULC-S588)
- "50 Years" anniversary badge
- Sustainability icons (UN SDG alignment)

**✅ Solution-Focused CTAs:**
- "Explore RetroFIT+ Solutions" (context-specific)
- "Energy Valve™ Bundle" (product + service)
- "Calculate Savings" (value-driven action)

**❌ Where Belimo Fails:**
- Information overload (too many badges, text)
- Outdated visual design (circa 2015 aesthetic)
- Slow site speed (noticed in analysis)
- No Quick View or comparison features

#### 🎯 **BAPI's Opportunity**

**Where We Can Win:**
- ✅ **Faster, cleaner interface** (Modern Next.js vs their legacy stack)
- ✅ **Better mobile experience** (noted as Belimo weakness)
- ✅ **Superior technical docs** (already a BAPI strength)
- ✅ **Quick View modal** (we have it, they don't)
- ✅ **Product Comparison** (we have it, they don't)

**Where We Must Match:**
- ⚠️ **Trust signals** - Belimo shows certifications, sustainability badges
- ⚠️ **Solution bundles** - They package products + services
- ⚠️ **Value calculators** - "Energy savings" tools

### 📊 **Competitive Feature Matrix**

| Feature | Belimo | BAPI (Current) | BAPI (Needed) |
|---------|--------|----------------|---------------|
| Quick View | ❌ | ✅ (Advanced) | Keep |
| Product Comparison | ❌ | ✅ (Advanced) | Keep |
| Sale Badges | ✅ | ✅ (Advanced) | Enhance |
| Certification Badges | ✅ | ❌ | **ADD** |
| Stock Status | ⚠️ (hidden) | ✅ (Advanced) | Keep |
| Part Number Badge | ⚠️ (in title) | ✅ (Basic) | **ADD to Advanced** |
| List View Toggle | ❌ | ✅ (Basic) | **ADD to Advanced** |
| Energy Savings | ✅ | ❌ | Consider |
| Mobile Optimized | ❌ | ✅ | Maintain |
| Hover Details | ❌ | ✅ | Enhance |

### 🎨 **Design Inspiration from Best-in-Class B2B**

**Beyond Belimo - Industry Leaders:**

1. **McMaster-Carr** (Industrial Parts)
   - Ultra-clean product cards
   - Instant search within cards
   - Part number prominently displayed
   - Stock quantity shown ("100+ in stock")

2. **Grainger** (Industrial Supply)
   - "Add to Order" without leaving grid
   - Bulk pricing visible on hover
   - "Compare" checkbox (similar to ours)
   - Customer reviews stars on card

3. **Digi-Key** (Electronics)
   - Parametric filters visible on cards
   - Stock "Real-time" indicator
   - Price breaks shown on hover
   - Datasheet download button

### ✅ **Features to Consider Adding**

Based on competitive analysis:

**HIGH PRIORITY:**
1. **Certification/Compliance Badges**
   - UL listings, CE marks, LEED credits
   - Position: Below product image, top-left
   - Example: `web/src/components/products/ComplianceBadges.tsx`

2. **Stock Quantity (not just status)**
   - "50+ in stock" vs generic "In Stock"
   - Creates urgency for low stock
   - McMaster-Carr style

3. **Part Number Visible (Advanced Card)**
   - Currently only in Basic card
   - B2B users search by part number
   - Position: Top-right or below title

**MEDIUM PRIORITY:**
4. **Quick Add-to-Cart**
   - Grainger-style instant add
   - Reduce clicks to purchase
   - Especially for repeat customers

5. **Price Breaks on Hover**
   - "1-9: $149 | 10+: $129"
   - B2B bulk pricing common
   - Could be in Quick View modal

**LOW PRIORITY:**
6. **Energy Savings Calculator**
   - Belimo's differentiator
   - Could be Quick View feature
   - Requires product metadata

---

## 4. User Journey Mapping

### Context: Different Cards for Different Journeys

**Key Insight:** One card design won't fit all user contexts.

### 🗺️ **Journey 1: Product Discovery (Search Results)**

**User Goal:** "Find products matching my specs quickly"

**User Type:** First-time visitor, Engineer researching options

**Context:** 
- Arrived from Google search "building temperature sensor"
- Sees 20-30 search results
- Needs to scan and compare quickly

**Optimal Card Features:**
| Feature | Priority | Rationale |
|---------|----------|-----------|
| Quick View | **CRITICAL** | Avoid leaving search results |
| Comparison Checkbox | **CRITICAL** | Compare 3-4 options |
| Part Number | **HIGH** | Matches spec sheet reference |
| Stock Status | **MEDIUM** | Avoid unavailable products |
| Sale Badge | **LOW** | Not primary decision factor |
| Detailed Description | **LOW** | Slows scanning |

**Recommendation:** **Advanced ProductCard is PERFECT for this.**

---

### 🗺️ **Journey 2: Category Browsing**

**User Goal:** "What temperature sensors do you have?"

**User Type:** Familiar with BAPI, exploring options

**Context:**
- Navigated to "Temperature Sensors" category
- Sees 40-50 products in category
- Might know subcategory (wall-mount, duct, outdoor)

**Optimal Card Features:**
| Feature | Priority | Rationale |
|---------|----------|-----------|
| Subcategory Badge | **CRITICAL** | "Wall Mount", "Duct Mount" |
| Price Range | **HIGH** | Budget filtering |
| Stock Status | **MEDIUM** | Lead time concerns |
| Quick View | **HIGH** | Quick spec check |
| Part Number | **MEDIUM** | Cross-reference |
| Sale Badge | **MEDIUM** | Budget opportunities |

**Gap:** We don't show subcategories on cards.

**Recommendation:** Add subcategory badge to Advanced ProductCard.

---

### 🗺️ **Journey 3: Repeat Purchase**

**User Goal:** "I need to reorder that sensor from last year"

**User Type:** Existing customer, knows exactly what they want

**Context:**
- Logged in user
- Searched by part number
- Wants fastest path to checkout

**Optimal Card Features:**
| Feature | Priority | Rationale |
|---------|----------|-----------|
| Part Number | **CRITICAL** | Primary identifier |
| Quick Add-to-Cart | **CRITICAL** | Speed to checkout |
| Stock Quantity | **HIGH** | Bulk order planning |
| Price (with customer discount) | **HIGH** | B2B pricing |
| "Previously Ordered" Badge | **MEDIUM** | Confidence signal |
| Quick View | **LOW** | Already knows product |

**Gap:** No "Quick Add-to-Cart" or "Previously Ordered" features.

**Recommendation:** Add for authenticated B2B users.

---

### 🗺️ **Journey 4: Mobile Browsing (Trade Show)**

**User Goal:** "Someone mentioned BAPI sensors at the show"

**User Type:** Engineer at trade show, on phone

**Context:**
- Small screen (375px)
- Spotty WiFi
- Limited time
- Wants to bookmark for later

**Optimal Card Features:**
| Feature | Priority | Rationale |
|---------|----------|-----------|
| Large Touch Targets | **CRITICAL** | Mobile usability |
| Save/Wishlist | **CRITICAL** | Review later at desk |
| Minimal Data | **HIGH** | Slow connection |
| Progressive Image Loading | **HIGH** | Performance |
| Quick View | **LOW** | Too small on mobile |
| Comparison Checkbox | **LOW** | Hard to tap, complex |

**Gap:** Quick View/Comparison are hover-based (desktop-centric).

**Recommendation:** Rethink mobile interaction patterns.

---

### 🗺️ **Journey 5: Specification Research**

**User Goal:** "Does this sensor meet our project specs?"

**User Type:** Consulting engineer, creating spec document

**Context:**
- Needs detailed technical data
- Will compare 5-10 products
- Needs to extract specs to doc
- Wants datasheet downloads

**Optimal Card Features:**
| Feature | Priority | Rationale |
|---------|----------|-----------|
| Comparison Checkbox | **CRITICAL** | Multi-product comparison |
| Download Datasheet Button | **CRITICAL** | Offline reference |
| Key Specs on Card | **HIGH** | Temp range, accuracy |
| Part Number | **HIGH** | Spec document citation |
| Certification Badges | **HIGH** | Code compliance |
| Price | **LOW** | Budget not primary concern |

**Gap:** No datasheet download from card, key specs not visible.

**Recommendation:** Add spec summary + download to Quick View.

---

### 📊 **Journey Prioritization Matrix**

| Journey | Frequency | Revenue Impact | Current Card Fit | Priority |
|---------|-----------|----------------|------------------|----------|
| Product Discovery | **HIGH** | Medium | ✅ Good (Advanced) | 1 |
| Repeat Purchase | **MEDIUM** | **HIGH** | ⚠️ Missing features | 1 |
| Category Browsing | **HIGH** | Medium | ⚠️ Missing subcategories | 2 |
| Specification Research | **MEDIUM** | **HIGH** | ⚠️ Missing datasheets | 2 |
| Mobile Browsing | **MEDIUM** | Low | ⚠️ Desktop-centric | 3 |

**Insight:** Repeat purchase and specification research are **high revenue** but **poorly served**.

---

## 5. Critical Design Issues Found

### 🚨 **CRITICAL** (Must Fix Before Launch)

#### 1. **Component Duplication**
- **Issue:** Two separate ProductCard implementations
- **Impact:** Inconsistent UX, double maintenance burden, user confusion
- **Heuristic Violated:** #4 Consistency & Standards
- **Solution:** Consolidate to one flexible component

#### 2. **Missing Analytics**
- **Issue:** No tracking of card interactions, Quick View, Comparison
- **Impact:** Designing blind without user behavior data
- **Solution:** Implement event tracking BEFORE design review

#### 3. **Mobile Quick View/Comparison**
- **Issue:** Hover-based features don't work on touch devices
- **Impact:** 30-40% of B2B traffic is mobile (industry average)
- **Heuristic Violated:** #7 Flexibility & Efficiency
- **Solution:** Tap-to-reveal menu on mobile

---

### ⚠️ **HIGH PRIORITY** (Phase 1 Launch)

#### 4. **No List View in Production**
- **Issue:** Advanced ProductCard (production) lacks list mode
- **Impact:** Power users can't scan efficiently
- **Heuristic Violated:** #7 Flexibility & Efficiency
- **Solution:** Add list view toggle to Advanced ProductCard

#### 5. **Part Number Missing from Advanced Card**
- **Issue:** Only Basic ProductCard shows part numbers
- **Impact:** B2B users rely on part numbers for ordering
- **Solution:** Add part number badge to Advanced card

#### 6. **No Certification/Compliance Badges**
- **Issue:** Belimo shows UL/CE marks, we don't
- **Impact:** Missed trust signal for compliance-focused buyers
- **Competitive Gap:** Belimo advantage
- **Solution:** Add compliance badge system

---

### 📋 **MEDIUM PRIORITY** (Phase 2 Enhancement)

#### 7. **No Contextual Help/Tooltips**
- **Issue:** Quick View, Comparison features not explained
- **Heuristic Violated:** #10 Help & Documentation
- **Solution:** Add tooltips to interactive elements

#### 8. **Badge Hierarchy Undefined**
- **Issue:** Sale + Stock + New badges can stack (visual clutter)
- **Heuristic Violated:** #8 Aesthetic & Minimalist
- **Solution:** Define max 2 badges, priority order

#### 9. **No "Previously Ordered" Signal**
- **Issue:** Repeat customers can't identify past purchases
- **Solution:** Add badge for authenticated users

---

### 💡 **LOW PRIORITY** (Future Consideration)

#### 10. **Decorative Elements**
- **Issue:** Yellow underline, decorative corner don't aid function
- **Heuristic Violated:** #8 Aesthetic & Minimalist
- **Solution:** Remove or A/B test

#### 11. **No Energy Savings Features**
- **Issue:** Belimo has energy calculators, we don't
- **Competitive Gap:** Differentiator for building owners
- **Solution:** Consider value calculators in Quick View

---

## 6. Recommendations for Matt

### 📝 **Before Reviewing Storybook**

**1. Read This Document First** ✅ (You're doing it!)
- Understand heuristic analysis findings
- Review analytics gaps
- Consider competitive context
- Think about user journeys

**2. Establish Design Principles**
- What's more important: Speed or Features?
- Target user: First-time visitor or repeat customer?
- Mobile vs Desktop priority?
- Sale focus or spec focus?

**3. Define Success Metrics**
- How will we measure if new design is better?
- What's acceptable CTR? Comparison usage?
- Mobile/Desktop parity targets?

---

### 🎯 **Key Questions for Matt to Answer**

#### **Strategic Questions:**

1. **Component Consolidation Approach**
   - [ ] Consolidate immediately (recommended)
   - [ ] Keep separate, document use cases clearly
   - [ ] Create third "hybrid" component

2. **Primary User Persona**
   - [ ] First-time researcher (optimize for discovery)
   - [ ] Repeat customer (optimize for speed)
   - [ ] Specification engineer (optimize for comparison)
   - [ ] All three (flexible component with modes)

3. **Mobile Strategy**
   - [ ] Mobile-first (touch-based interactions)
   - [ ] Desktop-optimized, mobile-acceptable
   - [ ] Separate mobile/desktop designs

4. **Feature Prioritization**
   - [ ] Keep all features (Quick View, Comparison, Badges)
   - [ ] Simplify (remove low-usage features)
   - [ ] A/B test before deciding

#### **Tactical Questions:**

5. **Badge Hierarchy** (if too many badges visible)
   ```
   Priority Order:
   1. ___________ (Sale? Certification? Stock?)
   2. ___________
   3. ___________
   Max visible: 2 or 3?
   ```

6. **Part Number Display**
   - [ ] Add to Advanced ProductCard (top-right badge)
   - [ ] Show in Quick View only
   - [ ] Fallback to SKU if no part number
   - [ ] Hide entirely (only 20/608 products have it)

7. **List View**
   - [ ] Add to Advanced ProductCard (needed)
   - [ ] Keep Basic ProductCard just for list view
   - [ ] Remove list view entirely

8. **Hover Effects** (Basic Card has more animation)
   - [ ] Keep yellow underline animation
   - [ ] Keep decorative corner element
   - [ ] Remove decorative elements (cleaner)
   - [ ] A/B test to let data decide

9. **Quick View on Mobile**
   - [ ] Full-screen modal (recommended)
   - [ ] Bottom sheet (drawer)
   - [ ] Remove Quick View on mobile
   - [ ] Tap menu to reveal options

10. **Comparison Checkbox on Mobile**
    - [ ] Keep (larger touch target)
    - [ ] Move to menu
    - [ ] Remove on mobile (too complex)
    - [ ] Require long-press to activate

---

### 📊 **Decision Framework for Matt**

Use this matrix to evaluate each design decision:

| Decision | User Impact | Dev Effort | Analytics Needed? | A/B Test? | Recommendation |
|----------|-------------|------------|-------------------|-----------|----------------|
| Consolidate components | HIGH | HIGH | No | No | ✅ **Do it** |
| Add list view | MEDIUM | LOW | Yes | Yes | ✅ **Do it** |
| Add part number | MEDIUM | LOW | No | No | ✅ **Do it** |
| Add certifications | MEDIUM | MEDIUM | Yes | No | ⚠️ **Consider** |
| Remove decorative corner | LOW | LOW | No | Yes | ⚠️ **A/B Test** |
| Add Quick Add-to-Cart | HIGH | MEDIUM | Yes | Yes | 🎯 **Phase 2** |
| Add energy calculator | MEDIUM | HIGH | Yes | No | 🎯 **Phase 2** |
| Add datasheets to card | HIGH | LOW | Yes | No | 🎯 **Phase 2** |

**Legend:**
- ✅ High confidence, do it
- ⚠️ Needs more thought or testing
- 🎯 Good idea, but defer to Phase 2

---

### 🚀 **Recommended Design Review Process**

1. **Review Phase 1 Analysis** (this document) - 15 min
2. **Review Storybook Stories** - 30 min
   - Components → Products → ProductCard (Basic)
   - Components → Products → ProductGrid (Advanced)
   - Components → Skeletons → ProductCardSkeleton
3. **Answer Strategic Questions** (above) - 15 min
4. **Mockup "Best of Both" Solution** - 30 min
   - Use Figma or annotated screenshots
   - Show consolidated component
5. **Fill Out Feedback Template** - 20 min
   - [PRODUCT-CARDS-STORYBOOK-REVIEW.md](./PRODUCT-CARDS-STORYBOOK-REVIEW.md)
6. **Define A/B Test Plan** - 15 min
   - What to test, how to measure
7. **Create Implementation Roadmap** - 15 min
   - Priority 1, 2, 3 with timelines

**Total Time:** ~2.5 hours

---

## 📎 Appendices

### A. **Heuristic Definitions (Quick Reference)**

1. **Visibility of System Status** - Keep users informed (loading, progress, state)
2. **Match System & Real World** - Use familiar language and concepts
3. **User Control & Freedom** - Support undo/redo, easy escape hatches
4. **Consistency & Standards** - Follow platform conventions, be internally consistent
5. **Error Prevention** - Prevent problems before they occur (validation, confirmations)
6. **Recognition vs Recall** - Minimize memory load, make options visible
7. **Flexibility & Efficiency** - Shortcuts for experts, simple for novices
8. **Aesthetic & Minimalist** - Only show essential information
9. **Error Recovery** - Helpful error messages, suggest solutions
10. **Help & Documentation** - Contextual help, searchable docs

### B. **Analytics Event Schema** (Recommended)

```typescript
// Product Card Click
{
  event: 'product_card_click',
  properties: {
    product_id: string,
    product_name: string,
    product_slug: string,
    card_type: 'basic' | 'advanced',
    view_mode: 'grid' | 'list',
    has_sale_badge: boolean,
    has_stock_badge: boolean,
    has_part_number: boolean,
    position_in_grid: number,
    viewport: 'mobile' | 'tablet' | 'desktop',
    timestamp: ISO8601,
  }
}

// Quick View
{
  event: 'quick_view_opened',
  properties: {
    product_id: string,
    trigger: 'button_click' | 'keyboard_shortcut',
    viewport: 'mobile' | 'tablet' | 'desktop',
  }
}

// Comparison
{
  event: 'comparison_toggled',
  properties: {
    product_id: string,
    action: 'added' | 'removed',
    comparison_count: number,
    max_reached: boolean,
  }
}
```

### C. **Competitive Product Card Screenshots** (TODO)

**Action Required:** Capture screenshots from:
- Belimo product listing page
- McMaster-Carr product card
- Grainger industrial supplies
- Digi-Key electronics
- Automation Direct

Annotate with:
- Badge positions
- CTA placements
- Hover effects
- Trust signals

---

**Next Steps:**
1. ✅ Matt reviews this Phase 1 analysis
2. ✅ Matt reviews Storybook with context
3. ✅ Matt answers strategic/tactical questions
4. ✅ Matt creates mockup of consolidated component
5. ⏳ Development team implements Phase 1 priorities
6. ⏳ A/B test uncertain decisions
7. ⏳ Measure against success metrics

---

**Document Version:** 1.0  
**Last Updated:** April 2, 2026  
**Author:** Development Team (Pre-Matt Review)  
**Status:** Ready for Matt's Review
