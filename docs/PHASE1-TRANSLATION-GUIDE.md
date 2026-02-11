# Phase 1 Translation Content - Complete Reference

## Status: Ready for Professional Translation

This document contains all English strings from the BAPI e-commerce platform that need translation into:
- **German (DE)** - ✅ 20% complete
- **French (FR)** - ⏳ Pending
- **Spanish (ES)** - ⏳ Pending
- **Japanese (JA)** - ⏳ Pending
- **Chinese (ZH)** - ⏳ Pending
- **Vietnamese (VI)** - ⏳ Pending (Vietnam facility opening April 2026)
- **Arabic (AR)** - ⏳ Pending (requires RTL CSS)
- **Thai (TH)** - ⏳ Pending
- **Polish (PL)** - ⏳ Pending

## Base Language File: `en.json` (15,496 bytes)

### Structure Overview

```json
{
  "common": { ... },          // 16 keys - Common UI actions
  "nav": { ... },             // 7 keys - Main navigation
  "megaMenu": { ... },        // 100+ keys - Product mega menu
  "products": { ... },        // 30+ keys - Product pages
  "home": { ... },            // 15+ keys - Homepage
  "footer": { ... },          // 40+ keys - Footer sections
  "region": { ... },          // 30+ keys - Language/region selector
  "units": { ... },           // 12+ keys - Measurement units
  "errors": { ... },          // 10+ keys - Error messages
  "auth": { ... },            // 15+ keys - Authentication
  "cart": { ... },            // 15+ keys - Shopping cart
  "checkout": { ... },        // 20+ keys - Checkout flow
  "forms": { ... },           // 20+ keys - Form fields
  "accessibility": { ... }    // 10+ keys - A11y labels
}
```

**Total: 310+ translation keys**
**Languages: 10** (EN, DE, FR, ES, JA, ZH, VI, AR, TH, PL)

---

## Translation Guidelines

### 1. Technical Terms

**DO NOT TRANSLATE** these technical terms (keep in English):
- Product names: WAM™, Blu-Test
- Certifications: NIST, ISO 9001:2015
- Technical units: PSI, bar, °C, °F, PM2.5, PM10
- Protocols: BACnet
- Product codes: SKU, Part Number
- Chemical abbreviations: CO₂, VOC, RH (Relative Humidity)

**TRANSLATE** these technical contexts:
- Sensor types (Temperature Sensor → German: "Temperatursensor")
- Applications (Building Automation → German: "Gebäudeautomation")
- Features (Weather-resistant → German: "Wetterbeständig")

### 2. Brand Voice

BAPI brand voice is:
- **Professional** - Engineering precision
- **Trustworthy** - "Trusted by engineers worldwide"
- **Quality-focused** - "NIST-traceable calibration"
- **Helpful** - "Engineers ready to help you succeed"

Maintain this tone in all translations.

### 3. Product Categories Hierarchy

```
Products (Produkte)
├── Temperature (Temperatur)
│   ├── Room & Wall Sensors (Raum- & Wandsensoren)
│   ├── Duct Sensors (Kanalsensoren)
│   ├── Immersion & Well (Tauch- & Tauchhülsen)
│   └── Outdoor Sensors (Außensensoren)
├── Humidity (Feuchtigkeit)
│   ├── Room Humidity (Raumfeuchtigkeit)
│   ├── Duct Humidity (Kanalfeuchtigkeit)
│   ├── Outdoor Humidity (Außenfeuchtigkeit)
│   └── Combo Sensors (Kombi-Sensoren)
├── Pressure (Druck)
│   ├── Differential Pressure (Differenzdruck)
│   ├── Static Pressure (Statischer Druck)
│   └── Barometric (Barometrisch)
├── Air Quality (Luftqualität)
│   ├── CO₂ Sensors (CO₂-Sensoren)
│   ├── VOC Sensors (VOC-Sensoren)
│   └── Particulate Matter (Feinstaub)
├── Wireless (Drahtlos)
│   ├── WAM Temperature (WAM Temperatur)
│   ├── WAM Humidity (WAM Feuchtigkeit)
│   ├── WAM Door Sensors (WAM Türsensoren)
│   └── Cloud Platform (Cloud-Plattform)
├── Accessories (Zubehör)
│   ├── Mounting Hardware (Montagematerial)
│   ├── Enclosures (Gehäuse)
│   └── Cables & Connectors (Kabel & Steckverbinder)
└── Test Instruments (Testgeräte)
    ├── Blu-Test Temperature (Blu-Test Temperatur)
    ├── Blu-Test Humidity (Blu-Test Feuchtigkeit)
    └── Blu-Test Pressure (Blu-Test Druck)
```

### 4. Regional Considerations

#### German (DE)
- Formal "Sie" for customer-facing content
- Compound words: "Gebäudeautomation" not "Gebäude Automation"
- Swiss German: Use standard Hochdeutsch

#### French (FR)
- Formal "vous" for customer-facing
- Accents mandatory: "É" not "E"
- Quebec vs. France: Use international French

#### Spanish (ES)
- Formal "usted" for B2B context
- Latin America vs. Spain: Use neutral Spanish
- Currency: Show both $ USD and regional

#### Japanese (JA)
- Formal business language (敬語 keigo)
- Katakana for technical/foreign terms: センサー (sensor)
- Date format: YYYY年MM月DD日

#### Chinese (ZH)
- Simplified Chinese (mainland China)
- Professional terminology for engineering
- Numeric separators: 1,000 → 1,000 (keep Western)

#### Vietnamese (VI)
- Modern Vietnamese with diacritics (á, à, ả, ã, ạ, etc.)
- Formal business language for B2B context
- Technical terms often borrow from English or French
- Date format: DD/MM/YYYY (e.g., 10/04/2026)
- Currency: Vietnamese Dong (₫) - consider adding VND to currency list
- Measurement: Metric system (°C, bar, mm)

#### Arabic (AR)
- Modern Standard Arabic (MSA)
- Technical terms may use English
- **Requires RTL CSS implementation**
- Numbers remain LTR: ١٢٣ or 123 (prefer 123)

---

## Priority Translation Order

### Phase 1A (March 1-7) - Navigation & Core UI
1. `common.*` - 16 keys
2. `nav.*` - 7 keys
3. `megaMenu.products.*` - 100 keys
4. `footer.*` - 40 keys

### Phase 1B (March 8-14) - E-Commerce
5. `products.*` - 30 keys
6. `cart.*` - 15 keys
7. `checkout.*` - 20 keys
8. `auth.*` - 15 keys

### Phase 1C (March 15-21) - Forms & Errors
9. `forms.*` - 20 keys
10. `errors.*` - 10 keys
11. `region.*` - 30 keys
12. `accessibility.*` - 10 keys

### Phase 1D (March 22-25) - QA & Polish (Priority: Vietnamese for April facility)
- Test all translations in-context
- Fix formatting issues
- Verify technical term consistency

---

## Example Translations (Reference Only)

### Common UI Actions
```
English: "Learn More"
German: "Mehr erfahren"
French: "En savoir plus"
Spanish: "Más información"
Japanese: "詳細を見る"
Chinese: "了解更多"
Arabic: "اعرف المزيد"
```

### Product Names
```
English: "Room & Wall Sensors"
German: "Raum- & Wandsensoren"
French: "Capteurs muraux et de pièce"
Spanish: "Sensores de pared y habitación"
Japanese: "ルームおよびウォールセンサー"
Chinese: "房间和墙壁传感器"
Arabic: "مستشعرات الغرفة والجدار"
```

### Call-to-Action Buttons
```
English: "Add to Cart"
German: "In den Warenkorb"
French: "Ajouter au panier"
Spanish: "Añadir al carrito"
Japanese: "カートに追加"
Chinese: "添加到购物车"
Arabic: "أضف إلى السلة"
```

---

## File Locations

- **Source (English)**: `/web/messages/en.json`
- **Target Files**:
  - `/web/messages/de.json` (German)
  - `/web/messages/fr.json` (French)
  - `/web/messages/es.json` (Spanish)
  - `/web/messages/ja.json` (Japanese)
  - `/web/messages/zh.json` (Chinese - Simplified)
  - `/web/messages/vi.json` (Vietnamese) **← NEW for Vietnam facility**
  - `/web/messages/ar.json` (Arabic)

---

## Implementation Notes

### Using Translations in Components

```tsx
// Import the translation hook
import { useTranslations } from 'next-intl';

// In component
export default function ProductCard() {
  const t = useTranslations('products');
  
  return (
    <div>
      <h2>{t('title')}</h2>
      <button>{t('addToCart')}</button>
      <p>{t('price')}: {product.price}</p>
    </div>
  );
}
```

### Nested Keys

```tsx
const t = useTranslations('megaMenu.products.temperature');

<h3>{t('title')}</h3>                    // "Temperature"
<p>{t('roomWallSensorsDesc')}</p>        // "High-accuracy temperature sensing"
```

### Pluralization

```tsx
const t = useTranslations('cart');

// Handles plural forms automatically
<span>{t('itemCount', { count: 5 })}</span>  // "5 items"
<span>{t('itemCount', { count: 1 })}</span>  // "1 item"
```

### Dynamic Values

```tsx
const t = useTranslations('footer');

// Use {placeholder} syntax
<p>{t('copyright', { year: 2026 })}</p>  // "© 2026 Building Automation Products, Inc..."
```

---

## Testing Checklist

- [ ] All navigation menu items translated
- [ ] Product categories and descriptions
- [ ] Mega menu featured content
- [ ] Footer sections and links
- [ ] Form field labels and validation
- [ ] Error messages and alerts
- [ ] Shopping cart UI
- [ ] Checkout flow (3 steps)
- [ ] Authentication screens
- [ ] Region selector (languages/currencies)
- [ ] Accessibility labels (screen readers)
- [ ] Email notifications (if applicable)

---

## Translation Service Requirements

### Deliverables
1. **8 Complete JSON Files** matching `en.json` structure (DE, FR, ES, JA, ZH, VI, AR)
2. **Translation Memory (TM)** for consistent terminology
3. **Glossary** of approved technical terms
4. **QA Report** with context screenshots
5. **Priority: Vietnamese** - Expedited delivery for Vietnam facility launch (April 2026)

### Format
- JSON format (UTF-8 encoding)
- Preserve all keys (do not change English keys)
- Maintain JSON structure and nesting
- Escape special characters properly (`"`, `\n`, etc.)

### Timeline
- **Week 1**: Navigation & core UI (40% complete)
- **Week 2**: E-commerce flows (70% complete)
- **Week 3**: Forms & errors (90% complete)
- **Week 4**: QA, fixes, RTL implementation (100% complete)

### Contact
- **Technical Lead**: Andrew Teece
- **Content Review**: BAPI Marketing Team
- **QA Testing**: Engineering Team

---

## Additional Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [BAPI Brand Guidelines](/docs/2024_brand_standards.pdf)
- [Technical Glossary](/docs/technical-glossary.md)
- [Component Storybook](http://localhost:6006) - See components in context

---

**Last Updated**: January 28, 2026  
**Status**: Ready for translation service  
**Priority**: Phase 1 - April 10 deadline
