import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "academy.infozub.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
