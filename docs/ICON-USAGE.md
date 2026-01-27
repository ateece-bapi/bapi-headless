# BAPI Product Category Icon Usage Guidelines

## Brand Standard Icon Order

**Source:** 2024 BAPI Brand Standards Guide

Product category icons **must always** appear in this order:

1. **Temperature** - Thermometer icon
2. **Humidity** - Water droplets icon
3. **Pressure** - Gauge/pressure icon
4. **Air Quality** - Hand with air flow icon
5. **Wireless** - WiFi/radio waves icon
6. **Accessories** - Mounting plate/frame icon
7. **Test Instruments** - Screwdriver/tool icon

## Icon Assets

All icons are located in `/web/public/images/icons/`:

- `Temperature_Icon.webp` / `Temperature_Icon.png`
- `Humidity_Icon.webp` / `Humidity_Icon.png`
- `Pressure_Icon.webp` / `Pressure_Icon.png`
- `AirQuality_Icon.webp` / `AirQuality_Icon.png`
- `Wireless_Icon.webp` / `Wireless_Icon.png`
- `Accessories_Icon.webp` / `Accessories_Icon.png`
- `Test_Instruments_Icon.webp` / `Test_Instruments_Icon.png`

**Format:** Use `.webp` for web performance, `.png` for backwards compatibility.

## Design Requirements

### Color Variants

Icons can appear in **two color schemes**:

1. **Blue icons on white** - Primary usage for light backgrounds
2. **White icons on blue background** - For hero sections and dark backgrounds

### Spacing

Icons **must be equidistant** from each other either:
- **Horizontally** - In navigation menus, product grids
- **Vertically** - In sidebar navigation, mobile menus

### Size Guidelines

- **Mega Menu:** 32px × 32px (with proper whitespace)
- **Product Cards:** 48px × 48px 
- **Hero Sections:** 64px × 64px
- **Mobile Navigation:** 24px × 24px

## When to Limit Icons

If space constraints allow only **6 icons**, you may eliminate:
- **Accessories** - For technical/engineering audiences
- **Wireless** - For traditional wired-sensor focused content

**Never eliminate:** Temperature, Humidity, Pressure, Air Quality, Test Instruments

## Implementation Examples

### Header Mega Menu (Current Implementation)

```typescript
// web/src/components/layout/Header/config.ts
export const MEGA_MENU_ITEMS: MegaMenuItem[] = [
  {
    label: 'Products',
    megaMenu: {
      columns: [
        { title: 'Temperature', icon: '/images/icons/Temperature_Icon.webp' },
        { title: 'Humidity', icon: '/images/icons/Humidity_Icon.webp' },
        { title: 'Pressure', icon: '/images/icons/Pressure_Icon.webp' },
        { title: 'Air Quality', icon: '/images/icons/AirQuality_Icon.webp' },
        { title: 'Wireless', icon: '/images/icons/Wireless_Icon.webp' },
        { title: 'Accessories', icon: '/images/icons/Accessories_Icon.webp' },
        { title: 'Test Instruments', icon: '/images/icons/Test_Instruments_Icon.webp' },
      ]
    }
  }
];
```

### Product Category Page

```typescript
// web/src/app/products/page.tsx
const productCategories = [
  { name: 'Temperature Sensors', icon: Thermometer }, // #1
  { name: 'Humidity Sensors', icon: Droplets },       // #2
  { name: 'Pressure Sensors', icon: Gauge },          // #3
  { name: 'Air Quality Sensors', icon: Wind },        // #4
  { name: 'Wireless Sensors', icon: Wifi },           // #5
  { name: 'Accessories', icon: Package },             // #6
  { name: 'Test Instruments', icon: FlaskConical },   // #7
];
```

### Hero Section with Icons

```tsx
<div className="grid grid-cols-7 gap-4">
  <img src="/images/icons/Temperature_Icon.webp" alt="Temperature" />
  <img src="/images/icons/Humidity_Icon.webp" alt="Humidity" />
  <img src="/images/icons/Pressure_Icon.webp" alt="Pressure" />
  <img src="/images/icons/AirQuality_Icon.webp" alt="Air Quality" />
  <img src="/images/icons/Wireless_Icon.webp" alt="Wireless" />
  <img src="/images/icons/Accessories_Icon.webp" alt="Accessories" />
  <img src="/images/icons/Test_Instruments_Icon.webp" alt="Test Instruments" />
</div>
```

## Icon Mapping Reference

| Category | Icon File | Lucide Icon (Fallback) | Color (Primary) |
|----------|-----------|------------------------|-----------------|
| Temperature | `Temperature_Icon.webp` | `Thermometer` | Red/Orange |
| Humidity | `Humidity_Icon.webp` | `Droplets` | Blue/Cyan |
| Pressure | `Pressure_Icon.webp` | `Gauge` | Purple/Pink |
| Air Quality | `AirQuality_Icon.webp` | `Wind` | Teal/Cyan |
| Wireless | `Wireless_Icon.webp` | `Wifi` | Green/Emerald |
| Accessories | `Accessories_Icon.webp` | `Package` | Gray/Neutral |
| Test Instruments | `Test_Instruments_Icon.webp` | `FlaskConical` | Cyan/Blue |

## Common Mistakes to Avoid

❌ **Don't** combine categories (e.g., "Humidity & Air Quality")  
❌ **Don't** reorder icons for visual preference  
❌ **Don't** use icons out of sequence  
❌ **Don't** mix branded icons with generic placeholders  
❌ **Don't** use Pantone colors for web (use RGB/HEX)

✅ **Do** maintain the standard order: T-H-P-AQ-W-A-TI  
✅ **Do** use equidistant spacing  
✅ **Do** maintain icon aspect ratios  
✅ **Do** use WebP for performance  
✅ **Do** provide alt text for accessibility

## Accessibility

All icon images must include descriptive alt text:

```tsx
<img 
  src="/images/icons/Temperature_Icon.webp" 
  alt="Temperature sensors category icon"
  aria-label="Navigate to temperature sensors"
/>
```

For decorative icons in navigation with visible text labels, use empty alt:

```tsx
<img src="/images/icons/Temperature_Icon.webp" alt="" aria-hidden="true" />
<span>Temperature</span>
```

## Brand Compliance Checklist

- [ ] Icons appear in brand-standard order (T-H-P-AQ-W-A-TI)
- [ ] Icons are equidistant horizontally or vertically
- [ ] Using WebP format for web performance
- [ ] Icons maintain original aspect ratio
- [ ] Blue or white color scheme (never custom colors)
- [ ] Alt text provided for accessibility
- [ ] No combined categories (e.g., "Pressure & Controllers")
- [ ] Icon size appropriate for context (32px-64px typical)

## Updates

**Last Updated:** January 27, 2026  
**Phase:** 19 - Product Category Icon Standardization  
**Brand Guide:** 2024 BAPI Brand Standards  
**Reference:** `/web/public/images/icons/` directory

## Related Documentation

- [Brand Color System](./COLOR_SYSTEM.md)
- [Header Configuration](../web/src/components/layout/Header/config.ts)
- [Product Category Mapping](../web/src/app/products/page.tsx)
