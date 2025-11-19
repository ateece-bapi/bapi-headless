/** web/next.config.ts */
import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use an absolute path for turbopack.root (resolve from this file's directory)
  turbopack: {
    root: path.resolve(__dirname),
  },

  // other Next options (keep whatever you already need here)...
  // Example: uncomment if you want a custom distDir explicitly inside the project:
  // distDir: path.join(path.resolve(__dirname), '.next'),
};

export default nextConfig;
