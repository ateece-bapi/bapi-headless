import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import {
  CableIcon,
  SignalIcon,
  BatteryIcon,
  LayersIcon,
} from '@/lib/icons';

const meta: Meta<typeof FeatureGrid> = {
  title: 'Landing Pages/FeatureGrid',
  component: FeatureGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeatureGrid>;

const wirelessFeatures = [
  {
    icon: <CableIcon className="h-12 w-12" />,
    title: 'No Wiring Required',
    description:
      'Eliminate expensive wire runs and reduce installation time by up to 70%.',
  },
  {
    icon: <SignalIcon className="h-12 w-12" />,
    title: 'Long Range Signal',
    description:
      'Up to 400ft range through walls and floors in typical commercial buildings.',
  },
  {
    icon: <BatteryIcon className="h-12 w-12" />,
    title: '10-Year Battery Life',
    description:
      'User-replaceable batteries last up to 10 years with optimized transmit intervals.',
  },
  {
    icon: <LayersIcon className="h-12 w-12" />,
    title: 'Easy Scalability',
    description:
      'Add up to 127 sensors per receiver. Expand your system as your needs grow.',
  },
];

/**
 * Default 4-column feature grid (Wireless page design)
 */
export const FourColumn: Story = {
  args: {
    features: wirelessFeatures,
    columns: 4,
  },
};

/**
 * 3-column variant for different layouts
 */
export const ThreeColumn: Story = {
  args: {
    features: wirelessFeatures.slice(0, 3),
    columns: 3,
  },
};

/**
 * 2-column variant for simpler layouts
 */
export const TwoColumn: Story = {
  args: {
    features: wirelessFeatures.slice(0, 2),
    columns: 2,
  },
};

/**
 * With gray background
 */
export const WithBackground: Story = {
  args: {
    features: wirelessFeatures,
    columns: 4,
    background: 'gray',
  },
};
