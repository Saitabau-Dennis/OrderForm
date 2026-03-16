import type { NextConfig } from "next";

const configuredRootDomain = (
  process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
  process.env.ROOT_DOMAIN ||
  "orderform.store"
)
  .replace(/^https?:\/\//i, "")
  .replace(/\/.*$/, "")
  .toLowerCase();

const serverActionAllowedOrigins = Array.from(
  new Set(
    [
      configuredRootDomain,
      `*.${configuredRootDomain}`,
      `app.${configuredRootDomain}`,
      "localhost:3000",
      "127.0.0.1:3000",
    ].filter(Boolean),
  ),
);

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Accept forwarded Server Actions from tenant subdomains (e.g. `shop.root-domain`).
      allowedOrigins: serverActionAllowedOrigins,
    },
  },
  async redirects() {
    return [
      // Keeps legacy product URLs working after route rename.
      {
        source: "/:storeSlug/product/:productId",
        destination: "/:storeSlug/catalog/:productId",
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
