# Translation Implementation Action Plan

**Status**: Ready to implement while waiting for translation service  
**Timeline**: Week of Feb 3-7, 2026  
**Goal**: Have infrastructure ready so translations work immediately when received

---

## ⭐ Priority 1: Implement `useTranslations` Hook (Most Important)

### Why This Matters
When translations arrive from Smartling (March 10), you want to drop them in and see them work immediately. Right now, all strings are hardcoded in English.

### Components to Update (Priority Order)

#### Week 1: Navigation & Footer (Feb 3-7)
**Files to modify:**

1. **Header Navigation** (Highest traffic)
   - `web/src/components/layout/Header/config.ts` - Replace hardcoded labels with translation keys
   - `web/src/components/layout/Header/components/MegaMenu.tsx` - Add useTranslations hook
   - `web/src/components/layout/Header/components/MegaMenuItem.tsx` - Translate labels/descriptions
   - `web/src/components/layout/Header/components/SignInButton.tsx` - "User Sign In" button

2. **Footer** (Every page)
   - `web/src/components/layout/Footer.tsx` - All section titles and links

3. **Homepage Hero** (First impression)
   - `web/src/components/Hero/Hero.tsx` - Title, subtitle, CTA buttons

**Example Implementation:**

```tsx
// BEFORE (Footer.tsx)
const footerSections = [
  {
    title: 'Products',
    links: [
      { label: 'All Sensors', href: '/sensors' },
      { label: 'Wireless Monitoring', href: '/wireless' },
    ],
  },
];

// AFTER (Footer.tsx)
'use client';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  
  const footerSections = [
    {
      title: t('sections.products.title'),
      links: [
        { label: t('sections.products.allSensors'), href: '/sensors' },
        { label: t('sections.products.wirelessMonitoring'), href: '/wireless' },
      ],
    },
  ];
  
  return (
    <footer>
      {/* ... */}
      <p>{t('copyright', { year: 2026 })}</p>
    </footer>
  );
}
```

**Estimated Time**: 6-8 hours for all navigation/footer components

---

## ⭐ Priority 2: Test Language Switching with EN/DE

### Create Language Switcher Component

**File**: `web/src/components/ui/LanguageSwitcher.tsx`

```tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher() {
  const t = useTranslations('region');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'ja', label: '日本語' },
    { code: 'zh', label: '中文' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'ar', label: 'العربية' },
  ];
  
  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };
  
  return (
    <select 
      value={locale} 
      onChange={(e) => switchLanguage(e.target.value)}
      className="px-3 py-2 border rounded-lg"
      aria-label={t('selectLanguage')}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
```

**Add to Header**: Place in top navigation bar next to cart/account

**Test**: Switch between English and German (20% complete) to verify infrastructure works

---

## ⭐ Priority 3: Configure next-intl Routing

### Verify Middleware Configuration

**File**: `web/src/middleware.ts`

Check that next-intl is properly configured:

```tsx
import createMiddleware from 'next-intl/middleware';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'de', 'fr', 'es', 'ja', 'zh', 'vi', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed', // Don't prefix default locale
});

const publicRoutes = createRouteMatcher([
  '/',
  '/:locale',
  '/:locale/products(.*)',
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // Run locale middleware first
  const intlResponse = intlMiddleware(req);
  
  // Then handle Clerk auth
  if (!publicRoutes(req)) {
    auth.protect();
  }
  
  return intlResponse;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

**Test URLs**:
- `http://localhost:3000` → English (default)
- `http://localhost:3000/de` → German
- `http://localhost:3000/vi` → Vietnamese
- `http://localhost:3000/ar` → Arabic (RTL)

---

## ⭐ Priority 4: Create Component Inventory

### Document All Components Needing Translation

Create a checklist of every component with hardcoded strings:

**File**: `docs/TRANSLATION-COMPONENT-INVENTORY.md`

```markdown
# Translation Component Inventory

## Navigation (Priority 1)
- [ ] Header/config.ts - Mega menu labels
- [ ] Header/MegaMenu.tsx - Featured content
- [ ] Header/SignInButton.tsx - Button text
- [ ] MobileMenu.tsx - Mobile navigation

## Footer (Priority 1)
- [ ] Footer.tsx - All sections and links
- [ ] Footer social links - Aria labels

## Homepage (Priority 2)
- [ ] Hero.tsx - Title, subtitle, CTA
- [ ] TaglineRotator.tsx - Taglines array
- [ ] Features section - 4 feature cards

## Products (Priority 2)
- [ ] ProductCard.tsx - "Add to Cart", "Out of Stock"
- [ ] ProductHero.tsx - Product details labels
- [ ] ProductFilters.tsx - Filter labels
- [ ] ProductSort.tsx - Sort options

## Cart & Checkout (Priority 3)
- [ ] CartDrawer.tsx - Cart UI strings
- [ ] CheckoutWizard.tsx - Step labels
- [ ] CheckoutSummary.tsx - Order summary
- [ ] OrderConfirmation.tsx - Success messages

## Forms (Priority 4)
- [ ] All form field labels
- [ ] Validation error messages
- [ ] Submit button text
```

**Estimated Total**: ~100 components, 8-10 hours to update all

---

## ⭐ Priority 5: Missing Translation Key Detection

### Create Script to Find Hardcoded Strings

**File**: `web/scripts/find-hardcoded-strings.mjs`

```javascript
#!/usr/bin/env node

import { readFileSync } from 'fs';
import { globSync } from 'glob';

// Patterns that indicate hardcoded strings (not in useTranslations)
const patterns = [
  /button.*>(?!<)[A-Z][^<]*</g,  // Button text
  /title=["']([^"']+)["']/g,     // Title attributes
  /placeholder=["']([^"']+)["']/g, // Placeholders
  /label.*>(?!<)[A-Z][^<]*</g,   // Labels
];

const files = globSync('src/**/*.{tsx,ts}', { ignore: 'src/**/*.test.*' });

console.log('🔍 Searching for hardcoded strings...\n');

files.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  
  // Skip if already using useTranslations
  if (content.includes('useTranslations')) return;
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      console.log(`📄 ${file}`);
      matches.forEach(m => console.log(`   ⚠️  ${m}`));
    }
  });
});

console.log('\n✅ Scan complete');
```

**Run**:
```bash
chmod +x web/scripts/find-hardcoded-strings.mjs
node web/scripts/find-hardcoded-strings.mjs
```

---

## ⭐ Priority 6: RTL CSS Preparation for Arabic

### Add RTL Support Utility

**File**: `web/src/lib/rtl.ts`

```typescript
import { useLocale } from 'next-intl';

const RTL_LOCALES = ['ar']; // Arabic

export function useIsRTL() {
  const locale = useLocale();
  return RTL_LOCALES.includes(locale);
}

export function getTextDirection(locale: string) {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}
```

**Update Root Layout**: `web/src/app/layout.tsx`

```tsx
import { getTextDirection } from '@/lib/rtl';

export default function RootLayout({ children, params }) {
  const { locale } = params;
  const direction = getTextDirection(locale);
  
  return (
    <html lang={locale} dir={direction}>
      <body>{children}</body>
    </html>
  );
}
```

**Test**: Visit `/ar` route - should flip layout to right-to-left

---

## ⚡ Quick Wins You Can Do Today (1-2 hours)

### 1. Update Footer Component Right Now

```bash
# Make Footer use translations
cd /home/ateece/bapi-headless/web
```

Would you like me to update the Footer component right now as a working example? It's the easiest place to start and will demonstrate the pattern for all other components.

### 2. Add Language Switcher to Header

Simple dropdown in navigation bar - shows all 8 languages, works immediately

### 3. Test with German (20% complete)

Switch to `/de` route, see navigation in German, identify any bugs

---

## 📋 Weekly Plan (While Waiting for Smartling)

### Week of Feb 3-7 (This Week)
- [ ] Update Footer component with useTranslations ✅ Can start NOW
- [ ] Update Header navigation with useTranslations
- [ ] Create LanguageSwitcher component
- [ ] Test EN ↔ DE switching
- [ ] Document component inventory

### Week of Feb 10-14
- [ ] Update all product components
- [ ] Update cart/checkout components
- [ ] Update form components
- [ ] Run hardcoded string detection script

### Week of Feb 17-21
- [ ] Engage Smartling (get quote, sign contract)
- [ ] Upload en.json + glossary + guide
- [ ] Continue component updates (forms, errors)

### Week of Feb 24 - March 3
- [ ] Smartling delivering translations (in progress)
- [ ] Implement RTL CSS for Arabic
- [ ] Test all 8 languages as files arrive

### Week of March 3-10
- [ ] Receive all 7 translated files
- [ ] Drop into /messages/*.json
- [ ] QA testing - test every page in every language
- [ ] Fix any formatting issues

### Week of March 10-17
- [ ] Currency conversion testing
- [ ] Final polish
- [ ] Stakeholder demo (all 8 languages working)

### March 25 - April 10
- [ ] Final QA
- [ ] Production deployment

---

## 🎯 Success Metrics

**Ready for Translations When:**
- [ ] All navigation using `t('key')` instead of hardcoded strings
- [ ] Language switcher visible and functional
- [ ] URL routing works for all 8 locales
- [ ] Footer displays correctly in EN and DE
- [ ] Homepage hero switches languages
- [ ] RTL layout working for Arabic test

**Translation Drop Success:**
- [ ] Drop fr.json → Homepage instantly French ✅
- [ ] Drop vi.json → Navigation instantly Vietnamese ✅
- [ ] Drop ar.json → Site flips to RTL ✅
- [ ] All placeholders render correctly ({year}, {count})
- [ ] No English "fallback" showing

---

## 💡 Pro Tips

1. **Start with Footer** - Easiest component, fewest dynamic parts
2. **Test with German** - 20% done, validates infrastructure works
3. **Use TypeScript** - `t('invalid.key')` will error if key missing
4. **Extract constants** - Don't hardcode translation keys as strings
5. **Check Placeholders** - Test `{year}`, `{count}`, `{count, plural}` early

---

## 🚀 Want Me To...?

I can immediately:

1. **Update Footer.tsx right now** - Working example with full translations
2. **Create LanguageSwitcher component** - Drop-in ready for Header
3. **Update Header config** - Replace all mega menu hardcoded strings
4. **Create component inventory script** - Automated detection of what needs work
5. **Test German translations** - Verify current 20% works correctly

Which would be most helpful to start with?
