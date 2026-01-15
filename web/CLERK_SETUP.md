# Clerk Authentication Setup

## Environment Variables

Add these to your `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Getting Your Clerk Keys

1. Go to [clerk.com](https://clerk.com) and sign up/sign in
2. Create a new application
3. Go to **API Keys** in the dashboard
4. Copy your **Publishable Key** and **Secret Key**
5. Add them to your `.env.local` file

## Features Implemented

### Authentication
- ✅ Modal-based sign in (no redirect needed)
- ✅ User profile button with dropdown
- ✅ Sign out functionality
- ✅ Protected routes via middleware

### Public Routes
The following routes are accessible without authentication:
- `/` - Homepage
- `/products/*` - All product pages
- `/api/preview` - Preview API
- `/api/revalidate` - Cache revalidation API
- `/sign-in/*` - Sign in pages
- `/sign-up/*` - Sign up pages

### Protected Routes
All other routes require authentication. Users will be automatically redirected to sign in.

## Middleware

The `middleware.ts` file at the root protects routes:
- Uses `clerkMiddleware` from `@clerk/nextjs/server`
- Defines public routes with `createRouteMatcher`
- Protects all non-public routes with `auth.protect()`

## Components

### SignInButton
Located: `/src/components/layout/Header/components/SignInButton.tsx`

Shows different UI based on auth state:
- **Signed Out**: "User Sign In" button that opens Clerk modal
- **Signed In**: User avatar button with profile dropdown

## Customization

### Appearance
Clerk components can be styled via the `appearance` prop:

```tsx
<UserButton 
  appearance={{
    elements: {
      avatarBox: "w-9 h-9",
      userButtonPopoverCard: "bg-white shadow-lg",
    }
  }}
/>
```

### Branding
Configure in Clerk Dashboard → Customization:
- Logo
- Colors
- Button styles
- Email templates

## Testing

1. Start dev server: `pnpm run dev`
2. Click "User Sign In" in header
3. Sign up with email or social provider
4. After sign in, you'll see your profile avatar
5. Click avatar to see profile options and sign out

## Production Deployment

### ⚠️ IMPORTANT: Development vs Production Keys

**Development/Test Keys** (`pk_test_`, `sk_test_`):
- ✅ Safe for local development
- ✅ Safe for staging/preview environments
- ❌ **NOT FOR PRODUCTION** - Clerk will show console warnings
- Limited to development domains

**Production Keys** (`pk_live_`, `sk_live_`):
- Required for production domains
- No console warnings
- Higher rate limits
- Production-grade security

### Current Status (Dec 31, 2025)
- **Staging Site** (bapi-headless.vercel.app): Using test keys (intentional)
- Console warning is expected and harmless for staging
- Production deployment will require live keys

### Vercel Deployment Steps

#### For Staging/Preview Environments:
1. Add environment variables in Vercel dashboard
2. Use test keys (`pk_test_`, `sk_test_`) - acceptable for non-production
3. Deploy - expect console warning (can be ignored)

#### For Production Environment:
1. Create production instance in Clerk Dashboard
2. Get production keys (`pk_live_`, `sk_live_`)
3. Add to Vercel environment variables (Production only)
4. Set allowed origins to production domain
5. Deploy - no warnings

### Clerk Dashboard Production Setup
Update these when moving to production:
- **Instance**: Create separate production instance
- **Allowed Origins**: Add your production URL(s)
- **Allowed Redirect URLs**: Configure post-auth redirects
- **Webhook Endpoints**: If using webhooks for user sync
- **Email/SMS Settings**: Configure production providers

## Security

- ✅ Secret key is server-side only (never exposed to client)
- ✅ Middleware protects routes before page loads
- ✅ JWT tokens for API authentication
- ✅ CSRF protection built-in

## Support

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Discord](https://clerk.com/discord)
