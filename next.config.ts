import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any source for user uploads
    unoptimized: true,
    domains: ['localhost'],
  },
};

export default nextConfig;
