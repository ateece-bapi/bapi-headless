# Storybook Implementation Guide
## BAPI Headless E-Commerce - Next.js 16 + Tailwind 4 + React 19

**Last Updated:** January 27, 2026  
**Status:** Planning Phase  
**Priority:** High (Senior-Level Architectural Decision)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Why Storybook for BAPI Headless](#why-storybook-for-bapi-headless)
3. [Technical Stack Considerations](#technical-stack-considerations)
4. [Implementation Phases](#implementation-phases)
5. [Detailed Setup Instructions](#detailed-setup-instructions)
6. [MSW Integration Guide](#msw-integration-guide)
7. [Component Migration Strategy](#component-migration-strategy)
8. [React Native Future-Proofing](#react-native-future-proofing)
9. [Troubleshooting](#troubleshooting)
10. [Success Criteria](#success-criteria)

---

## Executive Summary

**Decision:** Implement Storybook for the BAPI Headless project to improve component development velocity, enable visual regression testing, and prepare for future React Native mobile app development.

**Timeline:** 8-10 hours initial setup + ongoing maintenance  
**ROI:** Faster UI development, safer refactors, better documentation, React Native preparation  
**Risk Level:** Medium (bleeding-edge dependencies) → Mitigated (phased approach, fallback strategies)

---

## Why Storybook for BAPI Headless

### 1. **Component Migration in Progress**

**Current State:**
- Legacy: `web/src/components/ui/BapiButton.tsx` (manual styles)
- Modern: `web/src/components/ui/Button.tsx` (Class Variance Authority)

**Storybook Benefit:** Side-by-side visual comparison prevents regressions during migration. Acts as visual inventory for deprecation strategy.

### 2. **Headless WordPress Decoupling**

**Problem:** Developing components requires:
- Running full Next.js app
- WordPress backend running
- Editing CMS content to test edge cases
- Cache invalidation between changes

**Storybook Solution:** Mock GraphQL responses to test:
- Missing product images
- Long product titles
- Empty related products
- Out of stock states
- Error conditions

**Components Benefiting:**
- `ProductHeroFast.tsx`
- `RelatedProductsAsync.tsx`
- Product cards
- Category listings

### 3. **Complex Interactive State Testing**

**Components with Hard-to-Test States:**
- `Toast.tsx` - Auto-dismiss, success/error variants, stacking
- `ImageModal.tsx` - Open/closed, zoomed, dragging, keyboard navigation
- `TaglineRotator.tsx` - Rotation states, transition timing
- `CheckoutWizard.tsx` - Multi-step validation, error states

**Storybook Benefit:** Create "always-open" or "specific state" stories without manual user interactions.

### 4. **Visual Regression Testing**

**Risk Areas:**
- Tailwind 4 updates breaking existing styles
- Global CSS changes affecting all components
- BAPI brand color token modifications
- Typography/spacing system changes

**Storybook + Chromatic:** Automated screenshot comparison catches unintended visual changes in CI.

### 5. **Design System Documentation**

**Current Challenge:** BAPI brand standards exist in:
- `COLOR_SYSTEM.md` (written docs)
- `globals.css` (CSS tokens)
- Individual component implementations
- No visual catalog

**Storybook Benefit:** Living documentation with interactive examples of:
- Color palette with contrast ratios
- Button variants (primary, accent, outline, ghost, danger)
- Icon system (7 standard categories)
- Typography scale
- Spacing system

### 6. **Team Collaboration & Onboarding**

**Stakeholder Benefits:**
- **Designers:** Review components without running dev environment
- **Product Owners:** Validate UI states and edge cases
- **New Developers:** See component API and variants instantly
- **QA:** Test all component states systematically

### 7. **React Native Preparation**

**Future Goal:** Build iOS/Android app after website launch.

**Storybook Value:**
- Document component contracts (props, behavior)
- Build platform-agnostic primitives now
- Reuse component API across web and native
- Shared design tokens for both platforms

---

## Technical Stack Considerations

### Current Stack (Bleeding Edge)

| Technology | Version | Storybook Compatibility |
|------------|---------|-------------------------|
| React | 19.2.0 | ⚠️ Peer dep warnings expected |
| Next.js | 16.0.7 | ✅ Supported via @storybook/nextjs |
| Tailwind CSS | 4.x | ⚠️ Requires PostCSS config |
| TypeScript | 5.x | ✅ Full support |
| ESLint | 9.x | ⚠️ Flat config - manual setup |
| pnpm | 9.15.4 | ✅ Supported with workarounds |

### Known Compatibility Issues

#### 1. React 19 Peer Dependencies

**Problem:** Many Storybook addons list `react: ^18.0.0` in peer dependencies.

**Solution:**
```bash
# Use legacy peer deps flag during install
pnpm dlx storybook@latest init --skip-install
# Then manually install with:
pnpm install --legacy-peer-deps
```

#### 2. ESLint 9 Flat Config

**Problem:** Storybook auto-installer tries to patch legacy `.eslintrc.json`.

**Solution:** Manually add to `eslint.config.mjs`:
```javascript
import storybook from "eslint-plugin-storybook";

export default [
  // ... existing config
  ...storybook.configs['flat/recommended'],
];
```

#### 3. Tailwind 4 CSS-First Architecture

**Problem:** Tailwind 4 uses `@theme` in CSS instead of JavaScript config.

**Solution:** Import global CSS in `.storybook/preview.ts`:
```typescript
import '../src/app/globals.css'; // Contains @theme definitions
```

#### 4. pnpm Ghost Dependencies

**Problem:** pnpm's strict hoisting may hide Storybook's internal dependencies.

**Solution:** Add to `.npmrc`:
```
shamefully-hoist=true
# OR more targeted:
public-hoist-pattern[]=*storybook*
```

---

## Implementation Phases

### Phase 1: Core Setup + Button Migration (2-3 hours)

**Goal:** Get Storybook running with Tailwind 4 and validate CVA component migration.

**Tasks:**
1. ✅ Initialize Storybook
2. ✅ Configure Tailwind 4 integration
3. ✅ Create `Button.stories.tsx` (all CVA variants)
4. ✅ Create `BapiButton.stories.tsx` (legacy comparison)
5. ✅ Verify styling and interactions work

**Deliverables:**
- Storybook runs at `localhost:6006`
- Button variants render with correct Tailwind classes
- Side-by-side comparison validates migration

**Success Metric:** Can visually compare old and new Button implementations.

---

### Phase 2: MSW + ProductHero GraphQL Mocks (2-3 hours)

**Goal:** Mock WordPress GraphQL responses for product components.

**Tasks:**
1. ✅ Install MSW and msw-storybook-addon
2. ✅ Generate service worker in `web/public/`
3. ✅ Configure MSW in Storybook preview
4. ✅ Create GraphQL handlers for `GetProductBySlug`
5. ✅ Create `ProductHeroFast.stories.tsx` with mock data
6. ✅ Test edge cases (missing image, long title, no description)

**Deliverables:**
- MSW intercepts GraphQL requests
- Product stories load with mock data
- Edge case stories validate component resilience

**Success Metric:** Product components render without running WordPress backend.

---

### Phase 3: Interactive Components (1-2 hours)

**Goal:** Document complex stateful components.

**Tasks:**
1. ✅ `Toast.stories.tsx` - Success/error/warning variants with auto-dismiss
2. ✅ `ImageModal.stories.tsx` - Open/closed/zoomed states
3. ✅ `TaglineRotator.stories.tsx` - Rotation behavior

**Deliverables:**
- Interactive component states documented
- "Always-open" stories for styling without user interaction

**Success Metric:** Can style modal/toast without clicking triggers repeatedly.

---

### Phase 4: Visual Regression (Future)

**Goal:** Automated visual testing in CI.

**Tasks:**
1. ⏳ Set up Chromatic account
2. ⏳ Add Chromatic GitHub Action
3. ⏳ Baseline screenshots for core components
4. ⏳ PR workflow: visual review before merge

**Deliverables:**
- CI catches visual regressions automatically
- Designers can review UI changes in PRs

**Success Metric:** No more "I didn't realize that button turned yellow."

---

## Detailed Setup Instructions

### Step 1: Initialize Storybook

```bash
cd web

# Use pnpm dlx to get latest Storybook CLI
# --skip-install lets you review changes first
pnpm dlx storybook@latest init --skip-install

# Review package.json changes
# Then install manually
pnpm install --legacy-peer-deps
```

**Expected Changes:**
- New directory: `.storybook/` (main.ts, preview.ts)
- New scripts in `package.json`:
  - `storybook`: Start dev server
  - `build-storybook`: Build static site
- New dependencies: `@storybook/nextjs`, addons, etc.

---

### Step 2: Configure Tailwind 4 Integration

**File: `.storybook/preview.ts`**

```typescript
import '../src/app/globals.css'; // CRITICAL: Load Tailwind @theme definitions
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Next.js App Router support
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
```

---

### Step 3: Configure Static Assets

**File: `.storybook/main.ts`**

```typescript
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  // CRITICAL: Serve images and mockServiceWorker.js
  staticDirs: ['../public'], 
  docs: {
    autodocs: "tag",
  },
};

export default config;
```

---

### Step 4: Create First Story (Button)

**File: `src/components/ui/Button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { MousePointerClick } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'accent', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    fullWidth: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary BAPI Blue CTA
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
};

// BAPI Yellow Accent (Add to Cart)
export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Add to Cart',
  },
};

// Ghost variant
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Cancel',
  },
};

// With Icon (proves Lucide integration)
export const WithIcon: Story = {
  args: {
    variant: 'accent',
    size: 'lg',
    children: (
      <span className="flex items-center gap-2">
        <MousePointerClick size={18} />
        <span>Click Me</span>
      </span>
    ),
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};
```

---

### Step 5: Run Storybook

```bash
pnpm storybook
```

Open `http://localhost:6006`

**Verification Checklist:**
- [ ] Storybook loads without errors
- [ ] Button story renders
- [ ] Tailwind classes apply (colors, padding, hover states)
- [ ] Can change variant via controls dropdown
- [ ] Icons render correctly

---

## MSW Integration Guide

### Why MSW for Headless WordPress

**Problem:** Your components fetch data from WordPress GraphQL API. To test them in Storybook, you need to either:
1. Run WordPress backend (slow, requires data setup)
2. Mock at component level (brittle, duplicated mocks)
3. **Use MSW** (intercepts network requests globally)

**MSW Benefits:**
- Intercepts fetch/axios at browser network layer
- Works with existing GraphQL client code
- Per-story handler overrides
- Reusable mock fixtures

---

### Step 1: Install MSW

```bash
cd web
pnpm add -D msw msw-storybook-addon
```

---

### Step 2: Generate Service Worker

```bash
npx msw init public/ --save
```

**Creates:** `web/public/mockServiceWorker.js`

**Verify:** File exists and is served via `staticDirs` in `.storybook/main.ts`.

---

### Step 3: Initialize MSW in Storybook

**File: `.storybook/preview.ts`** (append to existing file)

```typescript
import { initialize, mswDecorator } from "msw-storybook-addon";

// Initialize MSW
initialize({
  onUnhandledRequest: "warn", // Logs unmatched requests
  serviceWorker: {
    url: "/mockServiceWorker.js", // Served from public/
  },
});

// Add MSW decorator globally
export const decorators = [mswDecorator];
```

---

### Step 4: Create GraphQL Handlers

**File: `.storybook/msw/handlers.ts`**

```typescript
import { graphql, rest } from "msw";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || "https://bapiheadlessstaging.kinsta.cloud/graphql";

// Mock product data
const mockProduct = {
  id: "cHJvZHVjdDoxMjM",
  databaseId: 123,
  slug: "temperature-sensor-wireless",
  name: "BAPI Wireless Temperature Sensor",
  shortDescription: "<p>High precision wireless temperature sensor for HVAC applications.</p>",
  image: {
    sourceUrl: "https://placehold.co/600x600/1479BC/FFFFFF/png?text=BAPI+Sensor",
    altText: "Wireless Temperature Sensor",
  },
  price: "$249.00",
  regularPrice: "$249.00",
  onSale: false,
};

// GraphQL handler for GetProductBySlug query
export const graphqlHandlers = [
  graphql.query("GetProductBySlug", (req, res, ctx) => {
    const { slug } = req.variables;
    
    return res(
      ctx.data({
        product: {
          ...mockProduct,
          slug, // Use requested slug
        },
      })
    );
  }),

  graphql.query("GetProductRelated", (req, res, ctx) => {
    return res(
      ctx.data({
        product: {
          related: {
            nodes: [
              {
                id: "cHJvZHVjdDo0NTY",
                databaseId: 456,
                slug: "humidity-sensor",
                name: "BAPI Humidity Sensor",
                image: {
                  sourceUrl: "https://placehold.co/300x300/1479BC/FFFFFF/png?text=Humidity",
                  altText: "Humidity Sensor",
                },
              },
            ],
          },
        },
      })
    );
  }),
];

// REST handlers (if needed)
export const restHandlers = [
  rest.get("/api/user", (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: "Test User" }));
  }),
];

export const handlers = [...graphqlHandlers, ...restHandlers];
export default handlers;
```

---

### Step 5: Wire Handlers into Preview

**File: `.storybook/preview.ts`** (append)

```typescript
import handlers from "./msw/handlers";

export const parameters = {
  msw: {
    handlers: {
      global: handlers, // Default for all stories
    },
  },
};
```

---

### Step 6: Create Product Story with Mock Data

**File: `src/components/products/ProductHeroFast.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProductHeroFast } from './ProductHeroFast';
import { graphql } from 'msw';

const meta: Meta<typeof ProductHeroFast> = {
  title: 'Products/Hero',
  component: ProductHeroFast,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ProductHeroFast>;

// Default mock (uses global MSW handler)
export const Default: Story = {
  args: {
    product: {
      id: "cHJvZHVjdDoxMjM",
      databaseId: 123,
      slug: "temperature-sensor",
      name: "BAPI Wireless Temperature Sensor",
      shortDescription: "<p>High precision sensor.</p>",
      image: {
        sourceUrl: "https://placehold.co/600x600/1479BC/FFFFFF/png",
        altText: "Sensor",
      },
    },
  },
};

// Edge case: Missing image
export const MissingImage: Story = {
  args: {
    product: {
      ...Default.args!.product,
      image: null,
    },
  },
};

// Edge case: Long title
export const LongTitle: Story = {
  args: {
    product: {
      ...Default.args!.product,
      name: "BAPI Wireless Temperature Sensor with Extra Long Title That Might Break Layout on Mobile Devices",
    },
  },
};

// Network error simulation
export const GraphQLError: Story = {
  parameters: {
    msw: {
      handlers: [
        graphql.query("GetProductBySlug", (req, res, ctx) => {
          return res(
            ctx.errors([{ message: "Product not found" }])
          );
        }),
      ],
    },
  },
  args: Default.args,
};
```

---

### MSW Troubleshooting

#### Service Worker Not Registered

**Check:**
1. `web/public/mockServiceWorker.js` exists
2. `.storybook/main.ts` includes `staticDirs: ['../public']`
3. Browser DevTools > Application > Service Workers shows registration

**Fix:** Unregister old worker and reload.

---

#### Handlers Not Firing

**Check:**
1. Network tab in DevTools - is request going to correct URL?
2. GraphQL query has `operationName` field
3. Handler URL exactly matches request URL (protocol + host)

**Debug:** Set `onUnhandledRequest: "error"` to fail loudly.

---

#### Server Components Not Mocked

**Problem:** MSW only intercepts browser fetch, not server-side rendering.

**Solution:** Pass mocked props directly to story instead of relying on data fetching:

```tsx
// ❌ Won't work - fetches server-side
export const ServerFetch: Story = {};

// ✅ Works - mock props
export const MockedProps: Story = {
  args: {
    product: mockProductData,
  },
};
```

---

## Component Migration Strategy

### Current Migration: BapiButton → Button

**Goal:** Deprecate `BapiButton.tsx` in favor of CVA-based `Button.tsx`.

**Storybook Workflow:**

1. **Create side-by-side stories:**

```tsx
// src/components/ui/BapiButton.stories.tsx
import { BapiButton } from './BapiButton';

const meta = {
  title: 'UI/BapiButton (Legacy)',
  component: BapiButton,
};

export default meta;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Legacy Button' },
};

// ... all variants
```

```tsx
// src/components/ui/Button.stories.tsx
const meta = {
  title: 'UI/Button (New)',
  component: Button,
};

// ... matching variants
```

2. **Visual comparison:** Open both story pages, compare styling/behavior.

3. **Find-and-replace with confidence:** Search codebase for `<BapiButton`, replace with `<Button`, verify in Storybook.

4. **Delete legacy:** Remove `BapiButton.tsx` once all usages migrated.

---

### Priority Components for Stories

**High Priority (Week 1):**
1. ✅ Button (CVA migration)
2. ✅ ProductHeroFast (GraphQL mock)
3. ✅ Toast (interactive states)
4. ⏳ ImageModal (open/zoom states)
5. ⏳ ProductCard (hover, sale badge)

**Medium Priority (Week 2-3):**
6. ⏳ Header (mega menu, mobile nav)
7. ⏳ Footer (link sections)
8. ⏳ SearchInput (focus, results)
9. ⏳ CartDrawer (empty/items states)
10. ⏳ CheckoutWizard (3-step flow)

**Low Priority (Future):**
- Form components
- Application landing pages
- Static content sections

---

## React Native Future-Proofing

### Design Tokens First

**Problem:** Tailwind CSS doesn't work in React Native.

**Solution:** Extract design tokens to JSON/TypeScript:

**File: `packages/tokens/colors.ts`**

```typescript
export const colors = {
  primary: {
    50: '#e6f2f9',
    500: '#1479bc', // BAPI Blue
    600: '#106196',
    // ... full scale
  },
  accent: {
    500: '#ffc843', // BAPI Yellow
    // ...
  },
  neutral: {
    500: '#97999b', // BAPI Gray
    // ...
  },
};
```

**Use in Tailwind:**

```javascript
// tailwind.config.js
import { colors } from '@/tokens/colors';

export default {
  theme: {
    colors,
  },
};
```

**Use in React Native:**

```tsx
// App.tsx
import { colors } from '@bapi/tokens';

<View style={{ backgroundColor: colors.primary[500] }} />
```

---

### Platform-Agnostic Component Pattern

**File: `packages/ui/Button/Button.types.ts`**

```typescript
export interface ButtonProps {
  variant: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg' | 'xl';
  onPress: () => void;
  children: React.ReactNode;
}
```

**File: `packages/ui/Button/Button.web.tsx`**

```tsx
import { ButtonProps } from './Button.types';

export function Button({ variant, size, onPress, children }: ButtonProps) {
  return (
    <button onClick={onPress} className={/* Tailwind */}>
      {children}
    </button>
  );
}
```

**File: `packages/ui/Button/Button.native.tsx`**

```tsx
import { ButtonProps } from './Button.types';
import { Pressable, Text } from 'react-native';
import { colors } from '@bapi/tokens';

export function Button({ variant, onPress, children }: ButtonProps) {
  return (
    <Pressable onPress={onPress} style={/* native styles */}>
      <Text>{children}</Text>
    </Pressable>
  );
}
```

**File: `packages/ui/Button/index.ts`**

```tsx
export { Button } from './Button.web'; // or .native based on platform
```

**Storybook Benefits:**
- Same stories document both platforms
- Button.stories.tsx defines expected behavior
- Platform implementations must match contract

---

## Troubleshooting

### Common Issues

#### 1. Tailwind Classes Not Applying

**Symptom:** Components render but have no styling.

**Fix:**
```typescript
// .storybook/preview.ts
import '../src/app/globals.css'; // Add this at TOP
```

---

#### 2. Next.js Image Not Loading

**Symptom:** `<Image>` components show placeholder or error.

**Fix:** Ensure `.storybook/main.ts` has `staticDirs: ['../public']`.

**Alternative:** Mock `next/image` in preview:
```typescript
import * as NextImage from 'next/image';

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: any) => <img {...props} />,
});
```

---

#### 3. React 19 Peer Dependency Warnings

**Symptom:** `npm ERR! peer react@"^18.0.0" from @storybook/addon-xyz`

**Fix:** Use legacy peer deps:
```bash
pnpm install --legacy-peer-deps
```

Or add to `.npmrc`:
```
legacy-peer-deps=true
```

---

#### 4. ESLint Plugin Not Working

**Symptom:** ESLint errors about Storybook-specific syntax.

**Fix:** Manually add to `eslint.config.mjs`:
```javascript
import storybook from "eslint-plugin-storybook";

export default [
  ...storybook.configs['flat/recommended'],
];
```

---

#### 5. MSW Handlers Not Matching

**Symptom:** Network requests bypass MSW handlers.

**Debug Steps:**
1. Check browser DevTools > Network tab - request URL
2. Verify handler URL matches exactly (including protocol)
3. Check GraphQL query has `operationName`
4. Set `onUnhandledRequest: "error"` in MSW init

**Common Fix:** GraphQL handler by operation name:
```typescript
// ✅ Works
graphql.query("GetProductBySlug", ...)

// ❌ Anonymous query - use rest.post instead
rest.post(GRAPHQL_ENDPOINT, async (req, res, ctx) => {
  const body = await req.json();
  // Parse body.query string
})
```

---

## Success Criteria

### Phase 1 Complete When:
- [ ] Storybook runs at `localhost:6006`
- [ ] Button story renders with all variants
- [ ] Tailwind classes apply correctly
- [ ] Can toggle variant via controls
- [ ] BapiButton and Button stories side-by-side

### Phase 2 Complete When:
- [ ] MSW service worker registered
- [ ] ProductHeroFast story loads with mock data
- [ ] Can create "missing image" story without WordPress
- [ ] GraphQL error story simulates network failure

### Phase 3 Complete When:
- [ ] Toast success/error stories work
- [ ] ImageModal "always open" story exists
- [ ] Can style complex components without clicking

### Phase 4 Complete When:
- [ ] Chromatic account set up
- [ ] Visual regression tests run in CI
- [ ] PR workflow includes visual review
- [ ] No false positives in baseline

---

## Next Steps

1. **Create branch:**
   ```bash
   git checkout -b feat/storybook-setup
   ```

2. **Install Storybook:**
   ```bash
   cd web
   pnpm dlx storybook@latest init --skip-install
   pnpm install --legacy-peer-deps
   ```

3. **Configure Tailwind:**
   - Edit `.storybook/preview.ts`
   - Import `globals.css`

4. **Create first story:**
   - `src/components/ui/Button.stories.tsx`

5. **Verify setup:**
   ```bash
   pnpm storybook
   ```

6. **Commit progress:**
   ```bash
   git add .storybook/ src/components/ui/Button.stories.tsx
   git commit -m "feat(storybook): initial setup with Button stories"
   ```

---

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [MSW Documentation](https://mswjs.io/)
- [Chromatic](https://www.chromatic.com/)
- [Class Variance Authority](https://cva.style/)
- [React Native + Storybook](https://storybook.js.org/tutorials/intro-to-storybook/react-native/)

---

**Questions or Issues?** Document in this guide or create GitHub issue with `storybook` label.
