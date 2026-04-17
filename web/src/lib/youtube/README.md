# YouTube Video Integration - Quick Reference

## 🚀 Quick Commands

```bash
# Fetch videos from YouTube
pnpm run youtube:fetch

# Sync to WordPress (dry-run first!)
pnpm run youtube:sync -- --file=youtube-videos.csv --dry-run

# Actual sync
pnpm run youtube:sync -- --file=youtube-videos.csv

# Get help
pnpm run youtube:help
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/youtube/client.ts` | YouTube Data API integration |
| `src/lib/youtube/mapping.ts` | SKU extraction & categorization |
| `src/lib/youtube/wordpress-sync.ts` | WordPress ACF sync |
| `src/components/shared/YouTubeEmbed.tsx` | Performance embed (224x faster) |
| `src/lib/schema/video.ts` | SEO VideoObject schema |
| `scripts/youtube-cli.ts` | CLI tool for fetch/sync |
| `.github/workflows/sync-youtube-videos.yml` | Daily automation |

## 🔑 Required Environment Variables

```bash
# .env.local
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CHANNEL_USERNAME=BAPIHVAC
WORDPRESS_API_URL=https://staging.bapi.com
WORDPRESS_AUTH_TOKEN=your_token
```

## 📖 Full Documentation

See [docs/YOUTUBE-VIDEO-SETUP.md](../docs/YOUTUBE-VIDEO-SETUP.md) for complete setup guide.

## 🎯 Workflow

1. **Fetch** - Download videos from YouTube → CSV
2. **Review** - Manually verify SKU mappings in CSV
3. **Sync** - Upload to WordPress ACF fields
4. **Display** - Automatically shown on product pages

## 🏆 Features

- ✅ **Automated SKU Detection** - Pattern matching for PS-500, TS-200, etc.
- ✅ **224x Faster Embeds** - Lite YouTube facade pattern
- ✅ **SEO Enhanced** - VideoObject schema for rich snippets
- ✅ **Privacy Compliant** - Uses youtube-nocookie.com
- ✅ **GitHub Actions** - Daily automated sync
- ✅ **CSV Export** - Manual review workflow

## 📊 SKU Detection Patterns

```typescript
// High Confidence
"PS-500" → ✅ PS-500
"TS-200-A" → ✅ TS-200-A

// Medium Confidence  
"BAPI PS 500" → ✅ PS-500
"BAPI TS 200 A" → ✅ TS-200-A

// Low Confidence
"PS500" → ⚠️ PS-500 (review needed)
```

## 🎨 Using in Components

```tsx
import YouTubeEmbed from '@/components/shared/YouTubeEmbed';

<YouTubeEmbed
  videoId="dQw4w9WgXcQ"
  title="Product Installation"
  showDuration
  durationSeconds={150}
/>
```

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| API quota exceeded | Wait 24h or reduce --limit |
| Product not found | Verify SKU in WordPress |
| Connection failed | Check WordPress credentials |
| No SKU detected | Manually add to CSV |

## 📞 Support

Questions? See [docs/YOUTUBE-VIDEO-SETUP.md](../docs/YOUTUBE-VIDEO-SETUP.md)
