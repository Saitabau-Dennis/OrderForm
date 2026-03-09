import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Keeps legacy product URLs working after route rename.
      {
        source: "/:storeSlug/product/:productId",
        destination: "/:storeSlug/products/:productId",
        permanent: true,
      },
    ];
  },
  images: {
    // Remote sources allowed by `next/image`.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.notion.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "xubohuah.github.io",
      },
      {
        protocol: "https",
        hostname: "ufs.sh",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
