# BAPI Headless E-Commerce

> Modern headless WordPress/WooCommerce with Next.js frontend, showcasing professional building automation products with full e-commerce capabilities.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![WordPress](https://img.shields.io/badge/WordPress-6.8.2-21759b?logo=wordpress)](https://wordpress.org/)
[![WooCommerce](https://img.shields.io/badge/WooCommerce-10.3.5-96588a?logo=woocommerce)](https://woocommerce.com/)

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
│   │   │   ├── products/       # Products listing
│   │   │   └── cart-test/      # Cart demo
│   │   ├── components/         # React components
│   │   │   └── cart/           # Cart UI components
│   │   ├── lib/
│   │   │   └── graphql/        # GraphQL client & types
│   │   └── store/              # Zustand stores
│   ├── public/                 # Static assets
│   ├── package.json            # Dependencies
│   └── next.config.ts          # Next.js configuration
│
├── .github/
│   └── workflows/              # CI/CD workflows
│
└── README.md                   # This file
```

## ✨ Features

### Frontend (Next.js)
- ⚡ **Next.js 16** with App Router and Turbopack
- 🎨 **BAPI Brand Colors** - Blue (#1479BC), Yellow (#FFC843), Gray (#97999B)
- 🧭 **Enterprise Mega Menu** – Multi-column navigation with icons, featured products, quick actions, and B2B enhancements
- ⬆️ **Back to Top Button** – Floating button for fast site-wide navigation
- 📱 **Fully Responsive** - Mobile-first design
- 🛒 **Shopping Cart** - Zustand state management with localStorage
- 🔒 **Type-Safe** - Full TypeScript with auto-generated GraphQL types
- 🎯 **SEO Optimized** - Server-side rendering for better search visibility
- 🚀 **Edge Deployment** - Hosted on Vercel with automatic preview deployments

### Backend (WordPress)
- 🛍️ **WooCommerce** - Complete e-commerce functionality
- 🔌 **WPGraphQL** - Modern GraphQL API for WordPress
- 📊 **Type-Safe API** - GraphQL schema with introspection
- 🔐 **Secure** - Headless architecture isolates admin from frontend
- ☁️ **Managed Hosting** - Kinsta with automatic backups

### Developer Experience
- 📝 **TypeScript Throughout** - 36K+ lines of generated types
- 🎨 **Tailwind CSS v4** - Utility-first styling with custom tokens
- 🔄 **GraphQL Code Generator** - Auto-generate types from schema
- 🧪 **Testing** - Vitest for unit and integration tests
- 🔧 **Git Hooks** - Husky + lint-staged for code quality
- 📦 **Monorepo** - WordPress and Next.js in single repository

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
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
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```env
   NEXT_PUBLIC_WORDPRESS_GRAPHQL=https://bapiheadlessstaging.kinsta.cloud/graphql
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Generate GraphQL types**
   ```bash
   npm run codegen
   ```

5. **Start development server**
   ```bash
   npm run dev
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

- **[Color System](./web/COLOR_SYSTEM.md)** - Complete brand color guidelines
- **[GraphQL Setup](./web/GRAPHQL_SETUP.md)** - GraphQL client configuration
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
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Vitest tests
npm run codegen      # Generate GraphQL types
npm run codegen:watch # Watch mode for type generation
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
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
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
- [WPGraphQL](https://www.wpgraphql.com/) - GraphQL for WordPress
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Vercel](https://vercel.com/) - Frontend hosting
- [Kinsta](https://kinsta.com/) - WordPress hosting

---

**Built with ❤️ for BAPI by the development team**
