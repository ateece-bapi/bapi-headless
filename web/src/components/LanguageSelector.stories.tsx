import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import LanguageSelector from './LanguageSelector';

/**
 * LanguageSelector Stories
 *
 * Phase 1 i18n component — allows users to switch between supported languages.
 * Renders as a pill button that opens a dropdown of available locales.
 *
 * Stories:
 * - Default: idle/closed state
 * - OpenDropdown: click to expand, Chromatic captures the list, asserts 3 locale options
 */

const meta: Meta<typeof LanguageSelector> = {
  title: 'Components/i18n/LanguageSelector',
  component: LanguageSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Language switcher for Phase 1 i18n support. Displays a pill button with the current language and flag; clicking opens a dropdown of available locales. Supports English, Spanish, and French.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

/** Default closed state. */
export const Default: Story = {};

/**
 * Interaction test: open the dropdown and verify options are visible.
 * Chromatic captures the expanded dropdown state.
 */
export const OpenDropdown: Story = {
  parameters: {
    chromatic: { delay: 200 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button');
    await userEvent.click(button);

    // Dropdown should now be visible
    const list = await canvas.findByRole('list');
    expect(list).toBeInTheDocument();

    // All three language options should be present
    const items = canvas.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  },
};
