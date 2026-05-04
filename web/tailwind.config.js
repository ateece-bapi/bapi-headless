import typography from '@tailwindcss/typography';

/**
 * Tailwind CSS v4 Configuration
 * 
 * With Tailwind v4, most configuration is now CSS-first via @theme directive
 * in globals.css. This config file only needs content paths.
 * 
 * Design tokens (colors, spacing, etc.) are defined in:
 * - src/app/globals.css (@theme inline directive)
 * 
 * @type {import('tailwindcss').Config}
 */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './**/*.{js,ts,jsx,tsx,mdx}',
    
    // Exclude test files for faster builds
    '!./src/**/*.test.{js,ts,jsx,tsx}',
    '!./src/**/*.spec.{js,ts,jsx,tsx}',
    '!./__tests__/**',
    '!./test/**',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#282820',
            fontFamily: 'var(--font-roboto), system-ui, sans-serif',
            p: {
              color: '#282820',
            },
            li: {
              color: '#282820',
            },
            strong: {
              color: '#282820',
            },
            td: {
              color: '#282820',
            },
            blockquote: {
              color: '#434440',
            },
            h1: {
              color: '#282820',
            },
            h2: {
              color: '#282820',
            },
            h3: {
              color: '#282820',
            },
            h4: {
              color: '#282820',
            },
          },
        },
      },
      maxWidth: {
        container: '1600px',
        content: '1200px',
        narrow: '800px',
        prose: '680px', // Optimized reading width for prose content
      },
      colors: {
        primary: {
          50: '#e5f1f8',
          100: '#cce3f2',
          200: '#99c7e4',
          300: '#66abd7',
          400: '#338fc9',
          500: '#166fb9',
          600: '#125994',
          700: '#0d436f',
          800: '#092c4a',
          900: '#041625',
          950: '#020b13',
        },
        accent: {
          50: '#fffbf0',
          100: '#fff7e1',
          200: '#ffefc3',
          300: '#ffe7a5',
          400: '#ffdf87',
          500: '#ffc843',
          600: '#e6b43c',
          700: '#cca035',
          800: '#b38c2e',
          900: '#997827',
          950: '#4d3c14',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e8e8e7',
          300: '#d4d5d3',
          400: '#b5b6b4',
          500: '#97999b',
          600: '#797a74',
          700: '#5e5f5a',
          800: '#434440',
          900: '#282820',
          950: '#141410',
        },
        // Semantic colors with full 50-950 scale for consistent accessibility
        success: {
          50: '#f0fdf4',   // Very light green background
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Base green
          600: '#16a34a',  // Darker green
          700: '#15803d',  // Even darker
          800: '#166534',  // Very dark green
          900: '#14532d',  // Darkest green for text
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',   // Very light yellow background (matches accent-50)
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#ffc843',  // Base yellow (BAPI Yellow)
          600: '#e6b43c',  // Darker yellow
          700: '#cca035',  // Even darker
          800: '#b38c2e',  // Very dark yellow
          900: '#997827',  // Darkest yellow for text (matches accent-900)
          950: '#4d3c14',
        },
        error: {
          50: '#fef2f2',   // Very light red background
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Base red
          600: '#dc2626',  // Darker red
          700: '#b91c1c',  // Even darker
          800: '#991b1b',  // Very dark red
          900: '#7f1d1d',  // Darkest red for text
          950: '#450a0a',
        },
        info: {
          50: '#e5f1f8',   // Very light blue background (matches primary-50)
          100: '#cce3f2',
          200: '#99c7e4',
          300: '#66abd7',
          400: '#338fc9',
          500: '#166fb9',  // Base blue (BAPI Blue Web/Digital / primary-500)
          600: '#125994',  // Darker blue (matches primary-600)
          700: '#0d436f',  // Even darker (matches primary-700)
          800: '#092c4a',  // Very dark blue (matches primary-800)
          900: '#041625',  // Darkest blue for text (matches primary-900)
          950: '#020b13',
        },
      },
    },
  },
  plugins: [typography],
};

export default config;