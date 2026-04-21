#!/usr/bin/env tsx
/**
 * YouTube Video Management CLI
 *
 * Commands:
 *   fetch  - Fetch videos from YouTube and generate mapping CSV
 *   sync   - Sync video mappings to WordPress ACF fields
 *   help   - Show usage information
 *
 * Examples:
 *   pnpm run youtube:fetch                     # Fetch all videos
 *   pnpm run youtube:fetch -- --limit=10       # Fetch first 10 videos
 *   pnpm run youtube:sync -- --file=videos.csv # Sync from custom CSV
 *   pnpm run youtube:sync -- --dry-run         # Test sync without changes
 */

import fs from 'fs';
import path from 'path';
import { YouTubeClient } from '../src/lib/youtube';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env') });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '@BAPIHVAC';

interface CLIOptions {
  command: 'fetch' | 'sync' | 'generate-json' | 'help';
  limit?: number;
  file?: string;
  dryRun?: boolean;
  batch?: number;
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const command = args[0] as CLIOptions['command'] || 'help';
  
  const options: CLIOptions = { command };
  
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      switch (key) {
        case 'limit':
          options.limit = parseInt(value, 10);
          break;
        case 'file':
          options.file = value;
          break;
        case 'dry-run':
          options.dryRun = true;
          break;
        case 'batch':
          options.batch = parseInt(value, 10);
          break;
      }
    }
  }
  
  return options;
}

function showHelp() {
  console.log(`
YouTube Video Management CLI
============================

COMMANDS:
  fetch         Fetch videos from YouTube and generate CSV mapping
  generate-json Generate JSON file from CSV for Next.js
  sync          Sync video mappings to WordPress ACF fields (NOT IMPLEMENTED)
  help          Show this help message

FETCH OPTIONS:
  --limit=N       Fetch only first N videos (default: all)

SYNC OPTIONS:
  --file=PATH     Path to CSV file (default: youtube-videos.csv)
  --dry-run       Show what would be synced without making changes
  --batch=N       Process N products per batch (default: 10)

EXAMPLES:
  # Fetch all videos from @BAPIHVAC
  pnpm run youtube:fetch

  # Fetch only 5 videos for testing
  pnpm run youtube:fetch -- --limit=5

  # Sync videos to WordPress (dry run first!)
  pnpm run youtube:sync -- --dry-run

  # Actual sync after reviewing CSV
  pnpm run youtube:sync

  # Generate JSON from CSV for Next.js
  pnpm run youtube:generate-json

ENVIRONMENT VARIABLES:
  YOUTUBE_API_KEY      YouTube Data API v3 key (required)
  YOUTUBE_CHANNEL_ID   Channel ID or handle (default: @BAPIHVAC)
  WORDPRESS_API_URL    WordPress REST API URL (required for sync)
  WORDPRESS_AUTH_TOKEN WordPress auth token (required for sync)

`);
}

async function fetchVideos(options: CLIOptions) {
  if (!YOUTUBE_API_KEY) {
    console.error('❌ Error: YOUTUBE_API_KEY not found in .env.local');
    console.error('   Get your API key from: https://console.cloud.google.com/apis/credentials');
    process.exit(1);
  }

  console.log('🎬 Fetching videos from YouTube...');
  console.log(`   Channel: ${YOUTUBE_CHANNEL_ID}`);
  if (options.limit) {
    console.log(`   Limit: ${options.limit} videos`);
  }
  console.log('');

  const client = new YouTubeClient(YOUTUBE_API_KEY);
  
  try {
    // Pass channel identifier as-is (supports @handles or usernames)
    const videos = await client.getChannelVideos({
      channelUsername: YOUTUBE_CHANNEL_ID,
      maxResults: options.limit
    });
    console.log(`✅ Fetched ${videos.length} videos`);
    console.log('');

    // Generate manual mapping CSV with all videos
    console.log('📝 Generating manual mapping CSV...');
    console.log('');

    // Use --output flag if provided, otherwise default to youtube-videos-manual.csv
    const csvPath = options.output 
      ? path.join(process.cwd(), options.output)
      : path.join(process.cwd(), 'youtube-videos-manual.csv');
    const csvHeader = 'Product SKU (FILL IN),Video ID,Video Title,Video URL,Published Date,Duration,Category (FILL IN),Notes\n';
    const csvRows = videos.map(v => {
      const url = `https://www.youtube.com/watch?v=${v.id}`;
      const publishedDate = new Date(v.publishedAt).toISOString().split('T')[0];
      // Escape quotes in title
      const safeTitle = v.title.replace(/"/g, '""');
      return `"","${v.id}","${safeTitle}","${url}","${publishedDate}","${v.duration}","",""`;
    }).join('\n');
    
    fs.writeFileSync(csvPath, csvHeader + csvRows, 'utf-8');
    
    console.log(`✅ Manual mapping CSV generated: ${csvPath}`);
    console.log(`   Total videos: ${videos.length}`);
    console.log('');
    console.log('📋 NEXT STEPS:');
    console.log('');
    console.log('1. Open the CSV file in Excel/Google Sheets');
    console.log('2. Fill in the "Product SKU (FILL IN)" column with matching product SKUs');
    console.log('   - Use SKUs from your WordPress products (e.g., BA/BIP-BLE-EZ)');
    console.log('   - Leave blank for videos that don\'t match a specific product');
    console.log('   - Multiple rows can have the same SKU (one product, many videos)');
    console.log('');
    console.log('3. Fill in "Category (FILL IN)" column:');
    console.log('   - Installation');
    console.log('   - Product Demo');
    console.log('   - Technical Training');
    console.log('   - Troubleshooting');
    console.log('   - Product Overview');
    console.log('   - Calibration');
    console.log('   - Maintenance');
    console.log('');
    console.log('4. Add any notes in the "Notes" column (optional)');
    console.log('');
    console.log('5. Save the CSV file');
    console.log('');
    console.log('6. Test sync (dry run):');
    console.log('   pnpm run youtube:sync -- --file=youtube-videos-manual.csv --dry-run');
    console.log('');
    console.log('7. Actual sync to WordPress:');
    console.log('   pnpm run youtube:sync -- --file=youtube-videos-manual.csv');
    console.log('');

  } catch (error) {
    console.error('❌ Error fetching videos:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  }
}

async function syncVideos(options: CLIOptions) {
  const csvPath = options.file || path.join(process.cwd(), 'youtube-videos-manual.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Error: CSV file not found: ${csvPath}`);
    console.error('   Run "pnpm run youtube:fetch" first to generate the CSV');
    process.exit(1);
  }

  console.log('🔄 Syncing videos to WordPress...');
  console.log(`   CSV file: ${csvPath}`);
  console.log(`   Dry run: ${options.dryRun ? 'Yes' : 'No'}`);
  console.log('');

  // Read CSV (new manual format)
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').slice(1); // Skip header
  
  interface VideoMapping {
    sku: string;
    videoId: string;
    title: string;
    url: string;
    publishedDate: string;
    duration: string;
    category: string;
    notes: string;
  }
  
  const mappings: VideoMapping[] = [];
  let skippedCount = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Parse CSV - handle both quoted and unquoted formats (Excel compatibility)
    let fields: string[];
    if (line.includes('"')) {
      // Quoted format (original)
      const matches = line.match(/"([^"]*)"/g);
      if (!matches || matches.length < 8) continue;
      fields = matches.map(m => m.slice(1, -1).replace(/""/g, '"'));
    } else {
      // Unquoted format (Excel saves this way)
      fields = line.split(',').map(f => f.trim());
      if (fields.length < 8) continue;
    }
    
    const [sku, videoId, title, url, publishedDate, duration, category, notes] = fields;
    
    // Skip rows without SKU (not mapped yet)
    if (!sku || sku.trim() === '') {
      skippedCount++;
      continue;
    }
    
    mappings.push({
      sku: sku.trim(),
      videoId,
      title,
      url,
      publishedDate,
      duration,
      category: category.trim(),
      notes
    });
  }

  console.log(`   📊 CSV Statistics:`);
  console.log(`      Total rows: ${lines.filter(l => l.trim()).length}`);
  console.log(`      Mapped videos: ${mappings.length}`);
  console.log(`      Unmapped (skipped): ${skippedCount}`);
  console.log('');

  if (mappings.length === 0) {
    console.log('⚠️  No mapped videos found in CSV!');
    console.log('');
    console.log('   Please fill in the "Product SKU (FILL IN)" column');
    console.log('   for the videos you want to sync to WordPress.');
    console.log('');
    return;
  }

  // Group by SKU
  const bySKU = new Map<string, VideoMapping[]>();
  for (const mapping of mappings) {
    if (!bySKU.has(mapping.sku)) {
      bySKU.set(mapping.sku, []);
    }
    bySKU.get(mapping.sku)!.push(mapping);
  }

  if (options.dryRun) {
    console.log('🔍 DRY RUN - No changes will be made');
    console.log('');
    console.log('SYNC PREVIEW:');
    console.log(`   Products to update: ${bySKU.size}`);
    console.log(`   Total videos to sync: ${mappings.length}`);
    console.log('');
    
    // Show all mappings
    for (const [sku, videos] of bySKU) {
      console.log(`📦 ${sku} (${videos.length} video${videos.length > 1 ? 's' : ''})`);
      for (const video of videos) {
        const categoryLabel = video.category || '(no category)';
        console.log(`   ▸ ${video.title}`);
        console.log(`     ${video.url}`);
        console.log(`     Category: ${categoryLabel} | Duration: ${video.duration}`);
        if (video.notes) {
          console.log(`     Notes: ${video.notes}`);
        }
      }
      console.log('');
    }
    
    console.log('✅ Dry run complete!');
    console.log('');
    console.log('To perform actual sync to WordPress, run:');
    console.log(`   pnpm run youtube:sync -- --file=${path.basename(csvPath)}`);
    console.log('');
    
  } else {
    console.error('❌ ERROR: WordPress sync not configured for automated execution');
    console.error('');
    console.error('📋 Current Implementation (Production):');
    console.error('   ✅ Manual CSV mapping → JSON generation → Product pages');
    console.error('   ✅ Videos load from edge JSON (fast, no database queries)');
    console.error('   ✅ This approach is production-ready and recommended');
    console.error('');
    console.error('📋 To sync to WordPress (Optional):');
    console.error('   The WordPress sync client is available in:');
    console.error('   src/lib/youtube/wordpress-sync.ts');
    console.error('');
    console.error('   Required environment variables:');
    console.error('   - WORDPRESS_API_URL=https://your-site.com');
    console.error('   - WORDPRESS_AUTH_TOKEN=\"Bearer your-jwt-token\"');
    console.error('   - OR WORDPRESS_AUTH_TOKEN=\"Basic $(echo -n user:pass | base64)\"');
    console.error('');
    console.error('💡 For May 4th launch, use JSON generation instead:');
    console.error('   pnpm run youtube:generate-json');
    console.error('');
    process.exit(1);
  }
}

async function generateJSON(options: CLIOptions) {
  const csvPath = options.file || path.join(process.cwd(), 'youtube-videos-manual.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Error: CSV file not found: ${csvPath}`);
    console.error('   Run "pnpm run youtube:fetch" first to generate the CSV');
    process.exit(1);
  }

  console.log('🔄 Generating JSON from CSV...');
  console.log(`   CSV file: ${csvPath}`);
  console.log('');

  // Read and parse CSV
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').slice(1); // Skip header
  
  interface ProductVideo {
    id: string;
    title: string;
    url: string;
    publishedAt: string;
    duration: string;
    category?: string;
  }
  
  // Map: Product SKU/ID -> Videos[]
  const productVideos = new Map<string, ProductVideo[]>();
  let mappedCount = 0;
  let skippedCount = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Parse CSV - handle both quoted and unquoted
    let fields: string[];
    if (line.includes('"')) {
      const matches = line.match(/"([^"]*)"/g);
      if (!matches || matches.length < 8) continue;
      fields = matches.map(m => m.slice(1, -1).replace(/""/g, '"'));
    } else {
      fields = line.split(',').map(f => f.trim());
      if (fields.length < 8) continue;
    }
    
    const [sku, videoId, title, url, publishedDate, duration, category] = fields;
    
    // Skip rows without SKU/ID
    if (!sku || sku.trim() === '') {
      skippedCount++;
      continue;
    }
    
    const productKey = sku.trim();
    
    if (!productVideos.has(productKey)) {
      productVideos.set(productKey, []);
    }
    
    productVideos.get(productKey)!.push({
      id: videoId,
      title,
      url,
      publishedAt: publishedDate,
      duration,
      category: category && category.trim() !== '' ? category.trim() : undefined
    });
    
    mappedCount++;
  }

  console.log(`   📊 Statistics:`);
  console.log(`      Total mapped videos: ${mappedCount}`);
  console.log(`      Unique products: ${productVideos.size}`);
  console.log(`      Skipped (no SKU): ${skippedCount}`);
  console.log('');

  // Convert Map to object for JSON
  const jsonData: Record<string, ProductVideo[]> = {};
  for (const [key, videos] of productVideos) {
    jsonData[key] = videos;
  }

  // Write JSON file
  const jsonPath = path.join(process.cwd(), 'src', 'data', 'product-videos.json');
  const jsonDir = path.dirname(jsonPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }
  
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
  
  console.log(`✅ JSON file generated: ${jsonPath}`);
  console.log('');
  console.log('📋 NEXT STEPS:');
  console.log('');
  console.log('1. Review the JSON file to verify mappings');
  console.log('2. Commit the file to git');
  console.log('3. Videos will automatically appear on product pages');
  console.log('4. To update videos in the future:');
  console.log('   - Edit the CSV file');
  console.log('   - Run: pnpm run youtube:generate-json');
  console.log('   - Commit and deploy');
  console.log('');
  
  // Show sample
  console.log('📦 Sample mappings:');
  let count = 0;
  for (const [productKey, videos] of productVideos) {
    if (count >= 3) break;
    console.log(`   ${productKey}: ${videos.length} video${videos.length > 1 ? 's' : ''}`);
    count++;
  }
  console.log('');
}

async function main() {
  const options = parseArgs();

  switch (options.command) {
    case 'fetch':
      await fetchVideos(options);
      break;
    case 'generate-json':
      await generateJSON(options);
      break;
    case 'sync':
      await syncVideos(options);
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
