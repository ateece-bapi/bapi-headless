# Component Patterns & Best Practices

## Page Component Structure

### Core Principle: Separation of Concerns

**Layout = Structure & Semantics**  
**Pages = Content & Presentation**

---

## ❌ Anti-Pattern: Duplicate Semantic Elements

### Problem
```tsx
// app/[locale]/layout.tsx
export default function Layout({ children }) {
  return (
    <body>
      <Header />
      <main id="main-content">{children}</main>  ← Layout provides <main>
      <Footer />
    </body>
  );
}

// app/[locale]/products/page.tsx
export default function ProductsPage() {
  return (
    <main className="min-h-screen">  ← ❌ WRONG: Creates duplicate!
      <section>...</section>
    </main>
  );
}
```

**Result:** Two `<main>` elements on the page
- ❌ Violates HTML semantics (only ONE main landmark allowed)
- ❌ Breaks accessibility (screen readers confused)
- ❌ Playwright strict mode violations
- ❌ SEO issues (ambiguous page structure)

---

## ✅ Correct Patterns

### Pattern 1: Fragments (Simplest)

**Use when:** Page has multiple sections, no full-page styling needed

```tsx
export default function Page() {
  return (
    <>
      <section className="hero py-20">...</section>
      <section className="features py-16">...</section>
      <section className="cta py-12">...</section>
    </>
  );
}
```

**Benefits:**
- Zero wrapper overhead
- Clean semantic HTML
- Each section styles itself

---

### Pattern 2: Single Section (Most Semantic)

**Use when:** Page is conceptually one unit of content

```tsx
export default function SimplePage() {
  return (
    <section className="min-h-screen bg-white py-12">
      <div className="container mx-auto">
        <h1>Page Title</h1>
        {/* content */}
      </div>
    </section>
  );
}
```

**Benefits:**
- Semantic HTML (`<section>` has meaning)
- No wrapper needed
- Styling on semantic element

---

### Pattern 3: Non-Semantic Wrapper (When Needed)

**Use when:** Need full-page styling that can't go on individual sections

```tsx
export default function ComplexPage() {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white transition-opacity"
      data-page="products"
    >
      <section className="hero">...</section>
      <section className="features">...</section>
      <section className="testimonials">...</section>
    </div>
  );
}
```

**Valid use cases for wrapper:**
- Full-page background gradients
- Page transition effects (`opacity`, `transform`)
- Data attributes for testing (`data-testid`)
- Global page state classes (`is-loading`, `has-error`)

**Key:** Use `<div>` (non-semantic) not `<main>` (semantic)

---

## Layout Hierarchy

```
┌─────────────────────────────────────┐
│ <html>                              │
│  <body>                             │
│   <Header />                        │ ← Layout provides
│   <main id="main-content">          │ ← ONE semantic landmark
│     {children}                      │ ← Pages render HERE
│   </main>                           │
│   <Footer />                        │ ← Layout provides
│  </body>                            │
│ </html>                             │
└─────────────────────────────────────┘
```

**Pages inject content into `<main>`:**
```
<main id="main-content">
  <!-- Page content renders here -->
  <section>Hero</section>
  <section>Features</section>
  <section>CTA</section>
</main>
```

---

## Decision Tree

```
Need to create a page component?
│
├─ Multiple distinct sections?
│  └─ Use <> fragments with multiple <section>s
│
├─ Single cohesive content unit?
│  └─ Use single <section> wrapper
│
└─ Need full-page styling/transitions?
   ├─ Can it go on first <section>? → Use semantic element
   └─ Must span all sections? → Use <div> wrapper (acceptable)
```

---

## Common Mistakes

### 1. Wrapping Everything in <div>

```tsx
// ❌ Unnecessary wrapper
export default function Page() {
  return (
    <div>  ← Not needed!
      <section>Content</section>
    </div>
  );
}

// ✅ Return section directly
export default function Page() {
  return <section>Content</section>;
}
```

### 2. Using <main> in Pages

```tsx
// ❌ NEVER do this
export default function Page() {
  return <main>...</main>;  // Layout already provides <main>
}
```

### 3. Deep Nesting

```tsx
// ❌ Too many wrappers
return (
  <div className="page">
    <div className="page-inner">
      <div className="page-content">
        <section>Actual content</section>
      </div>
    </div>
  </div>
);

// ✅ Flatten structure
return (
  <section className="page">
    {/* Actual content */}
  </section>
);
```

---

## Semantic Elements Guide

| Element | Purpose | Use In Pages? |
|---------|---------|---------------|
| `<main>` | Primary content landmark | ❌ NO (Layout provides) |
| `<section>` | Thematic grouping | ✅ YES (primary choice) |
| `<article>` | Self-contained content | ✅ YES (blog posts, products) |
| `<aside>` | Tangential content | ✅ YES (sidebars, related) |
| `<nav>` | Navigation links | ❌ Usually in Layout/Header |
| `<div>` | Non-semantic container | ⚠️ When needed for styling |

---

## Testing Semantic Structure

```tsx
// tests/structural.test.ts
test('page has exactly one main landmark', async ({ page }) => {
  await page.goto('/');
  const mainCount = await page.locator('main').count();
  expect(mainCount).toBe(1);
});

test('main has meaningful content', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main#main-content');
  await expect(main).toBeVisible();
  await expect(main).not.toBeEmpty();
});
```

---

## Enforcement

### ESLint Rule (See .eslintrc.js)

Prevents `<main>` usage in page components:
```js
'no-restricted-syntax': [
  'error',
  {
    selector: 'JSXOpeningElement[name.name="main"]',
    message: 'Do not use <main> in page components. Layout provides the main landmark.'
  }
]
```

### Code Review Checklist

- [ ] Does page use `<main>`? (Should be NO)
- [ ] Does wrapper serve a purpose? (Styling, transitions, etc.)
- [ ] Can wrapper be removed? (Use fragments or semantic elements)
- [ ] Are sections semantically appropriate?
- [ ] Is HTML hierarchy flat and logical?

---

## Examples from Codebase

### ✅ Homepage
```tsx
// web/src/app/[locale]/(public)/page.tsx
export default function Home() {
  return (
    <>
      <Hero />
      <section className="stats">...</section>
      <section className="categories">...</section>
    </>
  );
}
```

### ✅ Products Landing (with styling wrapper)
```tsx
// web/src/app/[locale]/products/page.tsx
export default function ProductsPage() {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-white"
      data-testid="products-page"
    >
      <section className="hero">...</section>
      <section className="categories-grid">...</section>
    </div>
  );
}
```

---

## Migration Notes (March 4, 2026)

**Issue:** 35+ pages had duplicate `<main>` elements causing Playwright strict mode violations.

**Fix:** Replaced page-level `<main>` with:
1. React Fragments `<>` where no wrapper needed
2. `<div>` wrappers where styling required

**Result:** Clean semantic structure, E2E tests passing.

**Lesson:** Document patterns BEFORE mass changes to prevent issues.

---

## Further Reading

- [MDN: Using HTML sections and outlines](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
- [W3C: Document Structure](https://www.w3.org/WAI/tutorials/page-structure/)
- [React: Fragments](https://react.dev/reference/react/Fragment)
- Next.js: Layouts and Templates

---

**Last Updated:** March 4, 2026  
**Maintainer:** Development Team
