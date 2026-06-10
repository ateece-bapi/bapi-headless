# Pressure Sensors & Switches Landing Page with Full i18n Support

## 📋 Summary

This PR adds a comprehensive landing page for the **Pressure Sensors & Switches** product category at `/pressure`, following the established pattern from Accessories, Temperature, Humidity, and Wireless landing pages. The page features a two-section structure matching the legacy website layout with full internationalization support for all 11 languages.

## 🎯 Deliverables

### ✅ Completed Features
1. **Two-Section Landing Page:**
   - Pressure Sensors section (6 products in 3-column grid)
   - Pressure Switches section (2 products in 2-column grid)

2. **Hero Section:**
   - Title: "Pressure matters!" (matching legacy branding)
   - Gradient background (primary-700 → primary-500)
   - Dual CTA buttons: "Explore Products" + "Contact Us"
   - Hero image: 2022 Pressure sensor family photo

3. **Product Images:**
   - 10 total images (1 hero + 6 sensors + 2 switches + 1 ZPM variant)
   - Organized folder structure: `/images/pressure/sensors/` and `/images/pressure/switches/`
   - Next.js Image optimization with quality={85}

4. **Full Internationalization:**
   - English + 10 additional languages (es, fr, de, ar, hi, ja, pl, th, vi, zh)
   - Legacy text preserved exactly: "Pressure matters!" hero copy
   - Section descriptions matching legacy website verbatim
   - Professional HVAC terminology translations

5. **Mega-Menu Integration:**
   - "Pressure Overview" link added to Products → Pressure submenu
   - Links to `/pressure` landing page
   - Translated for all 11 languages

## 🔧 Implementation Details

### Page Structure (`/web/src/app/[locale]/pressure/page.tsx`)

**Hero Section:**
- Breadcrumb navigation: Home → Products → Pressure Sensors
- Legacy branding: "Pressure matters!" title
- Description: "BAPI's Pressure sensors have the field selectability you need for easy installation and line-of-sight trouble shooting to save time and money."
- Responsive image with max-width constraint to prevent blur

**Pressure Sensors Section:**
- 6 products in 3-column responsive grid (`md:grid-cols-2 lg:grid-cols-3`)
- Legacy description: EZ panel unit, Zone Pressure Multi-Sensor (ZPM) details
- Yellow accent bar above product content
- 3 feature bullets per product + "Learn More" button

**Pressure Switches Section:**
- 2 products in 2-column grid (`md:grid-cols-2`)
- Legacy description: BAPI-Box UL 353 listing, Beck unit specifications
- Same card styling as sensors section
- "View All Pressure Products" link at bottom

### Products Featured

**Pressure Sensors (6):**
1. **ZPM BAPI-Box Pressure Sensor** - IP66/NEMA 4 rated enclosure
2. **ZPM Pressure Sensor** - ±0.25% precision accuracy, zone pressure multi-sensor
3. **EZ Pressure Sensor** - Field selected range, easy installation
4. **FRP Pressure Sensor** - Fixed factory set range
5. **Outside Air Pickup Port** - Weather-resistant design
6. **Zone Pressure Pickup Ports** - Clean room applications

**Pressure Switches (2):**
1. **Deck Pressure Switch** - Adjustable set points, duct monitoring
2. **Differential Pressure Switch** - Filter monitoring, adjustable dead band

### GraphQL Validation
All 8 product slugs verified against WordPress backend via GraphQL queries before implementation to prevent 404 errors:
- ✅ `zpm-standard-accuracy-pressure-sensor-in-a-bapi-box`
- ✅ `zone-pressure-multi-sensor-zpm-differential-pressure-sensor`
- ✅ `ez-differential-pressure-sensor-field-selected-range-and-output`
- ✅ `fixed-range-pressure-frp-differential-pressure-sensor`
- ✅ `alc-outside-pressure-pickup-port`
- ✅ `room-pressure-pickup-ports`
- ✅ `adjustable-pressure-switch`
- ✅ `alc-differential-pressure-switch-2`

### Translation Coverage

**Complete i18n for 11 languages:**
- **English (en):** "Pressure matters!"
- **Spanish (es):** "¡La presión importa!"
- **French (fr):** "La pression compte!"
- **German (de):** "Druck ist wichtig!"
- **Arabic (ar):** "الضغط مهم!"
- **Hindi (hi):** "दबाव मायने रखता है!"
- **Japanese (ja):** "圧力は重要です！"
- **Polish (pl):** "Ciśnienie ma znaczenie!"
- **Thai (th):** "ความดันสำคัญ!"
- **Vietnamese (vi):** "Áp suất quan trọng!"
- **Chinese (zh):** "压力很重要！"

**Legacy Text Preservation:**
All section descriptions match the legacy website exactly:
- Hero description about field selectability
- Sensors section: EZ panel unit and ZPM versatility
- Switches section: BAPI-Box UL 353 and Beck unit specifications

### Image Organization

**Folder Structure:**
```
/web/public/images/pressure/
├── sensors/
│   ├── 2022Pressure_REFLECTION_small-e1650653837224.png (hero)
│   ├── ZPM_BB(1).png
│   ├── zpm-pressure-shadow.png
│   ├── EZ-Main-Image-Blue.png
│   ├── FRP-Main-2022-1.png
│   ├── Pressure_Pickup_OA_white.png
│   └── Room-Ports-1.png
└── switches/
    ├── Beck_Pressure_Switch.png
    └── pressure-switches.png
```

## 📊 Testing & Validation

### Manual Testing
- ✅ Page renders at `/pressure` with all content
- ✅ Hero image displays at correct size (no blur)
- ✅ All 8 product cards render with images
- ✅ Product links navigate to correct product pages (verified slugs)
- ✅ Mega-menu "Pressure Overview" link works
- ✅ Breadcrumb navigation functional
- ✅ Responsive layout works on all breakpoints (mobile/tablet/desktop)
- ✅ Two-section structure matches legacy layout exactly
- ✅ All 11 languages display correctly
- ✅ SEO metadata present and locale-aware

### Build Validation
```bash
pnpm run build
```
- ✅ Compiled successfully (8.4s)
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ All translation keys resolve
- ✅ Image optimization working

## 📂 Files Changed

### Created Files
- `web/src/app/[locale]/pressure/page.tsx` (368 lines)
- `web/public/images/pressure/sensors/` (8 images)
- `web/public/images/pressure/switches/` (2 images)

### Modified Files
- `web/messages/en.json` - Added `pressureLandingPage` namespace
- `web/messages/es.json` - Spanish translations
- `web/messages/fr.json` - French translations
- `web/messages/de.json` - German translations
- `web/messages/ar.json` - Arabic translations
- `web/messages/hi.json` - Hindi translations
- `web/messages/ja.json` - Japanese translations
- `web/messages/pl.json` - Polish translations
- `web/messages/th.json` - Thai translations
- `web/messages/vi.json` - Vietnamese translations
- `web/messages/zh.json` - Chinese translations
- `web/src/components/layout/Header/config.ts` - Added Pressure Overview link

**Total:** 23 files changed, 1,497 insertions

## 🔑 Key Features

### Pattern Consistency
- ✅ Matches Humidity/Accessories landing page structure
- ✅ Uses Temperature page hero spacing (grid gaps)
- ✅ Yellow accent bars on product cards (brand consistency)
- ✅ Same button styling and hover effects
- ✅ Consistent breadcrumb navigation

### SEO Optimization
- Locale-aware metadata (title, description, keywords)
- Keywords split by locale-specific commas: `.split(/[,،、،]/)`
- Descriptive alt text for all images
- Proper heading hierarchy (h1 → h2 → h3)

### Accessibility
- ARIA labels on navigation elements
- Semantic HTML structure
- Focus states on all interactive elements
- Icon-only elements have `aria-hidden="true"`

### Performance
- Next.js Image component with optimized sizes
- Responsive image variants for mobile/tablet/desktop
- Quality={85} for balance between file size and clarity
- Lazy loading below-the-fold images

## 📝 Notes

### Legacy Text Fidelity
This implementation preserves the exact wording from the legacy pressure page:
- **Hero:** "Pressure matters!" with field selectability message
- **Sensors:** Detailed description of EZ panel unit and ZPM features
- **Switches:** Specific mention of UL 353 listing and pressure ranges

### Product Organization
The two-section structure matches the legacy site exactly:
- **Sensors section:** Installation flexibility, field configuration
- **Switches section:** Safety circuits, monitoring applications

### Future Improvements
- Consider adding product comparison table
- Potential for interactive pressure range calculator
- Video demonstrations of field configuration

## ✅ Checklist

- [x] Two-section page structure (Sensors + Switches)
- [x] 8 products with validated GraphQL slugs
- [x] 10 product images organized in folders
- [x] Hero section with legacy "Pressure matters!" branding
- [x] Complete translations for all 11 languages
- [x] Mega-menu integration with translations
- [x] Legacy text preserved exactly
- [x] Responsive design (mobile/tablet/desktop)
- [x] SEO metadata with locale support
- [x] Build succeeds without errors
- [x] All product links verified (no 404s)
- [x] Image optimization configured
- [x] Accessibility standards met

---

**Ready to merge** ✅
