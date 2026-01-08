# Test User Setup for Headless Site

## Quick Setup Guide

### Step 1: Create Test Users in Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your BAPI project
3. Click **Users** in the left sidebar
4. Click **Create User** button
5. Add each team member:
   - Enter their email address
   - Set a temporary password
   - Click **Create**

### Step 2: Add Mock Data for Test Users

1. In Clerk Dashboard, click on a user
2. Scroll down to **Public metadata** section
3. Click **Edit**
4. Paste this JSON (customize as needed):

```json
{
  "companyName": "Test Company Inc",
  "accountNumber": "ACCT-12345",
  "billingAddress": {
    "street": "123 Main Street",
    "city": "Madison",
    "state": "WI",
    "zip": "53703",
    "country": "US"
  }
}
```

### Step 3: Configure Mock Data in Code

Edit `/web/src/lib/mock-user-data.ts` and add each user's Clerk ID:

```typescript
export const MOCK_USER_DATA: Record<string, MockUserProfile> = {
  // Get the user ID from Clerk Dashboard → Users → Click user → Copy ID
  'user_2abc123xyz': {
    userId: 'user_2abc123xyz',
    companyName: 'Test Company Inc',
    accountNumber: 'ACCT-12345',
    // ... rest of mock data
  },
  
  // Add more team members
  'user_3def456uvw': {
    userId: 'user_3def456uvw',
    companyName: 'Another Test Co',
    accountNumber: 'ACCT-67890',
    // ... rest of mock data
  },
};
```

### Step 4: Share Login Credentials

Send each team member:
- Website URL: https://your-staging-site.vercel.app
- Their email address (registered in Clerk)
- Temporary password
- Ask them to change password on first login

## What Team Members Will See

When logged in, test users can navigate:

- **Account Dashboard** (`/account`) - Overview of their account
- **Orders** (`/account/orders`) - Mock order history
- **Quotes** (`/account/quotes`) - Saved quotes
- **Profile** (`/account/profile`) - Personal information
- **Settings** (`/account/settings`) - Preferences

All pages will show a yellow banner indicating "Development Mode: Showing mock data"

## Mock Data Features

The mock data system provides:

### Order History
- Multiple orders with different statuses (pending, processing, shipped, delivered)
- Product details (SKU, name, quantity, price)
- Order totals and dates

### Company Information
- Company name
- Account number
- Billing address
- Multiple shipping addresses (with default selection)

### Saved Quotes
- Quote ID and date
- Expiration dates
- Item counts and totals

### Preferences
- Email notification settings
- Order update preferences
- Newsletter subscription status

## Customizing Mock Data

To add more realistic data for testing:

1. **Edit** `/web/src/lib/mock-user-data.ts`
2. **Add** more orders, quotes, or shipping addresses
3. **Use real SKUs** from your WordPress product catalog
4. **Match** your actual order workflow statuses

Example: Add a recent order

```typescript
orderHistory: [
  {
    orderId: 'ORDER-20260108-NEW',
    date: '2026-01-08',
    status: 'processing',
    total: 542.00,
    items: [
      {
        sku: 'BA/10K-2-O-B',  // Use actual SKU from WordPress
        name: 'Temperature Sensor',
        quantity: 2,
        price: 271.00
      }
    ]
  },
  // ... existing orders
]
```

## Production vs Development

### Development Mode (Current)
- Mock data enabled automatically
- Yellow banner shows on account pages
- Data comes from `/web/src/lib/mock-user-data.ts`

### Production Mode (Future)
- Set `NEXT_PUBLIC_ENABLE_MOCK_DATA=false` in `.env.production`
- Data fetched from real API/database
- No mock data banner

## Using the Hook

In your components, use the `useUserProfile` hook:

```typescript
import { useUserProfile } from '@/hooks/useUserProfile';

export default function MyComponent() {
  const { isLoaded, isSignedIn, user, profile, isMockData } = useUserProfile();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in</div>;

  return (
    <div>
      {isMockData && <div className="warning">Using mock data</div>}
      
      <h2>{profile?.companyName}</h2>
      <p>Account: {profile?.accountNumber}</p>
      
      {profile?.orderHistory.map(order => (
        <div key={order.orderId}>
          Order #{order.orderId} - ${order.total}
        </div>
      ))}
    </div>
  );
}
```

## Getting Clerk User IDs

To find a user's Clerk ID:

1. Go to Clerk Dashboard
2. Click **Users**
3. Click on the user
4. The ID is at the top (starts with `user_`)
5. Click the copy icon next to it
6. Paste into `mock-user-data.ts`

## Troubleshooting

### "No profile data available"
- Check that the user's Clerk ID is in `MOCK_USER_DATA`
- Verify `NODE_ENV === 'development'` or `NEXT_PUBLIC_ENABLE_MOCK_DATA=true`

### User can't sign in
- Verify email is correct in Clerk Dashboard
- Check user is not suspended
- Reset password in Clerk Dashboard

### Mock data not showing
- Clear browser cache and reload
- Check console for errors
- Verify user ID matches exactly (case-sensitive)

## Next Steps

After testing with mock data:

1. **Build real API endpoints** to fetch actual user/order data
2. **Update `useUserProfile` hook** to call your API in production
3. **Migrate to real database** for order history, quotes, etc.
4. **Disable mock data** by setting env variable

---

**Files Created:**
- `/web/src/lib/mock-user-data.ts` - Mock data definitions
- `/web/src/hooks/useUserProfile.ts` - Hook to access user data
- Account pages already exist at `/web/src/app/account/*/page.tsx`
