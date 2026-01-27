import type { Meta, StoryObj } from '@storybook/react';
import ImageModal from './ImageModal';
import { useState } from 'react';
import { ZoomIn } from 'lucide-react';

/**
 * ImageModal Component
 * 
 * Full-screen image viewer with zoom and pan controls.
 * Features:
 * - Click outside/ESC to close
 * - Mouse wheel zoom (desktop)
 * - Pinch-to-zoom (mobile/trackpad)
 * - Drag to pan when zoomed
 * - Zoom in/out/reset buttons
 * - Backdrop blur effect
 * - Accessible with ARIA labels
 * - Prevents body scroll when open
 */

const meta = {
  title: 'UI/ImageModal',
  component: ImageModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive demo with trigger button
 */
function ImageModalDemo({ imageSrc, imageAlt }: { imageSrc: string; imageAlt: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        <ZoomIn size={20} />
        <span>Open Image Modal</span>
      </button>

      <ImageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
      />
    </div>
  );
}

/**
 * Default product image
 * 
 * Click "Open Image Modal" to view full-screen image with zoom controls.
 */
export const Default: Story = {
  render: () => (
    <ImageModalDemo
      imageSrc="https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BA10K-3-O-12-1.jpg"
      imageAlt="BAPI Temperature Sensor BA/10K-3-O-12"
    />
  ),
};

/**
 * Wide landscape image (tests layout)
 */
export const LandscapeImage: Story = {
  render: () => (
    <ImageModalDemo
      imageSrc="https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BAPI-Campus-Aerial-1-scaled.jpg"
      imageAlt="BAPI Campus Aerial View"
    />
  ),
};

/**
 * Portrait image (tests vertical layout)
 */
export const PortraitImage: Story = {
  render: () => (
    <ImageModalDemo
      imageSrc="https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BA10K-3-O-12-1.jpg"
      imageAlt="BAPI Product Portrait"
    />
  ),
};

/**
 * High resolution image (tests zoom quality)
 */
export const HighResolution: Story = {
  render: () => (
    <ImageModalDemo
      imageSrc="https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BAPI-Campus-Aerial-1-scaled.jpg"
      imageAlt="High Resolution BAPI Campus Image"
    />
  ),
};

/**
 * Multiple images demo (tests modal reopening)
 */
export const MultipleImages: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState({
      src: '',
      alt: '',
    });

    const images = [
      {
        src: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BA10K-3-O-12-1.jpg',
        alt: 'Temperature Sensor',
        thumb: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BA10K-3-O-12-1.jpg',
      },
      {
        src: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BAPI-Campus-Aerial-1-scaled.jpg',
        alt: 'BAPI Campus',
        thumb: 'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BAPI-Campus-Aerial-1-scaled.jpg',
      },
    ];

    const openImage = (src: string, alt: string) => {
      setCurrentImage({ src, alt });
      setIsOpen(true);
    };

    return (
      <div className="p-8">
        <h3 className="text-xl font-bold mb-4">Click any thumbnail to view:</h3>
        <div className="grid grid-cols-2 gap-4 max-w-xl">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => openImage(img.src, img.alt)}
              className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden hover:ring-4 hover:ring-primary-500 transition-all"
            >
              <img
                src={img.thumb}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors">
                <ZoomIn className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>

        <ImageModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          imageSrc={currentImage.src}
          imageAlt={currentImage.alt}
        />
      </div>
    );
  },
};

/**
 * Already open modal (for testing initial state)
 */
export const InitiallyOpen: Story = {
  render: () => {
    const [isOpen] = useState(true);

    return (
      <div className="p-8">
        <p className="text-neutral-600">Modal is open by default (for testing)</p>
        <ImageModal
          isOpen={isOpen}
          onClose={() => {}}
          imageSrc="https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/2024/12/BA10K-3-O-12-1.jpg"
          imageAlt="BAPI Temperature Sensor"
        />
      </div>
    );
  },
};
