/**
 * WordPress Product Video Sync
 * 
 * Synchronizes YouTube videos to WordPress product ACF fields.
 * Handles bulk updates, validation, and error recovery.
 * 
 * Usage:
 *   node scripts/sync-youtube-videos.js --mode=auto
 *   node scripts/sync-youtube-videos.js --mode=csv --file=videos.csv
 * 
 * @module youtube/wordpress-sync
 */

import logger from '@/lib/logger';
import type {
  YouTubeVideo,
  VideoProductMapping,
  WordPressProductVideo,
  SyncResult,
} from './types';

/**
 * WordPress REST API client for video sync
 */
export class WordPressSyncClient {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    if (!baseUrl || !authToken) {
      throw new Error('WordPress URL and auth token are required');
    }
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.authToken = authToken;
  }

  /**
   * Find product by SKU
   */
  async findProductBySKU(sku: string): Promise<any | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/wp-json/wc/v3/products?sku=${encodeURIComponent(sku)}`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
      }

      const products = await response.json();

      if (products.length === 0) {
        logger.warn('[WordPressSync] Product not found', { sku });
        return null;
      }

      if (products.length > 1) {
        logger.warn('[WordPressSync] Multiple products found for SKU', {
          sku,
          count: products.length,
        });
      }

      return products[0];
    } catch (error) {
      logger.error('[WordPressSync] Error finding product', { sku, error });
      throw error;
    }
  }

  /**
   * Get existing product videos from ACF
   */
  async getProductVideos(productId: number): Promise<WordPressProductVideo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/wp-json/acf/v3/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        // ACF field might not exist yet
        if (response.status === 404) {
          return [];
        }
        throw new Error(`ACF API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.acf?.product_videos || [];
    } catch (error) {
      logger.error('[WordPressSync] Error fetching product videos', { productId, error });
      return [];
    }
  }

  /**
   * Update product videos ACF field
   */
  async updateProductVideos(
    productId: number,
    videos: WordPressProductVideo[]
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/wp-json/acf/v3/products/${productId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            product_videos: videos,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `ACF update error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      logger.info('[WordPressSync] Product videos updated', {
        productId,
        videoCount: videos.reduce((sum, cat) => sum + cat.videos.length, 0),
      });

      return true;
    } catch (error) {
      logger.error('[WordPressSync] Error updating product videos', { productId, error });
      throw error;
    }
  }

  /**
   * Add video to product (appends to existing videos)
   */
  async addVideoToProduct(productId: number, video: YouTubeVideo, category: string): Promise<boolean> {
    try {
      const existingVideos = await this.getProductVideos(productId);

      // Check if video already exists
      const videoExists = existingVideos.some((cat) =>
        cat.videos.some((v) => v.url === video.url)
      );

      if (videoExists) {
        logger.info('[WordPressSync] Video already exists, skipping', {
          productId,
          videoId: video.id,
        });
        return false;
      }

      // Find or create category
      let categoryGroup = existingVideos.find((cat) => cat.heading === category);

      if (!categoryGroup) {
        categoryGroup = {
          heading: category,
          videos: [],
        };
        existingVideos.push(categoryGroup);
      }

      // Add video to category
      categoryGroup.videos.push({
        title: video.title,
        url: video.url,
        description: video.description,
        thumbnail: video.thumbnailUrl,
        duration: video.duration,
        published_date: video.publishedAt,
      });

      // Update ACF field
      await this.updateProductVideos(productId, existingVideos);

      logger.info('[WordPressSync] Video added to product', {
        productId,
        videoId: video.id,
        category,
      });

      return true;
    } catch (error) {
      logger.error('[WordPressSync] Error adding video to product', {
        productId,
        videoId: video.id,
        error,
      });
      throw error;
    }
  }

  /**
   * Sync mapped videos to WordPress products
   */
  async syncMappings(
    mappings: VideoProductMapping[],
    options: {
      dryRun?: boolean;
      skipExisting?: boolean;
      batchSize?: number;
    } = {}
  ): Promise<SyncResult> {
    const { dryRun = false, skipExisting = true, batchSize = 10 } = options;

    const result: SyncResult = {
      success: true,
      videosProcessed: 0,
      productsUpdated: 0,
      errors: [],
      warnings: [],
      unmappedVideos: [],
    };

    logger.info('[WordPressSync] Starting sync', {
      totalMappings: mappings.length,
      dryRun,
      skipExisting,
      batchSize,
    });

    // Filter out unmapped videos
    const mappedVideos = mappings.filter((m) => m.productSku);
    result.unmappedVideos = mappings.filter((m) => !m.productSku).map((m) => m.video);

    // Process in batches to avoid overwhelming the API
    for (let i = 0; i < mappedVideos.length; i += batchSize) {
      const batch = mappedVideos.slice(i, i + batchSize);

      logger.info('[WordPressSync] Processing batch', {
        batchNumber: Math.floor(i / batchSize) + 1,
        totalBatches: Math.ceil(mappedVideos.length / batchSize),
      });

      for (const mapping of batch) {
        try {
          result.videosProcessed++;

          // Find product
          const product = await this.findProductBySKU(mapping.productSku!);

          if (!product) {
            result.warnings.push({
              video: mapping.video.title,
              message: `Product not found for SKU: ${mapping.productSku}`,
            });
            continue;
          }

          // Check confidence level
          if (mapping.confidence === 'low') {
            result.warnings.push({
              video: mapping.video.title,
              message: `Low confidence mapping (${mapping.confidence}) - manual review recommended`,
            });
          }

          // Dry run mode
          if (dryRun) {
            logger.info('[WordPressSync] DRY RUN - Would add video', {
              sku: mapping.productSku,
              productId: product.id,
              video: mapping.video.title,
              category: mapping.category,
            });
            continue;
          }

          // Add video to product
          const added = await this.addVideoToProduct(
            product.id,
            mapping.video,
            mapping.category
          );

          if (added) {
            result.productsUpdated++;
          }

          // Rate limiting: wait 200ms between requests
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
          logger.error('[WordPressSync] Error processing mapping', {
            video: mapping.video.title,
            error,
          });

          result.errors.push({
            video: mapping.video.title,
            error: error instanceof Error ? error.message : String(error),
          });

          result.success = false;
        }
      }
    }

    logger.info('[WordPressSync] Sync complete', {
      videosProcessed: result.videosProcessed,
      productsUpdated: result.productsUpdated,
      errors: result.errors.length,
      warnings: result.warnings.length,
      unmappedVideos: result.unmappedVideos.length,
    });

    return result;
  }

  /**
   * Remove video from product
   */
  async removeVideoFromProduct(productId: number, videoUrl: string): Promise<boolean> {
    try {
      const existingVideos = await this.getProductVideos(productId);

      let removed = false;

      // Remove video from all categories
      for (const category of existingVideos) {
        const index = category.videos.findIndex((v) => v.url === videoUrl);
        if (index !== -1) {
          category.videos.splice(index, 1);
          removed = true;
        }
      }

      if (!removed) {
        logger.warn('[WordPressSync] Video not found in product', { productId, videoUrl });
        return false;
      }

      // Clean up empty categories
      const cleanedVideos = existingVideos.filter((cat) => cat.videos.length > 0);

      // Update ACF field
      await this.updateProductVideos(productId, cleanedVideos);

      logger.info('[WordPressSync] Video removed from product', { productId, videoUrl });

      return true;
    } catch (error) {
      logger.error('[WordPressSync] Error removing video', { productId, videoUrl, error });
      throw error;
    }
  }

  /**
   * Clear all videos from product
   */
  async clearProductVideos(productId: number): Promise<boolean> {
    try {
      await this.updateProductVideos(productId, []);
      logger.info('[WordPressSync] All videos cleared from product', { productId });
      return true;
    } catch (error) {
      logger.error('[WordPressSync] Error clearing videos', { productId, error });
      throw error;
    }
  }
}

/**
 * Validate WordPress connection and permissions
 */
export async function validateWordPressConnection(
  client: WordPressSyncClient
): Promise<boolean> {
  try {
    // Test by searching for a common SKU
    const testResult = await client.findProductBySKU('TEST-SKU-DOES-NOT-EXIST');

    // If we get here without error, connection is valid
    logger.info('[WordPressSync] Connection validated');
    return true;
  } catch (error) {
    logger.error('[WordPressSync] Connection validation failed', { error });
    return false;
  }
}
