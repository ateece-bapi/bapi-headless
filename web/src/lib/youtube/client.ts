/**
 * YouTube Data API Client
 * 
 * Provides type-safe access to YouTube Data API v3 for fetching
 * channel videos, playlists, and video metadata.
 * 
 * Rate Limits:
 * - 10,000 quota units per day (free tier)
 * - Search costs 100 units, Videos.list costs 1 unit
 * 
 * @module youtube/client
 */

import logger from '@/lib/logger';
import type { YouTubeAPIConfig, YouTubeVideo, YouTubeVideoRaw } from './types';

/**
 * Parse ISO 8601 duration to seconds
 * @example parseDuration('PT2M30S') => 150
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format duration in human-readable format
 * @example formatDuration(150) => '2:30'
 */
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * YouTube Data API Client
 */
export class YouTubeClient {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('YouTube API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Get channel ID from username or handle
   * Supports both legacy usernames and new @handles
   */
  async getChannelId(usernameOrHandle: string): Promise<string> {
    try {
      // Determine if it's a handle (starts with @) or legacy username
      const isHandle = usernameOrHandle.startsWith('@');
      const identifier = isHandle ? usernameOrHandle.slice(1) : usernameOrHandle;
      const param = isHandle ? 'forHandle' : 'forUsername';
      
      const response = await fetch(
        `${this.baseUrl}/channels?part=id&${param}=${encodeURIComponent(identifier)}&key=${this.apiKey}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `YouTube API error: ${response.status} ${response.statusText}. ` +
          `Details: ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error(`Channel not found: ${usernameOrHandle}`);
      }

      const channelId = data.items[0].id;
      logger.info('[YouTubeClient] Channel ID found', { 
        identifier: usernameOrHandle,
        type: isHandle ? 'handle' : 'username',
        channelId 
      });

      return channelId;
    } catch (error) {
      logger.error('[YouTubeClient] Failed to get channel ID', { 
        identifier: usernameOrHandle,
        error 
      });
      throw error;
    }
  }

  /**
   * Fetch all videos from a channel (handles pagination)
   */
  async getChannelVideos(config: YouTubeAPIConfig): Promise<YouTubeVideo[]> {
    const videos: YouTubeVideo[] = [];
    let channelId = config.channelId;

    // Get channel ID from username if not provided
    if (!channelId && config.channelUsername) {
      channelId = await this.getChannelId(config.channelUsername);
    }

    if (!channelId) {
      throw new Error('Either channelId or channelUsername must be provided');
    }

    let pageToken: string | undefined;
    let pageCount = 0;
    const maxPages = 10; // Safety limit (50 results per page = 500 videos max)

    logger.info('[YouTubeClient] Fetching channel videos', {
      channelId,
      maxResults: config.maxResults || 50,
    });

    do {
      try {
        // Step 1: Search for video IDs
        const searchParams = new URLSearchParams({
          key: this.apiKey,
          channelId,
          part: 'id',
          type: 'video',
          order: config.order || 'date',
          maxResults: String(config.maxResults || 50),
        });

        if (pageToken) {
          searchParams.append('pageToken', pageToken);
        }

        const searchResponse = await fetch(`${this.baseUrl}/search?${searchParams}`);

        if (!searchResponse.ok) {
          throw new Error(`Search API error: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) {
          logger.info('[YouTubeClient] No more videos found');
          break;
        }

        // Step 2: Get full video details (including duration, stats)
        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

        const videosResponse = await fetch(
          `${this.baseUrl}/videos?key=${this.apiKey}&id=${videoIds}&part=snippet,contentDetails,statistics`
        );

        if (!videosResponse.ok) {
          throw new Error(`Videos API error: ${videosResponse.status}`);
        }

        const videosData = await videosResponse.json();

        // Process videos
        for (const item of videosData.items as YouTubeVideoRaw[]) {
          const durationSeconds = item.contentDetails?.duration
            ? parseDuration(item.contentDetails.duration)
            : undefined;

          videos.push({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            url: `https://www.youtube.com/watch?v=${item.id}`,
            embedUrl: `https://www.youtube-nocookie.com/embed/${item.id}`,
            thumbnailUrl: item.snippet.thumbnails.high.url,
            thumbnailUrlHD: item.snippet.thumbnails.maxres?.url,
            publishedAt: item.snippet.publishedAt,
            duration: item.contentDetails?.duration,
            durationSeconds,
            viewCount: item.statistics?.viewCount
              ? parseInt(item.statistics.viewCount, 10)
              : undefined,
            tags: item.snippet.tags,
          });
        }

        pageToken = searchData.nextPageToken;
        pageCount++;

        logger.info('[YouTubeClient] Page fetched', {
          page: pageCount,
          videosThisPage: searchData.items.length,
          totalSoFar: videos.length,
        });

        // Safety check
        if (pageCount >= maxPages) {
          logger.warn('[YouTubeClient] Max pages reached', { maxPages });
          break;
        }

        // Rate limiting: wait 100ms between requests
        if (pageToken) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        logger.error('[YouTubeClient] Error fetching page', { pageCount, error });
        throw error;
      }
    } while (pageToken);

    logger.info('[YouTubeClient] All videos fetched', {
      totalVideos: videos.length,
      pages: pageCount,
    });

    return videos;
  }

  /**
   * Get videos from a specific playlist
   */
  async getPlaylistVideos(playlistId: string, maxResults = 50): Promise<YouTubeVideo[]> {
    const videos: YouTubeVideo[] = [];
    let pageToken: string | undefined;

    logger.info('[YouTubeClient] Fetching playlist videos', { playlistId, maxResults });

    do {
      const params = new URLSearchParams({
        key: this.apiKey,
        playlistId,
        part: 'snippet',
        maxResults: String(maxResults),
      });

      if (pageToken) {
        params.append('pageToken', pageToken);
      }

      const response = await fetch(`${this.baseUrl}/playlistItems?${params}`);

      if (!response.ok) {
        throw new Error(`Playlist API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        break;
      }

      for (const item of data.items) {
        const videoId = item.snippet.resourceId.videoId;
        videos.push({
          id: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          thumbnailUrlHD: item.snippet.thumbnails.maxres?.url,
          publishedAt: item.snippet.publishedAt,
        });
      }

      pageToken = data.nextPageToken;

      if (pageToken) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } while (pageToken);

    logger.info('[YouTubeClient] Playlist videos fetched', {
      playlistId,
      totalVideos: videos.length,
    });

    return videos;
  }

  /**
   * Get detailed info for specific video IDs
   */
  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    if (videoIds.length === 0) return [];

    // API supports max 50 IDs per request
    const chunks = [];
    for (let i = 0; i < videoIds.length; i += 50) {
      chunks.push(videoIds.slice(i, i + 50));
    }

    const allVideos: YouTubeVideo[] = [];

    for (const chunk of chunks) {
      const response = await fetch(
        `${this.baseUrl}/videos?key=${this.apiKey}&id=${chunk.join(',')}&part=snippet,contentDetails,statistics`
      );

      if (!response.ok) {
        throw new Error(`Videos API error: ${response.status}`);
      }

      const data = await response.json();

      for (const item of data.items as YouTubeVideoRaw[]) {
        const durationSeconds = item.contentDetails?.duration
          ? parseDuration(item.contentDetails.duration)
          : undefined;

        allVideos.push({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          url: `https://www.youtube.com/watch?v=${item.id}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${item.id}`,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          thumbnailUrlHD: item.snippet.thumbnails.maxres?.url,
          publishedAt: item.snippet.publishedAt,
          duration: item.contentDetails?.duration,
          durationSeconds,
          viewCount: item.statistics?.viewCount
            ? parseInt(item.statistics.viewCount, 10)
            : undefined,
          tags: item.snippet.tags,
        });
      }

      // Rate limiting
      if (chunks.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return allVideos;
  }
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/watch\?.+&v=)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      const videoId = match[1];
      // Validate: YouTube IDs are 11 characters, alphanumeric + _ -
      if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
  }

  logger.warn('[YouTubeClient] Invalid video URL', { url });
  return null;
}

/**
 * Format duration for display
 */
export { formatDuration, parseDuration };
