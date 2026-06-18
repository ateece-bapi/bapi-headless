# Blu-Test Landing Page - Required Images

**Created:** June 16, 2026  
**Branch:** `feat/blu-test-landing-page`  
**Page Location:** `/blu-test`

## Overview

Based on the existing Temperature and Wireless landing pages pattern, we need product images for the Blu-Test test and measurement probes landing page.

---

## 1. Hero Section

### Main Hero Image
- **Path:** `/web/public/images/blu-test/hero/blu-test-hero.webp`
- **Dimensions:** 640x640px (recommended)
- **Description:** Collection of test probes showing the product family
- **Reference:** Similar to Temperature/Wireless hero images

---

## 2. Blu-View App Section

### Blu-View App Interface
- **Path:** `/web/public/images/blu-test/blu-view-app.webp`
- **Dimensions:** 500px width (max), maintains aspect ratio
- **Description:** Screenshot of the Blu-View mobile app showing measurement interface
- **Reference:** Should show the app running on a modern smartphone

---

## 3. Test Probes (7 products)

### 3.1 BT Temperature Probe
- **Path:** `/web/public/images/blu-test/probes/bt-temperature-probe.webp`
- **Product Slug:** `bt-temperature-probe`
- **Description:** Temperature probe with 1 meter shielded cable and stainless steel probe

### 3.2 T Temperature Probe
- **Path:** `/web/public/images/blu-test/probes/t-temperature-probe.webp`
- **Product Slug:** `t-temperature-probe`
- **Description:** Compact temperature probe for tight spaces

### 3.3 P Folding Temperature Probe
- **Path:** `/web/public/images/blu-test/probes/p-folding-probe.webp`
- **Product Slug:** `p-folding-temperature-probe`
- **Description:** Folding probe with 7 inch stainless steel probe element

### 3.4 K Surface/Pipe Probe
- **Path:** `/web/public/images/blu-test/probes/k-surface-pipe-probe.webp`
- **Product Slug:** `k-surface-pipe-probe`
- **Description:** Surface/pipe probe with spring-loaded contact and magnetic attachment

### 3.5 BT Immersed K Temperature Probe
- **Path:** `/web/public/images/blu-test/probes/immersion-probe.webp`
- **Product Slug:** `bt-immersed-k-temperature-probe`
- **Description:** 8 inch stainless steel immersion probe

### 3.6 Low Temp Pocket Probe
- **Path:** `/web/public/images/blu-test/probes/low-temp-probe.webp`
- **Product Slug:** `low-temp-pocket-probe`
- **Description:** Compact pocket-sized probe optimized for refrigeration

### 3.7 Wireless Temperature Probe
- **Path:** `/web/public/images/blu-test/probes/wireless-probe.webp`
- **Product Slug:** `wireless-temperature-probe`
- **Description:** Bluetooth-enabled wireless temperature probe

---

## Image Specifications

### General Guidelines
- **Format:** WebP (preferred) for best compression and quality
- **Fallback:** PNG or JPG if WebP not available
- **Background:** Transparent or white (#FFFFFF)
- **Dimensions:** Consistent sizing for product cards (recommended: 400x400px minimum)
- **Quality:** High resolution for retina displays (2x pixel density)
- **Alignment:** Product centered in frame
- **Lighting:** Even lighting, professional product photography

### Image Usage
All probe images will be displayed in:
- 3-column grid on desktop (lg:grid-cols-3)
- 2-column grid on tablet (md:grid-cols-2)
- Single column on mobile
- Yellow accent bar below each image (implemented in code)

---

## Reference Materials

**Similar Pages:**
- `/web/src/app/[locale]/temperature/page.tsx` - Temperature sensors landing page
- `/web/src/app/[locale]/wireless/page.tsx` - Wireless sensors landing page

**Layout Pattern:**
- Same layout pattern used for Temperature and Wireless landing pages
- Consistent card styling and grid structure
- Hero section with gradient background
- Product sections with features grid

---

## Next Steps

1. **Source Product Images:**
   - Contact Graphics Designer (Matt) for optimized product images
   - Ensure images match naming convention above
   - Verify all 7 probe images + 1 hero + 1 app screenshot are available

2. **Upload Images:**
   - Place images in appropriate directories:
     - Probes → `/web/public/images/blu-test/probes/`
     - Hero image → `/web/public/images/blu-test/hero/`
     - App screenshot → `/web/public/images/blu-test/`

3. **Test Page:**
   - Run `pnpm run dev` to test locally at `http://localhost:3000/blu-test`
   - Verify all images load correctly
   - Check responsive behavior on mobile/tablet/desktop

4. **Alternative: Placeholder Images:**
   - If final images not ready, use temporary placeholders
   - Update filenames in `/web/src/app/[locale]/blu-test/page.tsx` as needed

---

## Status

- ✅ Page component created
- ✅ Translations added (all 11 languages)
- ✅ Image directories created
- ⏳ **Awaiting product images from Graphics Designer (Matt)**
- ⏳ Testing and verification pending

---

## Notes

- This page follows the exact same pattern as the Temperature and Wireless landing pages
- All translations use English as placeholder - can be localized later if needed
- Blu-View App download links are placeholder URLs - update with actual App Store/Play Store links
- Product slugs in the code should match actual product URLs when pages are created
