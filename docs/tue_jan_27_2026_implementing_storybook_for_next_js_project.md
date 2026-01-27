# Copilot Chat Conversation Export: Implementing Storybook for Next.js project

**User:** @ateece-bapi
**Thread URL:** https://github.com/copilot/c/367b18b6-4139-4bdf-8098-1f60744e933c

## @ateece-bapi

Would install and implementing Storybook for our headless wordpress nextjs fronten site be something we should look into?

## Copilot

Based on the analysis of your repository, **yes, I highly recommend implementing Storybook.**

Your project is in a perfect state to benefit from it. You are currently transitioning between component patterns (moving from `BapiButton.tsx` to a more modern `Button.tsx` using `cva`), and Storybook is the ideal tool to manage that migration.

### Why it's a good fit for your specific repo:

1.  **Managing Your UI Migration**:
    *   You have **`web/src/components/ui/BapiButton.tsx`** (likely the legacy implementation) and **`web/src/components/ui/Button.tsx`** (the new CVA-based implementation).
    *   Storybook allows you to view these side-by-side to ensure visual regression doesn't happen during the transition.
    *   It serves as a "source of truth" for the new design system you are building with `class-variance-authority`.

2.  **Isolating Complex Interactions**:
    *   Components like **`Toast.tsx`** and **`ImageModal.tsx`** have complex states (open, closed, animated, auto-dismiss).
    *   Developing these inside the full Next.js application is tedious because you have to constantly trigger the "open" state manually.
    *   In Storybook, you can create a "Always Open" story to style the modal without clicking a button 50 times.

3.  **Visualizing "Headless" Data**:
    *   Since you are running a **headless WordPress** setup, your frontend relies heavily on data coming from an API (e.g., `ProductHeroFast.tsx` and `RelatedProductsAsync.tsx`).
    *   Storybook lets you mock this data. You can create a story for "Product with no image," "Product with long title," or "Out of stock" without needing to edit WordPress content to see how it looks.

### Recommended Next Steps

Since you are using **Next.js 16**, **Tailwind**, and **Vite/Vitest**, the setup is straightforward.

1.  **Initialize Storybook:**
    Run this command in your `web` directory:
    ```bash
    npx storybook@latest init
    ```
    *It will automatically detect Next.js and Tailwind and configure the basics for you.*

2.  **Create your first Stories:**
    Start with your base UI components. I recommend creating `Button.stories.tsx` first, as it's the core of your new design system.

3.  **Mock Next.js Modules:**
    Since you use `next/image` heavily (in `AppImage.tsx`), ensure the Storybook Next.js addon is active (it usually is by default in new inits) so images render correctly in isolation.

## @ateece-bapi

Would this be considered a senior developer move for this project/site?

## Copilot

Yes, absolutely. In the context of your specific repository structure and the "headless" architecture, introducing Storybook is a classic **senior-level architectural decision**.

Here is why this moves beyond "just installing a tool" and demonstrates senior-level strategic thinking for **`bapi-headless`**:

### 1. It Decouples Frontend Velocity from the CMS
**Junior/Mid approach:** Develop components by running the full Next.js app and pointing it at the actual WordPress GraphQL API. To test a "Sold Out" state or an "Error" toast, they have to go into WordPress, edit a product, save it, refresh the page, and hope caching doesn't get in the way.

**Senior approach:** You recognize that `ProductHeroFast.tsx` and `RelatedProductsAsync.tsx` are dependent on specific data shapes. By using Storybook, you mock these data states. You can build the entire UI for a "Missing Image" or "Super Long Title" edge case without ever touching the WordPress backend. This separates your UI development cycle from your content management cycle.

### 2. It Manages the "Migration Risk"
You are currently in a transition state.
*   **Legacy:** `web/src/components/ui/BapiButton.tsx` (Manual styles)
*   **Modern:** `web/src/components/ui/Button.tsx` (Using `class-variance-authority`)

A senior developer knows that having two sources of truth for buttons is technical debt. Storybook provides a "Visual Inventory." It allows you to put the Old Button and New Button side-by-side to ensure parity before you do a mass find-and-replace. It turns a scary refactor into a controlled, visible process.

### 3. It Documents Complexity (CVA & Interactive States)
You are using **Class Variance Authority (CVA)** in `Button.tsx`. This is powerful, but it makes the code abstract.
*   A junior developer looks at the code and has to mentally parse what `variant: "ghost"` looks like.
*   With Storybook, that code becomes a visual catalog. New developers (or you, 6 months from now) can click a dropdown to see `ghost`, `danger`, and `outline` variants instantly.

Similarly, testing `Toast.tsx` inside the app requires clicking a specific trigger to make it appear for 5 seconds. In Storybook, you set the story to `{ isOpen: true }`, and it stays there while you perfect the CSS.

### 4. It Prepares for Visual Regression Testing
Senior developers think about **stability at scale**. If you update Tailwind or change a global base style, how do you know you didn't break the layout of the `ImageModal`?
*   Without Storybook: You manually click through the site.
*   With Storybook: You have the infrastructure to eventually add tools like Chromatic (or just standard Storybook test runners) that will automatically alert you: *"Hey, you changed the padding on `body`, and now the Close button on the modal is misaligned."*

### The Verdict
Implementing Storybook here isn't "over-engineering"—it is the correct response to the complexity of a **Headless CMS + Modern Component Library** architecture. It shifts your workflow from "Implementing pages" to "Building a Design System," which is the hallmark of a mature, scalable frontend project.

## @ateece-bapi

Create a step by step guide for me to implement Storybook into our site. I want to read to over completely before we move forward.

## Copilot

This is a comprehensive, step-by-step guide tailored to your **Next.js 16 + Tailwind 4** repository.

Since you are in a "monorepo-style" setup (where your frontend lives in the `web/` directory), we need to ensure Storybook is installed and configured specifically for that workspace.

### **Phase 1: Installation & Setup**

#### **Step 1: Initialize Storybook**
Run this command inside your `web` directory. Do not run it in the root of the repo.

```bash
cd web
npx storybook@latest init
```

*   **What this does:** It detects Next.js, TypeScript, and Tailwind. It will ask if you want to install the `eslint-plugin-storybook` (say **Yes**).
*   **The Senior Dev Check:** It creates a `.storybook` folder and adds scripts to your `package.json`. It will likely default to using Webpack to match Next.js's internal build process, ensuring your CSS modules and aliases (`@/components`) work out of the box.

#### **Step 2: Connect Tailwind 4**
Tailwind 4 changes how styles are loaded (it relies heavily on CSS imports rather than a config file). You must tell Storybook where your "source of truth" for styles is.

1.  Open `.storybook/preview.ts`.
2.  Import your global CSS file at the very top.

```typescript name=.storybook/preview.ts
// Add this line at the top
import '../src/app/globals.css'; 

import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // This improves how Next.js images behave in Storybook
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
```

#### **Step 3: Asset Configuration (Crucial for Images)**
Your components use `next/image`. Storybook needs to know where your static assets (like placeholder images or icons) live.

1.  Open `.storybook/main.ts`.
2.  Add the `staticDirs` property.

```typescript name=.storybook/main.ts
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  // ADD THIS LINE:
  staticDirs: ['../public'], 
  docs: {
    autodocs: "tag",
  },
};
export default config;
```

---

### **Phase 2: Creating Your First "Senior" Story**

We will skip the tutorial examples and go straight to your migration tool: the **Button**. This confirms that your `class-variance-authority` (CVA) setup is working correctly in isolation.

Create a file: `src/components/ui/Button.stories.tsx`.

```tsx name=src/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { MousePointerClick } from 'lucide-react'; // Proves icons work

const meta = {
  title: 'UI/Button', // Categorizes it in the sidebar
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // This allows you to edit the props using controls in the UI
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

// The "Standard" view
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
};

// The "Ghost" view (proving your CVA logic works)
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Cancel',
  },
};

// A "Complex" view with an Icon
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
```

---

### **Phase 3: The "Headless" Strategy (Mocking Data)**

This is the most valuable part for your specific architecture. You want to see how `ProductHeroFast` looks without querying WordPress.

Create `src/components/products/ProductHeroFast.stories.tsx`.

```tsx name=src/components/products/ProductHeroFast.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProductHeroFast } from './ProductHeroFast';

const meta = {
  title: 'Products/Hero',
  component: ProductHeroFast,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ProductHeroFast>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mocking the complex GraphQL shape
const mockProduct = {
  id: 'prod_123',
  databaseId: 123,
  slug: 'temp-sensor-x',
  name: 'BAPI Wireless Temp Sensor',
  shortDescription: '<p>High precision wireless temperature sensor for HVAC applications.</p>',
  image: {
    sourceUrl: 'https://placehold.co/600x600/png', // Mock image
    altText: 'Sensor Device',
  },
  // ... add other required fields from your GraphQL type
} as any; // Cast to 'any' temporarily if types are strict generated types

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const MissingImage: Story = {
  args: {
    product: {
      ...mockProduct,
      image: null, // Test how your component handles null images
    },
  },
};

export const LongTitle: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'BAPI Wireless Temperature Sensor with Extra Long Title That Might Break The Layout on Mobile Devices',
    },
  },
};
```

### **Phase 4: Running It**

1.  Run the server:
    ```bash
    npm run storybook
    ```
2.  Open `http://localhost:6006`.

### **Verification Checklist**
*   [ ] Does the **Button** story load?
*   [ ] Can you change the `variant` dropdown and see the color change? (This confirms Tailwind is loading).
*   [ ] Does the **ProductHero** story load? (This confirms Next.js Image handling is working).

Once this is running, you can deprecate `BapiButton.tsx` safely by visually comparing it to your new `Button.stories.tsx` to ensure you haven't lost any styles.

## @ateece-bapi

I have done Storybook implementations before have have run into problems with dependencies. Can you review the package.json file for potential conflicts/problems?

## Copilot

Yes, I have reviewed your `web/package.json` carefully. Because you are on the bleeding edge with **React 19**, **Next.js 16**, and **Tailwind 4**, you will almost certainly encounter dependency warnings during installation.

Here are the specific conflicts you should anticipate and how to handle them:

### 1. React 19 Peer Dependency Warnings
**The Conflict:**
You are using `"react": "19.2.0"`. Many Storybook addons (and even some parts of the core ecosystem) may still list `"react": "^16.8.0 || ^17.0.0 || ^18.0.0"` in their `peerDependencies`. They haven't been updated to explicitly allow v19 yet.

**The Fix:**
Since you are using `pnpm` (based on your `build:analyze` script), the installation might fail strictly.
*   **Action:** When running the init command, you may need to bypass peer dependency checks if it errors out:
    ```bash
    npx storybook@latest init --package-manager=pnpm --legacy-peer-deps
    ```
    *Note: React 19 is backward compatible for most Storybook use cases, so these warnings are usually safe to ignore.*

### 2. ESLint 9 "Flat Config" Mismatch
**The Conflict:**
You are using `"eslint": "^9"`, which uses the new `eslint.config.mjs` (Flat Config) system.
The Storybook CLI automation often tries to patch legacy `.eslintrc.json` files. It might fail to automatically configure the `eslint-plugin-storybook` or create a generic `.eslintrc` file that conflicts with your new config.

**The Fix:**
If the auto-installer fails to setup linting:
1.  Let it finish the rest of the installation.
2.  Manually add the plugin to your `eslint.config.mjs` (or `.js`) instead of relying on the generated file.
    ```javascript
    // In your eslint.config.mjs
    import storybook from "eslint-plugin-storybook";
    
    export default [
      // ... your other configs
      ...storybook.configs['flat/recommended'],
    ];
    ```

### 3. Tailwind 4 Configuration
**The Conflict:**
Tailwind 4 moves configuration from JavaScript (`tailwind.config.js`) to CSS. Storybook's default Next.js integration usually expects the old behavior (reading a config file to generate styles).
Additionally, I noticed you have `"@tailwindcss/postcss": "^4"` but I do **not** see `"tailwindcss"` explicitly listed in your `devDependencies`.

**The Fix:**
1.  Ensure you actually have `tailwindcss` installed. If it's missing, Storybook won't be able to generate the styles.
    ```bash
    pnpm add -D tailwindcss
    ```
2.  In **Tailwind 4**, the PostCSS plugin is the primary integration point. Storybook for Next.js (Webpack) relies on `postcss-loader`. Ensure your `web/postcss.config.mjs` is set up correctly for Tailwind 4 so Storybook's webpack builder can pick it up:
    ```javascript
    // web/postcss.config.mjs
    const config = {
      plugins: {
        '@tailwindcss/postcss': {},
      },
    };
    export default config;
    ```

### 4. Pnpm "Ghost Dependencies" (Hoisting)
**The Conflict:**
Storybook relies on a lot of internal dependencies (like `webpack`, `preview-js`, etc.). `pnpm` is very strict about not letting you access packages you haven't explicitly installed. Sometimes Storybook tries to access a package it *assumes* is hoisted to the root `node_modules`.

**The Fix:**
If Storybook crashes immediately on startup saying it "cannot find module X":
1.  Create or edit a `.npmrc` file in the root of your workspace (or the `web` folder).
2.  Add: `public-hoist-pattern[]=*storybook*` or simpler: `shamefully-hoist=true` (if you are okay with looser boundaries).

### Summary Recommendation
Your setup is solid, but "very new."
Run the init command with the expectation of peer-dependency warnings. As long as the `npx storybook init` command completes and creates the `.storybook` folder, you can fix the rest (ESLint/PostCSS) manually.

**Run this command to start:**
```bash
# Using dlx ensures you get the latest binary
# --skip-install allows you to inspect package.json changes before pnpm installs
pnpm dlx storybook@latest init --skip-install
```
*Then run `pnpm install` manually so you can see exactly what breaks.*

## @ateece-bapi

Are there alternatives to Storybook that you recommend?

## Copilot

Yes — there are several viable alternatives to Storybook. Which one is best depends on your primary goals (design-system docs, fast dev server, visual regression testing, multi-repo component sharing, or fixtures/edge-state testing). Below I list the most practical options for a Next.js 16 + Tailwind 4 + React 19 project, with short pros/cons, compatibility notes, and a clear recommendation for common use-cases.

1) Storybook (recap)
- Why keep it: richest ecosystem, addons (controls, accessibility, interactions), Chromatic visual testing, MDX docs, great for design systems.
- Downsides: largest surface area → more dependency/peer-dep headaches (React 19), heavier startup and config.
- When to use: you want a full-featured design system, team onboarding docs, addons and visual regression (Chromatic).

2) Ladle (lightweight Storybook alternative)
- What it is: a fast, Vite-based component dev server with Storybook-style stories format.
- Pros:
  - Very fast cold/hot start times (Vite).
  - Simpler dependency surface → fewer peer-dep issues with React 19.
  - Supports .stories.* story files and many modern workflows.
- Cons:
  - Smaller ecosystem and fewer mature addons than Storybook.
  - Less out-of-the-box integration for advanced features (Chromatic).
- Compatibility notes: Works well with Tailwind (import your globals into the Ladle entry) and React 19; you’ll need to mock Next-specific APIs (next/image, router) similar to Storybook.
- When to use: you want a fast, low-friction local component playground where dependency issues are blocking Storybook.

3) Bit (bit.dev) — component hub / distribution platform
- What it is: a platform and tooling for collecting, versioning, publishing, and composing components across repos.
- Pros:
  - Great for sharing components across projects and teams.
  - Hosted component hub and remote dev experiences.
  - Components are documented with playgrounds and tests.
- Cons:
  - Bigger workflow change — learning curve and CI/workflow integration required.
  - Not focused solely on local visual docs (but it can host them).
- When to use: you plan to reuse components across multiple apps or teams, or want a component registry.

4) React Cosmos (fixture-driven component dev)
- What it is: a tool that isolates components and renders them with fixtures for different states.
- Pros:
  - Excellent for testing component states and permutations.
  - Focused on fixtures, making state testing easy.
- Cons:
  - Less focused on polished docs and controls than Storybook.
  - Ecosystem smaller and UX more developer-focused.
- When to use: you want to iterate edge states and inputs quickly, especially for complex interactive components.

5) Playroom (component playground)
- What it is: a live coding playground for components and design tokens.
- Pros:
  - Good for design/dev collaboration and showing composable components.
- Cons:
  - Less of a documentation/catalog solution; more of an interactive playground.
- When to use: designers and devs want a shared interactive playground for layout/composition experiments.

6) React Styleguidist
- What it is: a living style guide generator for React components.
- Pros:
  - Simple and good for docs and examples.
- Cons:
  - Less active than Storybook; fewer modern features and addons.
- When to use: you need a simple component documentation site and don’t need Storybook’s full feature set.

7) Custom Vite + MDX + Docs site
- What it is: build a minimal, bespoke component docs site (Vite + MDX + Tailwind).
- Pros:
  - Maximum control and minimal dependencies.
  - Tailored to exactly the features you need.
- Cons:
  - More initial engineering time; you re-build features Storybook provides.
- When to use: you have very specific requirements and want minimal tooling surface.

Complementary tools (visual testing):
- Chromatic (built for Storybook) — hosted visual regression.
- Percy / Applitools — visual testing that can integrate with Storybook or custom sites.

Recommendation for your project
- If your goal is a full design system, robust docs, and future visual regression CI: Storybook is still the best overall choice. It’s the safest long-term investment despite the dependency friction you’ve seen.
- If you’re currently blocked by peer-dependency or React 19 issues and need a fast, low-friction proof-of-concept: try Ladle first. It’s Vite-based, much faster, and tends to avoid many of Storybook’s dependency problems. You can use it to validate your stories and then opt to migrate to Storybook later (or keep Ladle if it meets your needs).
- If your strategic priority is component distribution across multiple repos / teams: evaluate Bit (it can be used alongside Storybook or Ladle).

If you want, I can:
- Do a short PoC plan for Ladle (install commands, minimal config files, how to import Tailwind and mock next/image).
- Or produce a smaller “Storybook troubleshooting checklist” targeting the peer-dep problems you experienced (exact dependency pins, pnpm flags, .npmrc entries, and next/image mocks).

Which would you prefer — a Ladle PoC guide or a Storybook troubleshooting checklist first?

## @ateece-bapi

I am thinking Storybook is the way forward. I know in past projects I had a hard time with MSW.

## Copilot

Great — since you want to go forward with Storybook, I'll focus on making MSW (Mock Service Worker) integration predictable and maintainable. Below is a practical, step-by-step guide tailored to your Next.js 16 + App Router + Tailwind 4 + pnpm + React 19 repo (web/). It covers installation, configuration (global + per-story), GraphQL and REST examples, common gotchas you mentioned (service worker registration, server-side fetches, handlers not matching), and troubleshooting.

High-level plan
- Install MSW and the Storybook MSW addon
- Generate the service worker into web/public
- Add a Storybook preview setup to initialize MSW and register the global decorator
- Write global handlers (GraphQL + REST) and per-story overrides
- Verify and troubleshoot common failure modes

Important constraints to keep in mind
- MSW intercepts only browser network requests. It will not intercept server-side fetches used during SSR/Next.js Server Components. For server-side components, you must pass mocked props into stories rather than relying on MSW.
- Service worker file must be available from Storybook's static server (configure staticDirs).
- You may run into peer-dependency warnings with React 19; MSW itself should be fine, but Storybook + addons may warn. Proceed but investigate any install errors.

1) Install packages (in web/)
Run these (uses pnpm):
- Core MSW
- Storybook MSW integration (pick one — I show the widely-used msw-storybook-addon approach; Storybook also has an official addon variant, names may change over time)

```bash
cd web
pnpm add -D msw msw-storybook-addon
```

If you prefer the Storybook-official addon and it exists in your environment, you can use that (package names have changed historically). Either approach works; instructions below use the msw-storybook-addon API which is stable and simple.

2) Generate the service worker to web/public
MSW requires a worker script to be hosted at a public path so the browser can register it.

```bash
# generate mockServiceWorker.js in web/public
npx msw init public/ --save
```

Verify file exists: web/public/mockServiceWorker.js

Make sure Storybook serves web/public — you'll add staticDirs next.

3) Storybook config: ensure staticDirs and preview are set
Open or create `.storybook/main.ts` (or `.storybook/main.js`) and ensure staticDirs includes public and stories pattern includes your src files:

```ts
// .storybook/main.ts
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    // other addons...
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"], // <-- required so mockServiceWorker.js is served
  docs: { autodocs: "tag" },
};
export default config;
```

4) Initialize MSW in Storybook preview
Create or edit `.storybook/preview.ts` (or preview.js). This will initialize the MSW library and add the msw decorator so handlers apply automatically to stories.

Example using msw-storybook-addon:

```ts
// .storybook/preview.ts
import "../src/app/globals.css"; // your Tailwind entry
import { initialize, mswDecorator } from "msw-storybook-addon";
import type { Preview } from "@storybook/react";

// Initialize MSW and ensure the worker file is loaded from the public path
initialize({
  onUnhandledRequest: "warn", // 'bypass' or 'warn' during dev; 'error' in CI if you want strictness
  serviceWorker: {
    url: "/mockServiceWorker.js",
  },
});

// Provide the MSW decorator globally
export const decorators = [mswDecorator];

// Add other Storybook parameters
export const parameters: Preview["parameters"] = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
  // Optional: configuration for addon msw can go here
};
```

Notes:
- serviceWorker.url should point to /mockServiceWorker.js because we used staticDirs: ['../public'].
- onUnhandledRequest: 'warn' is a good default — it logs when a request isn't matched.

5) Organize handlers
Create a centralized directory for handlers (recommended): web/.storybook/msw or web/src/mocks

Example: web/.storybook/msw/handlers.ts

- GraphQL example (intercepts by operation name)
- REST example (intercepts by exact URL or relative path)

```ts
// .storybook/msw/handlers.ts
import { graphql, rest } from "msw";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "https://wp.example.com/graphql";

// GraphQL handler by operation name
export const graphqlHandlers = [
  graphql.query("GetProductBySlug", (req, res, ctx) => {
    // req.variables available
    const { slug } = req.variables;
    return res(
      ctx.data({
        product: {
          id: "prod_1",
          slug,
          name: "Mocked Product Name",
          shortDescription: "<p>Mocked description</p>",
          image: { sourceUrl: "https://placehold.co/600x600", altText: "Mock" },
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
              { id: "r1", slug: "related-1", name: "Related 1", image: { sourceUrl: "https://placehold.co/300x300", altText: "Rel1" } },
            ],
          },
        },
      })
    );
  }),
];

// REST example
export const restHandlers = [
  rest.get("https://api.example.com/user", (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: "Mock User" }));
  }),
];

export const handlers = [...graphqlHandlers, ...restHandlers];
export default handlers;
```

Notes:
- graphql.query('OperationName', ...) intercepts GraphQL requests where the operation name equals "OperationName". Many GraphQL clients set the operationName automatically when using named queries — this is the most robust approach.
- If your GraphQL requests have anonymous operations (no operationName), use rest.post to intercept the POST to the GraphQL endpoint and parse req.body to examine query/variables.

6) Wire global handlers into preview
Import and apply the handlers in preview so they're active by default.

```ts
// .storybook/preview.ts (append to the file)
import handlers from "./msw/handlers"; // adjust path if you put mocks elsewhere

// The msw-storybook-addon will pick up handlers via the mswDecorator and also searches parameters.msw
export const parameters = {
  msw: {
    handlers: {
      // default handlers for all stories
      global: handlers,
    },
  },
};
```

7) Per-story and per-suite overrides
You often want special handlers for a single story (errors, timeouts, missing data). MSW addon supports story-level parameters.

Example in a story file:

```tsx
// src/components/products/ProductHeroFast.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ProductHeroFast } from "./ProductHeroFast";
import { graphql } from "msw";

const meta: Meta<typeof ProductHeroFast> = {
  title: "Products/Hero",
  component: ProductHeroFast,
};

export default meta;

const mockProduct = { /* ... */ };

export const Default: StoryObj<typeof ProductHeroFast> = {
  args: { product: mockProduct },
};

// Story that simulates a GraphQL network error
export const GraphQLError: StoryObj<typeof ProductHeroFast> = {
  parameters: {
    msw: {
      handlers: [
        graphql.query("GetProductBySlug", (req, res, ctx) => {
          return res(ctx.errors([{ message: "GraphQL error: product not found" }]));
        }),
      ],
    },
  },
  args: { product: mockProduct },
};

// Story that simulates a slow network
export const SlowNetwork: StoryObj<typeof ProductHeroFast> = {
  parameters: {
    msw: {
      handlers: [
        graphql.query("GetProductBySlug", (req, res, ctx) => {
          return res(ctx.delay(2000), ctx.data({ product: mockProduct }));
        }),
      ],
    },
  },
  args: { product: mockProduct },
};
```

8) Dealing with anonymous GraphQL operations
If your frontend sends GraphQL requests without operationName (e.g., inline queries or automatic tooling that strips names), use rest.post interception:

```ts
// .storybook/msw/handlers.ts (add)
import { rest } from "msw";
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "https://wp.example.com/graphql";

export const anonymousGraphqlHandler = rest.post(GRAPHQL_URL, async (req, res, ctx) => {
  const body = await req.json();
  // body.query is the GraphQL query string; you can inspect it to decide
  if (body.query.includes("productBy")) {
    return res(ctx.data({ product: /*...*/ }));
  }
  return res(ctx.status(500), ctx.json({ errors: [{ message: "No handler for query" }] }));
});
```

9) Key gotchas & how to handle them

- MSW doesn’t intercept server-side fetches (Next.js server components / getServerSideProps)
  - Solution: For Server Components or data fetched during SSR, stories must provide the props directly (mock the data and pass it as args) or you must convert that logic to client-side fetches to be intercepted.

- Service worker not found or not registered
  - Ensure web/public/mockServiceWorker.js exists.
  - Ensure `.storybook/main.ts` staticDirs includes '../public'.
  - In .storybook/preview.ts, initialize({ serviceWorker: { url: '/mockServiceWorker.js' }})
  - Open browser devtools > Application > Service Workers to confirm registration.

- Handlers not firing / onUnhandledRequest floods
  - Start with onUnhandledRequest: "warn" to log missing matches.
  - Verify request URL exactly matches handler specification (including protocol and host).
  - If you're mocking absolute URLs, ensure env var in Storybook is set (NEXT_PUBLIC_GRAPHQL_ENDPOINT visible in storybook env).
  - If the request is a cross-origin CORS-preflight and the request is a simple GET/POST from the browser, MSW still intercepts, but check network tab to confirm it's a real network call or browser being prevented.

- Operation name mismatch in GraphQL
  - Ensure your GraphQL client sends operationName; prefer named queries.
  - If not, handle via rest.post and parse the query string as above.

- Interactions between service worker + cache + local dev
  - When you change handlers, sometimes the service worker is cached; open devtools and select "Update on reload" or unregister the worker and reload.

- pnpm and hoisting / missing modules
  - If Storybook or msw-storybook-addon fails to resolve modules, try adding `shamefully-hoist=true` to web/.npmrc or root .npmrc temporarily, or add missing deps explicitly.

10) CI/build notes (build-storybook)
- The mockServiceWorker must be included in the static build — since you used staticDirs: ['../public'], build-storybook output will include it automatically.
- In CI, you usually don't need MSW, but if you run visual tests against the built Storybook that rely on mocks (e.g., Chromatic or Percy), keep the mockServiceWorker in the build.

11) Debugging checklist (quick)
- Does web/public/mockServiceWorker.js exist? yes/no
- Does .storybook/main.ts include staticDirs: ['../public']? yes/no
- Is preview.ts initializing MSW with the serviceWorker url set? yes/no
- Do handlers match URL and operation names? Check network requests in the browser devtools and compare with your handlers.
- Is the component under test performing server-side fetches? If so, change story to pass mocked props.
- If service worker is registered but handlers not firing — unregister worker, reload, check console logs (onUnhandledRequest).

12) Nice-to-have patterns (senior-level)
- Centralize mock fixtures in web/.storybook/msw/fixtures to reuse in stories.
- Create small helper factories (factories for products/users) to generate varied mock data.
- Use per-story parameters to test edge cases and add snapshot tests per story (visual regression).
- Add a test that runs Storybook + Playwright to validate the UI and the mocks end to end.
- Add linting or a script that validates msw handlers cover expected operations (optional).

13) Minimal example files to copy into your repo
You can add these files verbatim into your repo. (Paths are relative to web/.)

- .storybook/preview.ts (example already above)
- .storybook/main.ts (example above)
- .storybook/msw/handlers.ts (example above)

14) TL;DR actionable commands
```bash
cd web
# install
pnpm add -D msw msw-storybook-addon

# generate worker in public so storybook can serve it
npx msw init public/ --save

# Start Storybook (it will pick up preview and handlers)
pnpm storybook
```

15) If you hit any of the specific MSW problems you've seen before, tell me:
- the exact error message or behavior (e.g., "service worker not found", "handler not matched", "request bypassed", or console logs)
- whether the failing request is GraphQL or REST, and whether it originates from a server component or client component

I can then provide targeted fixes (for example: converting a server component into a small client wrapper for stories, or writing a rest.post GraphQL fallback handler that inspects the body when operationName is missing).

Would you like me to:
- produce the exact files you should add into web/.storybook (I can paste full files), or
- generate a short PoC story + handler for ProductHeroFast so you can run and verify locally?

## @ateece-bapi

I are the MAIN benefits of me implementing Storybook in this project.

## Copilot

You meant “What are the MAIN benefits…?” — here are the clear, prioritized benefits of adding Storybook to your Next.js + Headless WordPress project, with concrete examples tied to files in your repo and recommended next steps.

Top-line summary
- Storybook reduces risk and speeds development by letting you build, test, and document UI components in isolation — without running the full app or touching WordPress. For your repo this means faster, safer UI work on components like Button, Toast, ImageModal, and ProductHeroFast.

Main benefits (ranked)

1) Faster component development cycle
- Why: Build components in isolation and see immediate feedback without booting the whole Next app or changing CMS content.
- Repo example: Iterate on web/src/components/ui/Button.tsx and BapiButton.tsx side-by-side to validate the new CVA-based Button quickly.

2) Safer refactors & migration support
- Why: Visual, story-driven comparisons make it easy to replace legacy components without regressions.
- Repo example: Compare BapiButton.tsx and Button.tsx stories to ensure parity before removing the legacy file.

3) Reliable mocking of headless data (via MSW)
- Why: Mock WordPress GraphQL responses so you can exercise edge cases (missing images, long titles, empty relations) without modifying the CMS.
- Repo example: ProductHeroFast.tsx and RelatedProductsAsync.tsx can be tested with mock GraphQL handlers to validate “no image”, “long title”, “related products empty”, etc.

4) Better QA & visual regression testing
- Why: Storybook integrates with visual testing (Chromatic, Percy, Applitools) so UI changes are caught automatically in CI.
- Repo example: Detect accidental style regressions when updating Tailwind or global styles that would affect Footer.tsx, ProductHeroFast, or Product cards.

5) Improved documentation and onboarding
- Why: Stories become living docs (props, examples, notes) that help onboard new devs and designers faster.
- Repo example: Document Button variants (primary / accent / outline / ghost / danger) and demonstrate Toast behaviour (success/ error / auto-dismiss).

6) Easier testing of interactive/complex states
- Why: You can create stories for modal open states, keyboard interactions, auto-dismiss toasts, focus states and more — without manual user interactions.
- Repo example: ImageModal.tsx, Toast.tsx, TaglineRotator.tsx — create “always open”, “dragging”, “zoomed” stories.

7) Centralized design-system building and branding consistency
- Why: Storybook becomes the single source of truth for component behavior and styling.
- Repo example: Centralize CVA variants, tokens, and Tailwind utilities and demonstrate them as stories so teams reuse the same components.

8) Easier accessibility checks and automated audits
- Why: Storybook supports a11y addons to run checks per story and catch common accessibility issues early.
- Repo example: Run axe checks against ProductHero, Footer, SearchInput stories to find missing aria attributes or color-contrast problems.

9) Facilitates cross-discipline collaboration
- Why: Designers can review components independently; product owners can review states without navigating the app.
- Repo example: Designers can sign off on RelatedProducts card hover overlays or the Footer layout before it goes live.

10) Low-friction static publishing for review/stakeholders
- Why: You can build a static Storybook site and host it (Netlify, Vercel, GitHub Pages) for UAT and design review.
- Repo example: Publish a Storybook that demonstrates product states and component library for stakeholders to review without internal dev setup.

11) Supports long-term developer productivity & maintenance
- Why: Over time, a component catalog reduces duplicated UI code and the cost of future changes.
- Repo example: Reuse shared UI elements (AppImage, Button, Toast) across pages and micro-frontends consistently.

Costs/Tradeoffs you should consider
- Additional dependency surface (Storybook + addons) — expect some peer-dep noise since you’re on React 19 and Next 16.
- Initial setup time (config, MSW, next/image mocks).
- Maintenance overhead: keep stories updated as components change.

Practical, low-effort ROI path (recommended first steps)
1. Add Storybook to web/ and wire Tailwind globals (preview.ts imports).
2. Create a tiny “migration” story suite:
   - src/components/ui/Button.stories.tsx — all CVA variants
   - src/components/ui/BapiButton.stories.tsx — legacy for side-by-side comparison
   - src/components/ui/Toast.stories.tsx — success/error/auto-dismiss
3. Add MSW, generate mockServiceWorker.js into web/public, and add a basic GraphQL handler for GetProductBySlug.
4. Run Storybook and validate:
   - Button variants render and Tailwind classes apply
   - ProductHero stories with mocked GraphQL render (missing image, long title)
5. Add basic visual regression checks (Chromatic or Percy) for the Button and ProductHero stories.

Suggested acceptance criteria for “Storybook MVP”
- Storybook runs locally and serves at localhost:6006 with Tailwind styles loaded.
- At least 5 stories exist (Button variants, Toast open, ImageModal open, ProductHero default/missing-image).
- MSW is registered and intercepts GraphQL requests in ProductHero stories.
- One visual test configured (Chromatic or a simple screenshot test) that runs on CI for Button and ProductHero.

If you want, I can:
- Generate the minimal story files and MSW handlers for your repo (Button, ProductHero, Toast) so you can paste them into web/.
- Provide a checklist and explicit pnpm commands and .storybook files tailored to React 19 / Next 16 / Tailwind 4.

Which would you prefer next — the ready-to-paste story + handler files, or the exact step-by-step commands & .storybook configuration tuned for your package.json and pnpm?

## @ateece-bapi

I assume using Storybook with be very beneficial when we wish to create a React Native app for iOS/Android after we launch our new headless nextjs site.

## Copilot

Yes — that assumption is correct. Storybook is highly valuable when you later build a React Native app (iOS/Android). It speeds development, improves cross-platform consistency, and makes it much easier to reuse, document, and test UI when you support both web and native. Below is a focused summary of why it helps, recommended approaches for cross-platform component sharing, important caveats, and a short set of actionable next steps you can follow when you start the RN work.

Why Storybook helps for a future React Native app
- Single source of truth for UI: Stories document component API, visual states, and accessibility expectations that both web and native teams can follow.
- Faster iteration & reviews: Designers and PMs can review isolated components (variants, edge states) without installing or running the full app.
- Easier portability: If components are built as platform-agnostic primitives (or have thin platform-specific wrappers), Storybook lets you validate behavior and visuals before implementing native wrappers.
- Safer refactors & visual regression: Running visual tests on the web catalog catches regressions early so the native UI has fewer surprises.
- Clear contract for APIs: Stories show how components are intended to be used — new RN wrappers can implement the same props/API surface.

Recommended approaches for cross-platform reuse
1. Design “platform-agnostic primitives” first
   - Create small, focused primitives (Text, View, Icon, Button, Image) with stable prop contracts.
   - Implement platform-specific renderers/wrappers that map those props to Next.js/Tailwind on web and to RN primitives on mobile.

2. Use a shared UI package
   - Put shared components and design tokens into a package (e.g., packages/ui or /packages/core-ui) so Next.js and the RN app import the same component API.
   - Keep only rendering concerns platform-specific; business logic should stay shared.

3. Leverage react-native-web (optionally)
   - react-native-web lets many RN components run in the browser. This can let you keep one component implementation and run the same stories in Storybook web.
   - It works well if your design system is closer to RN primitives (and you’re willing to avoid Next.js-only features like next/image in shared components).

4. Maintain separate Storybooks (or a combined, multi-framework setup)
   - Web Storybook (your current one) + RN Storybook (storybook/react-native) or
   - A monorepo approach where the same stories run in both environments (requires careful config).
   - Often teams start with web Storybook for design and later add an RN Storybook for native preview.

5. Use design tokens, not Tailwind classes, as the canonical values
   - Tailwind is great for web, but not directly portable to RN.
   - Maintain tokens (colors, spacing, type-scale) in JSON/TS and drive styling in both web and RN implementations.
   - Tools: Style Dictionary, tokens-studio, or a small tokens package.

Key tools and libraries to consider
- react-native-web — share components across web and native
- expo (or bare RN) — fast RN development
- storybook/react-native — Storybook runtime for mobile/simulator
- nativewind or Tailwind-like libraries for RN (if you want Tailwind syntax on RN)
- Style Dictionary or tokens package — design tokens
- Bit (optional) — component distribution across apps/teams

Important caveats & gotchas
- next/image and App Router specifics aren’t available in RN — you’ll need separate image implementations and navigation handling.
- Tailwind (web) doesn’t translate 1:1 to RN; use tokens or nativewind.
- MSW (Service Worker) won’t work in a native environment. For RN stories:
  - Use direct fixtures / per-story props instead of runtime network mocks, or
  - Replace network calls with JS-level mocks (override fetch) in Storybook RN, or use node-style msw server in test environments (not service-worker).
- Some browser-only libraries and CSS techniques won’t run in RN; isolate or provide wrappers.
- Visual regression tooling: Chromatic focuses on web Storybook. For RN visual testing you’ll need other tooling (Detox, Applitools, Percy mobile support, or image snapshot tests).

Practical workflow to prepare today (so RN later is easier)
1. Convert your most important UI into small, documented primitives in a shared package:
   - Button, Text, Container, Icon, AppImage (with web and RN implementations later).
2. Keep props stable and documented in Storybook stories (controls + MDX docs).
3. Extract design tokens into a JSON/TS tokens package and use tokens in Tailwind config and component styles.
4. For images & assets, keep paths and semantics (alt, width, height) in the API, but implement platform-specific loaders.
5. Start a small RN prototype using react-native-web + Expo to confirm how shared components render, then create RN-native wrappers as needed.
6. Add Storybook for RN (when you start mobile) to preview native renderers in a simulator; reuse stories where possible.

Example high-level repo structure for cross-platform reuse
- packages/
  - ui/            ← shared component APIs + tokens (stories live here)
    - components/
      - Button/
        - Button.web.tsx
        - Button.native.tsx
        - Button.stories.tsx
    - tokens/
      - tokens.ts
- apps/
  - web/           ← Next.js site (imports packages/ui)
  - mobile/        ← Expo / React Native app (imports packages/ui)

Next steps I can help with
- Create a short migration/architecture doc that maps your current components (Button, Toast, ImageModal, ProductHero) into shared primitives and suggests file layouts + token definitions.
- Create a proof-of-concept story + component pair that demonstrates how to share a Button between Next.js and a React Native app using react-native-web and a small native wrapper.
- Provide a checklist for adding Storybook for React Native later (config, fetch mocking strategies, screenshot testing).

Would you like a POC plan that maps 3 of your existing components (Button, AppImage, Toast) to a shared-package structure and shows how stories would work for web and native?
