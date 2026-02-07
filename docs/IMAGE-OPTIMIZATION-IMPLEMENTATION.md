# Image Optimization Implementation Guide

## Overview

This document outlines the image optimization strategy implemented for world-class performance and SEO.

## Key Performance Improvements

### Before Optimization
- **452MB** of images in `web/public/images/`
- **3.7MB** of product images in `web/public/products/`
- Mixed JPEG/PNG formats without optimization
- No responsive image loading
- 20+ `<img>` tags instead of Next.js `<Image />`

### After Optimization (Target)
- **30-50% size reduction** through WebP/AVIF conversion
- Responsive image loading with `srcset` and `sizes`
- Lazy loading for below-the-fold images
- Blur placeholders for smooth loading
- Automatic format negotiation (WebP → JPEG fallback)

## Configuration Files

### 1. `next.config.ts` - Enhanced Image Optimization

```typescript
images: {
  formats: ['image/webp', 'image/avif'],           // Modern formats
  deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive breakpoints
  imageSizes: [16, 32, 48, 64, 96, 128, 256],     // Icon/thumbnail sizes
  minimumCacheTTL: 60 * 60 * 24 * 30,             // 30-day cache
}
```

### 2. `src/lib/utils/image.ts` - Image Utilities

**Key Functions:**
- `getImageProps()` - Pre-configured props for different image types
- `optimizeImageUrl()` - Add optimization params to external URLs
- `getOptimizedImagePath()` - Auto-detect WebP versions
- `generatePlaceholder()` - Blur placeholder generation

**Image Size Presets:**
```typescript
IMAGE_SIZES = {
  product: { thumbnail: 80x80, small: 200x200, medium: 400x400, large: 800x800, hero: 1200x1200 }
  category: { card: 400x225, banner: 1200x400 }
  hero: { mobile: 640x400, tablet: 1024x600, desktop: 1920x800 }
  logo: { small: 120x60, medium: 200x100, large: 300x150 }
}
```

**Quality Settings:**
```typescript
IMAGE_QUALITY = {
  thumbnail: 60,  // Small thumbnails
  default: 75,    // Most images
  high: 85,       // Product heroes
  lossless: 100,  // Logos, diagrams
}
```

## Migration Guide

### Replace `<img>` with `<Image />`

Before:
```tsx
<img src="/products/temp-sensor.jpg" alt="Temperature Sensor" className="w-64 h-64" />
```

After:
```tsx
import Image from 'next/image';
import { getImageProps, IMAGE_SIZES } from '@/lib/utils/image';

<Image
  src="/products/temp-sensor.webp"
  alt="Temperature Sensor - BAPI BA/10K-3-O-B"
  width={IMAGE_SIZES.product.medium.width}
  height={IMAGE_SIZES.product.medium.height}
  {...getImageProps('product', false)} // false = not priority
  className="w-64 h-64 object-contain"
/>
```

### Hero/Above-the-Fold Images

Use `priority` prop for images visible on page load:

```tsx
<Image
  src="/hero-banner.webp"
  alt="BAPI Building Automation"
  fill
  {...getImageProps('hero', true)} // true = priority
  className="object-cover"
/>
```

### External Images (WordPress)

```tsx
import { optimizeImageUrl } from '@/lib/utils/image';

const imageSrc = optimizeImageUrl(
  product.image.sourceUrl,
  800,  // width
  800,  // height
  85    // quality
);

<Image
  src={imageSrc}
  alt={product.image.altText || product.name}
  width={800}
  height={800}
  {...getImageProps('product')}
/>
```

### Responsive Images with Blur Placeholder

```tsx
<Image
  src="/products/sensor.webp"
  alt="Sensor"
  width={400}
  height={400}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Use generatePlaceholder()
  {...getImageProps('product')}
/>
```

## Current `<img>` Usage Audit

### Files Needing Migration (20 instances)

| File | Line | Priority | Notes |
|------|------|----------|-------|
| `components/Hero/index.tsx` | 65 | HIGH | Hero image, needs `priority` |
| `components/layout/Footer.tsx` | 92, 179, 185, 191, 213, 218, 223 | LOW | Logo images, lazy load OK |
| `components/ui/ImageModal.tsx` | 187 | MED | Product zoom modal |
| `components/products/ProductHero.tsx` | 63, 90 | HIGH | Product images |
| `components/products/RelatedProducts.tsx` | 27 | LOW | Related products |
| `app/[locale]/where-to-buy/page.tsx` | 573 | LOW | Distributor logos |
| `app/[locale]/account/favorites/page.tsx` | 164 | LOW | Favorite products |
| `app/[locale]/account/orders/page.tsx` | 195 | LOW | Order items |

### Migration Priority

**Phase 1 (Immediate - Performance Critical):**
- ✅ Hero images (above the fold)
- ✅ Product main images
- ✅ Category card images

**Phase 2 (Next - User Experience):**
- Related products
- Product thumbnails
- Profile images

**Phase 3 (Low Priority - Below Fold):**
- Footer logos
- Distributor logos
- Order history images

## Image Format Strategy

### 1. Convert Static Images to WebP

```bash
# Manual conversion (if needed)
find web/public -name "*.jpg" -o -name "*.png" | while read img; do
  cwebp "$img" -q 85 -o "${img%.*}.webp"
done
```

### 2. Format Preference Order

1. **AVIF** - Best compression (Next.js auto-converts)
2. **WebP** - 25-35% smaller than JPEG, wide browser support
3. **JPEG** - Fallback for older browsers
4. **PNG** - Only for images requiring transparency

### 3. File Size Targets

| Image Type | Target Size | Max Size |
|------------|-------------|----------|
| Thumbnail | < 5KB | 10KB |
| Product card | < 30KB | 50KB |
| Product hero | < 100KB | 200KB |
| Hero banner | < 150KB | 300KB |
| Logo | < 10KB | 20KB |

## Responsive Image Loading

### Desktop vs Mobile

```tsx
<Image
  src="/banner.webp"
  alt="Banner"
  width={1920}
  height={800}
  sizes="(max-width: 768px) 640px, (max-width: 1200px) 1024px, 1920px"
/>
```

Browser loads:
- **Mobile (<768px)**: 640px wide image
- **Tablet (768-1200px)**: 1024px wide image
- **Desktop (>1200px)**: 1920px full-size image

### Lazy Loading

All images below the fold automatically lazy load with `loading="lazy"`:

```tsx
<Image
  src="/product.webp"
  alt="Product"
  width={400}
  height={400}
  loading="lazy" // Default for non-priority images
/>
```

## SEO Benefits

### Image SEO Checklist

✅ **Alt text** - Descriptive, includes keywords  
✅ **Width/Height** - Prevents layout shift (Core Web Vital)  
✅ **WebP format** - Faster load = better SEO ranking  
✅ **Responsive sizes** - Mobile-first optimization  
✅ **Lazy loading** - Reduces initial page weight  
✅ **Proper file names** - `ba-10k-sensor.webp` vs `IMG_1234.jpg`  

### Example: Product Image SEO

```tsx
<Image
  src="/products/ba-10k-3-o-b-outdoor-temperature-sensor.webp"
  alt="BA/10K-3-O-B Outdoor Temperature Sensor - NIST Traceable, -40°F to 140°F Range"
  width={800}
  height={800}
  {...getImageProps('product', true)}
  className="object-contain"
/>
```

## Performance Monitoring

### Lighthouse Metrics (Target)

- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Image size reduction**: 30-50%
- **Format coverage**: 90%+ WebP

### Measurement

```bash
# Run Lighthouse audit
pnpm run lighthouse

# Check image optimization
npm run build
npm run analyze # Bundle analysis
```

## Next Steps

1. ✅ Update `next.config.ts` with enhanced image config
2. ✅ Create `src/lib/utils/image.ts` utility library
3. ⏳ Migrate high-priority `<img>` tags (Hero, Product pages)
4. ⏳ Convert remaining static images to WebP
5. ⏳ Add blur placeholders for smooth loading
6. ⏳ Run bundle analysis to measure improvements

## Testing Checklist

- [ ] Hero images load with `priority`
- [ ] Below-fold images lazy load
- [ ] WebP format served to modern browsers
- [ ] JPEG fallback works in older browsers
- [ ] Images responsive on mobile/tablet/desktop
- [ ] No layout shift during image load (CLS)
- [ ] Alt text present on all images
- [ ] Lighthouse performance score improved

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [WebP vs JPEG Comparison](https://developers.google.com/speed/webp/docs/webp_study)
- [Responsive Images Guide](https://web.dev/responsive-images/)
- [Core Web Vitals](https://web.dev/vitals/)
