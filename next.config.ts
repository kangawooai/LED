import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [],
    qualities: [25, 35, 50, 75, 100],
  },
};

export default nextConfig;
