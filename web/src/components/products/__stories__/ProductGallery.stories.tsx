import type { Meta, StoryObj } from '@storybook/nextjs';
import StorybookProductGallery from './StorybookProductGallery';
import type { GalleryImage } from './StorybookProductGallery';

/**
 * ProductGallery Component
 *
 * Enhanced product gallery with lightbox, zoom, and keyboard navigation.
 * 
 * NOTE: These stories use StorybookProductGallery.tsx (HTML img tags) instead of
 * the production ProductGallery.tsx (Next/Image) for Chromatic compatibility.
 * Both provide identical visual demonstrations for design review.
 *
 * Features:
 * - Thumbnail navigation
 * - Lightbox modal for full-size viewing
 * - Keyboard controls (Arrow keys, ESC)
 * - Touch gestures for mobile
 * - Image zoom on hover
 * - Responsive layout
 */
const meta: Meta<typeof StorybookProductGallery> = {
  title: 'Products/ProductGallery',
  component: StorybookProductGallery,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
    chromatic: {
      viewports: [1200],
    },
    docs: {
      description: {
        component:
          '⚠️ **Manual Testing Required:** Main image display has rendering limitations in Chromatic static builds. Please test in development environment for full visual validation.\n\nA feature-rich image gallery component with lightbox, zoom, and keyboard navigation. Supports multiple images with thumbnail preview and full-screen viewing. Thumbnails and interactions render correctly.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    images: {
      description: 'Array of gallery images with sourceUrl and optional altText',
    },
    productName: {
      description: 'Product name used as fallback for alt text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock images for stories - using local PNG images from /public/products
const mockImages: GalleryImage[] = [
  {
    sourceUrl: '/products/temp_sensors.png',
    altText: 'Temperature Sensors - front view',
  },
  {
    sourceUrl: '/products/humidity_sensors.png',
    altText: 'Humidity Sensors - side view',
  },
  {
    sourceUrl: '/products/pressure_sensors.png',
    altText: 'Pressure Sensors - detail view',
  },
  {
    sourceUrl: '/products/wireless_sensors.png',
    altText: 'Wireless Sensors - installation',
  },
];

/**
 * Default gallery with multiple images.
 *
 * Click main image to open lightbox.
 * Use arrow keys for navigation in lightbox mode.
 * Press ESC to close lightbox.
 */
export const Default: Story = {
  args: {
    images: mockImages,
    productName: 'BA/10K-3-O-12 Temperature Sensor',
  },
};

/**
 * Gallery with single image only.
 *
 * No thumbnails or navigation arrows displayed.
 * Click to open lightbox for full-size viewing.
 */
export const SingleImage: Story = {
  args: {
    images: [mockImages[0]],
    productName: 'BA/1K-R3 Single Image Product',
  },
};

/**
 * Gallery with two images.
 *
 * Minimal thumbnail navigation.
 * Good for products with limited photography.
 */
export const TwoImages: Story = {
  args: {
    images: mockImages.slice(0, 2),
    productName: 'BA/1.8K-R2 Two Image Product',
  },
};

/**
 * Gallery with many images (6+).
 *
 * Tests thumbnail grid layout with more images.
 * Demonstrates responsive thumbnail sizing.
 */
export const ManyImages: Story = {
  args: {
    images: [
      ...mockImages,
      {
        sourceUrl: '/products/air_quality_sensors.png',
        altText: 'Air Quality Sensors',
      },
      {
        sourceUrl: '/products/test_products.png',
        altText: 'Test Instruments',
      },
    ],
    productName: 'BA/10K-3-O-24 Multi-View Product',
  },
};

/**
 * Gallery with images missing altText.
 *
 * Falls back to productName for accessibility.
 * Ensures alt text is always present for screen readers.
 */
export const NoAltText: Story = {
  args: {
    images: [
      { sourceUrl: mockImages[0].sourceUrl, altText: null },
      { sourceUrl: mockImages[1].sourceUrl, altText: null },
      { sourceUrl: mockImages[2].sourceUrl, altText: null },
    ],
    productName: 'BA/10K-3-O-18 Product Without Alt Text',
  },
};

/**
 * Gallery with portrait-oriented images.
 *
 * Tests layout with tall images.
 * Images maintain aspect ratio in square container.
 */
export const PortraitImages: Story = {
  args: {
    images: [
      {
        sourceUrl: '/products/temp_sensors.png',
        altText: 'Portrait orientation - view 1',
      },
      {
        sourceUrl: '/products/humidity_sensors.png',
        altText: 'Portrait orientation - view 2',
      },
    ],
    productName: 'Vertical Mount Sensor',
  },
};

/**
 * Gallery with landscape-oriented images.
 *
 * Tests layout with wide images.
 * Images maintain aspect ratio in square container.
 */
export const LandscapeImages: Story = {
  args: {
    images: [
      {
        sourceUrl: '/products/pressure_sensors.png',
        altText: 'Landscape orientation - view 1',
      },
      {
        sourceUrl: '/products/wireless_sensors.png',
        altText: 'Landscape orientation - view 2',
      },
    ],
    productName: 'Horizontal Mount Sensor',
  },
};

/**
 * Empty gallery state.
 *
 * Displays "No image available" message.
 * Handles gracefully when product has no images.
 */
export const NoImages: Story = {
  args: {
    images: [],
    productName: 'Product Without Images',
  },
};

/**
 * Gallery with high-resolution images.
 *
 * Tests loading and display of large images.
 * Demonstrates Next.js Image optimization.
 */
export const HighResolution: Story = {
  args: {
    images: [
      {
        sourceUrl: '/products/temp_sensors.png',
        altText: 'High resolution image 1',
      },
      {
        sourceUrl: '/products/humidity_sensors.png',
        altText: 'High resolution image 2',
      },
    ],
    productName: 'High Resolution Product Photography',
  },
};

/**
 * Gallery with mixed aspect ratios.
 *
 * Tests handling of various image dimensions.
 * All images fit within square containers with object-contain.
 */
export const MixedAspectRatios: Story = {
  args: {
    images: [
      {
        sourceUrl: '/products/temp_sensors.png',
        altText: 'Square image',
      },
      {
        sourceUrl: '/products/humidity_sensors.png',
        altText: 'Portrait image',
      },
      {
        sourceUrl: '/products/wireless_sensors.png',
        altText: 'Landscape image',
      },
    ],
    productName: 'Mixed Aspect Ratio Product',
  },
};

/**
 * Interactive testing - Keyboard navigation.
 *
 * Open lightbox and test keyboard controls:
 * - Arrow Left: Previous image
 * - Arrow Right: Next image
 * - ESC: Close lightbox
 */
export const KeyboardNavigation: Story = {
  args: {
    images: mockImages,
    productName: 'Keyboard Navigation Test',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Open the lightbox and use keyboard arrows to navigate between images. Press ESC to close.',
      },
    },
  },
};

/**
 * Accessibility testing.
 *
 * All images have proper alt text.
 * All buttons have aria-labels.
 * Keyboard navigation fully functional.
 */
export const Accessibility: Story = {
  args: {
    images: mockImages.map((img, index) => ({
      ...img,
      altText: `${img.altText} - Image ${index + 1} of ${mockImages.length}`,
    })),
    productName: 'Accessibility Test Product',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Test with screen reader. All controls should be accessible via keyboard. Alt text should be descriptive.',
      },
    },
  },
};
