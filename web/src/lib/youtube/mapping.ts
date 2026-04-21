/**
 * Product SKU Extraction and Video Categorization
 * 
 * Uses pattern matching and ML-inspired heuristics to automatically
 * map YouTube videos to BAPI product SKUs and categorize by content type.
 * 
 * @module youtube/mapping
 */

import logger from '@/lib/logger';
import type {
  YouTubeVideo,
  VideoCategory,
  ProductSKUMatch,
  VideoProductMapping,
} from './types';

/**
 * BAPI Product SKU Patterns
 * 
 * Based on actual product SKUs in database:
 * - Temperature: TS-xxx, TA-xxx, TI-xxx, TR-xxx, TO-xxx
 * - Pressure: PS-xxx, PI-xxx
 * - Humidity: HU-xxx, HI-xxx, HA-xxx
 * - CO2: CO2-xxx
 * - Air Quality: AQ-xxx
 * - Wireless: ZW-xxx, BA-xxx
 */
const SKU_PATTERNS = [
  // Standard format: XX-XXX or XXX-XXX with optional suffix
  {
    pattern: /\b([A-Z]{2,3}-\d{3,4}(?:-[A-Z0-9]+)?)\b/g,
    confidence: 'high' as const,
  },
  // Spaced format: BAPI PS 500 → PS-500
  {
    pattern: /\bBAPI\s+([A-Z]{2,3})\s*(\d{3,4})(?:\s*([A-Z0-9]+))?\b/gi,
    confidence: 'medium' as const,
    transform: (match: RegExpMatchArray) => {
      const prefix = match[1].toUpperCase();
      const number = match[2];
      const suffix = match[3] ? `-${match[3].toUpperCase()}` : '';
      return `${prefix}-${number}${suffix}`;
    },
  },
  // Concatenated: PS500 → PS-500
  {
    pattern: /\b([A-Z]{2,3})(\d{3,4})\b/g,
    confidence: 'low' as const,
    transform: (match: RegExpMatchArray) => {
      return `${match[1]}-${match[2]}`;
    },
  },
];

/**
 * Video category detection patterns
 */
const CATEGORY_PATTERNS: Record<VideoCategory, RegExp> = {
  Installation: /\b(install|installation|mounting|mount|setup|wiring|connect|connection)\b/i,
  'Product Demo': /\b(demo|demonstration|overview|features|introduction|intro|review)\b/i,
  'Technical Training': /\b(training|calibration|configuration|programming|setup|advanced)\b/i,
  Troubleshooting: /\b(troubleshoot|repair|fix|problem|issue|error|fault|diagnostic)\b/i,
  'Product Overview': /\b(product overview|introduction to|getting started|what is)\b/i,
  Calibration: /\b(calibrat|accuracy|adjustment|tuning)\b/i,
  Maintenance: /\b(maintenance|cleaning|service|upkeep|care)\b/i,
  'Product Videos': /.*/, // Default fallback
};

/**
 * Extract all potential SKUs from text with confidence scoring
 */
export function extractProductSKUs(text: string): ProductSKUMatch[] {
  const matches: ProductSKUMatch[] = [];
  const seen = new Set<string>();

  for (const { pattern, confidence, transform } of SKU_PATTERNS) {
    const regex = new RegExp(pattern);
    let match: RegExpMatchArray | null;

    // Reset lastIndex for global patterns
    if (pattern.global) {
      pattern.lastIndex = 0;
    }

    while ((match = regex.exec(text)) !== null) {
      let sku = transform ? transform(match) : match[1];
      sku = sku.toUpperCase();

      // Validate SKU format
      if (!isValidBAPISKU(sku)) {
        continue;
      }

      // Deduplicate
      if (seen.has(sku)) {
        continue;
      }
      seen.add(sku);

      matches.push({
        sku,
        confidence,
        source: 'title',
        matchedText: match[0],
      });
    }
  }

  return matches;
}

/**
 * Validate if SKU matches BAPI product naming conventions
 */
function isValidBAPISKU(sku: string): boolean {
  // Must start with valid BAPI product prefix
  const validPrefixes = [
    'TS', 'TA', 'TI', 'TR', 'TO', 'TB', // Temperature
    'PS', 'PI', 'PA', // Pressure
    'HU', 'HI', 'HA', // Humidity
    'CO2', 'AQ', // Air Quality
    'ZW', 'BA', // Wireless
    'DC', // Display/Controllers
  ];

  const prefix = sku.split('-')[0];
  if (!validPrefixes.includes(prefix)) {
    return false;
  }

  // Must have numeric component
  if (!/\d{3,4}/.test(sku)) {
    return false;
  }

  // Reasonable length (4-15 characters)
  if (sku.length < 4 || sku.length > 15) {
    return false;
  }

  return true;
}

/**
 * Detect video category from title and description
 */
export function categorizeVideo(video: YouTubeVideo): VideoCategory {
  const combinedText = `${video.title} ${video.description}`.toLowerCase();

  // Check patterns in priority order
  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    if (category === 'Product Videos') continue; // Skip default

    if (pattern.test(combinedText)) {
      return category as VideoCategory;
    }
  }

  return 'Product Videos'; // Default fallback
}

/**
 * Map video to product SKU with confidence scoring
 */
export function mapVideoToProduct(video: YouTubeVideo): VideoProductMapping {
  // Extract SKUs from title (highest priority)
  const titleMatches = extractProductSKUs(video.title);

  // Extract SKUs from description (medium priority)
  const descriptionMatches = extractProductSKUs(video.description).map((match) => ({
    ...match,
    source: 'description' as const,
    confidence:
      match.confidence === 'high'
        ? ('medium' as const)
        : match.confidence === 'medium'
          ? ('low' as const)
          : ('low' as const),
  }));

  // Extract SKUs from tags (lowest priority)
  const tagMatches = (video.tags || [])
    .flatMap((tag) => extractProductSKUs(tag))
    .map((match) => ({
      ...match,
      source: 'tags' as const,
      confidence: 'low' as const,
    }));

  // Combine all matches, prioritize by source
  const allMatches = [...titleMatches, ...descriptionMatches, ...tagMatches];

  // Get best match
  const bestMatch = allMatches.sort((a, b) => {
    const confidenceOrder = { high: 3, medium: 2, low: 1 };
    const sourceOrder = { title: 3, description: 2, tags: 1 };

    const confidenceDiff =
      confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
    if (confidenceDiff !== 0) return confidenceDiff;

    return sourceOrder[b.source] - sourceOrder[a.source];
  })[0];

  const category = categorizeVideo(video);

  const mapping: VideoProductMapping = {
    video,
    productSku: bestMatch?.sku,
    category,
    confidence: bestMatch?.confidence || 'low',
  };

  // Add notes for manual review
  if (allMatches.length > 1) {
    mapping.notes = `Multiple SKUs found: ${allMatches.map((m) => m.sku).join(', ')}`;
  } else if (!bestMatch) {
    mapping.notes = 'No SKU detected - requires manual mapping';
  }

  logger.debug('[VideoMapping] Mapped video', {
    title: video.title,
    sku: mapping.productSku,
    category: mapping.category,
    confidence: mapping.confidence,
  });

  return mapping;
}

/**
 * Batch map multiple videos to products
 */
export function mapVideosToProducts(videos: YouTubeVideo[]): VideoProductMapping[] {
  logger.info('[VideoMapping] Starting batch mapping', { totalVideos: videos.length });

  const mappings = videos.map((video) => mapVideoToProduct(video));

  const stats = {
    total: mappings.length,
    highConfidence: mappings.filter((m) => m.confidence === 'high').length,
    mediumConfidence: mappings.filter((m) => m.confidence === 'medium').length,
    lowConfidence: mappings.filter((m) => m.confidence === 'low').length,
    unmapped: mappings.filter((m) => !m.productSku).length,
    categories: Object.fromEntries(
      Object.keys(CATEGORY_PATTERNS).map((cat) => [
        cat,
        mappings.filter((m) => m.category === cat).length,
      ])
    ),
  };

  logger.info('[VideoMapping] Batch mapping complete', stats);

  return mappings;
}

/**
 * Generate CSV export for manual review
 */
export function generateMappingCSV(mappings: VideoProductMapping[]): string {
  const headers = [
    'video_id',
    'video_title',
    'video_url',
    'suggested_sku',
    'confidence',
    'category',
    'published_at',
    'duration',
    'view_count',
    'notes',
  ];

  const rows = mappings.map((m) => [
    m.video.id,
    escapeCSV(m.video.title),
    m.video.url,
    m.productSku || '',
    m.confidence,
    m.category,
    new Date(m.video.publishedAt).toISOString().split('T')[0],
    m.video.durationSeconds ? formatDuration(m.video.durationSeconds) : '',
    m.video.viewCount?.toString() || '',
    escapeCSV(m.notes || ''),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Escape CSV field
 */
function escapeCSV(text: string): string {
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * Format duration in MM:SS format
 */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Parse CSV back to mappings (for edited manual mapping)
 */
export function parseCSVToMappings(csv: string): Partial<VideoProductMapping>[] {
  const lines = csv.split('\n').filter((line) => line.trim());
  const headers = lines[0].split(',');

  const mappings: Partial<VideoProductMapping>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const obj: any = {};

    headers.forEach((header, idx) => {
      obj[header] = values[idx] || '';
    });

    mappings.push({
      video: {
        id: obj.video_id,
        title: obj.video_title,
        url: obj.video_url,
        embedUrl: `https://www.youtube-nocookie.com/embed/${obj.video_id}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${obj.video_id}/hqdefault.jpg`,
        description: '',
        publishedAt: obj.published_at,
      },
      productSku: obj.suggested_sku || undefined,
      category: obj.category as VideoCategory,
      confidence: obj.confidence as 'high' | 'medium' | 'low',
      notes: obj.notes,
    });
  }

  return mappings;
}

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
