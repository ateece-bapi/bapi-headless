# BAPI Headless E-Commerce

> Modern headless WordPress/WooCommerce with Next.js frontend, showcasing professional building automation products with full e-commerce capabilities.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![WordPress](https://img.shields.io/badge/WordPress-6.8.2-21759b?logo=wordpress)](https://wordpress.org/)
[![WooCommerce](https://img.shields.io/badge/WooCommerce-10.3.5-96588a?logo=woocommerce)](https://woocommerce.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com/)

## 🌐 Live Demo

- **Frontend**: [bapi-headless.vercel.app](https://bapi-headless.vercel.app)
- **WordPress Admin**: [bapiheadlessstaging.kinsta.cloud/wp-admin](https://bapiheadlessstaging.kinsta.cloud/wp-admin)
- **GraphQL Endpoint**: [bapiheadlessstaging.kinsta.cloud/graphql](https://bapiheadlessstaging.kinsta.cloud/graphql)

## 🏗️ Architecture

This project demonstrates a modern headless CMS architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     End Users                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js Frontend (Vercel)                                   │
│  • Server Components (SSR)                                   │
│  • TypeScript + Tailwind CSS                                 │
│  • Zustand State Management                                  │
│  • Clerk Authentication (Google OAuth)                       │
│  • BAPI Brand Color System                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ GraphQL API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  WordPress/WooCommerce (Kinsta)                              │
│  • WPGraphQL + WPGraphQL for WooCommerce                     │
│  • Product Catalog Management                                │
│  • Content Management System                                 │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
bapi-headless/
├── cms/                          # WordPress installation
│   ├── wp-content/              # Themes, plugins, uploads
│   ├── wp-config.php            # WordPress configuration
│   └── ...                      # WordPress core files
│
├── web/                         # Next.js application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── layout.tsx      # Root layout with ClerkProvider
│   │   │   ├── account/        # User dashboard (6 pages)
│   │   │   │   ├── page.tsx    # Dashboard overview
│   │   │   │   ├── profile/    # User profile management
│   │   │   │   ├── orders/     # WooCommerce order history
│   │   │   │   ├── favorites/  # Saved products
│   │   │   │   ├── quotes/     # Quote requests
│   │   │   │   └── settings/   # Account settings
│   │   │   ├── products/       # Products listing
│   │   │   ├── cart/           # Shopping cart page
│   │   │   ├── checkout/       # Multi-step checkout wizard
│   │   │   ├── order-confirmation/[orderId]/  # Order success page
│   │   │   ├── api/            # API routes
│   │   │   │   ├── payment/    # Stripe payment endpoints
│   │   │   │   ├── cart/       # WooCommerce cart operations
│   │   │   │   └── ...         # Other API routes
│   │   │   └── components/     # App-specific components
│   │   ├── components/         # Shared React components
│   │   │   ├── layout/         # Layout components (Header, Footer)
│   │   │   ├── cart/           # Cart UI components
│   │   │   │   ├── CartDrawer.tsx         # Sliding cart drawer
│   │   │   │   └── CartPage/              # Full cart page components
│   │   │   ├── checkout/       # Checkout flow components
│   │   │   │   ├── CheckoutWizard.tsx     # 3-step wizard
│   │   │   │   ├── CheckoutSummary.tsx    # Sticky order summary
│   │   │   │   └── steps/                 # Shipping, Payment, Review steps
│   │   │   ├── order-confirmation/  # Order success components
│   │   │   ├── payment/        # Stripe payment components
│   │   │   ├── products/       # Product components
│   │   │   ├── Hero/           # Hero section
│   │   │   ├── ui/             # Reusable UI components
│   │   │   └── examples/       # Example components
│   │   ├── lib/
│   │   │   └── graphql/        # GraphQL clients & generated types
│   │   │       ├── client.ts   # Public GraphQL client
│   │   │       ├── authenticated-client.ts  # WordPress authenticated client
│   │   │       └── queries/    # GraphQL query definitions
│   │   ├── store/              # Zustand stores
│   │   └── styles/             # Global styles
│   ├── middleware.ts           # Clerk authentication middleware
│   ├── scripts/                # Utility scripts
│   │   ├── bulk-import-users.mjs  # WordPress to Clerk migration
│   │   └── test-user-import.sh    # Safe migration testing
│   ├── public/                 # Static assets
│   ├── __tests__/              # Test files
│   ├── package.json            # Dependencies
│   ├── next.config.ts          # Next.js configuration
│   ├── CLERK_SETUP.md          # Clerk authentication guide
│   ├── COLOR_SYSTEM.md         # Brand color documentation
│   └── PREVIEW.md              # WordPress preview guide
│
├── .github/
│   └── workflows/              # CI/CD workflows
│
├── docs/                       # Project documentation
│   ├── BULK-USER-MIGRATION.md  # WordPress user migration guide
│   ├── STRIPE-PAYMENT-INTEGRATION.md  # Stripe setup and testing
│   ├── EMAIL-NOTIFICATIONS.md  # Email system configuration
│   ├── PHASE2-COMPLETION-SUMMARY.md  # Phase 2 project summary
│   └── ...                     # Additional docs
├── scripts/                    # Repository-level scripts
└── README.md                   # This file
```

## ✨ Features

### Frontend (Next.js)
- ⚡ **Next.js 16** with App Router and Turbopack
- ⚡ **95% Faster Product Pages** - Optimized from 2-3s to <100ms with React cache(), parallel queries, and Smart Cache
- 🔐 **Clerk Authentication** - Google OAuth, user profiles, protected routes
- 👤 **Complete User Dashboard** - 6-page account system (dashboard, profile, orders, favorites, quotes, settings)
- 🛍️ **Real Order History** - Display WooCommerce orders via authenticated GraphQL
- 💬 **Quote Request System** - Custom quote forms with file uploads
- ⭐ **Favorites System** - Save and manage favorite products
- 🔄 **WordPress User Migration** - Bulk import system for existing customers
- 🎨 **BAPI Brand Colors** - Blue (#1479BC), Yellow (#FFC843), Gray (#97999B)
- 🧭 **Enterprise Mega Menu** – Multi-column navigation with icons, featured products, quick actions, and B2B enhancements
- ⬆️ **Back to Top Button** – Floating button for fast site-wide navigation
- 📱 **Fully Responsive** - Mobile-first design
- 🛒 **Complete Shopping Cart** - Full cart management with WooCommerce API integration, coupon codes, quantity controls
- 🛍️ **Multi-Step Checkout** - 3-step wizard (Shipping → Payment → Review) with form validation
- 💳 **Stripe Payment Integration** - Secure card processing with PCI compliance, test mode ready
- ✅ **Order Confirmation** - Beautiful success page with order details and status tracking
- 📧 **Email Notifications** - WooCommerce email system with SMTP configuration guide
- 🔒 **Type-Safe** - Full TypeScript with auto-generated GraphQL types
- 🎯 **SEO Optimized** - Server-side rendering for better search visibility
- 💨 **Blazing Fast Builds** - 130x faster builds with warm cache (144s → 1.1s)
- 🚀 **Edge Deployment** - Hosted on Vercel with automatic preview deployments

### Backend (WordPress)
- 🛍️ **WooCommerce** - Complete e-commerce functionality
- 🔌 **WPGraphQL** - Modern GraphQL API for WordPress
- 🔐 **Authenticated GraphQL** - Customer-specific data via WordPress Application Passwords
- 📦 **Customer Order Integration** - Real-time order history from WooCommerce
- ⚡ **Smart Cache** - WPGraphQL response caching with automatic invalidation
- 🌐 **CDN-Cacheable** - GET request support with proper Cache-Control headers
- 📊 **Type-Safe API** - GraphQL schema with introspection
- 🔐 **Secure** - Headless architecture isolates admin from frontend
- ☁️ **Managed Hosting** - Kinsta with automatic backups
- 🚀 **Optimized Queries** - Increased limits (depth: 20, complexity: 2000) for complex product data

### Developer Experience
- 📝 **TypeScript Throughout** - 36K+ lines of generated types
- 🎨 **Tailwind CSS v4** - Utility-first styling with custom tokens
- 🔄 **GraphQL Code Generator** - Auto-generate types from schema
- 🧪 **Testing** - Vitest for unit and integration tests
- 🔧 **Git Hooks** - Husky + lint-staged for code quality
- 📦 **Monorepo** - WordPress and Next.js in single repository
- ⚡ **React cache()** - Automatic query deduplication across server components
- 🎯 **Static Generation** - Pre-build 30 most popular pages for instant loads

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and pnpm (see [PNPM Setup Guide](./docs/PNPM-TEAM-GUIDE.md))
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ateece-bapi/bapi-headless.git
   cd bapi-headless
   ```

2. **Install dependencies**
   ```bash
   cd web
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```env
   NEXT_PUBLIC_WORDPRESS_GRAPHQL=https://bapiheadlessstaging.kinsta.cloud/graphql
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Clerk Authentication (get keys from https://dashboard.clerk.com)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. **Generate GraphQL types**
   ```bash
   pnpm run codegen
   ```

5. **Start development server**
   ```bash
   pnpm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

## 🎨 Brand Color System

BAPI uses a professional color system with specific usage guidelines:

| Color | Hex | Usage | Percentage |
|-------|-----|-------|------------|
| **BAPI Blue** | `#1479BC` | Navigation, links, trust elements | ~30% |
| **BAPI Yellow** | `#FFC843` | CTAs, highlights, accents | ~10% |
| **BAPI Gray** | `#97999B` | Text, borders, backgrounds | ~60% |

- The header divider uses a BAPI yellow–blue–yellow gradient for a branded accent.

See [`web/COLOR_SYSTEM.md`](./web/COLOR_SYSTEM.md) for complete color documentation.

## 📚 Documentation

- **[PNPM Setup Guide](./docs/PNPM-TEAM-GUIDE.md)** - 5-minute team onboarding for PNPM migration
- **[Color System](./web/COLOR_SYSTEM.md)** - Complete brand color guidelines
- **[Clerk Authentication](./web/CLERK_SETUP.md)** - Authentication setup and configuration
- **[WordPress User Migration](./docs/BULK-USER-MIGRATION.md)** - Bulk import guide for existing customers
- **[GraphQL Setup](./web/GRAPHQL_SETUP.md)** - GraphQL client configuration
- **[WordPress Performance](./docs/WORDPRESS-GRAPHQL-OPTIMIZATION.md)** - Backend optimization guide (Smart Cache, CORS, Redis)
- **[Preview Mode](./web/PREVIEW.md)** - WordPress preview integration

## 🛠️ Development Workflow

### Branch Strategy
```bash
# Create feature branch
git checkout -b feat/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push and create PR
git push -u origin feat/feature-name
```
> **Tip:** Always merge feature branches into `main` before deleting, or recover with `git checkout -b branch <commit>` if needed.

### Available Scripts

```bash
pnpm run dev          # Start development server (with Turbopack)
pnpm run build        # Build for production (includes GraphQL codegen)
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run test         # Run Vitest tests
pnpm run codegen      # Generate GraphQL types from WordPress
pnpm run codegen:watch # Watch mode for type generation
```

## 🔧 GraphQL Integration

### Fetching Products

```typescript
import { getProducts, getProductPrice } from '@/lib/graphql';

// Fetch products
const data = await getProducts(10);
const products = data.products?.nodes || [];

// Get product price
const price = getProductPrice(product);
```

### Type Safety

All GraphQL queries are fully typed:

```typescript
import type { GetProductsQuery } from '@/lib/graphql/generated';

// TypeScript knows the exact shape of the response
const product: GetProductsQuery['products']['nodes'][0];
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage
```

## 📦 Deployment

### Frontend (Vercel)

The Next.js app automatically deploys via Vercel:
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests
- **Environment Variables**: Configure in Vercel dashboard

### Backend (Kinsta)

WordPress is hosted on Kinsta with:
- Automatic daily backups
- CDN for media files
- Managed security updates
- SSH and SFTP access

## 🔐 Environment Variables

### Required Variables

```env
# GraphQL API endpoint
NEXT_PUBLIC_WORDPRESS_GRAPHQL=https://your-site.kinsta.cloud/graphql

# Application URL
NEXT_PUBLIC_APP_URL=https://your-site.vercel.app

# Clerk Authentication (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key
CLERK_SECRET_KEY=sk_test_your-key

# WordPress Authenticated GraphQL (required for order history)
WORDPRESS_API_USER=your-wordpress-username
WORDPRESS_API_PASSWORD=your-wordpress-app-password

# Preview mode (optional)
PREVIEW_SECRET=your-secret-key
PREVIEW_USER=admin
PREVIEW_APP_PASSWORD=your-app-password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For questions or issues:
- **Technical**: Create an issue in this repository
- **BAPI Products**: [www.bapihvac.com/contact](https://www.bapihvac.com/contact/)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication and user management
- [WPGraphQL](https://www.wpgraphql.com/) - GraphQL for WordPress
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Vercel](https://vercel.com/) - Frontend hosting
- [Kinsta](https://kinsta.com/) - WordPress hosting

---

**Built with ❤️ for BAPI by the development team**
