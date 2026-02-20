import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import RadioGroupSelector from './variation-selectors/RadioGroupSelector';
import DropdownSelector from './variation-selectors/DropdownSelector';
import ColorSwatchSelector from './variation-selectors/ColorSwatchSelector';
import BinaryToggleSelector from './variation-selectors/BinaryToggleSelector';

/**
 * Form Components Stories
 *
 * Professional B2B form components used for product variation selection:
 * - RadioGroupSelector: Radio button groups for 2-4 options
 * - DropdownSelector: Select dropdown for 5+ complex options
 * - ColorSwatchSelector: Visual color picker with swatches
 * - BinaryToggleSelector: Toggle switch for yes/no choices
 *
 * Stories demonstrate:
 * - Interactive state management
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Visual feedback on selection
 * - Responsive layouts
 * - Form validation patterns
 * - B2B-optimized styling
 */

const meta: Meta = {
  title: 'Components/Forms/FormComponents',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-50 p-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-neutral-200 bg-white p-8">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Professional form components built for BAPI B2B e-commerce. Optimized for technical product configuration with clear selection states, accessibility compliance, and enterprise UX patterns. Used in product variation selection, checkout forms, and configuration wizards.',
      },
    },
  },
};

export default meta;

/**
 * RadioGroupSelector Stories
 */
export const RadioGroupBasic: StoryObj = {
  render: () => {
    const [value, setValue] = useState('Standard');
    return (
      <RadioGroupSelector
        label="Output Type"
        options={['Standard', 'Enhanced', 'Premium']}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic radio group for 2-4 options. Shows selected state with BAPI blue border, background, and checkmark. Hover effects on unselected options.',
      },
    },
  },
};

export const RadioGroupWithDescription: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioGroupSelector
        label="Mounting Type"
        description="Select how the sensor will be installed"
        options={['Wall Mount', 'Duct Mount', 'Immersion Mount', 'Surface Mount']}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Radio group with descriptive help text. 4 options shown. No default selection (empty state). Click to select.',
      },
    },
  },
};

export const RadioGroupSelected: StoryObj = {
  render: () => {
    const [value, setValue] = useState('4-20mA');
    return (
      <RadioGroupSelector
        label="Signal Output"
        options={['0-10VDC', '4-20mA', 'Thermistor']}
        value={value}
        onChange={setValue}
        description="Choose the electrical output signal type"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Radio group with pre-selected option (4-20mA). Shows "Selected" badge on active option. Blue highlight and checkmark visible.',
      },
    },
  },
};

/**
 * DropdownSelector Stories
 */
export const DropdownBasic: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <DropdownSelector
        label="Temperature Range"
        options={[
          '0-50°F',
          '0-100°F',
          '32-122°F',
          '50-90°F',
          '-40-125°F',
          '-20-80°F',
          '0-200°F',
          '32-212°F',
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dropdown selector for 5+ options. Shows placeholder "Choose an option" when empty. Chevron icon indicates dropdown. Yellow (accent) border when selected.',
      },
    },
  },
};

export const DropdownSelected: StoryObj = {
  render: () => {
    const [value, setValue] = useState('0-100°F');
    return (
      <DropdownSelector
        label="Temperature Range"
        description="Select the operating temperature range for your sensor"
        options={[
          '0-50°F',
          '0-100°F',
          '32-122°F',
          '50-90°F',
          '-40-125°F',
          '-20-80°F',
          '0-200°F',
          '32-212°F',
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dropdown with selected value (0-100°F). Shows yellow border and bold text when option chosen. Includes descriptive help text.',
      },
    },
  },
};

export const DropdownLongOptions: StoryObj = {
  render: () => {
    const [value, setValue] = useState(
      'Temperature Range: 0-200°F, Accuracy: ±0.5°F, Output: 4-20mA, Material: Stainless Steel 316, Length: 12 inches'
    );
    return (
      <DropdownSelector
        label="Sensor Configuration"
        options={[
          'Temperature Range: 0-100°F, Accuracy: ±1°F, Output: 0-10VDC, Material: Plastic ABS, Length: 6 inches',
          'Temperature Range: 0-200°F, Accuracy: ±0.5°F, Output: 4-20mA, Material: Stainless Steel 316, Length: 12 inches',
          'Temperature Range: -40-125°F, Accuracy: ±0.25°F, Output: Thermistor 10K Type II, Material: Copper, Length: 18 inches',
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dropdown with long technical specifications (50+ characters). Shows shortened label below dropdown when selected, with full text in expandable box.',
      },
    },
  },
};

/**
 * ColorSwatchSelector Stories
 */
export const ColorSwatchBasic: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <ColorSwatchSelector
        label="Housing Color"
        options={['White', 'Black', 'Gray', 'Beige']}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Color swatch selector with no selection. Shows color circles with names. Click to select. Light colors (White, Beige) have shadow for visibility.',
      },
    },
  },
};

export const ColorSwatchSelected: StoryObj = {
  render: () => {
    const [value, setValue] = useState('Black');
    return (
      <ColorSwatchSelector
        label="Housing Color"
        options={['White', 'Black', 'Gray', 'Beige']}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Color swatch with Black selected. Shows checkmark on selected color, blue border around button, and "Selected: Black" indicator below.',
      },
    },
  },
};

export const ColorSwatchWhiteSelected: StoryObj = {
  render: () => {
    const [value, setValue] = useState('White');
    return (
      <ColorSwatchSelector
        label="Enclosure Color"
        options={['White', 'Black', 'Gray', 'Beige', 'Silver']}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'White color selected. Shows blue checkmark (high contrast on light background). WCAG AA compliant contrast ratios for accessibility.',
      },
    },
  },
};

export const ColorSwatchManyOptions: StoryObj = {
  render: () => {
    const [value, setValue] = useState('Red');
    return (
      <ColorSwatchSelector
        label="Wire Color"
        options={[
          'Red',
          'Black',
          'White',
          'Green',
          'Blue',
          'Yellow',
          'Orange',
          'Purple',
          'Gray',
          'Brown',
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '10 color options wrapping across multiple rows. Shows how component handles many swatches. Red selected with checkmark. Swatches wrap responsively.',
      },
    },
  },
};

/**
 * BinaryToggleSelector Stories
 */
export const BinaryToggleBasic: StoryObj = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <BinaryToggleSelector
        label="Display Included"
        options={['No', 'Yes']}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Binary toggle for yes/no choice. No selection yet (status dot gray). Click either button to select. Positive option (Yes) will show blue when selected.',
      },
    },
  },
};

export const BinaryToggleYesSelected: StoryObj = {
  render: () => {
    const [value, setValue] = useState('Yes');
    return (
      <BinaryToggleSelector
        label="Display Included"
        description="Add LCD display for local temperature reading"
        options={['No', 'Yes']}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Toggle with "Yes" selected. Shows blue background on positive option, white shadow, green status dot. Includes descriptive help text.',
      },
    },
  },
};

export const BinaryToggleNoSelected: StoryObj = {
  render: () => {
    const [value, setValue] = useState('No');
    return (
      <BinaryToggleSelector
        label="Wireless Module"
        description="Enable wireless connectivity via LoRa or WiFi"
        options={['No', 'Yes']}
        value={value}
        onChange={setValue}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Toggle with "No" selected. Shows white background on negative option with shadow. Gray status dot. Positive option (Yes) is unselected.',
      },
    },
  },
};

export const BinaryToggleCustomOptions: StoryObj = {
  render: () => {
    const [value, setValue] = useState('Included');
    return (
      <BinaryToggleSelector
        label="Calibration Certificate"
        options={['Not Included', 'Included']}
        value={value}
        onChange={setValue}
        description="Add NIST-traceable calibration certificate (adds 5-7 business days)"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Toggle with custom option labels. "Included" detected as positive option (shown on right with blue). Green status dot indicates positive selection.',
      },
    },
  },
};

/**
 * All Form Components Together
 */
export const AllFormComponents: StoryObj = {
  render: () => {
    const [output, setOutput] = useState('Standard');
    const [range, setRange] = useState('0-100°F');
    const [color, setColor] = useState('White');
    const [display, setDisplay] = useState('Yes');

    return (
      <div className="space-y-8">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">Configure Your Sensor</h2>
          <p className="text-neutral-600">
            Use the form components below to customize your temperature sensor
          </p>
        </div>

        <RadioGroupSelector
          label="Output Type"
          description="Select the electrical output signal type"
          options={['Standard', 'Enhanced', 'Premium']}
          value={output}
          onChange={setOutput}
        />

        <DropdownSelector
          label="Temperature Range"
          description="Select the operating temperature range for your sensor"
          options={[
            '0-50°F',
            '0-100°F',
            '32-122°F',
            '50-90°F',
            '-40-125°F',
            '-20-80°F',
            '0-200°F',
            '32-212°F',
          ]}
          value={range}
          onChange={setRange}
        />

        <ColorSwatchSelector
          label="Housing Color"
          options={['White', 'Black', 'Gray', 'Beige']}
          value={color}
          onChange={setColor}
        />

        <BinaryToggleSelector
          label="LCD Display"
          description="Add LCD display for local temperature reading"
          options={['No', 'Yes']}
          value={display}
          onChange={setDisplay}
        />

        <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-primary-900">Current Configuration</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Output Type:</span> {output || 'Not selected'}
            </p>
            <p>
              <span className="font-semibold">Temperature Range:</span> {range || 'Not selected'}
            </p>
            <p>
              <span className="font-semibold">Housing Color:</span> {color || 'Not selected'}
            </p>
            <p>
              <span className="font-semibold">LCD Display:</span> {display || 'Not selected'}
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete form showing all 4 component types in product configuration flow. All selections tracked in summary box below. Interactive - change any value to see real-time updates.',
      },
    },
  },
};

/**
 * Mobile View
 */
export const MobileFormComponents: StoryObj = {
  render: () => {
    const [output, setOutput] = useState('Enhanced');
    const [range, setRange] = useState('0-100°F');
    const [color, setColor] = useState('Black');
    const [display, setDisplay] = useState('Yes');

    return (
      <div className="space-y-6">
        <RadioGroupSelector
          label="Output Type"
          options={['Standard', 'Enhanced', 'Premium']}
          value={output}
          onChange={setOutput}
        />

        <DropdownSelector
          label="Temperature Range"
          options={['0-50°F', '0-100°F', '32-122°F', '50-90°F']}
          value={range}
          onChange={setRange}
        />

        <ColorSwatchSelector
          label="Housing Color"
          options={['White', 'Black', 'Gray', 'Beige']}
          value={color}
          onChange={setColor}
        />

        <BinaryToggleSelector
          label="LCD Display"
          options={['No', 'Yes']}
          value={display}
          onChange={setDisplay}
        />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12pro',
    },
    docs: {
      description: {
        story:
          'Form components on mobile (390px width). Radio buttons and selectors stack vertically. Touch-optimized with larger hit areas. Color swatches wrap across rows.',
      },
    },
  },
};
