# Cache Revalidation API

## Overview

The revalidation API allows you to invalidate Next.js cache on-demand when content changes in WordPress.

## Endpoint

```
POST /api/revalidate
```

## Authentication

Requires `REVALIDATE_SECRET` environment variable to be set and passed in the request.

## Request Body

```json
{
  "secret": "your-revalidate-secret",
  "tag": "products"
}
```

## Allowed Tags

- `products` - All product-related data
- `product-list` - Product listings
- `categories` - Product categories
- `product-{slug}` - Specific product by slug (e.g., `product-ba10k-2-o-b5`)
- `graphql` - All GraphQL queries

## Response

```json
{
  "revalidated": true,
  "tag": "products",
  "now": 1703340000000
}
```

## Rate Limiting

- 5 requests per minute per IP address

## WordPress Integration

### Setup Webhook in WordPress

1. Install a webhook plugin (e.g., "WP Webhooks")
2. Configure webhook to trigger on product save/update
3. Set webhook URL: `https://your-domain.com/api/revalidate`
4. Set method: `POST`
5. Add body:

```json
{
  "secret": "your-revalidate-secret",
  "tag": "products"
}
```

### Example: Manual Trigger via cURL

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-revalidate-secret",
    "tag": "products"
  }'
```

### Example: Revalidate Specific Product

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-revalidate-secret",
    "tag": "product-ba10k-2-o-b5"
  }'
```

## Environment Variables

Add to `.env.local`:

```
REVALIDATE_SECRET=your-secure-random-string
```

Generate a secure secret:

```bash
openssl rand -base64 32
```
