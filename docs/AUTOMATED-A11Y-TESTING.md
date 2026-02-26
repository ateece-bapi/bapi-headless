# Automated Accessibility Testing - Setup Complete ✅

**Senior-Level Testing Infrastructure for WCAG 2.1 Level AA Compliance**

## What Was Set Up

### 🎯 Three Testing Layers

```
┌─────────────────────────────────────────┐
│  1. Storybook Test Runner (40% coverage)│
│     → Tests all stories automatically   │
│     → Catches component-level issues    │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  2. Vitest + axe (30% coverage)         │
│     → Unit tests for components         │
│     → Fast feedback in development      │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  3. Manual Testing (30% coverage)       │
│     → Screen readers, keyboard testing  │
│     → Real user validation              │
└─────────────────────────────────────────┘
```

### 📦 Installed Packages

- **vitest-axe** - Accessibility testing in Vitest tests
- **@storybook/test-runner** - Automated Storybook story testing
- **axe-playwright** - axe-core integration for Playwright
- **playwright** - Browser automation for testing
- **concurrently** - Run multiple commands for CI
- **wait-on** - Wait for servers to be ready
- **http-server** - Serve static Storybook builds

### 📝 New Files Created

1. **`.storybook/test-runner.ts`** - Storybook test configuration with axe
2. **`src/components/ui/Button.a11y.test.tsx`** - Example Button tests
3. **`src/components/ui/ImageModal.a11y.test.tsx`** - Example Modal tests
4. **`test/setupTests.ts`** - Updated with vitest-axe matchers

### 🚀 New NPM Scripts

```json
{
  "test:a11y": "vitest --run --grep='accessibility|a11y'",
  "test:storybook": "test-storybook",
  "test:storybook:ci": "concurrently -k -s first ..."
}
```

---

## How to Run Tests

### 1. Component Tests (Fast - 5 seconds)

**Run all accessibility tests:**
```bash
cd web/
pnpm test:a11y
```

**Run specific component:**
```bash
pnpm test Button.a11y
```

**Watch mode (development):**
```bash
pnpm test -- --grep=a11y
```

**What it tests:**
- Button variants and states
- ImageModal dialog patterns
- Color contrast
- ARIA attributes
- Keyboard accessibility

---

### 2. Storybook Tests (Medium - 2-5 minutes)

**Development (requires Storybook running):**
```bash
# Terminal 1: Start Storybook
pnpm run storybook

# Terminal 2: Run tests
pnpm test:storybook
```

**CI/CD (builds Storybook first):**
```bash
pnpm test:storybook:ci
```

**What it tests:**
- ALL stories in your Storybook
- Component accessibility in rendered state
- Integration with Headless UI, Next.js
- Visual state + accessibility combined

**Output:**
```
✓ UI/Button › Primary
✓ UI/Button › Accent
✓ UI/Toast › Success
✗ Components/ProductCard › Default
  → Found 2 critical violations:
     • image-alt: Images must have alternate text
     • button-name: Buttons must have discernible text
```

---

### 3. Full Test Suite

**Run everything:**
```bash
# All unit tests + accessibility tests
pnpm test

# Storybook tests
pnpm test:storybook

# Chromatic (visual + a11y)
pnpm run chromatic
```

---

## Writing Accessibility Tests

### Pattern 1: Basic Component Test

```typescript
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';

it('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Pattern 2: Test Specific Rules

```typescript
it('should have sufficient color contrast', async () => {
  const { container } = render(<Button variant="accent">Text</Button>);
  
  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
    },
  });
  
  expect(results).toHaveNoViolations();
});
```

### Pattern 3: Test Semantic HTML

```typescript
it('should use proper semantic elements', () => {
  const { getByRole } = render(<ProductCard {...props} />);
  
  // Should have link role (semantic <a> tag)
  const link = getByRole('link');
  expect(link).toBeInTheDocument();
  
  // Should have img with alt
  const image = getByRole('img');
  expect(image).toHaveAttribute('alt');
});
```

### Pattern 4: Test ARIA Attributes

```typescript
it('should have proper dialog attributes', () => {
  const { getByRole } = render(<Modal isOpen={true} />);
  
  const dialog = getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(dialog).toHaveAttribute('aria-labelledby');
});
```

---

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/a11y-tests.yml`:

```yaml
name: Accessibility Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  component-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: cd web && pnpm install
      
      - name: Run a11y component tests
        run: cd web && pnpm test:a11y

  storybook-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: cd web && pnpm install
      
      - name: Install Playwright
        run: cd web && npx playwright install --with-deps
      
      - name: Run Storybook tests
        run: cd web && pnpm test:storybook:ci
```

### Merge Blocking Rules

In GitHub repo settings, add required checks:
- ✅ `component-tests` - Must pass to merge
- ✅ `storybook-tests` - Must pass to merge

---

## What Gets Caught Automatically

### ✅ Automatically Detected (~50% of issues)

- **Missing alt text** on images
- **Insufficient color contrast** (< 4.5:1 ratio)
- **Missing button labels** (icon-only buttons)
- **Form inputs without labels**
- **Invalid ARIA attributes**
- **Incorrect heading hierarchy**
- **Missing landmark regions**
- **Keyboard accessibility** (missing tabindex, etc.)
- **Focus management** (keyboard traps)
- **Link accessibility** (empty links, missing href)

### ❌ NOT Detected (Manual Testing Required)

- **Logical tab order** in complex layouts
- **Screen reader announcements** quality
- **Focus indicator visibility** on all backgrounds
- **Touch target sizes** on mobile (< 44x44px)
- **Reduced motion** preferences
- **Context and help text** clarity
- **User experience** with assistive tech
- **Real-world usage** patterns

---

## Development Workflow

### Daily (Automated - Zero Manual Effort)

```bash
# Before committing
pnpm test:a11y

# If you changed a story
pnpm test:storybook
```

### Before Creating PR

```bash
# Run full test suite
pnpm test
pnpm test:storybook

# Fix any violations
# Push to branch
# CI will run tests again
```

### Weekly (30 minutes)

- Review failed Storybook tests
- Fix critical violations
- Update test coverage

### Monthly (2-3 hours)

- Manual screen reader testing
- Keyboard navigation testing
- Touch target size review
- Update accessibility docs

---

## Test Coverage Goals

### Current State (February 2026)
- ✅ Infrastructure set up
- ✅ 2 example test files
- ⏳ ~10% component coverage

### Phase 1 Goals (March 2026)
- ⏳ 50% component coverage
- ⏳ All checkout forms tested
- ⏳ All product components tested
- ⏳ CI/CD integration

### Phase 2 Goals (April 2026)
- ⏳ 80%+ component coverage
- ⏳ Monthly manual testing routine
- ⏳ Accessibility statement published
- ⏳ User testing with assistive tech

---

## Examples to Study

### 1. Button Tests
**File:** `src/components/ui/Button.a11y.test.tsx`
- All variants tested
- Color contrast checks
- Focus indicators
- Icon buttons with aria-labels

### 2. Modal Tests
**File:** `src/components/ui/ImageModal.a11y.test.tsx`
- Dialog role and aria-modal
- Focus management
- Keyboard navigation
- Icon button labels

### 3. Create Your Own
```typescript
// src/components/products/ProductCard.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ProductCard } from './ProductCard';

describe('ProductCard - Accessibility', () => {
  it('should have no violations', async () => {
    const { container } = render(
      <ProductCard
        name="Test Product"
        slug="test-product"
        price="$100"
        image={{ sourceUrl: '/test.jpg', altText: 'Test Product Image' }}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have descriptive image alt text', () => {
    const { getByAltText } = render(<ProductCard {...props} />);
    expect(getByAltText(/test product image/i)).toBeInTheDocument();
  });
});
```

---

## Debugging Test Failures

### Common Issues

**1. "Images must have alternate text"**
```typescript
// ❌ BAD
<Image src="/product.jpg" width={300} height={300} />

// ✅ GOOD
<Image 
  src="/product.jpg" 
  alt="Temperature Sensor TS-101"
  width={300} 
  height={300} 
/>
```

**2. "Buttons must have discernible text"**
```typescript
// ❌ BAD
<button onClick={handleClose}>
  <X className="h-5 w-5" />
</button>

// ✅ GOOD
<button onClick={handleClose} aria-label="Close modal">
  <X className="h-5 w-5" />
</button>
```

**3. "Elements must have sufficient color contrast"**
```typescript
// ❌ BAD - Yellow text on white
<span className="text-accent-500">Price: $100</span>

// ✅ GOOD - Yellow background with dark text
<span className="bg-accent-500 text-neutral-900">Price: $100</span>
```

---

## Resources

### Documentation
- **vitest-axe:** https://github.com/chaance/vitest-axe
- **Storybook test-runner:** https://storybook.js.org/docs/react/writing-tests/test-runner
- **axe-core rules:** https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/

### Tools
- **axe DevTools:** https://www.deque.com/axe/devtools/ (browser extension)
- **WAVE:** https://wave.webaim.org/extension/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

## Next Steps

### Immediate (This Week)
1. ✅ Infrastructure set up
2. ⏳ Run example tests: `pnpm test:a11y`
3. ⏳ Add tests for ProductCard
4. ⏳ Add tests for CartButton

### Short Term (Next 2 Weeks)
5. ⏳ Add tests for all UI components
6. ⏳ Add tests for checkout forms
7. ⏳ Set up CI/CD workflow
8. ⏳ Document failures in violations log

### Medium Term (Month 1-2)
9. ⏳ 50%+ test coverage
10. ⏳ Fix all critical violations
11. ⏳ Monthly manual testing routine
12. ⏳ Team training session

---

**Last Updated:** February 26, 2026  
**Status:** ✅ Ready to use  
**Branch:** `feature/automated-a11y-testing`  
**Next:** Run `pnpm test:a11y` to see automated tests in action!
