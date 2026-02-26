import type { Meta, StoryObj } from '@storybook/nextjs-vite';

/**
 * Typography System Documentation
 *
 * The BAPI typography system uses Roboto for its clean, professional appearance
 * suitable for technical documentation. The system includes a comprehensive scale
 * for headings, body text, and UI elements with proper line heights and spacing.
 */

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The typography system provides a consistent, accessible text hierarchy using
Google's Roboto font family. All text styles follow WCAG accessibility guidelines
with proper contrast ratios, line heights, and font sizes optimized for readability.

## Font Families

- **Sans-serif (Primary):** Roboto - Modern, clean, highly legible
- **Monospace (Code):** Roboto Mono - For code samples and technical data
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * Typography Sample Component
 */
const TypographyExample = ({
  tag,
  className,
  children,
  description,
  tailwind,
}: {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  children: React.ReactNode;
  description: string;
  tailwind: string;
}) => {
  const Tag = tag;
  return (
    <div className="mb-8 border-b border-neutral-200 pb-8 last:border-0">
      <Tag className={className}>{children}</Tag>
      <div className="mt-4 rounded-lg bg-neutral-50 p-4">
        <div className="mb-1 text-sm font-semibold text-neutral-900">{description}</div>
        <code className="font-mono text-xs text-neutral-600">{tailwind}</code>
      </div>
    </div>
  );
};

/**
 * Complete Typography System
 */
export const AllTypography: Story = {
  render: () => (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900">Typography System</h1>
          <p className="text-lg text-neutral-600">
            Professional, accessible text styles for the BAPI Headless platform using Roboto font
            family.
          </p>
        </div>

        {/* Font Families */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">Font Families</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-neutral-50 p-6">
              <div className="mb-2 font-sans text-2xl font-semibold text-neutral-900">
                Roboto Sans-Serif
              </div>
              <div className="mb-4 text-sm text-neutral-600">Primary font for all UI text</div>
              <div className="text-neutral-700">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz
                <br />
                0123456789
              </div>
              <code className="mt-3 block font-mono text-xs text-neutral-600">
                font-family: 'Roboto', Arial, Helvetica, sans-serif
              </code>
            </div>
            <div className="rounded-lg bg-neutral-50 p-6">
              <div className="mb-2 font-mono text-2xl font-semibold text-neutral-900">
                Roboto Mono
              </div>
              <div className="mb-4 text-sm text-neutral-600">
                Monospace for code and technical data
              </div>
              <div className="font-mono text-neutral-700">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz
                <br />
                0123456789 &lt;/&gt; {} []
              </div>
              <code className="mt-3 block font-mono text-xs text-neutral-600">
                font-family: 'Roboto Mono', 'Consolas', monospace
              </code>
            </div>
          </div>
        </div>

        {/* Heading Scale */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">Heading Scale</h2>

          <TypographyExample
            tag="h1"
            className="text-5xl font-bold leading-tight text-neutral-900"
            description="H1 - Page Title"
            tailwind="text-5xl font-bold text-neutral-900 leading-tight"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h2"
            className="text-4xl font-bold leading-tight text-neutral-900"
            description="H2 - Major Section Heading"
            tailwind="text-4xl font-bold text-neutral-900 leading-tight"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h3"
            className="text-3xl font-semibold leading-snug text-neutral-900"
            description="H3 - Section Heading"
            tailwind="text-3xl font-semibold text-neutral-900 leading-snug"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h4"
            className="text-2xl font-semibold leading-snug text-neutral-900"
            description="H4 - Subsection Heading"
            tailwind="text-2xl font-semibold text-neutral-900 leading-snug"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h5"
            className="text-xl font-semibold leading-normal text-neutral-900"
            description="H5 - Minor Heading"
            tailwind="text-xl font-semibold text-neutral-900 leading-normal"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h6"
            className="text-lg font-semibold leading-normal text-neutral-900"
            description="H6 - Small Heading"
            tailwind="text-lg font-semibold text-neutral-900 leading-normal"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>
        </div>

        {/* Body Text Sizes */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">Body Text Sizes</h2>

          <TypographyExample
            tag="p"
            className="text-xl leading-relaxed text-neutral-700"
            description="Extra Large Body Text - for introductions"
            tailwind="text-xl text-neutral-700 leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </TypographyExample>

          <TypographyExample
            tag="p"
            className="text-lg leading-relaxed text-neutral-700"
            description="Large Body Text - for feature descriptions"
            tailwind="text-lg text-neutral-700 leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </TypographyExample>

          <TypographyExample
            tag="p"
            className="text-base leading-relaxed text-neutral-700"
            description="Base Body Text - default paragraph style"
            tailwind="text-base text-neutral-700 leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </TypographyExample>

          <TypographyExample
            tag="p"
            className="text-sm leading-normal text-neutral-600"
            description="Small Body Text - for captions and secondary info"
            tailwind="text-sm text-neutral-600 leading-normal"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </TypographyExample>

          <TypographyExample
            tag="p"
            className="text-xs leading-normal text-neutral-500"
            description="Extra Small Text - for labels and metadata"
            tailwind="text-xs text-neutral-500 leading-normal"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </TypographyExample>
        </div>

        {/* Font Weights */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">Font Weights</h2>
          <div className="space-y-4">
            <div className="flex items-baseline gap-4 border-b border-neutral-200 pb-4">
              <span className="flex-1 text-2xl font-light text-neutral-900">
                Light (300) - Rarely used
              </span>
              <code className="font-mono text-xs text-neutral-600">font-light</code>
            </div>
            <div className="flex items-baseline gap-4 border-b border-neutral-200 pb-4">
              <span className="flex-1 text-2xl font-normal text-neutral-900">
                Normal (400) - Body text default
              </span>
              <code className="font-mono text-xs text-neutral-600">font-normal</code>
            </div>
            <div className="flex items-baseline gap-4 border-b border-neutral-200 pb-4">
              <span className="flex-1 text-2xl font-medium text-neutral-900">
                Medium (500) - Emphasis within text
              </span>
              <code className="font-mono text-xs text-neutral-600">font-medium</code>
            </div>
            <div className="flex items-baseline gap-4 border-b border-neutral-200 pb-4">
              <span className="flex-1 text-2xl font-semibold text-neutral-900">
                Semibold (600) - Subheadings
              </span>
              <code className="font-mono text-xs text-neutral-600">font-semibold</code>
            </div>
            <div className="flex items-baseline gap-4 pb-4">
              <span className="flex-1 text-2xl font-bold text-neutral-900">
                Bold (700) - Headings and strong emphasis
              </span>
              <code className="font-mono text-xs text-neutral-600">font-bold</code>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">Text Colors</h2>
          <div className="space-y-3 rounded-lg bg-neutral-50 p-6">
            <p className="text-neutral-950">
              <strong>neutral-950:</strong> Darkest text - reserved for maximum emphasis
            </p>
            <p className="text-neutral-900">
              <strong>neutral-900:</strong> Primary text - headings and important content
            </p>
            <p className="text-neutral-800">
              <strong>neutral-800:</strong> Strong emphasis - subheadings
            </p>
            <p className="text-neutral-700">
              <strong>neutral-700:</strong> Body text - default paragraph text
            </p>
            <p className="text-neutral-600">
              <strong>neutral-600:</strong> Secondary text - captions and descriptions
            </p>
            <p className="text-neutral-500">
              <strong>neutral-500:</strong> Tertiary text - metadata and labels
            </p>
            <p className="text-neutral-400">
              <strong>neutral-400:</strong> Placeholder text - form inputs
            </p>
            <p className="text-neutral-300">
              <strong>neutral-300:</strong> Disabled text - inactive elements
            </p>
          </div>
        </div>

        {/* Special Text Styles */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">Special Text Styles</h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-3 font-semibold text-neutral-900">Links</h3>
              <p className="mb-2 text-neutral-700">
                Inline links use{' '}
                <a href="#" className="text-primary-500 underline hover:text-primary-600">
                  primary color with underline
                </a>{' '}
                for clear affordance.
              </p>
              <code className="font-mono text-xs text-neutral-600">
                text-primary-500 hover:text-primary-600 underline
              </code>
            </div>

            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-3 font-semibold text-neutral-900">Code Inline</h3>
              <p className="mb-2 text-neutral-700">
                Use{' '}
                <code className="rounded bg-neutral-200 px-2 py-1 font-mono text-sm text-neutral-900">
                  monospace font
                </code>{' '}
                for inline code snippets.
              </p>
              <code className="font-mono text-xs text-neutral-600">
                bg-neutral-200 text-neutral-900 px-2 py-1 rounded font-mono text-sm
              </code>
            </div>

            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-3 font-semibold text-neutral-900">Code Block</h3>
              <pre className="overflow-x-auto rounded bg-neutral-900 p-4 font-mono text-sm text-neutral-100">
                {`function addToCart(productId: string) {
  // Implementation here
  return true;
}`}
              </pre>
              <code className="mt-2 block font-mono text-xs text-neutral-600">
                bg-neutral-900 text-neutral-100 p-4 rounded font-mono text-sm
              </code>
            </div>

            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-3 font-semibold text-neutral-900">Emphasis</h3>
              <p className="text-neutral-700">
                Use <strong className="font-semibold">bold for strong emphasis</strong> and{' '}
                <em className="italic">italic for subtle emphasis</em>.
              </p>
            </div>

            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-3 font-semibold text-neutral-900">Lists</h3>
              <ul className="list-inside list-disc space-y-2 text-neutral-700">
                <li>Unordered lists use disc bullets</li>
                <li>Each item has proper spacing</li>
                <li>Text color matches body text</li>
              </ul>
              <ol className="mt-4 list-inside list-decimal space-y-2 text-neutral-700">
                <li>Ordered lists use numbers</li>
                <li>Consistent spacing between items</li>
                <li>Same styling as unordered lists</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Line Heights */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">Line Heights</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-neutral-50 p-4">
              <h4 className="mb-3 font-semibold text-neutral-900">Tight (leading-tight)</h4>
              <p className="leading-tight text-neutral-700">
                Used for large headings where vertical space is premium. Creates a compact,
                impactful look. Line height: 1.25
              </p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4">
              <h4 className="mb-3 font-semibold text-neutral-900">Snug (leading-snug)</h4>
              <p className="leading-snug text-neutral-700">
                Slightly more breathing room than tight. Good for subheadings and medium-size text.
                Line height: 1.375
              </p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4">
              <h4 className="mb-3 font-semibold text-neutral-900">Normal (leading-normal)</h4>
              <p className="leading-normal text-neutral-700">
                Default line height for most UI elements. Balanced spacing for buttons and short
                text. Line height: 1.5
              </p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4">
              <h4 className="mb-3 font-semibold text-neutral-900">Relaxed (leading-relaxed)</h4>
              <p className="leading-relaxed text-neutral-700">
                Ideal for body text and long-form content. Improves readability for paragraphs. Line
                height: 1.625
              </p>
            </div>
          </div>
        </div>

        {/* Real-World Example */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">Real-World Example</h2>
          <div className="rounded-lg bg-neutral-50 p-8">
            <h1 className="mb-4 text-4xl font-bold text-neutral-900">
              Building Automation Temperature Sensors
            </h1>
            <p className="mb-6 text-lg text-neutral-600">Precision sensors for HVAC applications</p>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">Product Features</h2>
            <p className="mb-4 text-base leading-relaxed text-neutral-700">
              Our temperature sensors deliver reliable, accurate measurements for commercial and
              industrial HVAC systems. Built to <strong>NIST standards</strong> with calibration
              certificates available.
            </p>
            <ul className="mb-6 list-inside list-disc space-y-2 text-neutral-700">
              <li>10K Type III thermistor technology</li>
              <li>±0.2°F accuracy at 70°F</li>
              <li>Operating range: -40°F to 257°F</li>
            </ul>
            <div className="flex gap-4">
              <button className="rounded-lg bg-accent-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-accent-600">
                Add to Cart
              </button>
              <button className="rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white hover:bg-primary-600">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Heading Scale Only - Quick Reference
 */
export const HeadingScale: Story = {
  render: () => (
    <div className="p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-5xl font-bold leading-tight text-neutral-900">
          Heading 1 - Page Title (text-5xl font-bold)
        </h1>
        <h2 className="text-4xl font-bold leading-tight text-neutral-900">
          Heading 2 - Major Section (text-4xl font-bold)
        </h2>
        <h3 className="text-3xl font-semibold leading-snug text-neutral-900">
          Heading 3 - Section Heading (text-3xl font-semibold)
        </h3>
        <h4 className="text-2xl font-semibold leading-snug text-neutral-900">
          Heading 4 - Subsection (text-2xl font-semibold)
        </h4>
        <h5 className="text-xl font-semibold leading-normal text-neutral-900">
          Heading 5 - Minor Heading (text-xl font-semibold)
        </h5>
        <h6 className="text-lg font-semibold leading-normal text-neutral-900">
          Heading 6 - Small Heading (text-lg font-semibold)
        </h6>
        <p className="text-base leading-relaxed text-neutral-700">
          Body text - Base size for paragraphs (text-base text-neutral-700 leading-relaxed)
        </p>
      </div>
    </div>
  ),
};

/**
 * Text Color Variations
 */
export const TextColors: Story = {
  render: () => (
    <div className="max-w-2xl p-8">
      <h2 className="mb-6 text-2xl font-bold text-neutral-900">Text Color Hierarchy</h2>
      <div className="space-y-3 rounded-lg bg-white p-6">
        <p className="text-lg text-neutral-950">neutral-950 - Darkest (maximum emphasis)</p>
        <p className="text-lg text-neutral-900">neutral-900 - Primary text (headings)</p>
        <p className="text-lg text-neutral-800">neutral-800 - Strong emphasis</p>
        <p className="text-lg text-neutral-700">neutral-700 - Body text (default)</p>
        <p className="text-lg text-neutral-600">neutral-600 - Secondary text</p>
        <p className="text-lg text-neutral-500">neutral-500 - Tertiary text</p>
        <p className="text-lg text-neutral-400">neutral-400 - Placeholder text</p>
        <p className="text-lg text-neutral-300">neutral-300 - Disabled text</p>
      </div>
    </div>
  ),
};

/**
 * Responsive Typography Example
 */
export const ResponsiveText: Story = {
  render: () => (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-2xl font-bold text-neutral-900 md:text-3xl lg:text-4xl">
          Responsive Heading
        </h2>
        <p className="text-base leading-relaxed text-neutral-700 md:text-lg lg:text-xl">
          This text scales responsively across breakpoints using Tailwind's responsive modifiers. On
          mobile (default), it uses smaller sizes. On tablet (md:), it increases. On desktop (lg:),
          it reaches its maximum size for optimal readability.
        </p>
        <div className="mt-6 rounded-lg bg-neutral-50 p-4">
          <code className="font-mono text-xs text-neutral-600">
            text-base md:text-lg lg:text-xl
          </code>
        </div>
      </div>
    </div>
  ),
};
