import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Set Turbopack root to prevent workspace inference and Turbopack panic
  // when it tries to traverse up beyond the web/ directory in this monorepo
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
