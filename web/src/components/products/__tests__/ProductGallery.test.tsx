import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductGallery, { type GalleryImage } from '../ProductGallery';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    priority,
    fill,
    sizes,
    className,
  }: {
    src: string;
    alt: string;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
    className?: string;
  }) => (
    <img
      src={src}
      alt={alt}
      data-priority={priority}
      data-fill={fill}
      data-sizes={sizes}
      className={className}
    />
  ),
}));

describe('ProductGallery Component', () => {
  const mockImages: GalleryImage[] = [
    { sourceUrl: '/image1.jpg', altText: 'Product image 1' },
    { sourceUrl: '/image2.jpg', altText: 'Product image 2' },
    { sourceUrl: '/image3.jpg', altText: 'Product image 3' },
  ];

  const productName = 'Test Product';

  beforeEach(() => {
    // Reset body overflow style before each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Cleanup body overflow style
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders main image with first image selected', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImage = screen.getAllByAltText('Product image 1')[0];
      expect(mainImage).toBeInTheDocument();
    });

    it('renders thumbnails when multiple images', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const thumbnails = screen.getAllByRole('button', { name: /View image \d/ });
      expect(thumbnails).toHaveLength(3);
    });

    it('does not render thumbnails for single image', () => {
      const singleImage = [mockImages[0]];
      render(<ProductGallery images={singleImage} productName={productName} />);
      const thumbnails = screen.queryAllByRole('button', { name: /View image \d/ });
      expect(thumbnails).toHaveLength(0);
    });

    it('renders no image message when images array is empty', () => {
      render(<ProductGallery images={[]} productName={productName} />);
      expect(screen.getByText('No image available')).toBeInTheDocument();
    });

    it('uses altText from image data', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      expect(screen.getAllByAltText('Product image 1')[0]).toBeInTheDocument();
    });

    it('falls back to productName when altText is null', () => {
      const imagesWithoutAlt = [{ sourceUrl: '/image1.jpg', altText: null }];
      render(<ProductGallery images={imagesWithoutAlt} productName={productName} />);
      expect(screen.getByAltText(productName)).toBeInTheDocument();
    });
  });

  describe('Thumbnail Navigation', () => {
    it('selects image when thumbnail clicked', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const thumbnails = screen.getAllByRole('button', { name: /View image \d/ });
      
      fireEvent.click(thumbnails[1]);
      
      // Second image should now be displayed as main
      const mainImages = screen.getAllByAltText('Product image 2');
      expect(mainImages[0]).toBeInTheDocument();
    });

    it('highlights selected thumbnail', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const thumbnails = screen.getAllByRole('button', { name: /View image \d/ });
      
      fireEvent.click(thumbnails[2]);
      
      expect(thumbnails[2].className).toContain('border-primary-500');
    });

    it('updates main image when different thumbnail clicked', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const thumbnails = screen.getAllByRole('button', { name: /View image \d/ });
      
      fireEvent.click(thumbnails[0]);
      expect(screen.getAllByAltText('Product image 1')[0]).toBeInTheDocument();
      
      fireEvent.click(thumbnails[1]);
      expect(screen.getAllByAltText('Product image 2')[0]).toBeInTheDocument();
    });
  });

  describe('Gallery Navigation Arrows', () => {
    it('renders navigation arrows for multiple images', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      expect(screen.getAllByLabelText('Previous image')).toHaveLength(1);
      expect(screen.getAllByLabelText('Next image')).toHaveLength(1);
    });

    it('does not render navigation arrows for single image', () => {
      const singleImage = [mockImages[0]];
      render(<ProductGallery images={singleImage} productName={productName} />);
      expect(screen.queryAllByLabelText('Previous image')).toHaveLength(0);
      expect(screen.queryAllByLabelText('Next image')).toHaveLength(0);
    });

    it('navigates to next image on next arrow click', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const nextButton = screen.getAllByLabelText('Next image')[0];
      
      fireEvent.click(nextButton);
      
      expect(screen.getAllByAltText('Product image 2')[0]).toBeInTheDocument();
    });

    it('navigates to previous image on previous arrow click', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      
      // First go to second image
      const nextButton = screen.getAllByLabelText('Next image')[0];
      fireEvent.click(nextButton);
      
      // Then go back
      const prevButton = screen.getAllByLabelText('Previous image')[0];
      fireEvent.click(prevButton);
      
      expect(screen.getAllByAltText('Product image 1')[0]).toBeInTheDocument();
    });

    it('wraps to last image when clicking previous on first image', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const prevButton = screen.getAllByLabelText('Previous image')[0];
      
      fireEvent.click(prevButton);
      
      expect(screen.getAllByAltText('Product image 3')[0]).toBeInTheDocument();
    });

    it('wraps to first image when clicking next on last image', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const nextButton = screen.getAllByLabelText('Next image')[0];
      
      // Click next twice to reach last image
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      // Click next again to wrap
      fireEvent.click(nextButton);
      
      expect(screen.getAllByAltText('Product image 1')[0]).toBeInTheDocument();
    });
  });

  describe('Lightbox Modal', () => {
    it('opens lightbox when main image clicked', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      expect(screen.getByLabelText('Close lightbox')).toBeInTheDocument();
    });

    it('displays correct image in lightbox', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      // Lightbox should show the selected image
      const lightboxImages = screen.getAllByAltText(/Product image 1/);
      expect(lightboxImages.length).toBeGreaterThan(0);
    });

    it('shows image counter in lightbox', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('closes lightbox when close button clicked', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      const closeButton = screen.getByLabelText('Close lightbox');
      fireEvent.click(closeButton);
      
      expect(screen.queryByLabelText('Close lightbox')).not.toBeInTheDocument();
    });

    it('prevents body scroll when lightbox is open', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      expect(document.body.style.overflow).toBe('');
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when lightbox is closed', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      const closeButton = screen.getByLabelText('Close lightbox');
      fireEvent.click(closeButton);
      
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Lightbox Navigation', () => {
    it('navigates to next image in lightbox', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      const nextButtons = screen.getAllByLabelText('Next image');
      const lightboxNextButton = nextButtons[nextButtons.length - 1];
      fireEvent.click(lightboxNextButton);
      
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('navigates to previous image in lightbox', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      // Go to next first
      const nextButtons = screen.getAllByLabelText('Next image');
      const lightboxNextButton = nextButtons[nextButtons.length - 1];
      fireEvent.click(lightboxNextButton);
      
      // Then go back
      const prevButtons = screen.getAllByLabelText('Previous image');
      const lightboxPrevButton = prevButtons[prevButtons.length - 1];
      fireEvent.click(lightboxPrevButton);
      
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('wraps to last image in lightbox', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      const prevButtons = screen.getAllByLabelText('Previous image');
      const lightboxPrevButton = prevButtons[prevButtons.length - 1];
      fireEvent.click(lightboxPrevButton);
      
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('wraps to first image in lightbox', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      
      // Select last image via thumbnail
      const thumbnails = screen.getAllByRole('button', { name: /View image \d/ });
      fireEvent.click(thumbnails[2]);
      
      // Open lightbox
      const mainImageContainer = screen.getAllByAltText('Product image 3')[0].closest('div')?.parentElement;
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      // Navigate next to wrap
      const nextButtons = screen.getAllByLabelText('Next image');
      const lightboxNextButton = nextButtons[nextButtons.length - 1];
      fireEvent.click(lightboxNextButton);
      
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates to next image with ArrowRight in lightbox', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('navigates to previous image with ArrowLeft in lightbox', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('closes lightbox with Escape key', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      expect(screen.getByLabelText('Close lightbox')).toBeInTheDocument();
      
      fireEvent.keyDown(window, { key: 'Escape' });
      
      expect(screen.queryByLabelText('Close lightbox')).not.toBeInTheDocument();
    });

    it('does not respond to keyboard when lightbox is closed', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      
      // Should still show first image
      expect(screen.getAllByAltText('Product image 1')[0]).toBeInTheDocument();
    });

    it('shows keyboard hints in lightbox', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      expect(screen.getByText('ESC to close')).toBeInTheDocument();
    });
  });

  describe('Zoom Functionality', () => {
    it('shows zoom icon on hover', () => {
      const { container } = render(<ProductGallery images={mockImages} productName={productName} />);
      const zoomIcon = container.querySelector('.lucide-zoom-in');
      expect(zoomIcon).toBeInTheDocument();
    });

    it('applies zoom cursor to main image container', () => {
      const { container } = render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = container.querySelector('.cursor-zoom-in');
      expect(mainImageContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels on all navigation buttons', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      expect(screen.getAllByLabelText('Previous image')).toHaveLength(1);
      expect(screen.getAllByLabelText('Next image')).toHaveLength(1);
    });

    it('has proper ARIA labels on thumbnail buttons', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      expect(screen.getByLabelText('View image 1')).toBeInTheDocument();
      expect(screen.getByLabelText('View image 2')).toBeInTheDocument();
      expect(screen.getByLabelText('View image 3')).toBeInTheDocument();
    });

    it('has proper ARIA label on close button', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImageContainer = screen.getAllByAltText('Product image 1')[0].closest('div')?.parentElement;
      
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      expect(screen.getByLabelText('Close lightbox')).toBeInTheDocument();
    });

    it('provides alt text for all images', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const allImages = screen.getAllByRole('img');
      allImages.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('sets appropriate image sizes for main image', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImage = screen.getAllByAltText('Product image 1')[0];
      expect(mainImage).toHaveAttribute('data-sizes', '(min-width: 1024px) 50vw, 100vw');
    });

    it('sets appropriate image sizes for thumbnails', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const thumbnails = screen.getAllByRole('button', { name: /View image \d/ });
      const thumbnailImage = thumbnails[0].querySelector('img');
      expect(thumbnailImage).toHaveAttribute('data-sizes', '(min-width: 1024px) 10vw, 20vw');
    });

    it('prioritizes main image loading', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      const mainImage = screen.getAllByAltText('Product image 1')[0];
      expect(mainImage).toHaveAttribute('data-priority', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles single image gracefully', () => {
      const singleImage = [mockImages[0]];
      render(<ProductGallery images={singleImage} productName={productName} />);
      expect(screen.getByAltText('Product image 1')).toBeInTheDocument();
      expect(screen.queryAllByLabelText('Previous image')).toHaveLength(0);
    });

    it('handles empty images array', () => {
      render(<ProductGallery images={[]} productName={productName} />);
      expect(screen.getByText('No image available')).toBeInTheDocument();
    });

    it('handles images without altText', () => {
      const imagesNoAlt: GalleryImage[] = [
        { sourceUrl: '/image1.jpg', altText: null },
        { sourceUrl: '/image2.jpg', altText: null },
      ];
      render(<ProductGallery images={imagesNoAlt} productName={productName} />);
      expect(screen.getByAltText(productName)).toBeInTheDocument();
    });

    it('opens lightbox with correct index when thumbnail clicked first', () => {
      render(<ProductGallery images={mockImages} productName={productName} />);
      
      // Click second thumbnail
      const thumbnails = screen.getAllByRole('button', { name: /View image \d/ });
      fireEvent.click(thumbnails[1]);
      
      // Open lightbox
      const mainImageContainer = screen.getAllByAltText('Product image 2')[0].closest('div')?.parentElement;
      if (mainImageContainer) {
        fireEvent.click(mainImageContainer);
      }
      
      // Should show image 2
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
  });
});
