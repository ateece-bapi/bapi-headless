import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import ImageModal from './ImageModal';

const meta: Meta<typeof ImageModal> = {
  title: 'UI/ImageModal',
  component: ImageModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImageModal>;

/**
 * Default image modal with product image
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const src = 'https://bapi.kinsta.cloud/wp-content/uploads/2024/01/sample-product.jpg';
    const alt = 'Sample Product Image';

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
        >
          Open Image Modal
        </button>
        <ImageModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          src={src}
          alt={alt}
        />
      </div>
    );
  },
};

/**
 * Modal with landscape image
 */
export const Landscape: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const src = 'https://bapi.kinsta.cloud/wp-content/uploads/2024/01/landscape-product.jpg';
    const alt = 'Landscape Product Image';

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
        >
          Open Landscape Image
        </button>
        <ImageModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          src={src}
          alt={alt}
        />
      </div>
    );
  },
};

/**
 * Modal with portrait image
 */
export const Portrait: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const src = 'https://bapi.kinsta.cloud/wp-content/uploads/2024/01/portrait-product.jpg';
    const alt = 'Portrait Product Image';

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
        >
          Open Portrait Image
        </button>
        <ImageModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          src={src}
          alt={alt}
        />
      </div>
    );
  },
};