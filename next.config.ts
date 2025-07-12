// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ⚠️ Accepts any domain
      },
    ],
  },
};

export default nextConfig;
