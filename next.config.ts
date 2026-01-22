// // next.config.ts
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '**', // ⚠️ Accepts any domain
//       },
//     ],
//   },
// };

// export default nextConfig;


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

  // Add redirects to fix 404 errors
  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/contact-us',
        permanent: true,  // 301 redirect (SEO friendly)
      },
      {
        source: '/services',
        destination: '/',  // Redirects to homepage for now
        permanent: true,
      },
      {
        source: '/%24',  // This handles the /$ URL ($ encoded as %24)
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;