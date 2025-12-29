# WordPress GraphQL Performance Optimization Guide

This guide covers critical WordPress backend optimizations for GraphQL performance on Kinsta hosting.

## Current Issues

1. **No Persistent Query Caching** - WordPress parses full queries every time
2. **POST-only Requests** - Cannot be CDN cached
3. **No Response Caching** - Every request hits WordPress/database
4. **Query Complexity Limits** - May throttle complex queries

## Required WordPress Plugins

### 1. WPGraphQL (Already Installed)
Core GraphQL functionality for WordPress.

### 2. WPGraphQL Smart Cache (REQUIRED)
**Critical for performance** - Caches GraphQL responses and invalidates on content changes.

**Install:**
```bash
# Via Kinsta SSH or WP-CLI
wp plugin install wp-graphql-smart-cache --activate
```

**Configure:**
- Settings → GraphQL Smart Cache
- Enable "Cache GraphQL Queries"
- Enable "Purge on Post Update"
- Cache TTL: 3600 seconds (1 hour)

### 3. WPGraphQL CORS (REQUIRED for GET requests)
Allows GET requests for CDN-cacheable queries.

**Install:**
```bash
wp plugin install wp-graphql-cors --activate
```

**Configure:**
- Settings → GraphQL CORS
- Enable "Allow GET requests"
- Set Access-Control-Max-Age: 86400

## WPGraphQL Configuration

### Increase Query Limits
Add to `wp-config.php` or functions.php:

```php
// Increase query depth limit (default: 15)
add_filter('graphql_query_depth_max', function() {
    return 20;
});

// Increase query complexity limit (default: 1000)
add_filter('graphql_query_complexity_max', function() {
    return 2000;
});

// Increase batch query limit (default: 10)
add_filter('graphql_batch_query_max', function() {
    return 20;
});
```

### Enable Query Batching
```php
add_filter('graphql_allow_batch_queries', '__return_true');
```

## Kinsta CDN Configuration

### Enable CDN Caching for GraphQL
In Kinsta dashboard:

1. **CDN Settings**
   - Enable Kinsta CDN
   - Cache static assets

2. **Add Custom Cache Rule**
   ```
   URL Pattern: */graphql*
   Cache TTL: 3600 seconds
   Query String Handling: Include all
   ```

3. **Cache Headers** (handled by frontend now)
   - GET requests will include proper cache-control headers
   - POST requests bypass cache (mutations)

## Object Caching (HIGHLY RECOMMENDED)

Kinsta provides Redis object caching:

```bash
# Enable in Kinsta dashboard
# Tools → Redis → Enable
```

Then install plugin:
```bash
wp plugin install redis-cache --activate
wp redis enable
```

**Verify:**
```bash
wp redis status
```

## Performance Monitoring

### Install Query Monitor Plugin
```bash
wp plugin install query-monitor --activate
```

Monitor:
- Database queries per GraphQL request
- Query execution time
- Memory usage
- Cache hit/miss ratio

### WPGraphQL Debug Mode
For development only - disable in production:

```php
// In wp-config.php
define('GRAPHQL_DEBUG', false); // Production
```

## Expected Performance Gains

**Before Optimization:**
- First request: ~2-3 seconds
- Cached request: ~500ms
- Database queries: 50-100 per request

**After Optimization:**
- First request: ~300-500ms (Smart Cache)
- CDN cached: ~50-100ms
- Database queries: 5-10 per request (Object Cache)
- GET requests: <50ms (CDN edge cache)

## Frontend Changes

Our Next.js frontend now:
1. ✅ Uses GET requests for cacheable queries (products, categories)
2. ✅ Sends proper cache-control headers
3. ✅ Uses React cache() for deduplication
4. ✅ Implements ISR with 1-hour revalidation
5. ✅ Pre-generates top 30 pages at build time

## Deployment Checklist

- [ ] Install WPGraphQL Smart Cache plugin
- [ ] Install WPGraphQL CORS plugin
- [ ] Enable GET requests in WPGraphQL CORS settings
- [ ] Add query limit filters to functions.php
- [ ] Enable Kinsta Redis object caching
- [ ] Configure CDN cache rules for /graphql
- [ ] Verify cache hit ratios with Query Monitor
- [ ] Test GET requests work: `curl -X GET "https://bapiheadlessstaging.kinsta.cloud/graphql?query=..."`

## Troubleshooting

### GET Requests Not Working
- Verify WPGraphQL CORS plugin is active
- Check "Allow GET requests" is enabled
- Clear Kinsta CDN cache

### Slow Queries Still
- Check Query Monitor for slow database queries
- Verify Redis is connected: `wp redis status`
- Review Smart Cache hit ratio
- Consider adding database indexes

### Cache Not Invalidating
- Smart Cache should auto-purge on content changes
- Manual purge: Settings → Smart Cache → Purge Cache
- Check webhook configuration for external updates

## Security Notes

- GET requests expose queries in URL - ensure no sensitive data in queries
- All queries are read-only (mutations still use POST)
- Rate limiting handled by Kinsta (300 req/min default)
- Consider WPGraphQL JWT for authenticated queries

## Additional Resources

- [WPGraphQL Docs](https://www.wpgraphql.com/docs/)
- [WPGraphQL Smart Cache](https://github.com/wp-graphql/wp-graphql-smart-cache)
- [Kinsta CDN Guide](https://kinsta.com/help/kinsta-cdn/)
- [Redis Object Cache](https://kinsta.com/help/redis-cache/)
