import type { Meta, StoryObj } from '@storybook/react';
import { ProcessSteps } from '@/components/landing/ProcessSteps';

const meta: Meta<typeof ProcessSteps> = {
  title: 'Landing Pages/ProcessSteps',
  component: ProcessSteps,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProcessSteps>;

const wirelessSteps = [
  {
    number: 1,
    title: 'Wireless Sensors',
    description:
      'Choose from temperature, humidity, or combination sensors for any application from outside air to duct to room monitoring.',
  },
  {
    number: 2,
    title: 'Wireless Receiver',
    description:
      'The receiver collects data from up to 127 sensors and distributes it to output modules for BMS integration.',
  },
  {
    number: 3,
    title: 'Output Modules',
    description:
      'Convert sensor data to analog signals (0-10V, resistance) or digital protocols (BACnet IP, BACnet MS/TP, Modbus RTU).',
  },
];

/**
 * Default 3-step process (How It Works)
 */
export const ThreeSteps: Story = {
  args: {
    steps: wirelessSteps,
    columns: 3,
  },
};

/**
 * With connecting lines between steps
 */
export const WithConnector: Story = {
  args: {
    steps: wirelessSteps,
    columns: 3,
    showConnector: true,
  },
};

/**
 * 4-step process variant
 */
export const FourSteps: Story = {
  args: {
    steps: [
      ...wirelessSteps,
      {
        number: 4,
        title: 'Building Management System',
        description:
          'Seamlessly integrate with your existing BMS for complete building automation control.',
      },
    ],
    columns: 4,
    showConnector: true,
  },
};

/**
 * 2-column layout for simpler flows
 */
export const TwoSteps: Story = {
  args: {
    steps: wirelessSteps.slice(0, 2),
    columns: 2,
  },
};
