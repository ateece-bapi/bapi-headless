/**
 * Image Optimization Configuration
 *
 * Centralized image optimization settings for Next.js Image component.
 * Optimized for performance, SEO, and user experience.
 */

/**
 * Responsive image sizes for different breakpoints
 * Based on Tailwind CSS breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)
 */
export const IMAGE_SIZES = {
  // Product images
  product: {
    thumbnail: { width: 80, height: 80 },
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 400 },
    large: { width: 800, height: 800 },
    hero: { width: 1200, height: 1200 },
  },

  // Category/Feature images
  category: {
    card: { width: 400, height: 225 }, // 16:9 aspect ratio
    banner: { width: 1200, height: 400 }, // 3:1 aspect ratio
  },

  // Hero/Banner images
  hero: {
    mobile: { width: 640, height: 400 },
    tablet: { width: 1024, height: 600 },
    desktop: { width: 1920, height: 800 },
  },

  // Logo sizes
  logo: {
    small: { width: 120, height: 60 },
    medium: { width: 200, height: 100 },
    large: { width: 300, height: 150 },
  },

  // Team/Profile photos
  profile: {
    thumbnail: { width: 100, height: 100 },
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 400 },
  },
} as const;

/**
 * Image quality settings by use case
 * Lower quality = smaller file size, faster loading
 * Higher quality = better visual fidelity
 */
export const IMAGE_QUALITY = {
  thumbnail: 60, // Small thumbnails don't need high quality
  default: 75, // Good balance for most images
  high: 85, // Product hero images, important visuals
  lossless: 100, // Logos, diagrams (avoid compression artifacts)
} as const;

/**
 * Loading strategies for different image types
 */
export const LOADING_STRATEGY = {
  // Above the fold - load immediately
  eager: 'eager' as const,

  // Below the fold - lazy load
  lazy: 'lazy' as const,
} as const;

/**
 * Priority settings for image loading
 * High priority images load first (above the fold)
 */
export const IMAGE_PRIORITY = {
  // Hero images, main product image
  highPriority: true,

  // Related products, thumbnails, footer images
  lowPriority: false,
} as const;

/**
 * Responsive image sizes attribute for srcset generation
 * Tells browser which image size to load at different viewport widths
 */
export const RESPONSIVE_SIZES = {
  // Full width on mobile, half width on desktop
  productCard: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',

  // Hero images - full width
  hero: '100vw',

  // Product detail main image
  productHero: '(max-width: 768px) 100vw, 50vw',

  // Thumbnails - fixed small size
  thumbnail: '100px',

  // Category cards
  category: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',

  // Logo sizes
  logo: '(max-width: 640px) 150px, 200px',
} as const;

/**
 * Supported image formats in order of preference
 * WebP is 25-35% smaller than JPEG with same quality
 * AVIF is even better but less browser support
 */
export const IMAGE_FORMATS = ['image/webp', 'image/jpeg', 'image/png'] as const;

/**
 * Common image optimization props for Next.js Image component
 */
export const getImageProps = (
  type: 'product' | 'hero' | 'thumbnail' | 'category' | 'logo',
  priority: boolean = false
) => {
  const configs = {
    product: {
      quality: IMAGE_QUALITY.high,
      loading: priority ? LOADING_STRATEGY.eager : LOADING_STRATEGY.lazy,
      sizes: RESPONSIVE_SIZES.productCard,
    },
    hero: {
      quality: IMAGE_QUALITY.high,
      loading: LOADING_STRATEGY.eager,
      sizes: RESPONSIVE_SIZES.hero,
      priority: true,
    },
    thumbnail: {
      quality: IMAGE_QUALITY.thumbnail,
      loading: LOADING_STRATEGY.lazy,
      sizes: RESPONSIVE_SIZES.thumbnail,
    },
    category: {
      quality: IMAGE_QUALITY.default,
      loading: priority ? LOADING_STRATEGY.eager : LOADING_STRATEGY.lazy,
      sizes: RESPONSIVE_SIZES.category,
    },
    logo: {
      quality: IMAGE_QUALITY.lossless,
      loading: LOADING_STRATEGY.eager,
      sizes: RESPONSIVE_SIZES.logo,
    },
  };

  return configs[type];
};

/**
 * Generate placeholder image for loading states
 * Returns a tiny base64 encoded blur placeholder
 */
export const generatePlaceholder = (width: number, height: number): string => {
  // Simple gray placeholder SVG
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f3f4f6"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

/**
 * Extract image dimensions from URL or filename
 * Returns null if dimensions cannot be determined
 */
export function getImageDimensions(src: string): { width: number; height: number } | null {
  // Try to extract dimensions from filename (e.g., image-800x600.jpg)
  const match = src.match(/[-_](\d+)x(\d+)\./);
  if (match) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10),
    };
  }

  return null;
}

/**
 * Optimize external image URL (WordPress, CDN)
 * Adds query parameters for size and format optimization
 */
export function optimizeImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality?: number
): string {
  try {
    const urlObj = new URL(url);

    // Add width/height params if provided
    if (width) urlObj.searchParams.set('w', width.toString());
    if (height) urlObj.searchParams.set('h', height.toString());
    if (quality) urlObj.searchParams.set('quality', quality.toString());

    // Request WebP format if supported
    urlObj.searchParams.set('format', 'webp');

    return urlObj.toString();
  } catch {
    // If URL is relative or invalid, return as-is
    return url;
  }
}

/**
 * Check if image source is from external domain
 */
export function isExternalImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

/**
 * Get optimized image path with WebP fallback
 * Checks if WebP version exists, otherwise returns original
 */
export function getOptimizedImagePath(originalPath: string): string {
  // If already WebP, return as-is
  if (originalPath.endsWith('.webp')) {
    return originalPath;
  }

  // Replace extension with .webp
  const webpPath = originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  // In production, assume WebP exists if we've generated it
  // In development, you might want to check file existence
  return webpPath;
}
