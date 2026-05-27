import type { Meta, StoryObj } from '@storybook/react';
import { CTABanner } from '@/components/landing/CTABanner';

const meta: Meta<typeof CTABanner> = {
  title: 'Landing Pages/CTABanner',
  component: CTABanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CTABanner>;

/**
 * Blue variant (default) - Primary CTA
 */
export const Blue: Story = {
  args: {
    title: 'Worried about signal strength?',
    description:
      "Get peace of mind before you place an order. BAPI's easy-to-use app lets you verify sensor distances in your application using just your smart device and our Wireless BAPI-Stat Quantum Slim Sensor.",
    buttonText: 'Learn More',
    buttonHref: '/wireless-site-verification',
    variant: 'blue',
  },
};

/**
 * Yellow variant - Attention-grabbing CTA
 */
export const Yellow: Story = {
  args: {
    title: 'Ready to go wireless?',
    description:
      "Schedule a free consultation with our wireless experts. We'll help you design the perfect wireless solution for your building.",
    buttonText: 'Contact Us',
    buttonHref: '/contact',
    variant: 'yellow',
  },
};

/**
 * Gray variant - Subtle CTA
 */
export const Gray: Story = {
  args: {
    title: 'Need help choosing the right sensors?',
    description:
      'Our product selection guide makes it easy to find the perfect wireless sensors for your HVAC application.',
    buttonText: 'View Guide',
    buttonHref: '/product-selector',
    variant: 'gray',
  },
};

/**
 * With background image
 */
export const WithImage: Story = {
  args: {
    title: 'Use WAM to prevent costly losses',
    description:
      'Wireless Asset Monitoring protects your critical equipment and inventory. Monitor temperature, humidity, and more from anywhere. Schedule a demo today.',
    buttonText: 'Contact Us',
    buttonHref: '/contact',
    imageSrc: '/images/wireless/Image (Wireless Integration Diagram).png',
    imageAlt: 'Wireless monitoring background',
    variant: 'blue',
  },
};
