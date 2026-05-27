import type { Meta, StoryObj } from '@storybook/react';
import { ProductHighlight } from '@/components/landing/ProductHighlight';

const meta: Meta<typeof ProductHighlight> = {
  title: 'Landing Pages/ProductHighlight',
  component: ProductHighlight,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductHighlight>;

/**
 * Wireless Receiver product highlight (image on right)
 */
export const WirelessReceiver: Story = {
  args: {
    title: 'Wireless Receiver',
    description:
      "The Wireless Receiver collects data from one or more wireless sensors and distributes it to output modules for seamless BMS integration. With field-selectable settings, you can customize performance to maximize battery life while ensuring your BMS gets the data it needs.",
    imageSrc: '/images/wireless/receiver-placeholder.png',
    imageAlt: 'BAPI Wireless Receiver',
    features: [
      'Sample Rate/Interval',
      'Transmit Rate/Interval',
      'Delta Temperature',
      'Delta Humidity',
      'Supports up to 127 different output modules',
    ],
    learnMoreHref: '/products/wireless-receiver',
    imagePosition: 'right',
  },
};

/**
 * Image on left variant
 */
export const ImageLeft: Story = {
  args: {
    title: 'BACnet IP Module',
    description:
      'Converts wireless sensor data for integration into the BMS ethernet communication network. Quick and easy web-based configuration. Surface, 2.75 snaptrack or 35mm DIN rail mountable.',
    imageSrc: '/images/wireless/bacnet-module-placeholder.png',
    imageAlt: 'BAPI BACnet IP Module',
    features: [
      'Web-based configuration',
      'BACnet/IP protocol',
      'Multiple mounting options',
      'Plug-and-play setup',
    ],
    learnMoreHref: '/products/bacnet-ip-module',
    imagePosition: 'left',
  },
};

/**
 * Without features list
 */
export const NoFeatures: Story = {
  args: {
    title: 'Wireless Temperature Sensor',
    description:
      'High-accuracy temperature monitoring for HVAC applications. Easy installation with no wiring required. Long battery life ensures years of reliable operation.',
    imageSrc: '/images/wireless/sensor-placeholder.png',
    imageAlt: 'BAPI Wireless Temperature Sensor',
    learnMoreHref: '/products/wireless-temperature-sensor',
    imagePosition: 'right',
  },
};

/**
 * Without CTA button
 */
export const NoCTA: Story = {
  args: {
    title: 'Output Modules',
    description:
      'Convert wireless sensor data into signals compatible with your building automation system. Choose from analog outputs (voltage, resistance) or digital protocols (BACnet, Modbus).',
    imageSrc: '/images/wireless/modules-placeholder.png',
    imageAlt: 'BAPI Output Modules',
    features: [
      'Voltage Output (0-5V, 0-10V)',
      'Resistance Output (10K thermistor curves)',
      'BACnet MS/TP or Modbus RTU',
      'Field-selectable protocols',
    ],
    imagePosition: 'right',
  },
};
