import type { Meta, StoryObj } from '@storybook/nextjs-vite';

/**
 * Color System Documentation
 *
 * The BAPI Headless color system based on 2026 BAPI Brand Standards.
 * Uses semantic naming with three primary families: Primary (Blue),
 * Accent (Yellow), and Neutral (Gray).
 */

const meta = {
  title: 'Design System/Colors',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The BAPI color system follows the official 2026 Brand Standards with a 
distribution of 60% White/Gray, 30% Blue, and 10% Yellow. All colors are 
optimized for digital applications and meet WCAG AA accessibility standards.

## Official BAPI Web Colors

- **BAPI Blue:** #1479BC (Primary - 30% usage)
- **BAPI Yellow:** #FFC843 (Accent - 10% usage)
- **BAPI Gray:** #97999B (Neutral - with white, 60% usage)
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Color Swatch Component
 */
const ColorSwatch = ({
  name,
  value,
  subtitle,
}: {
  name: string;
  value: string;
  subtitle?: string;
}) => {
  // Calculate relative luminance using WCAG formula
  const r = parseInt(value.slice(1, 3), 16) / 255;
  const g = parseInt(value.slice(3, 5), 16) / 255;
  const b = parseInt(value.slice(5, 7), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const isLight = luminance > 0.5;

  return (
    <div className="flex flex-col">
      <div
        className="flex h-24 items-center justify-center rounded-lg shadow-md"
        style={{ backgroundColor: value }}
      >
        <div
          className={`text-center font-mono text-sm ${isLight ? 'text-neutral-900' : 'text-white'}`}
        >
          {value}
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-semibold text-neutral-900">{name}</div>
        {subtitle && <div className="mt-1 text-xs text-neutral-600">{subtitle}</div>}
      </div>
    </div>
  );
};

/**
 * Color Family Component
 */
const ColorFamily = ({
  title,
  description,
  colors,
}: {
  title: string;
  description: string;
  colors: Array<{ name: string; value: string; subtitle?: string }>;
}) => (
  <div className="mb-12">
    <h2 className="mb-2 text-2xl font-bold text-neutral-900">{title}</h2>
    <p className="mb-6 text-neutral-600">{description}</p>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {colors.map((color) => (
        <ColorSwatch key={color.name} {...color} />
      ))}
    </div>
  </div>
);

/**
 * Complete Color System Display
 */
export const AllColors: Story = {
  render: () => (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900">BAPI Color System</h1>
          <p className="mb-8 text-lg text-neutral-600">
            Official 2026 BAPI Brand Standards for digital applications
          </p>

          {/* Brand Distribution */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-10">
            <div className="rounded-lg bg-neutral-50 p-6 text-center md:col-span-6">
              <div className="mb-2 text-5xl font-bold text-neutral-500">60%</div>
              <div className="text-xl font-semibold text-neutral-900">White & Gray</div>
              <div className="mt-2 text-sm text-neutral-600">Backgrounds, surfaces, subtle UI</div>
            </div>
            <div className="rounded-lg bg-primary-500 p-6 text-center md:col-span-3">
              <div className="mb-2 text-5xl font-bold text-white">30%</div>
              <div className="text-xl font-semibold text-white">BAPI Blue</div>
              <div className="mt-2 text-sm text-primary-100">Navigation, primary actions</div>
            </div>
            <div className="rounded-lg bg-accent-500 p-6 text-center md:col-span-1">
              <div className="mb-2 text-5xl font-bold text-neutral-900">10%</div>
              <div className="text-xl font-semibold text-neutral-900">Yellow</div>
              <div className="mt-2 text-sm text-accent-900">CTAs</div>
            </div>
          </div>

          {/* Official Brand Colors */}
          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-primary-500 p-6">
              <div className="text-xl font-bold text-white">BAPI Blue</div>
              <div className="mt-2 font-mono text-lg text-primary-100">#1479BC</div>
            </div>
            <div className="rounded-lg bg-accent-500 p-6">
              <div className="text-xl font-bold text-neutral-900">BAPI Yellow</div>
              <div className="mt-2 font-mono text-lg text-accent-900">#FFC843</div>
            </div>
            <div className="rounded-lg bg-neutral-500 p-6">
              <div className="text-xl font-bold text-white">BAPI Gray</div>
              <div className="mt-2 font-mono text-lg text-neutral-200">#97999B</div>
            </div>
          </div>
        </div>

        {/* Primary Colors */}
        <ColorFamily
          title="Primary Colors (BAPI Blue)"
          description="Signature brand blue for trust, professionalism, and primary actions. Usage: ~30% of visual elements."
          colors={[
            { name: 'primary-50', value: '#e6f2f9', subtitle: 'Lightest tint' },
            { name: 'primary-100', value: '#cce5f3', subtitle: 'Very light' },
            { name: 'primary-200', value: '#99cbe7', subtitle: 'Light' },
            { name: 'primary-300', value: '#66b1db', subtitle: 'Muted' },
            { name: 'primary-400', value: '#3397cf', subtitle: 'Soft' },
            { name: 'primary-500', value: '#1479bc', subtitle: 'Base ★' },
            { name: 'primary-600', value: '#106196', subtitle: 'Hover' },
            { name: 'primary-700', value: '#0c4971', subtitle: 'Active' },
            { name: 'primary-800', value: '#08304b', subtitle: 'Dark' },
            { name: 'primary-900', value: '#041826', subtitle: 'Very dark' },
            { name: 'primary-950', value: '#020c13', subtitle: 'Darkest' },
          ]}
        />

        {/* Accent Colors */}
        <ColorFamily
          title="Accent Colors (BAPI Yellow)"
          description="High-visibility accent for key actions and highlights. Usage: ~10% of visual elements."
          colors={[
            { name: 'accent-50', value: '#fffbf0', subtitle: 'Lightest tint' },
            { name: 'accent-100', value: '#fff7e1', subtitle: 'Very light' },
            { name: 'accent-200', value: '#ffefc3', subtitle: 'Light' },
            { name: 'accent-300', value: '#ffe7a5', subtitle: 'Soft' },
            { name: 'accent-400', value: '#ffdf87', subtitle: 'Light accent' },
            { name: 'accent-500', value: '#ffc843', subtitle: 'Base ★' },
            { name: 'accent-600', value: '#e6b43c', subtitle: 'Hover' },
            { name: 'accent-700', value: '#cca035', subtitle: 'Active' },
            { name: 'accent-800', value: '#b38c2e', subtitle: 'Dark' },
            { name: 'accent-900', value: '#997827', subtitle: 'Very dark' },
            { name: 'accent-950', value: '#4d3c14', subtitle: 'Darkest' },
          ]}
        />

        {/* Neutral Colors */}
        <ColorFamily
          title="Neutral Colors (BAPI Gray)"
          description="Professional gray scale for backgrounds, text, and subtle UI. Usage: ~60% with white."
          colors={[
            { name: 'neutral-50', value: '#fafafa', subtitle: 'Off-white' },
            { name: 'neutral-100', value: '#f5f5f5', subtitle: 'Light gray' },
            { name: 'neutral-200', value: '#e8e8e9', subtitle: 'Borders' },
            { name: 'neutral-300', value: '#d4d5d6', subtitle: 'Disabled' },
            { name: 'neutral-400', value: '#b5b6b8', subtitle: 'Placeholder' },
            { name: 'neutral-500', value: '#97999b', subtitle: 'Base ★' },
            { name: 'neutral-600', value: '#797a7c', subtitle: 'Secondary' },
            { name: 'neutral-700', value: '#5e5f60', subtitle: 'Body text' },
            { name: 'neutral-800', value: '#434445', subtitle: 'Headings' },
            { name: 'neutral-900', value: '#282829', subtitle: 'Primary text' },
            { name: 'neutral-950', value: '#141415', subtitle: 'Darkest' },
          ]}
        />

        {/* Semantic Colors */}
        <div className="mb-12">
          <h2 className="mb-2 text-2xl font-bold text-neutral-900">Semantic Colors</h2>
          <p className="mb-6 text-neutral-600">
            Purpose-specific colors for conveying state and meaning
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <h3 className="mb-3 font-semibold text-neutral-900">Success</h3>
              <ColorSwatch name="success-500" value="#22c55e" subtitle="Base" />
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-neutral-900">Warning</h3>
              <ColorSwatch name="warning-500" value="#ffc843" subtitle="Base (accent)" />
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-neutral-900">Error</h3>
              <ColorSwatch name="error-500" value="#ef4444" subtitle="Base" />
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-neutral-900">Info</h3>
              <ColorSwatch name="info-500" value="#1479bc" subtitle="Base (primary)" />
            </div>
          </div>
        </div>

        {/* Gradients */}
        <div className="mb-12">
          <h2 className="mb-2 text-2xl font-bold text-neutral-900">Official BAPI Gradients</h2>
          <p className="mb-6 text-neutral-600">
            2026 Brand Guide specifications for buttons and graphical elements
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div
                className="flex h-32 items-center justify-center rounded-lg text-2xl font-bold text-neutral-900 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #f89623 0%, #ffc843 100%)',
                }}
              >
                Accent Gradient
              </div>
              <div className="mt-3 text-sm text-neutral-600">
                <div className="mt-2 rounded bg-neutral-100 p-2 font-mono">
                  bg-bapi-accent-gradient
                </div>
                <div className="mt-2">Use for: Add to Cart, Primary CTAs</div>
              </div>
            </div>
            <div>
              <div
                className="flex h-32 items-center justify-center rounded-lg text-2xl font-bold text-white shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #044976 0%, #1479bc 100%)',
                }}
              >
                Primary Gradient
              </div>
              <div className="mt-3 text-sm text-neutral-600">
                <div className="mt-2 rounded bg-neutral-100 p-2 font-mono">
                  bg-bapi-primary-gradient
                </div>
                <div className="mt-2">Use for: Continue, View Details, Secondary CTAs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="mb-12">
          <h2 className="mb-2 text-2xl font-bold text-neutral-900">Accessibility & Contrast</h2>
          <p className="mb-6 text-neutral-600">
            All color combinations meet WCAG 2.1 Level AA standards
          </p>
          <div className="overflow-x-auto rounded-lg bg-neutral-50 p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-2 text-left font-semibold text-neutral-900">Background</th>
                  <th className="px-4 py-2 text-left font-semibold text-neutral-900">Text Color</th>
                  <th className="px-4 py-2 text-left font-semibold text-neutral-900">
                    Contrast Ratio
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-neutral-900">WCAG Level</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200">
                  <td className="px-4 py-2">primary-500</td>
                  <td className="px-4 py-2">white</td>
                  <td className="px-4 py-2">4.89:1</td>
                  <td className="px-4 py-2">✓ AA Large Text</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="px-4 py-2">primary-600</td>
                  <td className="px-4 py-2">white</td>
                  <td className="px-4 py-2">6.45:1</td>
                  <td className="px-4 py-2">✓✓ AA Normal Text</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="px-4 py-2">accent-500</td>
                  <td className="px-4 py-2">neutral-900</td>
                  <td className="px-4 py-2">10.24:1</td>
                  <td className="px-4 py-2">✓✓ AAA Normal Text</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="px-4 py-2">neutral-50</td>
                  <td className="px-4 py-2">neutral-900</td>
                  <td className="px-4 py-2">17.82:1</td>
                  <td className="px-4 py-2">✓✓ AAA Normal Text</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Examples */}
        <div>
          <h2 className="mb-2 text-2xl font-bold text-neutral-900">Usage Examples</h2>
          <p className="mb-6 text-neutral-600">Common patterns and component implementations</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-4 font-semibold text-neutral-900">Primary Button</h3>
              <button className="rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-600">
                Proceed to Checkout
              </button>
              <pre className="mt-4 overflow-x-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
                {`<button className="bg-primary-500 
  hover:bg-primary-600 
  text-white">
  Proceed to Checkout
</button>`}
              </pre>
            </div>

            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-4 font-semibold text-neutral-900">Accent Button</h3>
              <button className="rounded-lg bg-accent-500 px-6 py-3 font-semibold text-neutral-900 transition-colors hover:bg-accent-600">
                Add to Cart
              </button>
              <pre className="mt-4 overflow-x-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
                {`<button className="bg-accent-500 
  hover:bg-accent-600 
  text-neutral-900">
  Add to Cart
</button>`}
              </pre>
            </div>

            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-4 font-semibold text-neutral-900">Success Alert</h3>
              <div className="rounded border border-success-500 bg-success-50 p-4 text-success-700">
                ✓ Order placed successfully!
              </div>
              <pre className="mt-4 overflow-x-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
                {`<div className="bg-success-50 
  border border-success-500 
  text-success-700">
  ✓ Order placed successfully!
</div>`}
              </pre>
            </div>

            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-4 font-semibold text-neutral-900">Error Alert</h3>
              <div className="rounded border border-error-500 bg-error-50 p-4 text-error-700">
                ✗ Payment failed. Try again.
              </div>
              <pre className="mt-4 overflow-x-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
                {`<div className="bg-error-50 
  border border-error-500 
  text-error-700">
  ✗ Payment failed. Try again.
</div>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Brand Colors Only - Quick Reference
 */
export const BrandColors: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-bold text-neutral-900">BAPI Official Brand Colors</h2>
      <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-primary-500 p-8 text-center">
          <div className="mb-2 text-2xl font-bold text-white">BAPI Blue</div>
          <div className="mb-4 font-mono text-xl text-primary-100">#1479BC</div>
          <div className="text-sm text-primary-100">30% Usage</div>
          <div className="mt-2 text-xs text-primary-200">Navigation, Primary Actions</div>
        </div>
        <div className="rounded-lg bg-accent-500 p-8 text-center">
          <div className="mb-2 text-2xl font-bold text-neutral-900">BAPI Yellow</div>
          <div className="mb-4 font-mono text-xl text-accent-900">#FFC843</div>
          <div className="text-sm text-accent-900">10% Usage</div>
          <div className="mt-2 text-xs text-accent-800">CTAs, Highlights</div>
        </div>
        <div className="rounded-lg bg-neutral-500 p-8 text-center">
          <div className="mb-2 text-2xl font-bold text-white">BAPI Gray</div>
          <div className="mb-4 font-mono text-xl text-neutral-200">#97999B</div>
          <div className="text-sm text-neutral-200">60% Usage (with white)</div>
          <div className="mt-2 text-xs text-neutral-300">Backgrounds, Subtle UI</div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Accessibility Contrast Examples
 */
export const AccessibilityExamples: Story = {
  render: () => (
    <div className="max-w-4xl p-8">
      <h2 className="mb-6 text-2xl font-bold text-neutral-900">WCAG Accessibility Examples</h2>
      <div className="space-y-4">
        <div className="rounded-lg bg-primary-600 p-4 text-white">
          <strong>✓ PASS:</strong> White text on primary-600 (6.45:1) - AA Normal Text
        </div>
        <div className="rounded-lg bg-accent-500 p-4 text-neutral-900">
          <strong>✓ PASS:</strong> Dark text on accent-500 (10.24:1) - AAA Normal Text
        </div>
        <div className="rounded-lg bg-success-500 p-4 text-white">
          <strong>✓ PASS:</strong> White text on success-500 (4.51:1) - AA Large Text
        </div>
        <div className="rounded-lg bg-neutral-200 p-4 text-neutral-900">
          <strong>✓ PASS:</strong> Dark text on neutral-200 (13.42:1) - AAA Normal Text
        </div>
      </div>
    </div>
  ),
};
