import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [],
    qualities: [25, 35, 50, 60, 75, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        source: "/australia-contact",
        destination: "/book-a-call",
        permanent: true,
      },
      {
        source: "/2025-offer",
        destination: "/",
        permanent: true,
      },
      {
        source: "/why-us",
        destination: "/",
        permanent: true,
      },
      {
        source: "/terms-of-use",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/staff/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/why-join-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/tips-for-writing-great-posts-that-increase-your-site-traffic",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cleaning-home",
        destination: "/cleaning",
        permanent: true,
      },
      {
        source: "/trades-home",
        destination: "/trades",
        permanent: true,
      },
      {
        source: "/motortrade-home",
        destination: "/motor-trade",
        permanent: true,
      },
      {
        source: "/other-industries-home",
        destination: "/other-industries",
        permanent: true,
      },
      {
        source: "/why-work-here",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/meet-the-team",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
