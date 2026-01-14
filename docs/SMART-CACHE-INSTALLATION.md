# WPGraphQL Smart Cache Installation & Configuration

**Date**: January 14, 2026  
**Status**: ✅ Partially Complete - Object Cache Working, CDN Configuration Pending

## What Was Accomplished

### 1. Smart Cache Plugin Configuration ✅
- Plugin already installed: `wpgraphql-smart-cache` v2.0.1
- Configured via WP-CLI:
  ```bash
  wp option update graphql_general_settings '{
    "public_introspection_enabled":"on",
    "cache_enabled":"on",
    "cache_expiration":"3600",
    "network_cache_enabled":"on",
    "network_cache_max_age":"3600"
  }' --format=json
  ```

### 2. Cache Headers Plugin ✅
- Created MU plugin: `wp-content/mu-plugins/graphql-cache-headers.php`
- Adds proper cache-control headers for CDN caching
- Headers verified: `cache-control: max-age=3600, s-maxage=3600, must-revalidate`

### 3. GET Request Support ✅
- WPGraphQL v2.x supports GET requests by default
- Verified working: `GET /graphql?query={...}`
- Cache key validation working (see `x-graphql-keys` header)

## Performance Results

### WordPress Object Cache (Working) ✅
- **Before Smart Cache**: 4.177s (cold cache)
- **After Smart Cache**: 3.48s (cached)
- **Improvement**: ~15-20% faster
- Cache response includes: `"This response was not executed at run-time but has been returned from the GraphQL Object Cache"`

### CDN Edge Cache (NOT Working) 🔴
- **Current**: All requests ~3.5s (hitting WordPress server)
- **Expected**: <100ms for CDN-cached responses
- **Reason**: Kinsta CDN explicitly bypasses `/graphql` endpoint

**Evidence from Headers**:
```
cf-cache-status: DYNAMIC
ki-cf-cache-status: BYPASS
x-kinsta-cache: BYPASS
```

## Redis Object Cache Status ✅

**Confirmed Working** (January 14, 2026):
```
Status: Connected
Client: PhpRedis 6.2.0
Redis Version: 7.2.5
Metrics recorded: 25+
Drop-in: Valid
```

Redis is actively caching WordPress objects, providing faster database query performance.

## Next Steps - Kinsta CDN Configuration

### Required Action: Enable CDN Caching for GraphQL

**Kinsta Dashboard Investigation**:
- ✅ `/graphql` is NOT in CDN exclusion list
- ✅ Edge Caching is enabled
- ✅ Cache-Control headers are properly set
- ❌ CDN still bypassing (likely Kinsta security policy)

**Option 1: Kinsta Dashboard (Recommended)**
1. Log into Kinsta: https://my.kinsta.com/
2. Navigate to: **Sites** → **bapiheadlessstaging** → **CDN**
3. Look for **Cache Rules** or **Custom Cache Rules**
4. Add rule:
   - **URL Pattern**: `*/graphql*`
   - **Cache Method**: Cache GET requests
   - **Cache TTL**: 3600 seconds (1 hour)
   - **Query String Handling**: Include query string in cache key
   - **Respect Cache-Control Headers**: Yes

**Option 2: Contact Kinsta Support**
If cache rules aren't available in dashboard:
- Open support ticket
- Request: "Enable CDN caching for GET requests to `/graphql` endpoint"
- Mention: Cache-Control headers are already configured

### Current Performance (Redis + Smart Cache Enabled)

**Actual Results** (January 14, 2026):
- **All requests**: 3-4s (hitting WordPress, Smart Cache + Redis working)
- **Redis Status**: ✅ Connected (PhpRedis 6.2.0, Redis 7.2.5)
- **Smart Cache**: ✅ Object cache active
- **CDN Edge Caching**: ❌ Still bypassed by Kinsta policy

### Expected Performance After CDN Configuration

- **First request** (cold): ~3s (WordPress + Smart Cache + Redis)
- **Subsequent requests** (CDN edge): **<100ms** ⚡
- **Total improvement**: **~95% faster** for CDN-cached responses

## Testing CDN Caching (After Configuration)

```bash
# Run from SSH terminal
echo "Test 1 - Cold cache:"
time curl -X GET "https://bapiheadlessstaging.kinsta.cloud/graphql?query=%7B%20products(first%3A%201)%20%7B%20nodes%20%7B%20id%20%7D%20%7D%20%7D" > /dev/null 2>&1

echo "Test 2 - Should be CDN cached:"
time curl -X GET "https://bapiheadlessstaging.kinsta.cloud/graphql?query=%7B%20products(first%3A%201)%20%7B%20nodes%20%7B%20id%20%7D%20%7D%20%7D" > /dev/null 2>&1

# Check for HIT status
curl -I -X GET "https://bapiheadlessstaging.kinsta.cloud/graphql?query=%7B%20products(first%3A%201)%20%7B%20nodes%20%7B%20id%20%7D%20%7D%20%7D" | grep -i cache
```

Look for:
- `cf-cache-status: HIT` (instead of DYNAMIC)
- `ki-cache-type: CDN` (instead of None)
- Timing: <100ms

## Files Modified

1. **WordPress Database**:
   - `wp_options.graphql_general_settings` - Smart Cache configuration

2. **WordPress Filesystem**:
   - `wp-content/mu-plugins/graphql-cache-headers.php` - CDN cache headers

## Current Plugin Status

```bash
wp plugin list | grep -i graphql
```

Output:
```
wp-graphql                active  none    2.5.3
wpgraphql-smart-cache     active  none    2.0.1
wp-graphql-woocommerce    active  none    0.19.0
```

## Rollback Instructions (If Needed)

```bash
# Disable Smart Cache
wp option update graphql_general_settings '{"public_introspection_enabled":"on"}' --format=json

# Remove cache headers plugin
rm ~/public/wp-content/mu-plugins/graphql-cache-headers.php

# Flush cache
wp cache flush
```

## Related Documentation

- [WORDPRESS-BACKEND-SETUP.md](./WORDPRESS-BACKEND-SETUP.md) - Original plugin installation guide
- [WORDPRESS-GRAPHQL-OPTIMIZATION.md](./WORDPRESS-GRAPHQL-OPTIMIZATION.md) - Full optimization strategy
- [Copilot Instructions](../.github/copilot-instructions.md) - Updated with database insights

## Notes

- Smart Cache is working but only at WordPress object cache level
- CDN edge caching requires Kinsta dashboard configuration
- Query parameters are properly included in cache key
- WooCommerce session cookie doesn't prevent caching (using JWT)
