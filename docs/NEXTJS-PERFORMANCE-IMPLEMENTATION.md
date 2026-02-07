# Next.js Performance Optimization Implementation
**Date:** February 6, 2026  
**Branch:** seo-phase1-2026  
**Phase:** Step 2 - Frontend Performance

---

## Current State Analysis

### ✅ Already Optimized
- Analytics components (Vercel Analytics, Speed Insights) - lazy loaded
- Chat widget - lazy loaded via `next/dynamic`
- Payment components (Stripe) - lazy loaded
- Images using Next.js Image component with lazy loading
- ProductHeroFast component for streaming
- Cache headers configured (max-age=3600, s-maxage=3600)

### ⚠️ Needs Optimization

#### 1. Heavy Components Not Code-Split
- Product Gallery (image lightbox, zoom functionality)
- Image Modal component
- Rich text editors (if any)
- Video players (product videos)
- Interactive selectors/configurators

#### 2. Image Optimization
- Product images should use WebP/AVIF formats
- Responsive image sizes with proper `srcset`
- Priority loading for above-the-fold images
- Lazy loading for below-the-fold images

#### 3. Bundle Size
- Lodash-es (only import what you need)
- GraphQL dependencies (tree-shaking)
- Lucide React icons (only import used icons)
- Third-party scripts (defer non-critical)

---

## Implementation Plan

### Phase 1: Critical Code Splitting (High Priority)

#### 1.1 Product Gallery & Image Modal
**Impact:** Reduce initial bundle by ~50KB  
**Files:** 
- `web/src/components/products/ProductGallery.tsx`
- `web/src/components/ui/ImageModal.tsx`

**Action:**
```typescript
// Before: Direct import
import ProductGallery from '@/components/products/ProductGallery';
import ImageModal from '@/components/ui/ImageModal';

// After: Dynamic import
import dynamic from 'next/dynamic';

const ProductGallery = dynamic(() => import('@/components/products/ProductGallery'), {
  loading: () => <ProductGallerySkeleton />,
  ssr: false
});

const ImageModal = dynamic(() => import('@/components/ui/ImageModal'), {
  ssr: false
});
```

#### 1.2 Product Tabs & Related Products
**Impact:** Defer non-critical content  
**Files:**
- `web/src/components/products/ProductPage/ProductTabs.tsx`
- `web/src/components/products/ProductPage/RelatedProducts.tsx`

**Action:** These are already being optimized with async components (`ProductTabsAsync`, `RelatedProductsAsync`). Verify they're being used consistently.

#### 1.3 Application Landing Pages
**Impact:** Reduce initial JS for hero images  
**Files:**
- `web/src/components/applications/ApplicationLandingPage.tsx`

**Action:** Extract hero background images to CSS or use priority loading for hero, lazy load for sections below-the-fold.

---

### Phase 2: Image Optimization (High Priority)

#### 2.1 Convert Images to Modern Formats
**Tools:** `sharp`, `@squoosh/lib`, or Next.js built-in image optimization

**Action:**
```bash
# Install image optimization tools (already have optimize:images script)
pnpm run optimize:images
pnpm run optimize:families
```

**Target files:**
- `/public/images/products/families/*.webp` (already WebP - good!)
- Product gallery images
- Team photos
- Hero images

#### 2.2 Responsive Image Sizes
**Action:** Update Image components to use proper `sizes` prop

```typescript
// Before
<Image src={image} alt={alt} fill />

// After
<Image 
  src={image} 
  alt={alt} 
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### 2.3 Priority Loading Strategy
**Action:**
- Hero images: `priority={true}`
- Product images (first in gallery): `priority={true}`
- All other images: `loading="lazy"` (default)

---

### Phase 3: Bundle Size Optimization (Medium Priority)

#### 3.1 Lodash Tree-Shaking
**Current:** `import { debounce } from 'lodash-es';` ✅ (already optimized)

**Verify:** No full lodash imports anywhere

```bash
# Search for problematic imports
grep -r "import.*from 'lodash'" web/src
```

#### 3.2 Lucide Icons Optimization
**Current:** Individual imports ✅ `import { Search, ArrowRight } from 'lucide-react';`

**Verify:** No barrel imports `import * as Icons from 'lucide-react';`

```bash
# Search for barrel imports
grep -r "import \* .* from 'lucide-react'" web/src
```

#### 3.3 GraphQL Client Optimization
**Action:** Verify generated types are tree-shakeable

Files:
- `web/src/lib/graphql/generated.ts`
- `web/codegen.ts`

**Check:** Queries split by feature (products, categories, cart, etc.)

---

### Phase 4: Script Optimization (Medium Priority)

#### 4.1 Defer Third-Party Scripts
**Files:**
- `web/src/components/analytics/AnalyticsClient.tsx` ✅ (already dynamic)
- `web/src/components/analytics/WebVitalsClient.tsx` ✅ (already dynamic)
- `web/src/components/chat/ChatWidgetClient.tsx` ✅ (already dynamic)

**Action:** Verify all third-party scripts use `next/script` with `strategy="lazyOnload"` or `strategy="afterInteractive"`

#### 4.2 Font Optimization
**Files:**
- `web/src/app/layout.tsx`

**Action:** Verify fonts use `font-display: swap` and are preloaded

```typescript
// Check for font preload
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />
```

---

### Phase 5: Cache Strategy (Low Priority - Already Good)

#### Current State ✅
- ISR configured with cache tags
- Cache revalidation via `/api/revalidate`
- Cache durations: 1-2 hours for products/categories

**Optimization:** Review cache durations based on content update frequency

---

## Implementation Checklist

### Week 1: Critical Path
- [ ] Implement ProductGallery dynamic import
- [ ] Implement ImageModal dynamic import
- [ ] Add ProductGallerySkeleton component
- [ ] Verify ProductTabsAsync/RelatedProductsAsync usage
- [ ] Test product page load time (target: <2s FCP)

### Week 2: Image Optimization
- [ ] Run image optimization scripts
- [ ] Add responsive `sizes` prop to all Image components
- [ ] Set `priority` for above-the-fold images
- [ ] Audit all images for WebP/AVIF format
- [ ] Test mobile image load times

### Week 3: Bundle Analysis & Cleanup
- [ ] Run bundle analyzer: `pnpm run build --webpack`
- [ ] Verify no full lodash imports
- [ ] Verify no Lucide barrel imports
- [ ] Check for unused dependencies
- [ ] Remove dead code

### Week 4: Testing & Validation
- [ ] Run Lighthouse audit (target: 85+ performance)
- [ ] Test on 3G network (throttled)
- [ ] Verify Core Web Vitals (LCP <2.5s, CLS <0.1, FID <100ms)
- [ ] Run bundle size comparison (before/after)
- [ ] Deploy to staging for final validation

---

## Success Metrics

### Performance Targets
- **Speed Index:** 6.1s → <3.5s (-43% improvement)
- **Time to Interactive:** 11.5s → <5s (-57% improvement)
- **First Contentful Paint:** 1.2s → <1s (-17% improvement)
- **Largest Contentful Paint:** 2.5s → <2s (-20% improvement)
- **Total Bundle Size:** Reduce by 20-30%

### Lighthouse Scores
- **Performance:** 76 → 85+ (+12% improvement)
- **Accessibility:** 91 → Maintain  or improve
- **Best Practices:** 96 → Maintain
- **SEO:** Current → 95+

---

## Code Examples

### Dynamic Import Pattern
```typescript
// web/src/components/products/ProductPage/ProductDetailClient.tsx
import dynamic from 'next/dynamic';

const ProductGallery = dynamic(
  () => import('@/components/products/ProductGallery'),
  {
    loading: () => <ProductGallerySkeleton />,
    ssr: false, // Client-side only for image zoom functionality
  }
);

const ImageModal = dynamic(
  () => import('@/components/ui/ImageModal'),
  {
    ssr: false, // Modal only rendered client-side
  }
);
```

### Skeleton Component
```typescript
// web/src/components/products/ProductGallerySkeleton.tsx
export function ProductGallerySkeleton() {
  return (
    <div className="aspect-square bg-neutral-100 rounded-2xl animate-pulse">
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-neutral-300 border-t-primary-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}
```

### Responsive Image Sizes
```typescript
// Product hero image
<Image
  src={product.image.sourceUrl}
  alt={product.image.altText}
  fill
  priority // Above-the-fold
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-contain"
/>

// Product grid images
<Image
  src={product.image.sourceUrl}
  alt={product.image.altText}
  width={400}
  height={400}
  loading="lazy" // Below-the-fold
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>
```

---

## Next Steps (Immediate)

1. **Start with ProductGallery dynamic import** (highest impact)
2. **Add skeleton loaders** for better UX during load
3. **Audit and optimize images** (convert to WebP, add responsive sizes)
4. **Run bundle analyzer** to identify other heavy dependencies
5. **Test on mobile devices** with throttled network

After completing these optimizations, proceed to **Step 3: Structured Data & Schema.org Implementation** for world-class SEO.

---

**Last Updated:** February 6, 2026  
**Next Review:** After implementation (target: February 13, 2026)
