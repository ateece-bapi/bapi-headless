# Stripe Production Setup Runbook

**Last Updated:** 2026-07-09  
**Status:** Staging uses test-mode keys. Follow this runbook before going live.

---

## Overview

The BAPI headless store uses Stripe for payment processing (see [STRIPE-PAYMENT-INTEGRATION.md](./STRIPE-PAYMENT-INTEGRATION.md) for architecture details). This document covers:

1. Activating live mode and rotating keys for the first production deployment
2. Quarterly key rotation schedule
3. Vercel secrets audit checklist

---

## Pre-Conditions

Before switching to live keys you need:

- [ ] Stripe account fully verified (business details, bank account, tax info)
- [ ] Stripe account reviewed and approved for live payments
- [ ] At least one successful end-to-end checkout test in test mode on staging
- [ ] Team consensus that production launch is authorised (Product Manager sign-off)

---

## 1. Activating Production Keys (First Deployment)

### 1.1 Obtain Live Keys from Stripe Dashboard

1. Log in to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Toggle the top-left switch from **Test** → **Live**
3. Go to **Developers → API keys**
4. Copy the **Publishable key** (`pk_live_...`)
5. Click **Reveal live key** for the **Secret key** (`sk_live_...`) — copy it immediately; it won't be shown again without re-revealing
6. Store both values in the team password manager (1Password / Bitwarden) under *BAPI > Stripe > Production*

> **Never commit live keys to git.** They should only exist in Vercel environment variables and the password manager.

### 1.2 Add Keys to Vercel Production Environment

```bash
# Via Vercel CLI (preferred — avoids clipboard exposure)
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# paste pk_live_... when prompted

vercel env add STRIPE_SECRET_KEY production
# paste sk_live_... when prompted
```

Or in the Vercel dashboard:
1. Project → **Settings** → **Environment Variables**
2. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Environment: **Production**) → `pk_live_...`
3. Add `STRIPE_SECRET_KEY` (Environment: **Production**, **Sensitive**) → `sk_live_...`
4. Click **Save**
5. Trigger a **Redeploy** so the new variables are picked up

### 1.3 Configure Stripe Webhooks for Production

1. In the Stripe Dashboard (live mode) go to **Developers → Webhooks**
2. Click **Add endpoint**
3. URL: `https://bapi.com/api/payment/webhook`
4. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret** (`whsec_...`)
6. Add to Vercel:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET production
   # paste whsec_... when prompted
   ```

### 1.4 Smoke-Test Production Payments

Use a real card with a **$0.50 minimum** to confirm the integration works before announcing go-live:

1. Place a test order on production checkout
2. Verify payment appears in Stripe Dashboard (live mode) as **Succeeded**
3. Verify WooCommerce order is created in WordPress admin
4. Issue a refund from the Stripe Dashboard; confirm it propagates

---

## 2. Quarterly Key Rotation

Stripe secret keys should be rotated **every 90 days** to limit the blast radius of any potential key leak.

### Schedule

| Quarter | Target Date |
|---------|-------------|
| Q1      | March 15    |
| Q2      | June 15     |
| Q3      | September 15 |
| Q4      | December 15 |

### Rotation Steps

1. **Generate new key**: Stripe Dashboard (live mode) → Developers → API keys → **Roll key**. Stripe keeps the old key active during a transition window.
2. **Update Vercel**:
   ```bash
   vercel env rm STRIPE_SECRET_KEY production
   vercel env add STRIPE_SECRET_KEY production
   # paste new sk_live_... when prompted
   ```
3. **Redeploy** the production environment to pick up the new key.
4. **Confirm** a real payment succeeds after the redeploy.
5. **Revoke old key** in Stripe Dashboard once confidence is established (wait at least 1 hour in case of in-flight requests).
6. **Update password manager** entry with the new key value + rotation date.
7. Add an entry to [DAILY-LOG.md](./DAILY-LOG.md) noting the rotation.

> **Publishable key** (`pk_live_...`) is low-risk (client-side only) and does not need routine rotation. Rotate it only if you suspect exposure.

---

## 3. Vercel Secrets Audit Checklist

Run this audit before each production release and after any key rotation.

```
Production environment variables — required list
─────────────────────────────────────────────────
[ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY   starts with pk_live_
[ ] STRIPE_SECRET_KEY                    starts with sk_live_   (Sensitive)
[ ] STRIPE_WEBHOOK_SECRET                starts with whsec_     (Sensitive)
[ ] NEXT_PUBLIC_WORDPRESS_GRAPHQL        points to production WP URL
[ ] WORDPRESS_GRAPHQL_SECRET             server-only WP secret  (Sensitive)
[ ] PREVIEW_SECRET                       preview route secret   (Sensitive)
[ ] JWT_SECRET                           token signing key      (Sensitive)

Staging environment variables — required list
─────────────────────────────────────────────
[ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY   starts with pk_test_
[ ] STRIPE_SECRET_KEY                    starts with sk_test_   (Sensitive)
[ ] STRIPE_WEBHOOK_SECRET                starts with whsec_     (Sensitive)
[ ] NEXT_PUBLIC_WORDPRESS_GRAPHQL        points to staging WP URL
```

**Checks to perform:**

1. Log into Vercel Dashboard → Project → Settings → Environment Variables
2. Verify production and staging have **separate key sets** (no test key leaking into production)
3. All `Sensitive` values should show `***` — if a plain-text value is visible, rotate it immediately
4. Confirm `STRIPE_SECRET_KEY` is **not** prefixed with `NEXT_PUBLIC_` (would expose it to the browser)
5. Check Sentry for any `stripe` errors in the last 7 days before signing off

---

## 4. Rollback Procedure

If a production key must be revoked immediately (suspected leak):

1. **Immediately revoke** the key in Stripe Dashboard → Developers → API keys → **Revoke**
   - This instantly invalidates all requests using that key; the store will stop processing payments
2. Generate a new secret key (Stripe Dashboard)
3. Update Vercel environment variable and redeploy (steps in §1.2 above)
4. Notify the team in the engineering Slack channel with the time of revocation and reason
5. Check Stripe Radar for any suspicious charges in the preceding 24 hours

---

## 5. Related Documentation

- [STRIPE-PAYMENT-INTEGRATION.md](./STRIPE-PAYMENT-INTEGRATION.md) — Architecture, API routes, component overview
- [E2E-TEST-DATA-SETUP.md](./E2E-TEST-DATA-SETUP.md) — Staging test card configuration
- Vercel project: https://vercel.com/bapi (replace with actual project URL)
- Stripe Dashboard: https://dashboard.stripe.com
