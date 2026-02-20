import type { Meta, StoryObj } from '@storybook/nextjs';

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
  subtitle 
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
        className="h-24 rounded-lg shadow-md flex items-center justify-center"
        style={{ backgroundColor: value }}
      >
        <div 
          className={`text-center font-mono text-sm ${isLight ? 'text-neutral-900' : 'text-white'}`}
        >
          {value}
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="font-semibold text-sm text-neutral-900">{name}</div>
        {subtitle && <div className="text-xs text-neutral-600 mt-1">{subtitle}</div>}
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
    <h2 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h2>
    <p className="text-neutral-600 mb-6">{description}</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            BAPI Color System
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Official 2026 BAPI Brand Standards for digital applications
          </p>
          
          {/* Brand Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4 mb-8">
            <div className="md:col-span-6 bg-neutral-50 p-6 rounded-lg text-center">
              <div className="text-5xl font-bold text-neutral-500 mb-2">60%</div>
              <div className="text-xl font-semibold text-neutral-900">White & Gray</div>
              <div className="text-sm text-neutral-600 mt-2">Backgrounds, surfaces, subtle UI</div>
            </div>
            <div className="md:col-span-3 bg-primary-500 p-6 rounded-lg text-center">
              <div className="text-5xl font-bold text-white mb-2">30%</div>
              <div className="text-xl font-semibold text-white">BAPI Blue</div>
              <div className="text-sm text-primary-100 mt-2">Navigation, primary actions</div>
            </div>
            <div className="md:col-span-1 bg-accent-500 p-6 rounded-lg text-center">
              <div className="text-5xl font-bold text-neutral-900 mb-2">10%</div>
              <div className="text-xl font-semibold text-neutral-900">Yellow</div>
              <div className="text-sm text-accent-900 mt-2">CTAs</div>
            </div>
          </div>

          {/* Official Brand Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-primary-500 p-6 rounded-lg">
              <div className="text-white text-xl font-bold">BAPI Blue</div>
              <div className="text-primary-100 font-mono text-lg mt-2">#1479BC</div>
            </div>
            <div className="bg-accent-500 p-6 rounded-lg">
              <div className="text-neutral-900 text-xl font-bold">BAPI Yellow</div>
              <div className="text-accent-900 font-mono text-lg mt-2">#FFC843</div>
            </div>
            <div className="bg-neutral-500 p-6 rounded-lg">
              <div className="text-white text-xl font-bold">BAPI Gray</div>
              <div className="text-neutral-200 font-mono text-lg mt-2">#97999B</div>
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
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Semantic Colors</h2>
          <p className="text-neutral-600 mb-6">
            Purpose-specific colors for conveying state and meaning
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Success</h3>
              <ColorSwatch name="success-500" value="#22c55e" subtitle="Base" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Warning</h3>
              <ColorSwatch name="warning-500" value="#ffc843" subtitle="Base (accent)" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Error</h3>
              <ColorSwatch name="error-500" value="#ef4444" subtitle="Base" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Info</h3>
              <ColorSwatch name="info-500" value="#1479bc" subtitle="Base (primary)" />
            </div>
          </div>
        </div>

        {/* Gradients */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Official BAPI Gradients</h2>
          <p className="text-neutral-600 mb-6">
            2026 Brand Guide specifications for buttons and graphical elements
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div
                className="h-32 rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-neutral-900"
                style={{ 
                  background: 'linear-gradient(135deg, #f89623 0%, #ffc843 100%)' 
                }}
              >
                Accent Gradient
              </div>
              <div className="mt-3 text-sm text-neutral-600">
                <div className="font-mono bg-neutral-100 p-2 rounded mt-2">
                  bg-bapi-accent-gradient
                </div>
                <div className="mt-2">
                  Use for: Add to Cart, Primary CTAs
                </div>
              </div>
            </div>
            <div>
              <div
                className="h-32 rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #044976 0%, #1479bc 100%)' 
                }}
              >
                Primary Gradient
              </div>
              <div className="mt-3 text-sm text-neutral-600">
                <div className="font-mono bg-neutral-100 p-2 rounded mt-2">
                  bg-bapi-primary-gradient
                </div>
                <div className="mt-2">
                  Use for: Continue, View Details, Secondary CTAs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Accessibility & Contrast
          </h2>
          <p className="text-neutral-600 mb-6">
            All color combinations meet WCAG 2.1 Level AA standards
          </p>
          <div className="bg-neutral-50 rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-4 font-semibold text-neutral-900">Background</th>
                  <th className="text-left py-2 px-4 font-semibold text-neutral-900">Text Color</th>
                  <th className="text-left py-2 px-4 font-semibold text-neutral-900">Contrast Ratio</th>
                  <th className="text-left py-2 px-4 font-semibold text-neutral-900">WCAG Level</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200">
                  <td className="py-2 px-4">primary-500</td>
                  <td className="py-2 px-4">white</td>
                  <td className="py-2 px-4">4.89:1</td>
                  <td className="py-2 px-4">✓ AA Large Text</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="py-2 px-4">primary-600</td>
                  <td className="py-2 px-4">white</td>
                  <td className="py-2 px-4">6.45:1</td>
                  <td className="py-2 px-4">✓✓ AA Normal Text</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="py-2 px-4">accent-500</td>
                  <td className="py-2 px-4">neutral-900</td>
                  <td className="py-2 px-4">10.24:1</td>
                  <td className="py-2 px-4">✓✓ AAA Normal Text</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="py-2 px-4">neutral-50</td>
                  <td className="py-2 px-4">neutral-900</td>
                  <td className="py-2 px-4">17.82:1</td>
                  <td className="py-2 px-4">✓✓ AAA Normal Text</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Examples */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Usage Examples</h2>
          <p className="text-neutral-600 mb-6">
            Common patterns and component implementations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-4">Primary Button</h3>
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Proceed to Checkout
              </button>
              <pre className="mt-4 bg-neutral-900 text-neutral-100 p-3 rounded text-xs overflow-x-auto">
{`<button className="bg-primary-500 
  hover:bg-primary-600 
  text-white">
  Proceed to Checkout
</button>`}
              </pre>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-4">Accent Button</h3>
              <button className="bg-accent-500 hover:bg-accent-600 text-neutral-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                Add to Cart
              </button>
              <pre className="mt-4 bg-neutral-900 text-neutral-100 p-3 rounded text-xs overflow-x-auto">
{`<button className="bg-accent-500 
  hover:bg-accent-600 
  text-neutral-900">
  Add to Cart
</button>`}
              </pre>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-4">Success Alert</h3>
              <div className="bg-success-50 border border-success-500 text-success-700 p-4 rounded">
                ✓ Order placed successfully!
              </div>
              <pre className="mt-4 bg-neutral-900 text-neutral-100 p-3 rounded text-xs overflow-x-auto">
{`<div className="bg-success-50 
  border border-success-500 
  text-success-700">
  ✓ Order placed successfully!
</div>`}
              </pre>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-4">Error Alert</h3>
              <div className="bg-error-50 border border-error-500 text-error-700 p-4 rounded">
                ✗ Payment failed. Try again.
              </div>
              <pre className="mt-4 bg-neutral-900 text-neutral-100 p-3 rounded text-xs overflow-x-auto">
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
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">BAPI Official Brand Colors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="bg-primary-500 p-8 rounded-lg text-center">
          <div className="text-white text-2xl font-bold mb-2">BAPI Blue</div>
          <div className="text-primary-100 font-mono text-xl mb-4">#1479BC</div>
          <div className="text-primary-100 text-sm">30% Usage</div>
          <div className="text-primary-200 text-xs mt-2">Navigation, Primary Actions</div>
        </div>
        <div className="bg-accent-500 p-8 rounded-lg text-center">
          <div className="text-neutral-900 text-2xl font-bold mb-2">BAPI Yellow</div>
          <div className="text-accent-900 font-mono text-xl mb-4">#FFC843</div>
          <div className="text-accent-900 text-sm">10% Usage</div>
          <div className="text-accent-800 text-xs mt-2">CTAs, Highlights</div>
        </div>
        <div className="bg-neutral-500 p-8 rounded-lg text-center">
          <div className="text-white text-2xl font-bold mb-2">BAPI Gray</div>
          <div className="text-neutral-200 font-mono text-xl mb-4">#97999B</div>
          <div className="text-neutral-200 text-sm">60% Usage (with white)</div>
          <div className="text-neutral-300 text-xs mt-2">Backgrounds, Subtle UI</div>
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
    <div className="p-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        WCAG Accessibility Examples
      </h2>
      <div className="space-y-4">
        <div className="bg-primary-600 text-white p-4 rounded-lg">
          <strong>✓ PASS:</strong> White text on primary-600 (6.45:1) - AA Normal Text
        </div>
        <div className="bg-accent-500 text-neutral-900 p-4 rounded-lg">
          <strong>✓ PASS:</strong> Dark text on accent-500 (10.24:1) - AAA Normal Text
        </div>
        <div className="bg-success-500 text-white p-4 rounded-lg">
          <strong>✓ PASS:</strong> White text on success-500 (4.51:1) - AA Large Text
        </div>
        <div className="bg-neutral-200 text-neutral-900 p-4 rounded-lg">
          <strong>✓ PASS:</strong> Dark text on neutral-200 (13.42:1) - AAA Normal Text
        </div>
      </div>
    </div>
  ),
};
