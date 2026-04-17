#!/usr/bin/env node
/**
 * YouTube Video Management CLI
 * 
 * Command-line tool for fetching, mapping, and syncing YouTube videos
 * to WordPress product pages.
 * 
 * Usage:
 *   npm run youtube:fetch              # Fetch all videos and generate CSV
 *   npm run youtube:fetch -- --limit=10  # Fetch only 10 videos
 *   npm run youtube:sync -- --file=videos.csv --dry-run  # Test sync
 *   npm run youtube:sync -- --file=videos.csv  # Actual sync
 * 
 * Environment Variables:
 *   YOUTUBE_API_KEY - YouTube Data API v3 key
 *   YOUTUBE_CHANNEL_ID - Channel ID (or use YOUTUBE_CHANNEL_USERNAME)
 *   YOUTUBE_CHANNEL_USERNAME - Channel username (e.g., "BAPIHVAC")
 *   WORDPRESS_API_URL - WordPress REST API base URL
 *   WORDPRESS_AUTH_TOKEN - WordPress authentication token
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { YouTubeClient } from '../src/lib/youtube/client';
import { mapVideosToProducts, generateMappingCSV, parseCSVToMappings } from '../src/lib/youtube/mapping';
import { WordPressSyncClient, validateWordPressConnection } from '../src/lib/youtube/wordpress-sync';
import type { YouTubeAPIConfig } from '../src/lib/youtube/types';

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

const flags: Record<string, string | boolean> = {};
args.slice(1).forEach((arg) => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    flags[key] = value || true;
  }
});

// Environment variables
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const YOUTUBE_CHANNEL_USERNAME = process.env.YOUTUBE_CHANNEL_USERNAME || 'BAPIHVAC';
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;
const WORDPRESS_AUTH_TOKEN = process.env.WORDPRESS_AUTH_TOKEN;

/**
 * Fetch videos from YouTube and generate mapping CSV
 */
async function fetchVideos() {
  console.log('🎬 Fetching videos from YouTube...\n');

  if (!YOUTUBE_API_KEY) {
    console.error('❌ Error: YOUTUBE_API_KEY environment variable is required');
    console.error('   Get your API key from: https://console.cloud.google.com/apis/credentials\n');
    process.exit(1);
  }

  const client = new YouTubeClient(YOUTUBE_API_KEY);

  const config: YouTubeAPIConfig = {
    channelId: YOUTUBE_CHANNEL_ID,
    channelUsername: YOUTUBE_CHANNEL_USERNAME,
    maxResults: flags.limit ? parseInt(flags.limit as string, 10) : 50,
    order: 'date',
  };

  try {
    // Fetch videos
    const videos = await client.getChannelVideos(config);

    console.log(`✅ Fetched ${videos.length} videos\n`);

    // Map videos to products
    console.log('🔍 Mapping videos to products...\n');
    const mappings = mapVideosToProducts(videos);

    // Generate CSV
    const csv = generateMappingCSV(mappings);

    // Save to file
    const outputPath = resolve(process.cwd(), flags.output as string || 'youtube-videos.csv');
    writeFileSync(outputPath, csv, 'utf-8');

    console.log(`📄 CSV generated: ${outputPath}\n`);

    // Summary
    const stats = {
      total: mappings.length,
      highConfidence: mappings.filter((m) => m.confidence === 'high').length,
      mediumConfidence: mappings.filter((m) => m.confidence === 'medium').length,
      lowConfidence: mappings.filter((m) => m.confidence === 'low').length,
      unmapped: mappings.filter((m) => !m.productSku).length,
    };

    console.log('📊 Mapping Summary:');
    console.log(`   Total videos: ${stats.total}`);
    console.log(`   High confidence: ${stats.highConfidence}`);
    console.log(`   Medium confidence: ${stats.mediumConfidence}`);
    console.log(`   Low confidence: ${stats.lowConfidence}`);
    console.log(`   Unmapped: ${stats.unmapped}\n`);

    console.log('📝 Next steps:');
    console.log(`   1. Review the CSV file: ${outputPath}`);
    console.log('   2. Manually verify/correct SKU mappings');
    console.log('   3. Run sync: npm run youtube:sync -- --file=' + outputPath + '\n');

  } catch (error) {
    console.error('❌ Error fetching videos:', error);
    process.exit(1);
  }
}

/**
 * Sync videos to WordPress from CSV
 */
async function syncVideos() {
  console.log('🔄 Syncing videos to WordPress...\n');

  const csvPath = flags.file as string;

  if (!csvPath) {
    console.error('❌ Error: --file parameter is required');
    console.error('   Example: npm run youtube:sync -- --file=youtube-videos.csv\n');
    process.exit(1);
  }

  if (!existsSync(csvPath)) {
    console.error(`❌ Error: File not found: ${csvPath}\n`);
    process.exit(1);
  }

  if (!WORDPRESS_API_URL || !WORDPRESS_AUTH_TOKEN) {
    console.error('❌ Error: WordPress credentials required');
    console.error('   Set WORDPRESS_API_URL and WORDPRESS_AUTH_TOKEN environment variables\n');
    process.exit(1);
  }

  try {
    // Read CSV
    console.log(`📄 Reading CSV: ${csvPath}\n`);
    const csv = readFileSync(csvPath, 'utf-8');
    const mappings = parseCSVToMappings(csv);

    console.log(`   Found ${mappings.length} video mappings\n`);

    // Initialize WordPress client
    const wpClient = new WordPressSyncClient(WORDPRESS_API_URL, WORDPRESS_AUTH_TOKEN);

    // Validate connection
    console.log('🔌 Validating WordPress connection...');
    const isValid = await validateWordPressConnection(wpClient);

    if (!isValid) {
      console.error('❌ WordPress connection failed\n');
      process.exit(1);
    }

    console.log('✅ WordPress connection validated\n');

    // Sync
    const dryRun = flags['dry-run'] === true;

    if (dryRun) {
      console.log('🧪 DRY RUN MODE - No changes will be made\n');
    }

    console.log('⚡ Starting sync...\n');

    const result = await wpClient.syncMappings(mappings, {
      dryRun,
      skipExisting: !flags['overwrite'],
      batchSize: flags.batch ? parseInt(flags.batch as string, 10) : 10,
    });

    // Results
    console.log('\n✅ Sync complete!\n');
    console.log('📊 Results:');
    console.log(`   Videos processed: ${result.videosProcessed}`);
    console.log(`   Products updated: ${result.productsUpdated}`);
    console.log(`   Errors: ${result.errors.length}`);
    console.log(`   Warnings: ${result.warnings.length}`);
    console.log(`   Unmapped videos: ${result.unmappedVideos.length}\n`);

    if (result.errors.length > 0) {
      console.log('⚠️  Errors:');
      result.errors.forEach((err) => {
        console.log(`   - ${err.video}: ${err.error}`);
      });
      console.log();
    }

    if (result.warnings.length > 0 && !dryRun) {
      console.log('⚠️  Warnings:');
      result.warnings.slice(0, 10).forEach((warn) => {
        console.log(`   - ${warn.video}: ${warn.message}`);
      });
      if (result.warnings.length > 10) {
        console.log(`   ... and ${result.warnings.length - 10} more\n`);
      }
      console.log();
    }

    if (result.unmappedVideos.length > 0) {
      console.log('📝 Unmapped videos (no SKU found):');
      result.unmappedVideos.slice(0, 5).forEach((video) => {
        console.log(`   - ${video.title}`);
      });
      if (result.unmappedVideos.length > 5) {
        console.log(`   ... and ${result.unmappedVideos.length - 5} more\n`);
      }
    }

    if (dryRun) {
      console.log('💡 Run without --dry-run to actually sync videos\n');
    } else {
      console.log('🎉 Videos synced successfully!\n');
    }

  } catch (error) {
    console.error('❌ Sync error:', error);
    process.exit(1);
  }
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
YouTube Video Management CLI
============================

Commands:
  fetch    Fetch videos from YouTube and generate mapping CSV
  sync     Sync videos to WordPress from CSV file
  help     Show this help message

Fetch Options:
  --limit=N       Limit number of videos to fetch (default: 50)
  --output=FILE   Output CSV file path (default: youtube-videos.csv)

Sync Options:
  --file=FILE     Input CSV file path (required)
  --dry-run       Test mode - don't actually update WordPress
  --overwrite     Replace existing videos (default: skip existing)
  --batch=N       Batch size for API requests (default: 10)

Environment Variables:
  YOUTUBE_API_KEY            YouTube Data API v3 key (required for fetch)
  YOUTUBE_CHANNEL_ID         YouTube channel ID
  YOUTUBE_CHANNEL_USERNAME   YouTube channel username (default: BAPIHVAC)
  WORDPRESS_API_URL          WordPress REST API base URL (required for sync)
  WORDPRESS_AUTH_TOKEN       WordPress auth token (required for sync)

Examples:
  # Fetch all videos and generate CSV
  npm run youtube:fetch

  # Fetch only 10 videos
  npm run youtube:fetch -- --limit=10

  # Test sync (dry run)
  npm run youtube:sync -- --file=youtube-videos.csv --dry-run

  # Actual sync
  npm run youtube:sync -- --file=youtube-videos.csv

For more info, see: docs/YOUTUBE-VIDEO-SETUP.md
`);
}

// Main
async function main() {
  switch (command) {
    case 'fetch':
      await fetchVideos();
      break;
    case 'sync':
      await syncVideos();
      break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      showHelp();
      break;
    default:
      console.error(`❌ Unknown command: ${command}\n`);
      showHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
