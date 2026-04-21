/**
 * Video Schema.org Structured Data
 * 
 * Generates VideoObject schema for YouTube videos on product pages.
 * Improves SEO with rich snippets in Google search results.
 * 
 * @module lib/schema/video
 * @see https://schema.org/VideoObject
 * @see https://developers.google.com/search/docs/appearance/structured-data/video
 */

import type { WithContext, VideoObject } from 'schema-dts';

/**
 * Video schema input data
 */
export interface VideoSchemaInput {
  title: string;
  description?: string;
  url: string; // YouTube watch URL
  embedUrl?: string; // YouTube embed URL
  thumbnailUrl?: string;
  duration?: string; // ISO 8601 format: PT2M30S
  uploadDate?: string; // ISO 8601 date
  viewCount?: number;
  productName?: string; // Related product for context
}

/**
 * Generate VideoObject schema for a YouTube video
 * 
 * Creates schema.org markup that helps Google display video rich results
 * in search, including thumbnail, duration, and upload date.
 * 
 * @param video - Video metadata
 * @param siteUrl - Base site URL for organization reference
 * @returns JSON-LD VideoObject schema
 * 
 * @example
 * ```tsx
 * const schema = generateVideoSchema({
 *   title: 'PS-500 Installation Guide',
 *   description: 'Step-by-step installation of the BAPI PS-500 pressure sensor',
 *   url: 'https://youtube.com/watch?v=abc123',
 *   embedUrl: 'https://youtube-nocookie.com/embed/abc123',
 *   duration: 'PT5M30S',
 *   uploadDate: '2024-03-15',
 *   productName: 'PS-500 Pressure Sensor',
 * });
 * 
 * <script type="application/ld+json">
 *   {JSON.stringify(schema)}
 * </script>
 * ```
 */
export function generateVideoSchema(
  video: VideoSchemaInput,
  siteUrl: string = 'https://bapi.com'
): WithContext<VideoObject> {
  const videoId = extractYouTubeId(video.url);
  
  const schema: WithContext<VideoObject> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || video.title,
    
    // URLs
    contentUrl: video.url,
    embedUrl: video.embedUrl || (videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : video.url),
    
    // Thumbnail (required by Google)
    thumbnailUrl: video.thumbnailUrl || (videoId ? [
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    ] : undefined),
    
    // Duration (ISO 8601: PT#M#S)
    duration: video.duration,
    
    // Upload date (ISO 8601)
    uploadDate: video.uploadDate || new Date().toISOString(),
    
    // Publisher (BAPI)
    publisher: {
      '@type': 'Organization',
      name: 'Building Automation Products Inc.',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
        width: '600',
        height: '60',
      },
    },
    
    // Interaction statistics (optional)
    ...(video.viewCount && {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'WatchAction' },
        userInteractionCount: video.viewCount,
      },
    }),
  };

  return schema;
}

/**
 * Generate aggregated video list schema for product pages with multiple videos
 * 
 * @param videos - Array of video inputs
 * @param productName - Product name for context
 * @param siteUrl - Base site URL
 * @returns Array of VideoObject schemas
 */
export function generateMultipleVideoSchemas(
  videos: VideoSchemaInput[],
  productName: string,
  siteUrl: string = 'https://bapi.com'
): WithContext<VideoObject>[] {
  return videos.map((video) =>
    generateVideoSchema(
      {
        ...video,
        description: video.description || `${productName} - ${video.title}`,
        productName,
      },
      siteUrl
    )
  );
}

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Convert seconds to ISO 8601 duration format
 * 
 * @param seconds - Duration in seconds
 * @returns ISO 8601 duration (e.g., 'PT2M30S')
 * 
 * @example
 * formatDurationISO8601(150) // Returns: 'PT2M30S'
 * formatDurationISO8601(3661) // Returns: 'PT1H1M1S'
 */
export function formatDurationISO8601(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let duration = 'PT';
  
  if (hours > 0) duration += `${hours}H`;
  if (minutes > 0) duration += `${minutes}M`;
  if (secs > 0 || duration === 'PT') duration += `${secs}S`;
  
  return duration;
}

/**
 * Parse ISO 8601 duration to seconds
 * 
 * @param duration - ISO 8601 duration string
 * @returns Duration in seconds
 * 
 * @example
 * parseDurationISO8601('PT2M30S') // Returns: 150
 * parseDurationISO8601('PT1H1M1S') // Returns: 3661
 */
export function parseDurationISO8601(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}
