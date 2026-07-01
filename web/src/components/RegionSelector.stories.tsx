import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from '@storybook/test';
import RegionSelector from './RegionSelector';

/**
 * RegionSelector Stories
 *
 * Phase 1 regional support component — allows users to select their region
 * for appropriate currency, pricing, and measurement units.
 *
 * Stories:
 * - Default: idle/closed state
 * - OpenDropdown: all region options visible (with interaction test)
 */

const meta: Meta<typeof RegionSelector> = {
  title: 'Components/i18n/RegionSelector',
  component: RegionSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Region selector for Phase 1 i18n support. Controls currency display, pricing, and measurement units per region. Supports US, UK, EU, Poland, and Middle East.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RegionSelector>;

/** Default closed state. */
export const Default: Story = {};

/**
 * Interaction test: open the dropdown and verify all region options appear.
 */
export const OpenDropdown: Story = {
  parameters: {
    chromatic: { delay: 200 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button');
    await userEvent.click(button);

    const list = await canvas.findByRole('list');
    expect(list).toBeInTheDocument();

    // 5 regions: US, UK, EU, Poland, Middle East
    const items = canvas.getAllByRole('listitem');
    expect(items).toHaveLength(5);
  },
};
