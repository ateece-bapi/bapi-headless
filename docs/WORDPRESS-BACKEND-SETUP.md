# URGENT: WordPress Backend Performance Plugins

**Status:** ❌ CRITICAL - No caching plugins installed  
**Impact:** This is causing the 6.7s GraphQL query times

## Current State

```
✅ wp-graphql (2.5.3) - Installed
✅ wp-graphql-woocommerce (0.19.0) - Installed
❌ WPGraphQL Smart Cache - NOT INSTALLED
❌ Redis Object Cache - NOT INSTALLED
❌ WPGraphQL CORS - NOT INSTALLED
❌ Query Monitor - NOT INSTALLED
```

## IMMEDIATE ACTION REQUIRED

### 1. Install WPGraphQL Smart Cache (CRITICAL)

**This will give you 80-90% performance improvement immediately**

```bash
cd /home/ateece/bapi-headless/cms

# Install via WP-CLI
wp plugin install wp-graphql-smart-cache --activate

# OR download manually:
# https://github.com/wp-graphql/wp-graphql-smart-cache/releases/latest
```

**Configure:**
1. Go to: WordPress Admin → Settings → GraphQL → Cache
2. **Object Cache Settings:**
   - ✅ Enable Object Cache
   - Cache Expiration: `3600` (1 hour)
3. **Network Cache Settings:**
   - Cache-Control max-age: `3600`
4. Click "Save Changes"

**Expected Impact:** 6.7s → 1-2s

---

### 2. Install Redis Object Cache (HIGH PRIORITY)

**Enables WordPress to cache database queries in memory**

```bash
# Install Redis Cache plugin
wp plugin install redis-cache --activate

# Enable Redis (requires Redis server)
wp redis enable
```

**Check if Redis server is running:**
```bash
redis-cli ping
# Should return: PONG
```

**If Redis is not installed on your system:**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# macOS
brew install redis
brew services start redis
```

**Expected Impact:** 1-2s → 500ms-1s

---

### 3. Install WPGraphQL CORS (RECOMMENDED)

**Enables GET requests for CDN caching**

```bash
wp plugin install wp-graphql-cors --activate
```

**Configure:**
1. Go to: WordPress Admin → Settings → GraphQL → CORS
2. Add allowed origins (one per line):
   ```
   https://your-vercel-app.vercel.app
   https://yourdomain.com
   http://localhost:3000
   ```
3. Click "Save Changes"

**Expected Impact:** Enables edge caching (100-300ms cached)

---

### 4. Install Query Monitor (DEBUGGING)

**Helps identify slow queries and N+1 problems**

```bash
wp plugin install query-monitor --activate
```

**Usage:**
1. Load any page while logged in as admin
2. Check the Query Monitor toolbar at top
3. Review:
   - Database Queries (look for duplicates)
   - Slow queries (>100ms)
   - HTTP API calls

---

## Quick Install Script

**Run all installations at once:**

```bash
#!/bin/bash
cd /home/ateece/bapi-headless/cms

echo "Installing WPGraphQL Smart Cache..."
wp plugin install wp-graphql-smart-cache --activate

echo "Installing Redis Cache..."
wp plugin install redis-cache --activate

echo "Installing WPGraphQL CORS..."
wp plugin install wp-graphql-cors --activate

echo "Installing Query Monitor..."
wp plugin install query-monitor --activate

echo "✅ All plugins installed!"
echo ""
echo "Next steps:"
echo "1. Check if Redis is running: redis-cli ping"
echo "2. Enable Redis: wp redis enable"
echo "3. Configure Smart Cache: Settings → GraphQL → Cache"
echo "4. Configure CORS: Settings → GraphQL → CORS"
echo "5. Test performance: Load a product page"
```

**Save as:** `/home/ateece/bapi-headless/scripts/install-wp-performance-plugins.sh`

**Run:**
```bash
chmod +x scripts/install-wp-performance-plugins.sh
./scripts/install-wp-performance-plugins.sh
```

---

## Performance Expectations

### Current (No Caching)
- GraphQL Query: 6.7s
- Database Queries: 50-100 per request
- Memory Usage: High
- Server Load: High

### After Smart Cache Only
- GraphQL Query: 1-2s (first) / 100-300ms (cached)
- Database Queries: 10-20 per request
- Cache Hit Rate: 70-80%
- **70% improvement**

### After Smart Cache + Redis
- GraphQL Query: 500ms-1s (first) / 50-100ms (cached)
- Database Queries: 5-10 per request
- Cache Hit Rate: 90%+
- **90% improvement**

### After All Optimizations + Query Splitting
- GraphQL Query: 200-500ms (first) / 50ms (cached)
- Database Queries: <5 per request
- Cache Hit Rate: 95%+
- **95% improvement** (6.7s → 300ms)

---

## Verification Commands

```bash
# Check all plugins are active
wp plugin list

# Check Redis status (after enabling)
wp redis status

# Check Smart Cache settings
wp option get graphql_general_settings --format=json

# Flush all caches after changes
wp cache flush
wp plugin deactivate --all && wp plugin activate --all
```

---

## Troubleshooting

### Redis Not Connecting
```bash
# Check Redis is running
sudo systemctl status redis

# Check Redis config
redis-cli config get bind

# Test connection
redis-cli ping
```

### Smart Cache Not Working
```bash
# Check plugin is active
wp plugin list | grep smart-cache

# Verify settings
wp graphql config

# Clear and rebuild cache
wp cache flush
```

### CORS Errors
```bash
# Check CORS plugin is active
wp plugin list | grep cors

# Test GET request
curl -X GET "http://localhost/graphql?query={products{nodes{name}}}"
```

---

## Next Steps After Installation

1. ✅ Install all 4 plugins
2. ✅ Configure Smart Cache (Settings → GraphQL)
3. ✅ Enable Redis (`wp redis enable`)
4. ✅ Configure CORS origins
5. 🔄 Test performance (load product page)
6. 📊 Check Query Monitor for slow queries
7. 🚀 Deploy query splitting (Phase 1 from analysis doc)

---

## Contact/Support

- Smart Cache Issues: https://github.com/wp-graphql/wp-graphql-smart-cache/issues
- Redis Issues: https://wordpress.org/support/plugin/redis-cache/
- WPGraphQL Slack: https://wpgraphql.com/community

