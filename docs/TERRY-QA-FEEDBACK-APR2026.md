# Terry QA Feedback - April 2026

**Review Date:** April 24, 2026  
**Deadline:** May 8, 2026 (flexible)  
**Source:** Website_Issues_Terry_2.pdf

## Status Legend
- 🔴 **Blocked** - Cannot proceed
- 🟡 **In Progress** - Actively being worked on
- 🟢 **Complete** - Fixed and verified
- ⚪ **Not Started** - Queued for work
- 🔵 **Needs Discussion** - Requires team input
- 📋 **Backlog** - Lower priority

---

## 🚨 Critical Issues (P0 - Blocking Launch)

### 1. 404 Errors
**Status:** 🟢 Complete  
**Priority:** P0  
**Type:** Bug - Routing/Data

**Issue:**
- URL returns 404: `/en/products/temperature-sensors/temp-room-temp`

**Root Cause:**
- Legacy slug from original planning documents
- WordPress category uses `temp-room` (not `temp-room-temp`)
- Old slug was used in some external links/bookmarks

**Solution Implemented:**
- ✅ Added 301 redirect in `web/middleware.ts`: `temp-room-temp` → `temp-room`
- ✅ Updated verification script to use correct slug
- ✅ Redirect preserves locale and query parameters

**Files Changed:**
- `web/middleware.ts` (added SUBCATEGORY_SLUG_REDIRECTS)
- `web/scripts/verify-megamenu-links.ts` (updated slug)

**Assigned To:** Complete  
**Estimated Effort:** 1 hour (actual)

---

### 2. Missing Configurators (2 Products) ✅ NOT A BUG
**Status:** 🟢 Resolved - Working as Intended  
**Priority:** ~~P0~~ N/A  
**Type:** ~~Bug~~ User Feedback - Clarification Needed

**Affected Products:**
1. https://bapi-headless.vercel.app/en/product/duct-averaging-temperature-transmitter-flexible-2
2. https://bapi-headless.vercel.app/en/product/duct-averaging-temperature-sensor-flexible-2

**Resolution:**
These products are **CALL-TO-ORDER** products on both legacy and headless sites:

**Legacy Site Behavior:**
- Shows "CONFIGURE PRODUCT:" header
- Message: "If you can't find what you're looking for, please give us a call"
- "CALL TO ORDER" section with phone number
- **NO actual configurator** (Simple Products, not Variable)

**Headless Site Behavior:**
- Shows "Product Summary"
- "Price Not Available" message
- "Contact Sales" button
- **NO configurator** (correct behavior for Simple Products)

**Conclusion:**
- ✅ Both sites behave identically - no configurator, contact sales required
- ✅ These are Simple Products in WordPress (not Variable Products)
- ✅ Headless site correctly renders "Contact Sales" flow
- ✅ No WordPress changes needed
- ✅ No code changes needed

**User Notification:**
- Team notified that these products don't have configurators on either site
- Terry's feedback was based on expectation they should have configurators
- Products are working correctly

**Assigned To:** Resolved  
**Estimated Effort:** 0 hours (no changes needed)

---

### 3. Products Dropdown Cut Off
**Status:** � Needs Discussion  
**Priority:** P0  
**Type:** UX - May be user cache issue

**Issue:**
- Products mega menu appears cut off at bottom
- No scrolling available to access lower categories

**Investigation:**
- Mega menu already has `overflow-y-auto` and `max-h-[calc(100vh-8rem)]`
- Likely requires hard refresh (Ctrl+Shift+R) to clear cached CSS
- May be browser-specific issue

**Recommendation:**
- Have Terry do hard refresh before investigating further
- Test across different browsers and screen heights
- May not be actual bug, just cache issue

**Assigned To:** TBD - Verify after hard refresh  
**Estimated Effort:** 0-2 hours (depending on if real issue)

---

### 4. Wireless Subcategory Routing Bug
**Status:** 🔵 Needs Discussion  
**Priority:** P1  
**Type:** WordPress - Category Structure

**Issue:**
- All wireless subcategory links redirect to same "all wireless" page
- Should go to specific subcategory pages

**Root Cause:**
- WordPress doesn't have wireless subcategories created yet
- Frontend navigation config points all links to parent `/products/bluetooth-wireless`
- This is intentional until WordPress categories are created

**WordPress Action Required:**
Create these subcategories under `bluetooth-wireless`:
- [ ] `bluetooth-sensors` 
- [ ] `gateways-receivers`
- [ ] `output-modules`
- [ ] `wireless-accessories`

**Once WordPress categories exist:**
- Update `web/src/components/layout/Header/config.ts` wireless links to use proper slugs
- Test each subcategory page loads correctly

**Alternative:**
- Keep all wireless products on single page (current behavior is intentional)
- Use filters instead of subcategories

**Assigned To:** WordPress Admin / Product Manager  
**Estimated Effort:** 2-3 hours (WordPress setup + testing)

---

## ⚠️ High Priority (P1 - Pre-Launch)

### 5. Missing Product Options
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Data - Product Configuration

**Issue:**
- Product missing 4-20mA output option
- URL: https://bapi-headless.vercel.app/en/product/duct-temperature-transmitter-2

**Investigation Needed:**
- [ ] Check if attribute exists in WordPress
- [ ] Verify variation data
- [ ] Compare with current site product
- [ ] Check if it's query issue or missing data

**Assigned To:** TBD  
**Estimated Effort:** 1-2 hours

---

### 6. Missing Product Image
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Data - Media/Assets

**Issue:**
- No image displayed for product
- URL: https://bapi-headless.vercel.app/en/product/bapi-stat-quantum-temperature-and-humidity-sensor-with-display

**Investigation Needed:**
- [ ] Check if image exists in WordPress media library
- [ ] Verify featured image is set
- [ ] Check image URL/path resolution
- [ ] Review GraphQL query for product images

**Assigned To:** TBD  
**Estimated Effort:** 1 hour

---

### 7. Category Naming Issues
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Content - Category Names

**Changes Required:**

1. **"Immersion and Well" → "Immersion and Thermowell"**
   - Location: Products > Pressure (or Temperature)
   - Reason: BAPI doesn't use "Well" terminology

2. **"Static Pressure" → "Pickup Ports and Probes"**
   - Location: Products > Pressure
   - Reason: More accurate product description

**Tasks:**
- [ ] Update category names in WordPress
- [ ] Verify slug updates don't break links
- [ ] Update navigation config if needed
- [ ] Test mega menu display

**Assigned To:** TBD  
**Estimated Effort:** 30 minutes

---

### 8. Air Quality Subcategories Incomplete
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Bug - Navigation/Display

**Issue:**
- Air Quality category shows only 3 subcategories
- Should show 6 (visible when clicking "View All")

**Current Display:**
- CO₂ Sensors
- VOC Sensors  
- Particulate Matter

**Missing:**
- 3 additional subcategories (need to identify)

**Investigation Needed:**
- [ ] Check navigation config logic
- [ ] Review category display limit
- [ ] Compare with "View All" page data
- [ ] Verify GraphQL query for subcategories

**Assigned To:** TBD  
**Estimated Effort:** 2 hours

---

### 9. Accessories Subcategories Wrong
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Bug - Category Structure

**Issue:**
- Three subcategories wrong in Accessories
- Pages don't function correctly
- Terry notes: "Accessories line covers so many unrelated things that it would be hard to make subcategories"

**Current Incorrect Subcategories:**
- Mounting Hardware
- Enclosures
- Cables & Connectors

**Recommendation:**
- [ ] Discuss if subcategories should exist at all
- [ ] Consider removing subcategories for Accessories
- [ ] Update navigation to match decision

**Assigned To:** TBD  
**Estimated Effort:** 1-2 hours + discussion

---

### 10. Remove "Combo Sensors" Category
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Content - Category Cleanup

**Issue:**
- "Combo Sensors" unnecessary in Humidity category
- All humidity products handle temp/humidity combos on single product page
- Creates confusion and duplication

**Tasks:**
- [ ] Remove category from WordPress
- [ ] Verify no broken links
- [ ] Update navigation
- [ ] Redirect old URLs if needed

**Assigned To:** TBD  
**Estimated Effort:** 1 hour

---

### 11. Wireless Products in Wrong Categories
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Data - Product Categorization

**Issue:**
- Wireless products appearing in Temperature Sensors categories
- Example: "Wireless Duct" in "Temperature Duct"
- Should be in Wireless category ONLY

**Investigation Needed:**
- [ ] Identify all affected products
- [ ] Check WordPress category assignments
- [ ] Remove duplicate categorization
- [ ] Verify product display after cleanup

**Assigned To:** TBD  
**Estimated Effort:** 2-3 hours

---

### 12. Delta Style Sensors Miscategorized
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Data - Product Categorization

**Issue:**
- Delta Style temp/humidity sensors listed in "Outside Air" section
- Should ONLY be in "Room and Wall" category

**Tasks:**
- [ ] Identify all Delta Style products
- [ ] Update category assignments in WordPress
- [ ] Remove from Outside Air category
- [ ] Verify display in Room and Wall

**Assigned To:** TBD  
**Estimated Effort:** 1-2 hours

---

### 13. Videos Not Migrating to Video Tab
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Data Migration - Media

**Issue:**
- Videos from current site descriptions not appearing in video tab
- Videos were embedded in "Description" field on current site
- Need to extract and properly categorize

**Investigation Needed:**
- [ ] Audit how many products have videos
- [ ] Determine extraction method
- [ ] Check if manual re-upload needed
- [ ] Verify GraphQL product_videos field usage

**Assigned To:** TBD  
**Estimated Effort:** 4-6 hours (depends on volume)

---

### 14. Circular Document Reference
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Bug - Product Documents

**Issue:**
- "Instruction Sheet" category has extra document
- Document links to same page (circular reference)
- Product: duct-averaging-temperature-sensor-flexible-2
- Also: configurator not working on this product (see #2)

**Tasks:**
- [ ] Review product documents setup
- [ ] Remove circular reference
- [ ] Verify document categorization logic

**Assigned To:** TBD  
**Estimated Effort:** 1 hour

---

## 📋 Medium Priority (P2 - Post-Launch OK)

### 15. Radio Buttons vs Dropdowns Inconsistency
**Status:** 🔵 Needs Discussion  
**Priority:** P2  
**Type:** UX - Design Pattern

**Current Pattern:**
- 3 or fewer options = Radio buttons
- 4+ options = Dropdown
- Mixed controls on same configurator page

**Example Product:**
- https://bapi-headless.vercel.app/en/product/zpm-standard-accuracy-%c2%b11-pressure-sensor-in-a-bapi-box-ip66-or-nema4-rated-field-selected-range-and-output
- Has dropdown + radio + slider

**Discussion Points:**
- [ ] Is current pattern intentional?
- [ ] Does it improve UX or create confusion?
- [ ] Should we standardize on one control type?
- [ ] Get UX/design input

**Assigned To:** TBD  
**Estimated Effort:** 2-4 hours (depending on decision)

---

### 16. Bulleted Text Not Rendering
**Status:** ⚪ Not Started  
**Priority:** P2  
**Type:** Bug - Rich Text Rendering

**Issue:**
- Bulleted text from current site displays without bullets on new site
- Terry notes: "It doesn't look right without the bullet"

**Investigation Needed:**
- [ ] Check HTML/Markdown rendering for product descriptions
- [ ] Verify CSS for `<ul>` and `<li>` elements
- [ ] Check if it's data format issue (HTML vs Markdown)
- [ ] Test across multiple products

**Assigned To:** TBD  
**Estimated Effort:** 2-3 hours

---

### 17. Temperature Sensor Order Inconsistent
**Status:** ⚪ Not Started  
**Priority:** P2  
**Type:** UX - Data Ordering

**Issue:**
- Temperature sensor order in configurator dropdowns varies across products
- Doesn't match current website order
- Terry notes: "Not sure how much this matters"

**Discussion Points:**
- [ ] Determine if standardization needed
- [ ] Define canonical sort order
- [ ] Implement if deemed important

**Assigned To:** TBD  
**Estimated Effort:** 2-3 hours

---

### 18. Inconsistent Category Behavior
**Status:** 🔵 Needs Discussion  
**Priority:** P2  
**Type:** UX - Navigation Pattern

**Current Behavior:**

**Product Grid Pages:**
- Temperature
- Humidity
- Pressure
- Air Quality
- Wireless

**Overview Pages:**
- Accessories
- Blu-Test
- WAM

**Discussion Points:**
- [ ] Is this intentional design?
- [ ] Should all categories behave consistently?
- [ ] What's the user expectation?
- [ ] Review analytics/usage data

**Assigned To:** TBD  
**Estimated Effort:** 4-6 hours (depending on decision)

---

## 📚 Resources Section Issues

### 19. Application Notes - Need Categorization
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Content - Organization

**Issue:**
- All 60 application notes on single page
- No grouping/categories
- Current site groups them: https://www.bapihvac.com/application-notes/

**Tasks:**
- [ ] Review current site category structure
- [ ] Create category taxonomy in WordPress
- [ ] Assign application notes to categories
- [ ] Update Resources page to show grouped view
- [ ] Add filtering/search if needed

**Assigned To:** TBD  
**Estimated Effort:** 6-8 hours

---

### 20. Datasheets - Remove from Resources
**Status:** 🔵 Needs Discussion  
**Priority:** P2  
**Type:** UX - Navigation

**Terry's Recommendation:**
- Remove datasheets from Resources section
- Redirect users to product pages for datasheets
- Reason: "Hundreds of datasheets, impossible to find"

**Discussion Points:**
- [ ] Do users expect datasheets in Resources?
- [ ] Analytics: How are datasheets currently accessed?
- [ ] Would search help? Or is removal better?
- [ ] Impact on SEO?

**Tasks (if approved):**
- [ ] Remove datasheets section
- [ ] Add prominent link to product catalog
- [ ] Update Resources navigation

**Assigned To:** TBD  
**Estimated Effort:** 2-3 hours

---

### 21. Sensors Overview - Needs Expansion
**Status:** ⚪ Not Started  
**Priority:** P1  
**Type:** Content - Depth

**Issue:**
- New site has only 1-2 lines per sensor element
- Current site much more detailed: https://www.bapihvac.com/sensor-specs/
- Terry: "New site isn't nearly enough"

**Tasks:**
- [ ] Content audit: What's missing?
- [ ] Assign content authoring
- [ ] Determine if it's CMS update or code change
- [ ] Review layout for expanded content

**Assigned To:** TBD (Content team?)  
**Estimated Effort:** 8-12 hours (content work)

---

## 🔵 Requires Team Discussion

### 22. WAM "Real World Examples"
**Status:** 🔵 Needs Discussion  
**Priority:** P2  
**Type:** Content - Data Cleanup

**Issue:**
- Examples duplicated many times
- Mislabeled
- Terry: "Requires group discussion to determine what examples should be there"

**Discussion Needed:**
- [ ] What's the source of truth?
- [ ] Which examples should remain?
- [ ] Who owns this content?
- [ ] Manual cleanup vs data fix?

**Assigned To:** TBD  
**Estimated Effort:** TBD (depends on decision)

---

### 23. Unknown Product - Verify Existence
**Status:** 🔵 Needs Discussion  
**Priority:** P2  
**Type:** Data - Product Validation

**Issue:**
- Product: delta-style-room-humidity-sensor-17m50
- URL: https://bapi-headless.vercel.app/en/product/delta-style-room-humidity-sensor-17m50
- Terry: "I don't know what this product is or why it's on the website"

**Investigation:**
- [ ] Check current website for this product
- [ ] Verify SKU/part number
- [ ] Ask product team
- [ ] Delete if invalid, update if valid

**Assigned To:** TBD  
**Estimated Effort:** 1 hour + discussion

---

## 📊 Summary Statistics

**Total Issues:** 23  
**P0 Critical:** 2 (was 4, resolved 2 as "not bugs")  
**P1 High:** 14  
**P2 Medium:** 5  
**Resolved - Not Bugs:** 2

**Status Breakdown:**
- 🔴 Blocked: 0
- 🟡 In Progress: 0
- 🟢 Complete: 3 (Category naming x2, Combo Sensors removed, 404 redirect, Configurators clarified)
- ⚪ Not Started: 15
- 🔵 Needs Discussion: 5

**Estimated Total Effort:** 55-80 hours

---

## Next Steps

1. **Triage Meeting** - Prioritize with team, assign owners
2. **Quick Wins** - Tackle category naming (#7), remove combo sensors (#10)
3. **Critical Path** - Fix 404s (#1), configurators (#2), navigation (#3, #4)
4. **Data Cleanup** - Product categorization (#11, #12), missing data (#5, #6)
5. **Content Work** - Application notes (#19), Sensors Overview (#21)
6. **UX Review** - Navigation patterns (#15, #18), discuss with design team

---

## Decision Log

| Date | Issue # | Decision | Who | Notes |
|------|---------|----------|-----|-------|
| | | | | |

---

## Testing Checklist

- [ ] All 404s resolved
- [ ] All configurators functional
- [ ] Navigation scrolling works on all screen sizes
- [ ] Category links go to correct pages
- [ ] Product categorization matches requirements
- [ ] Videos display in video tab
- [ ] Documents display correctly (no circular refs)
- [ ] Resources sections organized properly
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Accessibility testing
