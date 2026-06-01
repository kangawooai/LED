import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [],
    qualities: [25, 35, 50, 75, 100],
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
        source: "/max-young",
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
        source: "/robert-o-toole",
        destination: "/",
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
    ];
  },
};

export default nextConfig;
