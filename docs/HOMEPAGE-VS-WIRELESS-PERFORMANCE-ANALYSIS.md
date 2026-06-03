# Homepage vs Wireless Page - Performance Analysis

**Created:** June 3, 2026  
**Context:** Investigating why wireless page achieves perfect 100/100 performance vs homepage's 77/100  
**Goal:** Identify optimizations to apply to homepage for similar performance gains

---

## Performance Comparison

| Metric | Homepage | Wireless Page | Difference |
|--------|----------|---------------|------------|
| **Performance** | 77/100 🟡 | **100/100** 🟢 | **+23 points** |
| **FCP** | 0.4s | 0.4s | Equal ✅ |
| **LCP** | 1.8s | **0.5s** ⚡ | **-1.3s (72% faster)** |
| **TBT** | 350ms | **10ms** ⚡ | **-340ms (97% faster!)** |
| **CLS** | 0.003 | 0.003 | Equal ✅ |
| **Speed Index** | 0.8s | 0.7s | -0.1s (slightly faster) |
| Accessibility | 97/100 | 97/100 | Equal ✅ |
| Best Practices | 96/100 | 96/100 | Equal ✅ |
| SEO | 100/100 | 92/100* | -8 (link text audit) |

*Link text audit failing on wireless page (0/1) - needs fixing

---

## Key Differences Found

### 1. **Total Blocking Time (TBT)** - CRITICAL DIFFERENCE ⚡

**Homepage:** 350ms (score: 0.5)  
**Wireless:** 10ms (score: 1.0)  
**Improvement:** 97% faster!

**Why Wireless is Faster:**
- Simpler page structure
- Fewer client components
- Less JavaScript execution
- No heavy third-party interactions

**Potential Issues on Homepage:**
1. ❓ GlobalPresence component (interactive map?) - may be heavy
2. ❓ News fetching from WordPress (`getPosts({ perPage: 3 })`)
3. ❓ Product category grid with hover effects (8 categories)
4. ❓ Multiple animation classes (group-hover, transitions)

### 2. **Largest Contentful Paint (LCP)** - MAJOR DIFFERENCE ⚡

**Homepage:** 1.8s (score: 0.7)  
**Wireless:** 0.5s (score: 1.0)  
**Improvement:** 72% faster!

**Analysis:**
- **Homepage LCP element:** Likely the Hero product family image or category icons
- **Wireless LCP element:** Simpler hero content or wireless sensor images
- **Difference:** Wireless page has less above-the-fold content complexity

**Potential Issues on Homepage:**
1. ❓ Hero component with background image + product family image (double images)
2. ❓ Stats bar with 3 animated cards + gradients + backdrop-blur
3. ❓ 8 category cards each with icon images (multiple image loads)
4. ❓ Why BAPI section with facility image + 3 pillar icons

**Wireless Page Advantages:**
- ✅ Single hero image focus
- ✅ Simpler feature grid (text-heavy, less images)
- ✅ Process steps component (likely lightweight)
- ✅ Product grid loads after hero (deferred)

### 3. **Rendering Configuration**

**Homepage:**
```typescript
export const dynamic = 'force-dynamic';  // Forces dynamic rendering
```
- Every request is server-rendered
- No static generation benefits
- Possible cache misses

**Wireless Page:**
```typescript
// No dynamic export - defaults to static where possible
```
- May benefit from static generation
- Better caching
- Faster TTFB (Time to First Byte)

### 4. **Data Fetching Patterns**

**Homepage:**
```typescript
const posts = await getPosts({ perPage: 3 });  // WordPress API call on every request
```
- Fetches WordPress posts on every page load
- Adds latency from WordPress backend
- Possible slow query

**Wireless Page:**
- All content from translations (instant)
- No external API calls during page render
- Pure static content

### 5. **Component Complexity**

**Homepage Sections:**
1. Hero (complex with 2 images + animations)
2. Quick Stats Bar (3 cards + gradients + backdrop-blur)
3. Product Categories (8 cards + icons + hover effects)
4. Why BAPI (1 facility image + 3 pillar icons)
5. GlobalPresence (potentially heavy interactive map)
6. Latest News (3 posts with images from WordPress)

**Wireless Page Sections:**
1. Hero (simple single focus)
2. FeatureGrid (4 features, text-heavy)
3. ProcessSteps (3 steps, lightweight)
4. Product Categories (6 sensors with images - but deferred)

**DOM Complexity Estimate:**
- Homepage: ~1,500-2,000 DOM elements
- Wireless: ~800-1,200 DOM elements

### 6. **Third-Party/Heavy Components**

**Homepage:**
- `<GlobalPresence>` - potentially heavy (map rendering?)
- `getPosts()` - WordPress GraphQL query
- Multiple image loads above fold

**Wireless:**
- Pure translation-based content
- Minimal external dependencies

---

## Suspected Performance Bottlenecks on Homepage

### Priority 1: Critical Issues (TBT + LCP)

**1. GlobalPresence Component** 🔴
- **Impact:** Likely causing high TBT (350ms)
- **Issue:** May include heavy JavaScript for interactive map
- **Fix:** 
  - Lazy load below fold
  - Convert to static SVG map
  - Defer client-side interactivity

**2. Stats Bar Backdrop Blur** 🟡
- **Impact:** GPU-intensive rendering
- **Code:** `backdrop-blur-sm` on 3 stat cards
- **Fix:**
  - Remove backdrop-blur (minimal visual impact)
  - Use solid backgrounds instead
  - Reduce animation complexity

**3. WordPress Posts Fetching** 🟡
- **Impact:** Adds latency on every request
- **Code:** `const posts = await getPosts({ perPage: 3 });`
- **Fix:**
  - Add ISR with revalidation: `export const revalidate = 3600;`
  - Cache posts in Redis/KV store
  - Consider removing from homepage (low value vs performance cost)

**4. Force Dynamic Rendering** 🟡
- **Impact:** No static generation benefits
- **Code:** `export const dynamic = 'force-dynamic';`
- **Fix:**
  - Remove if not required for locale handling
  - Test with static generation
  - Use ISR instead: `export const revalidate = 3600;`

### Priority 2: Medium Issues (LCP Optimization)

**5. Multiple Image Loads Above Fold**
- Hero background image
- Hero product family image
- 3 stats bar icons
- 8 category icons
- Facility image
- 3 Why BAPI icons

**Total:** ~17 images above fold!

**Fix:**
- Consolidate images where possible
- Lazy load below-fold images
- Use CSS sprites for small icons
- Reduce icon count in stats bar

**6. Category Grid Complexity**
- **Impact:** 8 cards with hover effects
- **Fix:**
  - Reduce to 6 "Featured Categories"
  - Simplify hover animations
  - Remove will-change-transform from every card

### Priority 3: Low Priority (Polish)

**7. Animation Complexity**
- Multiple `group-hover` effects
- `transition-all` on many elements
- GPU acceleration classes

**Fix:**
- Use `transition-transform` instead of `transition-all`
- Remove animations on low-end devices (prefers-reduced-motion)
- Limit GPU acceleration hints

---

## Recommended Action Plan

### Phase 1: Quick Wins (Expected +10-15 points)

1. **Remove `force-dynamic`** - Test with static generation
2. **Add ISR to posts** - `export const revalidate = 3600;`
3. **Remove backdrop-blur from stats** - Simplify rendering
4. **Lazy load GlobalPresence** - Defer below fold

### Phase 2: Structural Changes (Expected +5-10 points)

5. **Reduce category grid** - 8 → 6 featured categories
6. **Optimize hero images** - Consolidate or reduce
7. **Lazy load news section** - Below fold, client-side
8. **Simplify animations** - Reduce transition complexity

### Phase 3: Polish (Expected +2-5 points)

9. **CSS sprite for icons** - Reduce HTTP requests
10. **Optimize Why BAPI section** - Reduce images
11. **DOM cleanup** - Remove unnecessary wrappers

### Target Performance Score

**Current:** 77/100  
**After Phase 1:** 87-92/100  
**After Phase 2:** 92-97/100  
**After Phase 3:** 97-100/100 🎯

**Stretch Goal:** Match wireless page's perfect 100/100

---

## Link Text Audit Failures (SEO)

**Issue:** Wireless page has link text audit failing (0/1)  
**Current Score:** 92/100 SEO (down from 100)  
**Impact:** -8 SEO points

**Suspected Issues:**
1. Generic "Learn more" links without context
2. "Click here" or "Here" link text
3. Links with only icons (no accessible text)
4. "View Products" without category context

**Fix Strategy:**
1. Search for generic link text patterns
2. Add descriptive ARIA labels
3. Make link text contextual (e.g., "Browse Wireless Sensors" instead of "Browse Products")
4. Test with Lighthouse to verify fix

**Priority:** Medium (SEO impact, but not performance)

---

## Next Steps

1. ✅ Create feature branch: `feat/homepage-performance-optimization-phase2`
2. ⏳ Find and fix link text issues (wireless page + homepage)
3. ⏳ Review this analysis with user before implementing changes
4. ⏳ Implement Phase 1 optimizations
5. ⏳ Test with Lighthouse
6. ⏳ Iterate to 90+ score

**Goal:** Bring homepage to 90-95/100 performance to match wireless page excellence

---

**Status:** 🟡 Analysis complete, awaiting user review before implementation
