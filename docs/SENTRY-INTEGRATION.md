# Sentry Integration Guide

## Overview

The logger wrapper (`/web/src/lib/logger.ts`) is ready for Sentry integration. This guide covers setup and configuration.

## Environment Variables

Add to `.env.local` and Vercel:

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
SENTRY_AUTH_TOKEN=your-auth-token

# Optional
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
```

## Installation

```bash
cd web
pnpm add @sentry/nextjs
pnpm sentry-wizard --integration nextjs
```

This will:
1. Create `sentry.client.config.ts`
2. Create `sentry.server.config.ts`
3. Create `sentry.edge.config.ts`
4. Update `next.config.ts`

## Configuration

### 1. Client Configuration (`web/sentry.client.config.ts`)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',
  
  // Performance Monitoring
  tracesSampleRate: 1.0, // 100% in dev, adjust for production
  
  // Session Replay (optional - captures user sessions)
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% when errors occur
  
  // Integrations
  integrations: [
    new Sentry.BrowserTracing({
      // Track page navigation
      routingInstrumentation: Sentry.nextRouterInstrumentation,
    }),
    new Sentry.Replay({
      maskAllText: true, // Privacy: mask all text
      blockAllMedia: true, // Privacy: block all media
    }),
  ],
  
  // Filtering
  beforeSend(event, hint) {
    // Don't send development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Filter out known non-critical errors
    const error = hint.originalException;
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message);
      
      // Ignore network errors from browser extensions
      if (message.includes('Extension context invalidated')) {
        return null;
      }
      
      // Ignore ResizeObserver errors (common browser noise)
      if (message.includes('ResizeObserver')) {
        return null;
      }
    }
    
    return event;
  },
});
```

### 2. Server Configuration (`web/sentry.server.config.ts`)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',
  tracesSampleRate: 1.0,
  
  // Server-specific options
  beforeSend(event) {
    // Don't send development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
```

### 3. Next.js Config (`web/next.config.ts`)

The wizard will add this automatically:

```typescript
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  // ... your existing config
};

export default withSentryConfig(
  nextConfig,
  {
    // Sentry webpack plugin options
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // Upload source maps for better error tracking
    hideSourceMaps: true,
    
    // Automatically tree-shake Sentry logger in production
    disableLogger: true,
  }
);
```

## Logger Integration

The logger is already integrated! Errors automatically go to Sentry:

```typescript
import logger from '@/lib/logger';

try {
  await fetchProduct(slug);
} catch (error) {
  // This will automatically send to Sentry in production
  logger.error('Failed to fetch product', error, { slug });
}
```

## Sentry Dashboard Setup

1. **Create Account**: https://sentry.io/signup/
2. **Create Project**: 
   - Platform: Next.js
   - Name: bapi-headless
   - Team: Your organization
3. **Get DSN**: Settings → Projects → bapi-headless → Client Keys
4. **Configure Alerts**:
   - Settings → Alerts → New Alert Rule
   - Trigger: Error count > 10 in 1 hour
   - Action: Email/Slack notification

## Features You Get

### 1. Error Tracking
- Stack traces with source maps
- User context (Clerk user ID)
- Breadcrumbs (user actions before error)
- Environment and release tracking

### 2. Performance Monitoring
- Page load times
- API response times
- GraphQL query performance
- Database query tracking

### 3. Session Replay (Optional)
- Video-like replay of user sessions when errors occur
- See exactly what user did before error
- Privacy-safe (masks sensitive data)

### 4. Release Tracking
Automatically track deployments:

```bash
# Add to your CI/CD (Vercel auto-detects)
npx sentry-cli releases new "$VERCEL_GIT_COMMIT_SHA"
npx sentry-cli releases set-commits "$VERCEL_GIT_COMMIT_SHA" --auto
```

## Testing

### Test in Development

```typescript
import logger from '@/lib/logger';

// This will console.error but NOT send to Sentry (dev mode)
logger.error('Test error', new Error('Testing Sentry'));
```

### Test in Production

```bash
# Build and run production build locally
pnpm run build
pnpm run start

# Visit: http://localhost:3000/test-sentry
# Or add this to any page:
logger.error('Production test error', new Error('Testing Sentry in prod'));
```

## Cost

**Free Tier:**
- 5,000 errors/month
- 10,000 performance units/month
- 30-day event retention
- Usually sufficient for small-medium sites

**Team Plan ($26/month):**
- 50,000 errors/month
- 100,000 performance units/month
- 90-day retention
- Session replay
- Recommended for production

## Best Practices

### 1. Add User Context

```typescript
import * as Sentry from '@sentry/nextjs';
import { useUser } from '@clerk/nextjs';

export function useSentryUser() {
  const { user } = useUser();
  
  useEffect(() => {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username || undefined,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);
}
```

### 2. Add Custom Tags

```typescript
logger.error('GraphQL query failed', error, {
  query: 'GetProductBySlug',
  slug: productSlug,
  tags: {
    component: 'ProductPage',
    priority: 'high',
  },
});
```

### 3. Performance Tracking

```typescript
const timer = logger.time('Product Page Load');
const product = await getProductBySlug(slug);
timer.end(); // Logs: ⏱️ Product Page Load: 145.32ms
```

## Current Status

- ✅ Logger wrapper created with Sentry support
- ⏳ Sentry SDK installation (pending)
- ⏳ Configuration files (auto-generated by wizard)
- ⏳ Console.log replacement (50+ instances)
- ⏳ Vercel environment variables

## Next Steps

1. Run `pnpm sentry-wizard` in `/web` directory
2. Create Sentry project at sentry.io
3. Add environment variables to Vercel
4. Replace console.log calls with logger (tomorrow's task)
5. Test in production
6. Set up alerts and monitoring

## Resources

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Dashboard](https://sentry.io)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)

