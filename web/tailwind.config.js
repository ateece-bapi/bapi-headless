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
module.exports = {
  content: [
    // Scan all component and app files
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    
    // Exclude test files for faster builds
    '!./src/**/*.test.{js,ts,jsx,tsx}',
    '!./src/**/*.spec.{js,ts,jsx,tsx}',
    '!./__tests__/**',
    '!./test/**',
  ],
};
