# Create Test Customer Login - Quick Guide

## Step 1: Create User in Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Select your BAPI project
3. Click **Users** → **Create User**
4. Fill in:
   - **Email**: testuser@bapihvac.com (or your choice)
   - **Password**: TestPassword123!
   - Click **Create**
5. **Copy the User ID** (starts with `user_` - you'll need this!)

## Step 2: Add Mock Data to Code

Open `/web/src/lib/mock-user-data.ts` and replace the example user with your actual user:

```typescript
export const MOCK_USER_DATA: Record<string, MockUserProfile> = {
  // Replace 'user_example123' with the actual Clerk user ID you copied
  'user_2abc123xyz': {  // ← PASTE YOUR CLERK USER ID HERE
    userId: 'user_2abc123xyz',  // ← AND HERE
    companyName: 'BAPI Test Customer',
    accountNumber: 'ACCT-TEST-001',
    billingAddress: {
      street: '750 North Greenway',
      city: 'Glendale',
      state: 'WI',
      zip: '53209',
      country: 'US'
    },
    shippingAddresses: [
      {
        id: 'addr_1',
        label: 'Main Facility',
        street: '750 North Greenway',
        city: 'Glendale',
        state: 'WI',
        zip: '53209',
        country: 'US',
        isDefault: true
      },
      {
        id: 'addr_2',
        label: 'Secondary Warehouse',
        street: '1234 Industrial Parkway',
        city: 'Milwaukee',
        state: 'WI',
        zip: '53202',
        country: 'US',
        isDefault: false
      }
    ],
    orderHistory: [
      {
        orderId: 'ORDER-20260107-001',
        date: '2026-01-07',
        status: 'delivered',
        total: 1250.00,
        items: [
          {
            sku: 'BA/10K-2-O-B',
            name: 'Temperature Sensor, Outdoor, 10K-2',
            quantity: 5,
            price: 250.00
          }
        ]
      },
      {
        orderId: 'ORDER-20260105-045',
        date: '2026-01-05',
        status: 'shipped',
        total: 875.50,
        items: [
          {
            sku: 'BA/HQX-D-C-X-XX-X',
            name: 'Humidity Sensor, Duct Mount',
            quantity: 2,
            price: 437.75
          }
        ]
      },
      {
        orderId: 'ORDER-20251228-102',
        date: '2025-12-28',
        status: 'delivered',
        total: 3240.00,
        items: [
          {
            sku: 'BA/APSW1',
            name: 'BAPI Application Software',
            quantity: 1,
            price: 25.00
          },
          {
            sku: 'BA/10K-3-O-8',
            name: 'Temperature Sensor Pack',
            quantity: 10,
            price: 321.50
          }
        ]
      }
    ],
    savedQuotes: [
      {
        quoteId: 'QUOTE-20260108-A',
        date: '2026-01-08',
        expiresAt: '2026-02-08',
        total: 5430.00,
        items: 15
      },
      {
        quoteId: 'QUOTE-20251220-B',
        date: '2025-12-20',
        expiresAt: '2026-01-20',
        total: 2180.00,
        items: 8
      }
    ],
    preferences: {
      emailNotifications: true,
      orderUpdates: true,
      newsletter: false
    }
  },
};
```

## Step 3: Test the Login

1. **Start your dev server**:
   ```bash
   cd web
   npm run dev
   ```

2. **Open in browser**: http://localhost:3000

3. **Sign in** with:
   - Email: testuser@bapihvac.com
   - Password: TestPassword123!

4. **Go to Account Dashboard**: Click user profile → "Account" or navigate to `/account`

## What You'll See

### Account Dashboard (`/account`)
- ⚠️ Yellow banner: "Development Mode: Showing mock data"
- **Quick Stats**: Company name, account number, order count, quote count
- **Recent Activity**: Last 3 orders with details
- **Account Management**: Links to all account sections

### Order History (`/account/orders`)
- 3 mock orders with different statuses
- Product details, quantities, prices
- Order totals and dates

### Saved Quotes (`/account/quotes`)
- 2 mock quotes with expiration dates
- Item counts and totals

### Profile (`/account/profile`)
- Personal information
- Company details
- Billing and shipping addresses

## Add More Team Members

To add another test user, repeat Step 1 (create in Clerk), then add another entry in `MOCK_USER_DATA`:

```typescript
export const MOCK_USER_DATA: Record<string, MockUserProfile> = {
  'user_first_person': {
    // ... first person's data
  },
  'user_second_person': {  // Add second person
    userId: 'user_second_person',
    companyName: 'Another Company',
    // ... rest of data
  },
};
```

## Customize Mock Data

Feel free to edit:
- **Company names** to match real customers
- **SKUs** to match actual products from WordPress
- **Order amounts** to reflect realistic totals
- **Dates** to recent/upcoming dates
- **Addresses** to real company locations

## Troubleshooting

### "No profile data available"
- ✅ Check the Clerk user ID is exactly correct (case-sensitive)
- ✅ Verify user ID is in `MOCK_USER_DATA` object
- ✅ Restart dev server: `npm run dev`

### Yellow banner not showing
- ✅ Check you're in development mode: `npm run dev` (not `npm run build`)
- ✅ Clear browser cache and reload

### Can't sign in
- ✅ Verify email/password in Clerk Dashboard
- ✅ Check user is not suspended
- ✅ Try resetting password in Clerk

## Production Note

In production (after April 2026 launch):
- Set `NEXT_PUBLIC_ENABLE_MOCK_DATA=false` in `.env.production`
- Mock data will be disabled
- Real data will load from your API/database
- Yellow banner will not show

---

**Quick Commands:**

```bash
# Start dev server
cd web && npm run dev

# Open in browser
open http://localhost:3000

# Sign in as test user
# Email: testuser@bapihvac.com
# Password: TestPassword123!
```
