# Stripe Payment Integration Documentation

## Overview

This application integrates Stripe for secure payment processing in the checkout flow. Payments are handled via **Stripe Elements** and the **Payment Intents API** for PCI-compliant card processing.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Client (Browser)                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PaymentStep Component                                │  │
│  │  - Select payment method                              │  │
│  │  - Create payment intent (POST /api/payment/create-   │  │
│  │    intent)                                             │  │
│  │  - Render Stripe Elements (StripeProvider)            │  │
│  │  - User enters card details                           │  │
│  │  - Submit payment (Stripe.confirmPayment)             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js API Routes                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/payment/create-intent                           │  │
│  │  - Validate cart total                                │  │
│  │  - Create Stripe Payment Intent                       │  │
│  │  - Return clientSecret                                │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/payment/confirm                                 │  │
│  │  - Verify payment succeeded                           │  │
│  │  - Create WooCommerce order (TODO)                    │  │
│  │  - Return order details                               │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Stripe API                                                  │
│  - Payment Intent creation                                   │
│  - Card tokenization (secure, PCI-compliant)                 │
│  - Payment confirmation                                      │
└─────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a Stripe account
3. Complete account verification (not required for test mode)

### 2. Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Click "Developers" → "API keys"
3. Copy **Publishable key** (starts with `pk_test_...`)
4. Copy **Secret key** (starts with `sk_test_...`)

### 3. Configure Environment Variables

Add to your `.env.local` file:

```bash
# Stripe API Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

**⚠️ Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for publishable key)
- `STRIPE_SECRET_KEY` is server-only (never exposed to client)
- Use **test keys** (`pk_test_`, `sk_test_`) for development
- Use **live keys** (`pk_live_`, `sk_live_`) for production only

### 4. Test with Stripe Test Cards

Use these test card numbers in checkout:

| Card Number         | Description                    |
|---------------------|--------------------------------|
| 4242 4242 4242 4242 | Visa - Success                |
| 4000 0025 0000 3155 | Visa - Requires authentication|
| 4000 0000 0000 9995 | Visa - Declined (insufficient)|
| 5555 5555 5555 4444 | Mastercard - Success          |

- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

Full list: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

## Code Components

### 1. API Routes

#### `/api/payment/create-intent/route.ts`

Creates a Stripe Payment Intent:

```typescript
POST /api/payment/create-intent

Body:
{
  amount: 99.99,        // Total amount in dollars
  currency: 'usd',      // Currency code
  metadata: {           // Optional metadata
    orderId: '12345'
  }
}

Response (Success):
{
  success: true,
  clientSecret: 'pi_xxx_secret_xxx',
  paymentIntentId: 'pi_xxx'
}

Response (Error):
{
  error: 'Error Title',
  message: 'User-friendly error message'
}
```

#### `/api/payment/confirm/route.ts`

Confirms payment and creates order:

```typescript
POST /api/payment/confirm

Body:
{
  paymentIntentId: 'pi_xxx',
  orderData: {
    // Order details
  }
}

Response (Success):
{
  success: true,
  order: {
    id: 12345,
    status: 'processing',
    total: '99.99',
    transactionId: 'pi_xxx'
  }
}
```

### 2. Client Components

#### `StripeProvider.tsx`

Wraps payment forms with Stripe context:

```typescript
<StripeProvider clientSecret={clientSecret}>
  <StripePaymentForm onSuccess={...} onError={...} />
</StripeProvider>
```

Features:
- Lazy loads Stripe.js (async script)
- Custom appearance (BAPI brand colors)
- Automatic Elements configuration

#### `StripePaymentForm.tsx`

Renders payment form with Stripe Elements:

```typescript
<StripePaymentForm
  onSuccess={(paymentIntentId) => {
    // Handle successful payment
  }}
  onError={(error) => {
    // Handle payment error
  }}
/>
```

Features:
- Secure card input (Stripe-hosted iframe)
- Built-in validation
- Loading states
- Error handling

#### `PaymentStep.tsx`

Payment method selection and processing:

- Fetches cart total
- Creates payment intent when credit card selected
- Renders Stripe Elements
- Handles payment confirmation
- Proceeds to review step on success

### 3. Type Definitions

Updated `CheckoutData` interface:

```typescript
export interface CheckoutData {
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod | null;
  shippingMethod: string | null;
  orderNotes: string;
  paymentIntentId?: string; // Stripe payment intent ID
}
```

## Payment Flow

### Step-by-Step

1. **User selects Credit Card** (PaymentStep)
   - Component fetches cart total from `/api/cart`
   - Creates payment intent via `/api/payment/create-intent`
   - Receives `clientSecret`

2. **Stripe Elements Rendered**
   - StripeProvider wraps form with `clientSecret`
   - User enters card details (secure iframe)
   - Stripe validates card format

3. **User Submits Payment**
   - Stripe.js calls `stripe.confirmPayment()`
   - Payment processed (card charged)
   - Returns `paymentIntent.id` on success

4. **Order Review**
   - `paymentIntentId` stored in checkout data
   - User proceeds to ReviewStep
   - Reviews order details

5. **Place Order** (ReviewStep - future implementation)
   - Call `/api/payment/confirm` with `paymentIntentId`
   - Verify payment succeeded
   - Create WooCommerce order
   - Redirect to order confirmation

## Security Best Practices

✅ **Implemented:**
- Server-side payment intent creation
- Client-side card tokenization (PCI-compliant)
- Secret key never exposed to browser
- HTTPS required (enforced by Stripe)
- Amount validation on server

⚠️ **TODO:**
- Add rate limiting to payment API routes
- Implement webhook verification for async events
- Add order amount verification before charging
- Log payment events for auditing

## Error Handling

### Common Errors

| Error Code | Description | User Message |
|------------|-------------|--------------|
| `card_declined` | Card was declined | Your card was declined. Please try another card. |
| `insufficient_funds` | Not enough balance | Insufficient funds. Please use a different card. |
| `invalid_card_number` | Invalid card number | Please check your card number. |
| `expired_card` | Card expired | This card has expired. Please use a different card. |
| `authentication_required` | 3D Secure needed | Additional authentication required. |

Error handling in PaymentStep:

```typescript
const handleStripeError = (error: string) => {
  showToast('error', 'Payment Failed', error);
  logError('payment.stripe_error', { error });
};
```

## Testing Checklist

- [ ] Payment intent created with correct amount
- [ ] Stripe Elements render correctly
- [ ] Test card (4242...) payment succeeds
- [ ] Declined card (9995) shows error
- [ ] 3D Secure card (3155) prompts authentication
- [ ] Payment intent ID stored in checkout data
- [ ] Review step shows correct payment method
- [ ] Back button works during payment flow
- [ ] Loading states display correctly
- [ ] Toast notifications show on success/error

## Production Deployment

### Before Going Live:

1. **Switch to Live Keys**
   ```bash
   # .env.production
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

2. **Enable Webhooks** (recommended)
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook signing secret
   - Add to env: `STRIPE_WEBHOOK_SECRET=whsec_...`

3. **Complete Stripe Account**
   - Verify business details
   - Add bank account for payouts
   - Complete tax information

4. **Test in Production**
   - Make test purchase with live keys
   - Verify order creation
   - Check Stripe Dashboard for payment

## Monitoring & Maintenance

### Stripe Dashboard

Monitor payments:
- **Payments** → View all transactions
- **Customers** → View customer records
- **Disputes** → Handle chargebacks
- **Logs** → Debug API calls

### Error Logging

All payment errors logged via `logError()`:

```typescript
logError('payment.create_intent_failed', error, {
  amount,
  currency,
  timestamp: Date.now()
});
```

## Troubleshooting

### Payment Intent Not Creating

**Check:**
- `STRIPE_SECRET_KEY` is set in `.env.local`
- Cart total > 0
- API route not blocked by middleware
- No CORS issues

**Debug:**
```bash
# Check API route works
curl -X POST http://localhost:3000/api/payment/create-intent \
  -H "Content-Type: application/json" \
  -d '{"amount":99.99,"currency":"usd"}'
```

### Stripe Elements Not Rendering

**Check:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Client secret received from API
- No console errors in browser
- Stripe.js loaded (check Network tab)

**Debug:**
```typescript
console.log('Client Secret:', clientSecret);
console.log('Stripe Promise:', stripePromise);
```

### Payment Succeeds But Order Not Created

**This is expected** - Order creation is not yet implemented. The payment confirmation API currently returns mock order data.

**TODO:** Implement WooCommerce order creation in `/api/payment/confirm`

## Future Enhancements

- [ ] Apple Pay / Google Pay integration
- [ ] Save payment methods for repeat customers
- [ ] Subscription/recurring payment support
- [ ] Multi-currency support
- [ ] Refund processing via admin dashboard
- [ ] Payment analytics and reporting

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Elements](https://stripe.com/docs/payments/elements)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Test Cards](https://stripe.com/docs/testing)
- [Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

---

**Last Updated**: January 15, 2026
**Version**: 1.0
**Status**: ✅ Stripe Integration Complete (Order creation pending)

