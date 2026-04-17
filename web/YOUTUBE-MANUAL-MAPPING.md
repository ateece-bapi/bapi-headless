# YouTube Video Manual Mapping Guide

## Quick Start

### 1. Fetch All Videos from YouTube

```bash
pnpm run youtube:fetch
```

This generates **`youtube-videos-manual.csv`** with all 124 videos from @BAPIHVAC.

---

### 2. Fill Out the CSV

Open `youtube-videos-manual.csv` in Excel or Google Sheets:

#### Column A: Product SKU (FILL IN)
- Enter the WordPress product SKU (e.g., `BA/BIP-BLE-EZ`)
- Use exact SKU from your WordPress products
- Leave blank if video doesn't match a product
- **Multiple rows can have the same SKU** (many videos per product)

#### Column G: Category (FILL IN)
Choose from:
- Installation
- Product Demo
- Technical Training
- Troubleshooting
- Product Overview
- Calibration
- Maintenance

#### Column H: Notes
Optional internal notes for your team.

---

### 3. Test the Mapping (Dry Run)

```bash
pnpm run youtube:sync -- --dry-run
```

This shows exactly what will be synced **without making changes**.

**Sample Output:**
```
📦 BA/BIP-BLE-EZ (2 videos)
   ▸ Digital Output Module Setup
     https://www.youtube.com/watch?v=...
     Category: Installation | Duration: 2:30

📦 BA/DOM-BLE-EZ (1 video)
   ▸ Wireless Output Demo
     https://www.youtube.com/watch?v=...
     Category: Product Demo | Duration: 1:45
```

---

### 4. Sync to WordPress

```bash
pnpm run youtube:sync
```

⚠️ **Note:** WordPress sync API not yet implemented. For May 4th launch:
- Use the CSV to manually add videos in WordPress admin
- OR request WordPress sync implementation

---

## Example CSV Entry

```csv
Product SKU (FILL IN),Video ID,Video Title,Video URL,Published Date,Duration,Category (FILL IN),Notes
"BA/BIP-BLE-EZ","xmEC7_yvN0A","3324VC Voltage Converter","https://www.youtube.com/watch?v=xmEC7_yvN0A","2024-09-19","PT44S","Product Demo","Show on product page"
"","mSMI_VoPkNU","Backplanes for ETA","https://www.youtube.com/watch?v=mSMI_VoPkNU","2024-09-23","PT57S","","General video - not product-specific"
```

---

## Tips

### Finding Product SKUs
```bash
# Search WordPress products
curl "https://bapiheadlessstaging.kinsta.cloud/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ products(first: 100) { nodes { sku name } } }"}'
```

### Common SKU Patterns
- `BA/BIP-BLE-EZ` - Wireless modules
- `BA/11K-2-AP` - Temperature sensors
- `BA/T1K[-40 TO 140F]-O-BB2` - Range-specific sensors
- `17M50` - Simple numeric codes

### Video Categories
- **Installation**: "install", "mounting", "wiring", "setup"
- **Product Demo**: "demo", "overview", "features", "introduction"
- **Technical Training**: "training", "calibration", "configuration"
- **Troubleshooting**: "repair", "fix", "problem", "diagnostic"

---

## Re-fetching Videos

To get latest videos from YouTube:

```bash
# Fetch all videos (recommended)
pnpm run youtube:fetch

# Fetch limited set for testing
pnpm run youtube:fetch -- --limit=10
```

This overwrites `youtube-videos-manual.csv`, so **save your work first!**

---

## Questions?

- YouTube API key location: `web/.env` (`YOUTUBE_API_KEY`)
- Channel configured: `@BAPIHVAC` (124 videos as of April 17, 2026)
- CLI source: `web/scripts/youtube-cli.ts`
- Help command: `pnpm run youtube:help`
