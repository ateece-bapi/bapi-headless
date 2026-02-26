import type { Meta, StoryObj } from '@storybook/nextjs';
import TaglineRotator from './TaglineRotator';

/**
 * TaglineRotator Component
 *
 * Animated tagline carousel for homepage hero section.
 * Features:
 * - 7 BAPI brand taglines
 * - Auto-rotates every 4 seconds
 * - Fade transition (500ms)
 * - Responsive typography (3xl → 4xl → 5xl)
 * - Font smoothing optimizations
 * - Fixed height to prevent layout shift
 */

// Default BAPI taglines (English)
const defaultTaglines = [
  'Industry Leading Sensors',
  'Changing the way you think about sensors since 1993',
  'Seamless wireless integration for your existing BAS',
  'Precision Engineering',
  'Building the Future',
  '...It&apos;s in the details',
  'People. Building. Sensors',
];

const meta = {
  title: 'UI/TaglineRotator',
  component: TaglineRotator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    taglines: defaultTaglines,
  },
} satisfies Meta<typeof TaglineRotator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default tagline rotator
 *
 * Watch it cycle through all 7 BAPI taglines:
 * 1. "Industry Leading Sensors"
 * 2. "Changing the way you think about sensors since 1993"
 * 3. "Seamless wireless integration for your existing BAS"
 * 4. "Precision Engineering"
 * 5. "Building the Future"
 * 6. "...It&apos;s in the details"
 * 7. "People. Building. Sensors"
 */
export const Default: Story = {};

/**
 * With container background (for visual testing)
 */
export const WithBackground: Story = {
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-gradient-to-br from-primary-700 via-primary-500 to-primary-700 p-12">
        <div className="text-white">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * On dark background (homepage hero style)
 */
export const DarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-neutral-900 p-12">
        <div className="text-white">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Narrow container (mobile view)
 */
export const NarrowContainer: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-xs rounded-xl bg-neutral-100 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Wide container (desktop view)
 */
export const WideContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-[1200px] rounded-xl bg-neutral-100 p-12">
        <Story />
      </div>
    ),
  ],
};

/**
 * Multiple instances (tests independence)
 */
export const MultipleInstances: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl bg-primary-500 p-8 text-white">
        <TaglineRotator taglines={args.taglines} />
      </div>
      <div className="rounded-xl bg-accent-500 p-8">
        <TaglineRotator taglines={args.taglines} />
      </div>
      <div className="rounded-xl bg-neutral-900 p-8 text-white">
        <TaglineRotator taglines={args.taglines} />
      </div>
    </div>
  ),
};

/**
 * Accessibility test (screen reader announcement)
 *
 * The tagline changes trigger DOM updates that screen readers announce.
 */
export const AccessibilityTest: Story = {
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-neutral-100 p-8">
        <div className="mb-4 text-sm text-neutral-600">
          Screen readers will announce each tagline change.
        </div>
        <Story />
      </div>
    ),
  ],
};
