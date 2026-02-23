/**
 * Custom Image Loader for Storybook
 * 
 * Ensures static assets from /public are properly resolved in Storybook/Chromatic.
 * This bypasses Next.js default image optimization which can cause issues in static builds.
 */
export default function storybookImageLoader({ src }: { src: string }) {
  // Return the src as-is for static assets
  return src;
}
