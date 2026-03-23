# E2E Test Data Configuration Guide

**Purpose:** Configure staging/test environment to support E2E test execution  
**Target Audience:** DevOps, QA Engineers, Backend Developers  
**Priority:** HIGH - Required for PR validation before Phase 1 launch

---

## Quick Setup Checklist

- [ ] WordPress backend running and accessible
- [ ] 10+ test products created with stock
- [ ] 5 test coupon codes configured
- [ ] WPGraphQL plugins installed and active
- [ ] Stripe test keys configured
- [ ] Translation files for 11 languages present
- [ ] Environment variables set in Vercel/CI

**Estimated Setup Time:** 30-45 minutes

---

## 1. WordPress Products Setup

### Minimum Requirements
- **Quantity:** At least 10 products
- **Stock Status:** "In Stock" (not out of stock)
- **Price:** Greater than $0.00
- **Images:** At least 1 product image each

### Recommended Product Configuration

Create products in WordPress Admin → Products → Add New:

#### Product 1-3: Electronics Category
```
Product Name: Test Digital Thermostat
SKU: TEST-THERMO-001
Regular Price: $149.99
Stock: In Stock (qty: 100)
Category: Electronics > Thermostats
Image: Upload any product image
Description: Test product for E2E testing
```

#### Product 4-6: HVAC Category
```
Product Name: Test HVAC Valve
SKU: TEST-VALVE-001
Regular Price: $89.99
Stock: In Stock (qty: 50)
Category: HVAC > Valves
Image: Upload any product image
```

#### Product 7-10: Misc Categories
```
Product Name: Test Building Controller
SKU: TEST-CTRL-001
Regular Price: $299.99
Stock: In Stock (qty: 25)
Category: Building Automation > Controllers
```

### Category Structure Required

Create these categories in WordPress Admin → Products → Categories:

```
- Electronics
  └─ Thermostats
- HVAC
  └─ Valves
  └─ Actuators
- Building Automation
  └─ Controllers
  └─ Sensors
```

**Why:** Tests validate breadcrumb navigation and category/subcategory hierarchy.

---

## 2. WooCommerce Coupon Codes

Navigate to WordPress Admin → WooCommerce → Coupons → Add Coupon

### Required Test Coupons

#### Coupon 1: SAVE10 (Percentage Discount)
```
Coupon Code: SAVE10
Discount Type: Percentage discount
Coupon Amount: 10
Allow free shipping: No
Expiry Date: (Leave blank - no expiry)
Usage Restriction: None
Usage Limits: None
```

#### Coupon 2: SAVE5 (Fixed Cart Discount)
```
Coupon Code: SAVE5
Discount Type: Fixed cart discount
Coupon Amount: 5.00
Allow free shipping: No
Expiry Date: (Leave blank)
```

#### Coupon 3: FREESHIP (Free Shipping)
```
Coupon Code: FREESHIP
Discount Type: Free shipping
Coupon Amount: (Leave blank)
Allow free shipping: Yes
Expiry Date: (Leave blank)
```

#### Coupon 4: EXPIRED2025 (Expired Coupon - for error testing)
```
Coupon Code: EXPIRED2025
Discount Type: Percentage discount
Coupon Amount: 20
Expiry Date: 2025-12-31 (past date)
```

#### Coupon 5: SPECIFIC99 (Product-Specific - for restriction testing)
```
Coupon Code: SPECIFIC99
Discount Type: Percentage discount
Coupon Amount: 15
Products: (Select only Product 1)
Usage Restriction: Specific products only
```

**Validation:** After creating, test each coupon code manually in WooCommerce cart to confirm it works.

---

## 3. WordPress Plugin Configuration

### Required Plugins (All Must Be Active)

Install and activate in WordPress Admin → Plugins:

#### Core GraphQL Stack
1. **WPGraphQL** (v1.13+ recommended)
   - Download: https://www.wpgraphql.com/
   - Activation: WordPress Admin → Plugins → Activate

2. **WPGraphQL for WooCommerce** (v0.12+ recommended)
   - Download: https://github.com/wp-graphql/wp-graphql-woocommerce
   - Activation: WordPress Admin → Plugins → Activate

3. **WPGraphQL CORS** (for GET request caching)
   - Download: https://github.com/funkhaus/wp-graphql-cors
   - Settings: GraphQL → Settings → CORS
     - Enable CORS: Yes
     - Allowed Headers: `Content-Type, Authorization`
     - Exposed Headers: `X-WP-Total, X-WP-TotalPages`

#### Performance (Recommended)
4. **WPGraphQL Smart Cache**
   - Improves GraphQL performance
   - Settings: GraphQL → Settings → Cache

5. **Redis Object Cache** (if available on hosting)
   - Improves overall WordPress performance

### GraphQL Endpoint Validation

Test GraphQL endpoint is accessible:

```bash
curl -X POST https://your-staging-site.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ generalSettings { title } }"}'
```

**Expected Response:**
```json
{
  "data": {
    "generalSettings": {
      "title": "Your Site Title"
    }
  }
}
```

---

## 4. Stripe Test Configuration

### Stripe Dashboard Setup

1. **Get Test API Keys:**
   - Login to Stripe Dashboard: https://dashboard.stripe.com/test/
   - Navigate to Developers → API Keys
   - Copy "Publishable key" (starts with `pk_test_`)
   - Copy "Secret key" (starts with `sk_test_`)

2. **Configure in WordPress:**
   - Install WooCommerce Stripe Gateway plugin
   - Navigate to WooCommerce → Settings → Payments → Stripe
   - Enable Test Mode
   - Paste Test Publishable Key
   - Paste Test Secret Key
   - Save Changes

### Next.js Environment Variables

Add to Vercel/CI environment variables:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Test Payment Intent Endpoint

Verify `/api/payment/create-intent` API route works:

```bash
curl -X POST https://your-app.vercel.app/api/payment/create-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000}'
```

**Expected:** Returns `clientSecret` for Stripe payment intent.

---

## 5. Translation Files Configuration

### Required Language Files

Ensure these files exist in `web/messages/`:

```
web/messages/
├── en.json       (English - default)
├── es.json       (Spanish - ES)
├── fr.json       (French - FR)
├── de.json       (German - DE)
├── ja.json       (Japanese - JA)
├── ar.json       (Arabic - AR)
├── hi.json       (Hindi - HI)
├── th.json       (Thai - TH)
├── vi.json       (Vietnamese - VI)
└── zh.json       (Chinese - ZH)
```

**Note:** The E2E tests primarily focus on ES, FR, DE, and JA locales, but all language files should be present for complete multi-locale support.

### Minimum Translation Coverage

Each language file must include translations for:

```json
{
  "checkout": {
    "title": "Checkout",
    "continue": "Continue",
    "back": "Back"
  },
  "cart": {
    "title": "Cart",
    "empty": "Your cart is empty",
    "remove": "Remove"
  },
  "products": {
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock"
  },
  "payment": {
    "creditCard": "Credit Card",
    "paypal": "PayPal"
  },
  "coupon": {
    "apply": "Apply",
    "remove": "Remove",
    "invalid": "Invalid coupon code"
  }
}
```

**Validation:** Open app in each tested locale (`/es`, `/fr`, `/de`, `/ja`) and verify text displays in correct language.

**Important:** The current E2E test suite focuses on 4 key locales (ES, FR, DE, JA) rather than all supported languages. Additional locale coverage can be added in future test iterations.

---

## 6. Environment Variables

### Vercel Environment Variables

Configure in Vercel Dashboard → Project Settings → Environment Variables:

```bash
# WordPress GraphQL
NEXT_PUBLIC_WORDPRESS_GRAPHQL=https://your-staging-wp.com/graphql

# Preview System
PREVIEW_SECRET=your-random-secret-here

# Stripe (Test Keys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Locale (optional)
E2E_LOCALE=en
```

### CI/CD Environment Variables (GitHub Actions)

If using GitHub Actions, add to repository secrets:

```yaml
# .github/workflows/e2e-tests.yml
env:
  NEXT_PUBLIC_WORDPRESS_GRAPHQL: ${{ secrets.WORDPRESS_GRAPHQL_URL }}
  PREVIEW_SECRET: ${{ secrets.PREVIEW_SECRET }}
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_PUBLISHABLE_KEY }}
```

---

## 7. Database Configuration

### WordPress Database

Tests assume these database configurations:

#### Products Table (`wp_posts`)
- **Minimum rows:** 10 products
- **post_type:** `product`
- **post_status:** `publish`

#### Product Meta (`wp_postmeta`)
Required meta keys per product:
- `_price` - Regular price (e.g., "149.99")
- `_stock_status` - Stock status ("instock")
- `_manage_stock` - Stock management ("yes")
- `_stock` - Stock quantity (> 0)

#### WooCommerce Coupons (`wp_posts`)
- **post_type:** `shop_coupon`
- **post_status:** `publish`
- **post_name:** Coupon code (e.g., "SAVE10")

### Validation Query

Run in WordPress → phpMyAdmin or database client:

```sql
-- Count published products
SELECT COUNT(*) as product_count 
FROM wp_posts 
WHERE post_type = 'product' 
  AND post_status = 'publish';

-- Should return at least 10

-- Count active coupons
SELECT post_name, post_date 
FROM wp_posts 
WHERE post_type = 'shop_coupon' 
  AND post_status = 'publish';

-- Should return SAVE10, SAVE5, FREESHIP, EXPIRED2025, SPECIFIC99
```

---

## 8. Network & Hosting Requirements

### CORS Configuration

Frontend (Vercel) must be able to make requests to backend (WordPress):

1. **WordPress CORS Headers:**
   ```php
   // In wp-config.php or via plugin
   header('Access-Control-Allow-Origin: https://your-app.vercel.app');
   header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
   header('Access-Control-Allow-Headers: Content-Type, Authorization');
   ```

2. **WPGraphQL CORS Plugin Settings:**
   - Extend "Access-Control-Allow-Origin": `https://your-app.vercel.app`
   - Send Site Credentials: No
   - Enable Access-Control-Allow-Credentials: No

### SSL/TLS Requirements

- WordPress backend must use HTTPS (SSL certificate valid)
- Next.js frontend must use HTTPS in staging/production
- Stripe requires HTTPS for payment processing

---

## 9. Test Execution Pre-Flight Checklist

Before running E2E tests, verify:

### Backend Health Check
```bash
# GraphQL endpoint accessible
curl https://your-wp-site.com/graphql

# Products query returns data
curl -X POST https://your-wp-site.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ products { nodes { name } } }"}'
```

### Frontend Health Check
```bash
# App loads
curl https://your-app.vercel.app

# Products page loads
curl https://your-app.vercel.app/en/products

# Checkout page loads
curl https://your-app.vercel.app/en/checkout
```

### Environment Variables Loaded
```bash
# In Vercel/CI, verify variables are set
echo $NEXT_PUBLIC_WORDPRESS_GRAPHQL
echo $STRIPE_SECRET_KEY
```

### Products Available
- Navigate to `https://your-app.vercel.app/en/products`
- Should see at least 5-10 products listed
- At least one product should be "In Stock"
- Click a product → Should see "Add to Cart" button

### Coupons Work
- Add product to cart manually
- Navigate to cart
- Enter coupon code "SAVE10"
- Should see 10% discount applied

---

## 10. Troubleshooting Common Issues

### Issue: Tests fail with "No products found"

**Cause:** No products in database or all out of stock  
**Fix:**
1. Check WordPress → Products → All Products
2. Ensure at least 5 products are "In Stock"
3. Verify products are published (not drafts)

### Issue: Tests fail with "GraphQL endpoint not found"

**Cause:** WPGraphQL plugin not active or wrong URL  
**Fix:**
1. Activate WPGraphQL plugin
2. Verify `NEXT_PUBLIC_WORDPRESS_GRAPHQL` environment variable
3. Test endpoint: `curl https://your-wp-site.com/graphql`

### Issue: Coupon tests fail with "Invalid coupon code"

**Cause:** Coupons not created or wrong code  
**Fix:**
1. Navigate to WooCommerce → Coupons
2. Verify SAVE10, SAVE5, FREESHIP exist
3. Check coupon usage restrictions (should be none)
4. Verify expiry dates (EXPIRED2025 should be past, others no expiry)

### Issue: Payment tests fail with Stripe errors

**Cause:** Stripe test keys not configured  
**Fix:**
1. Verify Stripe test keys in environment variables
2. Check `/api/payment/create-intent` endpoint returns clientSecret
3. Ensure WooCommerce Stripe Gateway in test mode

### Issue: Multi-locale tests fail

**Cause:** Translation files missing or incomplete  
**Fix:**
1. Check `web/locales/` directory has all 11 language files
2. Verify each file has valid JSON structure
3. Test each locale manually: `/es`, `/fr`, `/de`, `/ja`

---

## 11. Maintenance & Updates

### Regular Maintenance Tasks

**Weekly:**
- [ ] Verify all 10+ test products still in stock
- [ ] Check coupon codes haven't been accidentally deleted
- [ ] Monitor test environment uptime

**After WordPress Updates:**
- [ ] Verify WPGraphQL plugins still active and compatible
- [ ] Re-test GraphQL endpoint accessibility
- [ ] Check product data structure hasn't changed

**After Next.js Deployments:**
- [ ] Verify environment variables still set in Vercel
- [ ] Test frontend can reach WordPress backend
- [ ] Check CORS headers still working

### Updating Test Data

If tests start failing due to data changes:

1. **Check what changed:**
   ```bash
   # Run single test to see error
   pnpm exec playwright test payment-flows.spec.ts --project=chromium
   ```

2. **Common fixes:**
   - Add more products if tests can't find in-stock items
   - Recreate coupons if accidentally deleted
   - Update environment variables if endpoints changed

3. **Document changes:**
   - Update this guide if requirements change
   - Notify team of test data dependencies

---

## Contact & Support

**Questions about test data setup?**
- DevOps Lead: [Name/Email]
- QA Engineer: [Name/Email]
- Backend Developer: [Name/Email]

**Issues with specific tests?**
- See test file comments for detailed requirements
- Check Playwright HTML report for failure details
- Review screenshots in `test-results/` directory

---

**Document Version:** 1.0  
**Last Updated:** March 23, 2026  
**Maintained By:** E2E Testing Team
