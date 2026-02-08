import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uncomment the line below for static export (GitHub Pages deployment)
  // output: "export",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hatuna-827.github.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.githubassets.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.qiita.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.atcoder.jp",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "onlinemathcontest.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.kaggle.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
    ],
    // Image optimization settings
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // React optimization
  reactStrictMode: true,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["react-syntax-highlighter"],
  },
};

export default nextConfig;
