/**
 * YouTube Video Management System
 * 
 * Complete solution for syncing YouTube channel videos to WordPress products.
 * 
 * @module youtube
 * @see docs/YOUTUBE-VIDEO-SETUP.md
 */

// Core utilities
export * from './types';
export * from './client';
export * from './mapping';
export * from './wordpress-sync';

// Re-export commonly used functions
export { YouTubeClient, extractYouTubeId, formatDuration, parseDuration } from './client';
export { mapVideoToProduct, mapVideosToProducts, generateMappingCSV } from './mapping';
export { WordPressSyncClient, validateWordPressConnection } from './wordpress-sync';
