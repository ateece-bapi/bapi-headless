# BAPI Headless - TODO & Next Steps

## ✅ Completed

### Region & Language Infrastructure
- [x] Region selector (US, EU, Asia, MENA) with persistence
- [x] Language selector (EN, DE, FR, ES, JA, ZH, AR) with persistence
- [x] Currency conversion and formatting
- [x] Date/time localization
- [x] TranslationProvider setup
- [x] Region store with Zustand
- [x] Test page demonstrating all features

### Company Section
- [x] Mission & Values page
- [x] Why BAPI page
- [x] News page with GraphQL integration
- [x] Careers page
- [x] Contact Us page
- [x] Senior UI/UX polish applied to all pages

### User Authentication & Account Management
- [x] Clerk authentication integration
- [x] Protected route middleware (proxy.ts)
- [x] User dashboard with 6 sections
- [x] Profile page with user data display
- [x] Orders page (placeholder for WooCommerce)
- [x] Favorites/saved products feature
- [x] Settings page with Clerk UserProfile
- [x] Quote requests page with status tracking
- [x] Quote request form with file uploads
- [x] Favorites API (GET/POST/DELETE)
- [x] Quotes API (GET/POST)
- [x] FavoriteButton component (reusable)
- [x] Account Dashboard link in user menu
- [x] Test pages for quotes and favorites

### Product Pages
- [x] Main products page redesign with category cards
- [x] Smart category/product routing in [slug]
- [x] Category pages with product grids
- [x] Product detail breadcrumbs with category hierarchy
- [x] ProductCard component
- [x] ISR caching (3600s)

### Navigation
- [x] Megamenu stability fixes (timer management)
- [x] Smooth hover transitions (300ms ease-out)
- [x] Mobile menu

### WordPress Integration
- [x] GraphQL setup and queries
- [x] Visual Composer shortcode cleanup (112 pages)
- [x] Kinsta CDN with WebP conversion
- [x] ISR caching strategy
- [x] **GraphQL Performance Optimization - Phase 1 (Dec 30, 2025)**
  - [x] React cache() for query deduplication
  - [x] Parallel fetching (Promise.allSettled)
  - [x] Static generation for top 30 pages
  - [x] GET request support with Cache-Control headers
  - [x] WPGraphQL Smart Cache configured
  - [x] CORS enabled for CDN caching
  - [x] Query limits increased via MU-plugin
  - [x] Comprehensive optimization documentation
- [x] **GraphQL Performance Optimization - Phase 2 (Dec 31, 2025)**
  - [x] Query splitting: GetProductBySlugLight (70% smaller payload)
  - [x] Deferred queries: details, variations, related products
  - [x] ProductGalleryAsync component with Suspense
  - [x] Updated async components (ProductTabsAsync, RelatedProductsAsync)
  - [x] Removed categories from generateStaticParams (6.9s builds)
  - [x] Reduced category products from 50 → 10
  - [x] WPGraphQL Smart Cache verified and configured
  - [x] Redis enabled on Kinsta ($100/month)
  - [x] Redis Object Cache plugin installed and activated
  - [x] **Results: 96% faster (6.7s → 258ms cached)**
- [ ] Deploy block patterns plugin to Kinsta
  - [ ] Upload `docs/wordpress-plugin/` to `/wp-content/plugins/bapi-block-patterns/`
  - [ ] Activate plugin in WordPress admin
  - [ ] Test all 8 patterns with content creators
  - [ ] Get feedback and iterate
- [ ] Create child theme (if needed for customization)
- [ ] Content creator training on new patterns

---

## 🚧 In Progress / Next Steps

### Back to Top Button Bug (High Priority)
- [ ] **Issue**: Back to Top button only appears at very bottom of page
- [ ] **Expected**: Should appear after scrolling 300px from top
- [ ] **Current State**: Component exists, properly positioned, but visibility broken
- [ ] **Investigation Needed**: 
  - [ ] Check if scroll event is firing correctly
  - [ ] Verify window.scrollY values in browser
  - [ ] Test with different scroll containers
  - [ ] Check for CSS conflicts or z-index issues
  - [ ] Review if Next.js hydration is causing issues
- [ ] **Files**: `web/src/components/layout/BackToTop.tsx`, `web/src/app/layout.tsx`

### Translations (High Priority)
- [ ] Complete translation files for all 7 languages
  - [ ] Current: Only skeleton/sample translations exist
  - [ ] Need: Full translations for all UI strings
  - [ ] Files: `messages/en.json`, `ar.json`, `de.json`, `fr.json`, `es.json`, `ja.json`, `zh.json`
- [ ] Add `t()` function calls throughout the app
  - [ ] Header/Footer components
  - [ ] Product pages
  - [ ] Company pages
  - [ ] Forms and buttons
- [ ] Test language switching across all pages

### RTL Support (High Priority)
- [ ] Add RTL CSS support for Arabic language
- [ ] Test layout in RTL mode
- [ ] Adjust component styles for RTL (text-align, margins, paddings)
- [ ] Ensure icons/images flip appropriately

### Product Pages Polish
- [x] **Product Page Performance Optimization (Dec 31, 2025)**
  - [x] Async components (ProductHeroFast, ProductTabsAsync, RelatedProductsAsync)
  - [x] Parallel data fetching (eliminates waterfall)
  - [x] Performance monitoring utilities
  - [x] Simplified loading states
  - [x] GraphQL data transformations
- [ ] Individual product detail page senior UI/UX polish
- [ ] Product image galleries enhancement
- [ ] Product specifications table design
- [ ] Add to cart functionality integration

### Resources Section
**Phase 1 - PDF Library (✅ Completed - Jan 2, 2026):**
- [x] Technical Documentation pages
- [x] GraphQL queries for WordPress media items (PDFs)
- [x] ResourceList component with search and filtering
- [x] Auto-categorization: installation guides, datasheets, app notes, catalogs
- [x] Direct download links to Kinsta CDN-hosted PDFs
- [x] 1,100+ technical documents accessible
- [x] File size and date metadata display
- [x] Responsive grid layout with hover states
- [x] **Senior UI/UX Polish (Jan 2, 2026):**
  - [x] Smooth hover effects (scale 1.01, shadow transitions 250ms)
  - [x] Category badges with dynamic counts
  - [x] 6 sorting options (date/title ascending/descending)
  - [x] Grid/List view toggle
  - [x] Text truncation with ellipsis
  - [x] Clear filters button
  - [x] Accessibility improvements (ARIA, keyboard nav)
  - [x] CTA card linking to Application Notes
  - [x] Hero heading size consistency (text-5xl md:text-6xl)

**Application Notes Section (✅ Completed - Jan 2, 2026):**
- [x] WordPress must-use plugin for custom post type
- [x] GraphQL queries (list, single, search)
- [x] 61 application notes exposed and accessible
- [x] List page with search, filters, sort, view toggle
- [x] Individual article pages with senior-level polish:
  - [x] Reading progress bar
  - [x] Sticky navigation with print/share buttons
  - [x] Enhanced hero with decorative elements
  - [x] Overview section with gradient styling
  - [x] Black text for maximum readability
  - [x] Content card with hover effects
  - [x] Enhanced CTA footer with animations
  - [x] SEO metadata and Open Graph
- [x] Icon-based card design (consistent BookOpen icon)
- [x] Reading time calculation
- [x] Cross-linking with Resources section
- [x] Typography plugin configuration for prose
- [x] **Phase 2 UI/UX Improvements (Jan 2, 2026):**
  - [x] CTA card color fix (accent yellow → primary blue gradient)
  - [x] Document badges always visible (rounded-full styling)
  - [x] Enhanced empty states with gradient backgrounds
  - [x] Hero section decorative blur orbs
  - [x] Typography consistency audit across all pages
  - [x] Standardized hero headings (text-5xl md:text-6xl lg:text-7xl)
  - [x] Standardized hero subheadings (text-xl md:text-2xl)
  - [x] Updated 8 pages for brand consistency
  - [x] Ready for production deployment

**Phase 2 - Interactive Tools (Future):**
- [ ] Product Selector tool
- [ ] Cross Reference tool
- [ ] BACnet Device Lookup
- [ ] Case Studies section
- [ ] White Papers with gated downloads
- [ ] Document version history
- [ ] Related products for each document

### Search Functionality
**Phase 1 - Basic Search (✅ Completed - Jan 2, 2026):**
- [x] Search input component in header with CMD+K shortcut
- [x] Instant results dropdown with keyboard navigation
- [x] Dedicated `/search` results page with SSR
- [x] GraphQL search query with WPGraphQL native search
- [x] Product grid for search results
- [x] Loading states with spinner feedback
- [x] Empty states with helpful messaging
- [x] Premium hover states and smooth transitions
- [x] URL query params for search state
- [x] Mobile-responsive search UI
- [x] Next.js API route proxy to avoid CORS issues
- [x] 300ms debounced queries with AbortController
- [x] Zero WordPress plugins required

**Phase 2 - Enhanced Search (Future):**
- [ ] Autocomplete/instant search dropdown
- [ ] Advanced filters (price range, specifications, attributes)
- [ ] Faceted search navigation
- [ ] Search analytics tracking
- [ ] "Did you mean?" suggestions
- [ ] Recent searches
- [ ] Popular products in search dropdown
- [ ] Integration with Algolia or Meilisearch (optional)

### Performance & SEO
- [x] **Major performance optimization - 95% faster (Dec 29, 2025)**
  - [x] React cache() eliminates double fetching
  - [x] Parallel GraphQL queries (30x faster builds)
  - [x] 70% reduction in payload sizes
  - [x] Static generation for 30 top pages
  - [x] WordPress Smart Cache configured
  - [x] Image and font preload optimization
- [x] **BAPI Brand Font & UI/UX Polish (Dec 30, 2025)**
  - [x] Removed Geist fonts, implemented Roboto site-wide
  - [x] Fixed Tailwind v4 @theme inline color token processing
  - [x] Enabled OpenType font features (ligatures, kerning)
  - [x] Added comprehensive micro-interactions (hover, focus, transitions)
  - [x] Smooth color, font-weight, and transform transitions
  - [x] Created comprehensive design token documentation
- [x] Add structured data (JSON-LD) - Product pages
- [x] Optimize images (lazy loading, Next.js Image)
- [x] Meta tags for all pages
- [ ] **Cold Cache Performance Investigation (Future)**
  - [ ] Test: Cold cache loads at ~4.2s vs warm cache ~250ms
  - [ ] Verify Redis caching working correctly in production
  - [ ] Check query deduplication effectiveness
  - [ ] Review ISR revalidation frequency (1h currently)
  - [ ] Consider: Additional CDN layer for GraphQL responses
  - [ ] Note: Current performance acceptable but room for improvement
- [ ] Generate sitemap.xml
- [ ] Add robots.txt
- [ ] Core Web Vitals optimization (ongoing)
- [ ] Lighthouse score improvements

### Authentication & User Features
**Clerk Infrastructure Status (✅ COMPLETED - Jan 5, 2026):**
- ✅ ClerkProvider integrated in root layout
- ✅ Middleware with route protection configured (proxy.ts for Next.js 15)
- ✅ SignInButton component (modal sign-in/sign-up)
- ✅ UserButton for authenticated users with Account Dashboard link
- ✅ Protected `/account/*` routes
- ✅ Complete user dashboard with 6 pages:
  - ✅ Main dashboard overview
  - ✅ Profile page with user data
  - ✅ Order history (placeholder)
  - ✅ Favorites/saved products
  - ✅ Account settings (Clerk UserProfile)
  - ✅ Quote requests management
- ✅ Quote request system:
  - ✅ Comprehensive form with file uploads
  - ✅ API endpoints (POST/GET)
  - ✅ JSON storage (/data/quotes.json)
  - ✅ Status tracking (pending/reviewing/quoted/declined)
- ✅ Favorites system:
  - ✅ FavoriteButton component (2 variants, 3 sizes)
  - ✅ API endpoints (GET/POST/DELETE)
  - ✅ JSON storage (/data/favorites.json)
  - ✅ Test page for development
- ✅ Navigation integration with user menu

**Next Steps for User Features:**
- [ ] Database migration (replace JSON storage):
  - [ ] Set up PostgreSQL/MySQL database
  - [ ] Create schema for quotes and favorites
  - [ ] Migrate API routes to use database
  - [ ] Add Prisma or similar ORM
- [ ] Add FavoriteButton to actual product pages
- [ ] Integrate WooCommerce for real order history
- [ ] Email notifications for quotes
- [ ] Admin dashboard for quote management
- [ ] Quote detail view page (`/account/quotes/[id]`)
- [ ] Update dashboard cards with real counts

**WordPress to Clerk User Migration (Phased Approach):**
- [x] **Phase 1 - New Registrations (Current)**
  - [x] New customer registrations use Clerk only
  - [x] Keep existing WordPress users active (no disruption)
  - [x] Document customer migration plan
- [ ] **Phase 2 - Existing Customer Import**
  - [ ] Export WordPress/WooCommerce users via WP-CLI or REST API
  - [ ] Import to Clerk via Bulk User Import API
  - [ ] Migration strategy:
    - [ ] Option A: Send "Set New Password" emails via Clerk
    - [ ] Option B: Password migration (users enter current password, Clerk validates against WP, then migrates)
    - [ ] Option C: Email verification flow with password reset
  - [ ] Link WordPress customer ID to Clerk user metadata
  - [ ] Test with small batch before full migration
- [ ] **Phase 3 - Order History Integration**
  - [ ] Create GraphQL queries for WooCommerce orders by customer
  - [ ] Build order history page in headless dashboard
  - [ ] Query WordPress orders using linked customer ID
  - [ ] Display order details, tracking, invoices
  - [ ] Consider: Sync key order data to separate DB for performance
- [ ] **Phase 4 - Gradual Cutover**
  - [ ] Deprecate WordPress login form
  - [ ] Redirect to headless site for authentication
  - [ ] Maintain WordPress admin access for staff
  - [ ] Monitor migration completion rate

**Missing User Features (Future Work):**
- [ ] Protected user dashboard page (`/account`)
- [ ] User profile management (update name, email, preferences)
- [ ] Order history page (requires e-commerce integration)
- [ ] Saved products/favorites (user-specific product lists)
- [ ] Quote request system with auth
- [ ] Role-based access control (RBAC):
  - [ ] Customer role (default)
  - [ ] Distributor role (special pricing access)
  - [ ] Admin role (content/order management)
- [ ] Auth-protected checkout flow
- [ ] User-specific cart persistence across devices

### Cart & Checkout
- [ ] Complete cart implementation
- [ ] Checkout flow
- [ ] Payment integration
- [ ] Order confirmation emails

### Analytics & Monitoring
- [ ] Google Analytics setup
- [ ] Error tracking (Sentry?)
- [ ] Performance monitoring
- [ ] User behavior analytics

### Testing
- [ ] Unit tests for utilities
- [ ] Integration tests for key flows
- [ ] E2E tests with Playwright/Cypress
- [ ] Accessibility testing

---

## 📝 Technical Debt

### Test Coverage Gaps (Documented: Dec 31, 2025)
**Current Coverage:**
- ✅ GraphQL queries (queries.test.ts)
- ✅ ProductDetailClient component (14 tests covering accessibility, variants, cart, edge cases)
- ✅ Product page route (page.test.tsx)

**Missing Coverage (Priority for future sprints):**
- [ ] Header component tests (navigation, mobile menu, megamenu)
- [ ] Footer component tests (links, layout, responsive)
- [ ] Hero component tests (image loading, CTA interactions)
- [ ] Cart drawer component tests (add/remove/update items, persistence)
- [ ] Cart state management tests (Zustand store operations)
- [ ] Form components tests (validation, error states, submission)
- [ ] Error boundary tests (graceful failures, fallback UI)
- [ ] Integration tests (multi-component workflows)
- [ ] E2E tests (critical user journeys: browse → add to cart → checkout)

### General Technical Debt
- [ ] Review and optimize bundle size
- [ ] Audit and remove unused dependencies
- [ ] Code splitting optimization
- [ ] TypeScript strict mode improvements
- [ ] Accessibility audit and fixes
- [ ] Browser compatibility testing

---

## 🎯 Future Enhancements

- [ ] Dark mode support
- [ ] Progressive Web App (PWA) features
- [ ] Offline support
- [ ] Push notifications
- [ ] Advanced product filtering
- [ ] Product comparison tool
- [ ] Live chat integration
- [ ] AI-powered product recommendations
- [ ] Virtual sensor configuration tool

---

## 📅 Priority Order

1. **Translations** - Complete all language files and implement throughout app
2. **RTL Support** - Ensure Arabic users have proper experience
3. **Product Detail Polish** - Individual product pages need senior UI/UX
4. **Resources Section** - Critical for technical users
5. **Search** - Important for discoverability
6. **Performance & SEO** - Ongoing optimization
7. **Testing** - Ensure stability and quality

---

Last Updated: December 31, 2025
