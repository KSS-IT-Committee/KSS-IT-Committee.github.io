import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uncomment the line below for static export (GitHub Pages deployment)
  // output: 'export',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
