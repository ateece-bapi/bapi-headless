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
            color: '#282829',
            fontFamily: 'var(--font-roboto), system-ui, sans-serif',
            p: {
              color: '#282829',
            },
            li: {
              color: '#282829',
            },
            strong: {
              color: '#282829',
            },
            td: {
              color: '#282829',
            },
            blockquote: {
              color: '#434445',
            },
            h1: {
              color: '#282829',
            },
            h2: {
              color: '#282829',
            },
            h3: {
              color: '#282829',
            },
            h4: {
              color: '#282829',
            },
          },
        },
      },
      maxWidth: {
        container: '1600px',
        content: '1200px',
        narrow: '800px',
      },
      colors: {
        primary: {
          50: '#e6f2f9',
          100: '#cce5f3',
          200: '#99cbe7',
          300: '#66b1db',
          400: '#3397cf',
          500: '#1479bc',
          600: '#106196',
          700: '#0c4971',
          800: '#08304b',
          900: '#041826',
          950: '#020c13',
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
          200: '#e8e8e9',
          300: '#d4d5d6',
          400: '#b5b6b8',
          500: '#97999b',
          600: '#797a7c',
          700: '#5e5f60',
          800: '#434445',
          900: '#282829',
          950: '#141415',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#ffc843',
          600: '#e6b43c',
          700: '#cca035',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50: '#e6f2f9',
          500: '#1479bc',
          600: '#106196',
          700: '#0c4971',
        },
      },
    },
  },
  plugins: [typography],
};

export default config;