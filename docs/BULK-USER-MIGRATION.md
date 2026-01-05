# Bulk User Migration from WordPress to Clerk

## Overview

Clean, professional approach to migrating existing WordPress/WooCommerce customers to Clerk authentication while maintaining access to their complete order history.

## Architecture

```
┌─────────────────────┐
│   WordPress/WC      │
│   (Content & Orders)│ ◄─── GraphQL queries
│                     │
│  - Products         │
│  - Orders ✓         │
│  - Customer Data ✓  │
└─────────────────────┘
          │
          │ Export Users
          ▼
┌─────────────────────┐
│  Bulk Import Script │
│                     │
│  Links:             │
│  WP Customer ID ───►│
└─────────────────────┘
          │
          │ Create Accounts
          ▼
┌─────────────────────┐
│       Clerk         │
│   (Authentication)  │
│                     │
│  - User Accounts ✓  │
│  - WP Customer ID ✓ │
│  - Metadata Link ✓  │
└─────────────────────┘
          │
          │ Fetch Orders
          ▼
┌─────────────────────┐
│   Headless Site     │
│   /account/orders   │
│                     │
│  Shows real-time    │
│  WooCommerce data   │
└─────────────────────┘
```

## Key Concept: Link, Don't Duplicate

**✓ What Gets Migrated:**
- User authentication credentials
- Basic profile (name, email)
- WordPress customer ID (stored in Clerk metadata)

**✗ What Stays in WordPress:**
- Order history
- Customer purchase data
- Billing/shipping addresses
- Product information

**Why?**
- Single source of truth for orders
- No data duplication
- Real-time order status
- WordPress can be upgraded/changed without affecting migrated users

## Step-by-Step Process

### 1. Export WordPress Users

```bash
# SSH into WordPress server or use Kinsta SSH
cd /path/to/wordpress

# Export all users to JSON
wp user list --format=json > wordpress-users.json

# Download the file
# Or copy to your local machine
```

### 2. Prepare Import Script

```bash
cd web

# Install Clerk SDK
npm install @clerk/clerk-sdk-node

# Copy users export to web directory
cp ~/wordpress-users.json ./
```

### 3. Set Environment Variables

Add to `web/.env.local`:

```env
CLERK_SECRET_KEY=sk_test_...
```

### 4. Run Bulk Import

```bash
node scripts/bulk-import-users.mjs
```

**What It Does:**
- Reads WordPress users from JSON
- Skips admins/editors (they only need WP access)
- Creates Clerk accounts for customers
- Links WordPress customer ID in metadata
- Sends "Set Password" emails
- Generates import report

### 5. Review Results

Check `import-results.json`:

```json
{
  "success": [
    {
      "email": "customer@example.com",
      "clerkId": "user_abc123",
      "wpUserId": 456
    }
  ],
  "skipped": [
    {
      "email": "admin@bapi.com",
      "reason": "Admin role"
    }
  ],
  "failed": []
}
```

### 6. Customer Communication

Send migration announcement email:

```
Subject: Important: BAPI Account Security Update

We've upgraded our account security system!

What you need to do:
1. Visit bapi.com
2. Click "Sign In"
3. Click "Forgot Password"
4. Enter your email
5. Set your new secure password

Your order history and account information remain unchanged.

Questions? Contact support@bapi.com
```

## Order History Access

### How Customers See Their Orders

1. **Customer signs in** → Authenticated by Clerk
2. **Visits `/account/orders`** → Page loads
3. **Gets WP Customer ID** → From Clerk metadata
4. **Queries WordPress** → Via GraphQL with customer ID
5. **Displays orders** → Real-time WooCommerce data

### Implementation

The Orders page (`web/src/app/account/orders/page.tsx`) automatically:
- Reads `wordpressCustomerId` from Clerk metadata
- Queries WordPress GraphQL for that customer's orders
- Displays complete order history with status
- Links to order details
- Shows product images and quantities

### GraphQL Queries

Located in `web/src/lib/graphql/queries/customer-orders.ts`:
- `GET_CUSTOMER_ORDERS` - List all orders for a customer
- `GET_CUSTOMER_ORDER_DETAILS` - Full details for one order
- `GET_CUSTOMER_INFO` - Customer profile and billing info

## Migration Checklist

- [ ] **Week Before:**
  - [ ] Announce upcoming migration to customers
  - [ ] Prepare support team
  - [ ] Test import script with 5-10 test accounts
  - [ ] Verify GraphQL queries work

- [ ] **Migration Day:**
  - [ ] Export WordPress users (morning)
  - [ ] Run bulk import script (afternoon)
  - [ ] Verify import results
  - [ ] Send migration emails to all customers
  - [ ] Monitor support queue

- [ ] **Week After:**
  - [ ] Check migration completion rate
  - [ ] Send reminder to non-migrated users
  - [ ] Monitor error logs
  - [ ] Verify order history displays correctly

## Troubleshooting

### Issue: Customer can't find order history

**Solution:**
```bash
# Check if customer ID is linked in Clerk
# Go to Clerk Dashboard > Users > Search email
# Check metadata for wordpressCustomerId
```

### Issue: GraphQL query fails

**Solution:**
```bash
# Test GraphQL query directly
curl -X POST https://bapi.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ customer(customerId: 123) { orders { nodes { id } } } }"}'
```

### Issue: User didn't receive password email

**Solution:**
```javascript
// Resend via Clerk Dashboard
// Or trigger programmatically:
await clerk.users.updateUser(userId, {
  notify: true
});
```

## Benefits of This Approach

✅ **Single Source of Truth**
- Orders stay in WooCommerce
- No data synchronization needed
- Real-time status updates

✅ **Zero Data Loss**
- Complete order history accessible
- Customer billing info preserved
- Purchase stats maintained

✅ **Professional UX**
- Customers see familiar order history
- Same data as WordPress site
- Seamless transition

✅ **Simple Architecture**
- No complex sync mechanisms
- Stateless queries
- Easy to maintain

✅ **Future-Proof**
- Can upgrade WordPress independently
- Can change commerce platform later
- Customer accounts portable

## What About New Orders?

**New orders placed on headless site:**
1. Still created in WooCommerce (via API)
2. Linked to Clerk user via customer ID
3. Appear in order history automatically
4. No special handling needed

## Cost Considerations

- **Clerk**: ~$0.02/user for password reset emails
- **WordPress**: Hosting continues (needed for content anyway)
- **GraphQL**: No additional cost (already implemented)

For 10,000 customers: ~$200 one-time migration cost

## Timeline

- Export users: 5 minutes
- Run import: ~15 minutes (10,000 users @ 100ms each)
- Send emails: Automatic via Clerk
- Customer action: Self-service over 1-2 weeks

**Total Developer Time: ~2 hours**

## Next Steps

1. Test import script with sample users
2. Schedule migration date
3. Draft customer communication email
4. Run migration
5. Monitor and support

## Support

Questions about this migration process? Check:
- `/docs/WORDPRESS-USER-MIGRATION.md` - Alternative seamless migration
- Clerk documentation on bulk imports
- WooCommerce GraphQL documentation
