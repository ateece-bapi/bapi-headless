import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * Typography System Documentation
 * 
 * The BAPI typography system uses Roboto for its clean, professional appearance
 * suitable for technical documentation. The system includes a comprehensive scale
 * for headings, body text, and UI elements with proper line heights and spacing.
 */

const meta = {
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
- **Monospace (Code):**mono Roboto Mono - For code samples and technical data
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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
    <div className="mb-8 pb-8 border-b border-neutral-200 last:border-0">
      <Tag className={className}>{children}</Tag>
      <div className="mt-4 bg-neutral-50 p-4 rounded-lg">
        <div className="text-sm font-semibold text-neutral-900 mb-1">{description}</div>
        <code className="text-xs text-neutral-600 font-mono">{tailwind}</code>
      </div>
    </div>
  );
};

/**
 * Complete Typography System
 */
export const AllTypography: Story = {
  render: () => (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Typography System</h1>
          <p className="text-lg text-neutral-600">
            Professional, accessible text styles for the BAPI Headless platform using Roboto font family.
          </p>
        </div>

        {/* Font Families */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Font Families</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-50 p-6 rounded-lg">
              <div className="font-sans text-2xl font-semibold text-neutral-900 mb-2">
                Roboto Sans-Serif
              </div>
              <div className="text-sm text-neutral-600 mb-4">Primary font for all UI text</div>
              <div className="text-neutral-700">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789
              </div>
              <code className="text-xs text-neutral-600 font-mono mt-3 block">
                font-family: 'Roboto', Arial, Helvetica, sans-serif
              </code>
            </div>
            <div className="bg-neutral-50 p-6 rounded-lg">
              <div className="font-mono text-2xl font-semibold text-neutral-900 mb-2">
                Roboto Mono
              </div>
              <div className="text-sm text-neutral-600 mb-4">Monospace for code and technical data</div>
              <div className="font-mono text-neutral-700">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789 &lt;/&gt; {} []
              </div>
              <code className="text-xs text-neutral-600 font-mono mt-3 block">
                font-family: 'Roboto Mono', 'Consolas', monospace
              </code>
            </div>
          </div>
        </div>

        {/* Heading Scale */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Heading Scale</h2>
          
          <TypographyExample
            tag="h1"
            className="text-5xl font-bold text-neutral-900 leading-tight"
            description="H1 - Page Title"
            tailwind="text-5xl font-bold text-neutral-900 leading-tight"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h2"
            className="text-4xl font-bold text-neutral-900 leading-tight"
            description="H2 - Major Section Heading"
            tailwind="text-4xl font-bold text-neutral-900 leading-tight"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h3"
            className="text-3xl font-semibold text-neutral-900 leading-snug"
            description="H3 - Section Heading"
            tailwind="text-3xl font-semibold text-neutral-900 leading-snug"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h4"
            className="text-2xl font-semibold text-neutral-900 leading-snug"
            description="H4 - Subsection Heading"
            tailwind="text-2xl font-semibold text-neutral-900 leading-snug"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h5"
            className="text-xl font-semibold text-neutral-900 leading-normal"
            description="H5 - Minor Heading"
            tailwind="text-xl font-semibold text-neutral-900 leading-normal"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>

          <TypographyExample
            tag="h6"
            className="text-lg font-semibold text-neutral-900 leading-normal"
            description="H6 - Small Heading"
            tailwind="text-lg font-semibold text-neutral-900 leading-normal"
          >
            The quick brown fox jumps over the lazy dog
          </TypographyExample>
        </div>

        {/* Body Text Sizes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Body Text Sizes</h2>

          <TypographyExample
            tag="p"
            className="text-xl text-neutral-700 leading-relaxed"
            description="Extra Large Body Text - for introductions"
            tailwind="text-xl text-neutral-700 leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </TypographyExample>

          <TypographyExample
            tag="p"
            className="text-lg text-neutral-700 leading-relaxed"
            description="Large Body Text - for feature descriptions"
            tailwind="text-lg text-neutral-700 leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </TypographyExample>

          <TypographyExample
            tag="p"
            className="text-base text-neutral-700 leading-relaxed"
            description="Base Body Text - default paragraph style"
            tailwind="text-base text-neutral-700 leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </TypographyExample>

          <TypographyExample
            tag="p"
            className="text-sm text-neutral-600 leading-normal"
            description="Small Body Text - for captions and secondary info"
            tailwind="text-sm text-neutral-600 leading-normal"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </TypographyExample>

          <TypographyExample
            tag="p"
            className="text-xs text-neutral-500 leading-normal"
            description="Extra Small Text - for labels and metadata"
            tailwind="text-xs text-neutral-500 leading-normal"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </TypographyExample>
        </div>

        {/* Font Weights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Font Weights</h2>
          <div className="space-y-4">
            <div className="flex items-baseline gap-4 pb-4 border-b border-neutral-200">
              <span className="font-light text-2xl text-neutral-900 flex-1">
                Light (300) - Rarely used
              </span>
              <code className="text-xs text-neutral-600 font-mono">font-light</code>
            </div>
            <div className="flex items-baseline gap-4 pb-4 border-b border-neutral-200">
              <span className="font-normal text-2xl text-neutral-900 flex-1">
                Normal (400) - Body text default
              </span>
              <code className="text-xs text-neutral-600 font-mono">font-normal</code>
            </div>
            <div className="flex items-baseline gap-4 pb-4 border-b border-neutral-200">
              <span className="font-medium text-2xl text-neutral-900 flex-1">
                Medium (500) - Emphasis within text
              </span>
              <code className="text-xs text-neutral-600 font-mono">font-medium</code>
            </div>
            <div className="flex items-baseline gap-4 pb-4 border-b border-neutral-200">
              <span className="font-semibold text-2xl text-neutral-900 flex-1">
                Semibold (600) - Subheadings
              </span>
              <code className="text-xs text-neutral-600 font-mono">font-semibold</code>
            </div>
            <div className="flex items-baseline gap-4 pb-4">
              <span className="font-bold text-2xl text-neutral-900 flex-1">
                Bold (700) - Headings and strong emphasis
              </span>
              <code className="text-xs text-neutral-600 font-mono">font-bold</code>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Text Colors</h2>
          <div className="bg-neutral-50 p-6 rounded-lg space-y-3">
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
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Special Text Styles</h2>
          
          <div className="space-y-6">
            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-3">Links</h3>
              <p className="text-neutral-700 mb-2">
                Inline links use <a href="#" className="text-primary-500 hover:text-primary-600 underline">primary color with underline</a> for clear affordance.
              </p>
              <code className="text-xs text-neutral-600 font-mono">
                text-primary-500 hover:text-primary-600 underline
              </code>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-3">Code Inline</h3>
              <p className="text-neutral-700 mb-2">
                Use <code className="bg-neutral-200 text-neutral-900 px-2 py-1 rounded font-mono text-sm">monospace font</code> for inline code snippets.
              </p>
              <code className="text-xs text-neutral-600 font-mono">
                bg-neutral-200 text-neutral-900 px-2 py-1 rounded font-mono text-sm
              </code>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-3">Code Block</h3>
              <pre className="bg-neutral-900 text-neutral-100 p-4 rounded overflow-x-auto font-mono text-sm">
{`function addToCart(productId: string) {
  // Implementation here
  return true;
}`}
              </pre>
              <code className="text-xs text-neutral-600 font-mono mt-2 block">
                bg-neutral-900 text-neutral-100 p-4 rounded font-mono text-sm
              </code>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-3">Emphasis</h3>
              <p className="text-neutral-700">
                Use <strong className="font-semibold">bold for strong emphasis</strong> and <em className="italic">italic for subtle emphasis</em>.
              </p>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-3">Lists</h3>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Unordered lists use disc bullets</li>
                <li>Each item has proper spacing</li>
                <li>Text color matches body text</li>
              </ul>
              <ol className="list-decimal list-inside text-neutral-700 space-y-2 mt-4">
                <li>Ordered lists use numbers</li>
                <li>Consistent spacing between items</li>
                <li>Same styling as unordered lists</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Line Heights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Line Heights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-3">Tight (leading-tight)</h4>
              <p className="leading-tight text-neutral-700">
                Used for large headings where vertical space is premium. Creates a compact,
                impactful look. Line height: 1.25
              </p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-3">Snug (leading-snug)</h4>
              <p className="leading-snug text-neutral-700">
                Slightly more breathing room than tight. Good for subheadings and medium-size text.
                Line height: 1.375
              </p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-3">Normal (leading-normal)</h4>
              <p className="leading-normal text-neutral-700">
                Default line height for most UI elements. Balanced spacing for buttons and short text.
                Line height: 1.5
              </p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-3">Relaxed (leading-relaxed)</h4>
              <p className="leading-relaxed text-neutral-700">
                Ideal for body text and long-form content. Improves readability for paragraphs.
                Line height: 1.625
              </p>
            </div>
          </div>
        </div>

        {/* Real-World Example */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Real-World Example</h2>
          <div className="bg-neutral-50 p-8 rounded-lg">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Building Automation Temperature Sensors
            </h1>
            <p className="text-lg text-neutral-600 mb-6">
              Precision sensors for HVAC applications
            </p>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Product Features
            </h2>
            <p className="text-base text-neutral-700 leading-relaxed mb-4">
              Our temperature sensors deliver reliable, accurate measurements for commercial and 
              industrial HVAC systems. Built to <strong>NIST standards</strong> with calibration 
              certificates available.
            </p>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 mb-6">
              <li>10K Type III thermistor technology</li>
              <li>±0.2°F accuracy at 70°F</li>
              <li>Operating range: -40°F to 257°F</li>
            </ul>
            <div className="flex gap-4">
              <button className="bg-accent-500 hover:bg-accent-600 text-neutral-900 px-6 py-3 rounded-lg font-semibold">
                Add to Cart
              </button>
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold">
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
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold text-neutral-900 leading-tight">
          Heading 1 - Page Title (text-5xl font-bold)
        </h1>
        <h2 className="text-4xl font-bold text-neutral-900 leading-tight">
          Heading 2 - Major Section (text-4xl font-bold)
        </h2>
        <h3 className="text-3xl font-semibold text-neutral-900 leading-snug">
          Heading 3 - Section Heading (text-3xl font-semibold)
        </h3>
        <h4 className="text-2xl font-semibold text-neutral-900 leading-snug">
          Heading 4 - Subsection (text-2xl font-semibold)
        </h4>
        <h5 className="text-xl font-semibold text-neutral-900 leading-normal">
          Heading 5 - Minor Heading (text-xl font-semibold)
        </h5>
        <h6 className="text-lg font-semibold text-neutral-900 leading-normal">
          Heading 6 - Small Heading (text-lg font-semibold)
        </h6>
        <p className="text-base text-neutral-700 leading-relaxed">
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
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">Text Color Hierarchy</h2>
      <div className="space-y-3 bg-white p-6 rounded-lg">
        <p className="text-neutral-950 text-lg">neutral-950 - Darkest (maximum emphasis)</p>
        <p className="text-neutral-900 text-lg">neutral-900 - Primary text (headings)</p>
        <p className="text-neutral-800 text-lg">neutral-800 - Strong emphasis</p>
        <p className="text-neutral-700 text-lg">neutral-700 - Body text (default)</p>
        <p className="text-neutral-600 text-lg">neutral-600 - Secondary text</p>
        <p className="text-neutral-500 text-lg">neutral-500 - Tertiary text</p>
        <p className="text-neutral-400 text-lg">neutral-400 - Placeholder text</p>
        <p className="text-neutral-300 text-lg">neutral-300 - Disabled text</p>
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
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
          Responsive Heading
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-neutral-700 leading-relaxed">
          This text scales responsively across breakpoints using Tailwind's responsive modifiers.
          On mobile (default), it uses smaller sizes. On tablet (md:), it increases. On desktop (lg:),
          it reaches its maximum size for optimal readability.
        </p>
        <div className="mt-6 bg-neutral-50 p-4 rounded-lg">
          <code className="text-xs text-neutral-600 font-mono">
            text-base md:text-lg lg:text-xl
          </code>
        </div>
      </div>
    </div>
  ),
};
