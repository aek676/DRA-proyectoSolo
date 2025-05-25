import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default nextConfig;
