# Datasheets Page Feedback - May 5, 2026

## Feedback from Shawn (Product Team)

**Date:** May 5, 2026  
**Page:** `/resources/datasheets`  
**Status:** ⚠️ Requires updates before launch

---

## Issues Identified

### 1. ✅ Remove Datasheets Filter (PRIORITY 1)
**Feedback:** "I would not include the Datasheets."

**Context:**  
- The primary purpose of this page is to help users find **installation/operation instructions** for old sensor versions
- Datasheets are not the focus and clutter the interface
- Users need quick access to historical Ins/Ops documents, not product marketing materials

**Current State:**  
- Page shows ALL document types including:
  - Datasheets (Pricing) - 151 docs
  - Datasheets (Submittal) - 189 docs
  - Instructions - ~190 docs
  - Catalogs, Drawings, Manuals, etc.

**Action Required:**  
- [ ] Remove "Datasheet (Pricing)" from type filter
- [ ] Remove "Datasheet (Submittal)" from type filter
- [ ] Remove generic "Datasheet" from type filter
- [ ] Keep only: Instructions, Operation Manual, Specification, Technical Drawing, Selection Guide, Application Note, Compliance, Catalog, Other
- [ ] Consider renaming page from "Datasheets" to "Product Documentation" or "Technical Documents"
- [ ] Update hero text to emphasize Instructions/Ops focus

---

### 2. ⚠️ SalesName/Model Number Search Not Working (PRIORITY 1)
**Feedback:** "I tried to search CO2 by several different SalesNames and got no results. I assume that SalesName = 'model number.'"

**Current Implementation:**  
```typescript
// Fuse.js searches these fields (line 150 in DocumentLibraryClient.tsx):
keys: ['title', 'filename', 'productName', 'productSku']

// BUT in datasheets/page.tsx (line 202-203):
productName: undefined,
productSku: undefined,
```

**Problem:**  
- Documents are NOT linked to products in the current implementation
- `productName` and `productSku` are hardcoded to `undefined`
- Search only works if model number appears in **document title or filename**
- Many documents use internal naming (e.g., `52374_ins_temp_humidity_pendant_sensor`) instead of sales names (e.g., "BA/10K-3-O-B")

**Action Required:**  
- [ ] **Option 1 (Quick Fix):** Add common model numbers to document titles via WordPress (manual mapping)
- [ ] **Option 2 (Better):** Create lookup table mapping document IDs to sales names/SKUs
- [ ] **Option 3 (Best - Phase 2):** Link documents to WooCommerce products via custom fields
- [ ] Test search with known CO2 model numbers: BA/10K-3-CO2-D-BB, BA/10K-3-CO2-AN-BB, etc.

**Recommendation:**  
For Phase 1 launch (May 8), implement **Option 1** with a curated list of popular model numbers. Phase 2 can implement proper product linking.

---

### 3. ⚠️ Missing Historical Documents (PRIORITY 2)
**Feedback:** "I assume that you do not have all documents loaded yet, because when I search 'ZPM' the oldest document is from 2024. It should go back to 2017."

**Current Implementation:**  
```typescript
// Fetches from WordPress custom endpoint (datasheets/page.tsx line 160):
const response = await fetch(
  `${baseUrl}/wp-json/bapi/v1/all-pdfs`,
  { next: { revalidate: 3600, tags: ['documents'] } }
);
```

**Possible Causes:**  
1. **WordPress Endpoint Issue:** Custom endpoint `/wp-json/bapi/v1/all-pdfs` may not return documents before 2024
2. **Migration Gap:** Historical documents (2017-2023) may not have been migrated from old website
3. **Date Filter Bug:** Documents may exist but date parsing is incorrect
4. **Customer Group Filter:** Historical documents may have OEM prefixes that are being filtered out

**Action Required:**  
- [ ] Check total document count in WordPress media library (should be 918 as of May 1, 2026 analysis)
- [ ] Verify current count on live page matches expected 918 (or filtered subset)
- [ ] Search for "ZPM" in WordPress media library directly to confirm documents exist
- [ ] Check oldest document dates in WordPress
- [ ] Review `/wp-json/bapi/v1/all-pdfs` endpoint code in WordPress (likely in `bapi-graphql-fixes.php`)
- [ ] Test date sorting: `?sort=date-asc` should show oldest first

**WordPress Query to Run:**  
```sql
SELECT post_title, post_date 
FROM wp_posts 
WHERE post_type = 'attachment' 
  AND post_mime_type = 'application/pdf'
  AND post_title LIKE '%ZPM%'
ORDER BY post_date ASC
LIMIT 20;
```

---

## ✅ What's Working

1. **Document Number Search:** "If you enter the Ins/Ops document number, you get it and sometimes other closely related Ins/Ops. That is good."
   - Fuse.js fuzzy search is working correctly for filenames like `52374_ins_...`
   - Related document grouping is a UX win

2. **Overall Page Structure:** "In general, good."
   - Hero section, filters, and layout are solid
   - Search functionality (when data exists) is responsive

---

## Implementation Priority

### Must-Fix for Launch (May 8, 2026)
1. **Remove Datasheet filters** - 1 hour
2. **Add model number search** - 2-4 hours (quick lookup table)
3. **Investigate missing historical docs** - 2-3 hours

### Can Defer to Phase 2
- Full product linking (Option 3 for model number search)
- Advanced search features (faceted search, autocomplete)
- Document versioning UI

---

## Technical Debt Notes

- **Current Search Fields:** Only title/filename (productName/productSku unused)
- **Document-Product Linking:** Not implemented (all undefined)
- **Total Documents:** 918 PDFs confirmed in May 1 analysis
- **Customer Group Filtering:** Working correctly (filters OEM docs like ALC, ACS)

---

## Next Steps

1. **Create branch:** `fix/datasheets-page-feedback`
2. **Remove datasheet types** from filter (DocumentLibraryClient.tsx)
3. **Create model number lookup table** (JSON file with common mappings)
4. **Investigate WordPress endpoint** for missing historical docs
5. **Test with Shawn's search terms:** CO2, ZPM
6. **Update page title/hero** to clarify Instructions focus

---

## Files to Modify

1. `/web/src/components/resources/DocumentLibraryClient.tsx` - Remove datasheet types from filters
2. `/web/src/app/[locale]/resources/datasheets/page.tsx` - Add model number lookup logic
3. `/cms/bapi-graphql-fixes.php` - Check `/wp-json/bapi/v1/all-pdfs` endpoint
4. Create: `/web/src/data/documentModelNumberLookup.json` - Model number → document ID mapping

---

**Estimated Time:** 6-8 hours  
**Risk:** Low (isolated to one page)  
**Impact:** High (critical for customer support use case)
