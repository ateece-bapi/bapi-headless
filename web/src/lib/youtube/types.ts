/**
 * YouTube Video Management - Type Definitions
 * 
 * Provides type-safe interfaces for YouTube Data API integration,
 * video metadata, and WordPress product video mapping.
 * 
 * @module youtube/types
 */

/**
 * Raw YouTube video data from API v3
 * @see https://developers.google.com/youtube/v3/docs/videos
 */
export interface YouTubeVideoRaw {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelId: string;
    channelTitle: string;
    tags?: string[];
  };
  contentDetails?: {
    duration: string; // ISO 8601 format: PT2M30S
    dimension: string;
    definition: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

/**
 * Processed YouTube video metadata
 */
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  thumbnailUrlHD?: string;
  publishedAt: string;
  duration?: string; // ISO 8601: PT2M30S
  durationSeconds?: number;
  viewCount?: number;
  tags?: string[];
}

/**
 * Video categorization based on content type
 */
export type VideoCategory = 
  | 'Installation'
  | 'Product Demo'
  | 'Technical Training'
  | 'Troubleshooting'
  | 'Product Overview'
  | 'Calibration'
  | 'Maintenance'
  | 'Product Videos'; // Default fallback

/**
 * Extracted product SKU from video metadata
 */
export interface ProductSKUMatch {
  sku: string;
  confidence: 'high' | 'medium' | 'low';
  source: 'title' | 'description' | 'tags';
  matchedText: string;
}

/**
 * Video-to-product mapping for WordPress import
 */
export interface VideoProductMapping {
  video: YouTubeVideo;
  productSku?: string;
  category: VideoCategory;
  confidence: ProductSKUMatch['confidence'];
  notes?: string;
}

/**
 * WordPress ACF product_videos field structure
 */
export interface WordPressProductVideo {
  heading: string; // Category name
  videos: Array<{
    title: string;
    url: string;
    description?: string;
    thumbnail?: string;
    duration?: string;
    published_date?: string;
  }>;
}

/**
 * YouTube Data API configuration
 */
export interface YouTubeAPIConfig {
  apiKey: string;
  channelId?: string;
  channelUsername?: string;
  maxResults?: number;
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'viewCount';
}

/**
 * Configuration for fetching channel videos
 * (apiKey not required - already set in YouTubeClient constructor)
 */
export interface ChannelVideosConfig {
  channelId?: string;
  channelUsername?: string;
  maxResults?: number;
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'viewCount';
}

/**
 * Sync operation result
 */
export interface SyncResult {
  success: boolean;
  videosProcessed: number;
  productsUpdated: number;
  errors: Array<{
    video: string;
    error: string;
  }>;
  warnings: Array<{
    video: string;
    message: string;
  }>;
  unmappedVideos: YouTubeVideo[];
}

/**
 * CSV export row for manual mapping
 */
export interface VideoMappingCSVRow {
  video_id: string;
  video_title: string;
  video_url: string;
  suggested_sku: string;
  confidence: string;
  category: string;
  published_at: string;
  duration: string;
  view_count: string;
  notes: string;
}
