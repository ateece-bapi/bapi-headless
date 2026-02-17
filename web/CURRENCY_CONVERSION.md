# Currency Conversion System

**Status:** ✅ Implemented (February 17, 2026)  
**API:** Exchange Rate API (exchangerate-api.com)  
**Currencies:** 8 supported (USD, EUR, GBP, JPY, CNY, SGD, AED, VND)

## Overview

The currency conversion system automatically converts product prices from USD (base currency) to the user's selected region currency using live exchange rates.

## Features

- ✅ Live exchange rate API integration
- ✅ 24-hour caching (client + server)
- ✅ Automatic fallback rates if API fails
- ✅ WooCommerce price parsing (handles "$19.99", "$10 - $25", "From $15")
- ✅ Seamless integration with region selector
- ✅ Zero-config setup (works out of the box)

## How It Works

1. **App Startup**: `CurrencyInitializer` fetches rates from `/api/exchange-rates`
2. **User Changes Region**: ProductGrid automatically displays prices in new currency
3. **Price Display**: `getProductPrice(product, currency)` handles conversion
4. **Caching**: Rates cached for 24 hours (reduces API calls to ~30/month)

## API Endpoint

**GET /api/exchange-rates**

Returns current exchange rates with 24-hour cache:

```json
{
  "rates": {
    "USD": 1.0,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 149.5,
    "CNY": 7.24,
    "SGD": 1.34,
    "AED": 3.67,
    "VND": 25320
  },
  "cached": false,
  "timestamp": 1708185600000,
  "source": "exchangerate-api.com"
}
```

## Environment Variables (Optional)

```bash
# Optional: Custom exchange rate API URL
# Default: https://api.exchangerate-api.com/v4/latest/USD
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest/USD
```

**Note:** The free tier (1,500 requests/month) requires no API key. With 24-hour caching, we use ~30 requests/month, well within limits.

## Usage Examples

### Display Product Price (Client Component)

```tsx
'use client';

import { getProductPrice } from '@/lib/graphql/types';
import { useRegion } from '@/store/regionStore';

function ProductCard({ product }) {
  const region = useRegion();
  
  // Automatically converts to region currency
  const price = getProductPrice(product, region.currency);
  
  return <div>{price}</div>; // "$19.99" or "18.39€" or "¥2,990"
}
```

### Manual Price Conversion

```tsx
import { convertWooCommercePrice, parsePrice, formatConvertedPrice } from '@/lib/utils/currency';

// Convert WooCommerce price string
const eurPrice = convertWooCommercePrice("$19.99", "EUR"); // "18.39€"

// Parse USD amount from string
const usdAmount = parsePrice("$19.99"); // 19.99

// Convert numeric USD to any currency
const jpyPrice = formatConvertedPrice(19.99, "JPY"); // "¥2,990"
```

## Testing

**46 comprehensive tests** covering all currency utilities:

```bash
pnpm test currency.test.ts
```

**Test Coverage:**
- ✅ Price parsing (simple, ranges, with prefixes)
- ✅ Currency conversion (all 8 currencies)
- ✅ Formatting (symbol position, decimals, locale)
- ✅ Edge cases (null, invalid, zero)

## Components Updated

1. **ProductGrid** → Uses `useRegion()` + `getProductPrice(product, currency)`
2. **QuickViewModal** → Uses `useRegion()` + `getProductPrice(product, currency)`
3. **CurrencyInitializer** → Fetches rates on app startup (added to locale layout)

## Fallback Behavior

If the API fails, the system seamlessly falls back to hardcoded rates:

```typescript
const FALLBACK_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  SGD: 1.34,
  AED: 3.67,
  VND: 25320,
};
```

**Users never see errors** — prices always display, just with slightly outdated rates if API is down.

## Performance

- **Initial Load**: Single API call (~50ms)
- **Cache Duration**: 24 hours
- **Cache Storage**: In-memory (server) + client state
- **Monthly API Calls**: ~30 (well within 1,500 free tier limit)
- **Page Load Impact**: Zero (cached after first call)

## Future Enhancements

### Phase 2 (Optional)

1. **Redis Caching**: Enterprise-grade distributed caching
2. **Multiple API Providers**: Redundancy (Fixer.io, Open Exchange Rates)
3. **Rate History**: Track exchange rate trends
4. **Admin Dashboard**: View current rates, cache status, API health
5. **Manual Rate Override**: Admin can set custom rates for specific currencies

## Monitoring

Check exchange rate API health:

```bash
curl http://localhost:3000/api/exchange-rates
```

Expected response time: < 100ms (cached), < 500ms (uncached)

## Documentation

- **API Route**: `/web/src/app/api/exchange-rates/route.ts`
- **Utilities**: `/web/src/lib/utils/currency.ts`
- **Tests**: `/web/src/lib/utils/__tests__/currency.test.ts`
- **Types**: `/web/src/lib/graphql/types.ts` (updated `getProductPrice`)
- **Initializer**: `/web/src/components/providers/CurrencyInitializer.tsx`

## Related Features

- [Region Selector](../docs/REGION-SELECTOR-TESTING-GUIDE.md) - Currency selection UI
- [Measurement Localization](../docs/DAILY-LOG.md) - Temperature, length, weight conversion
- [i18n System](../README.md) - Multi-language support (11 locales)

---

**Launch Ready:** ✅ Phase 1 complete (April 10, 2026 deadline)  
**Status:** Production-ready with comprehensive testing
