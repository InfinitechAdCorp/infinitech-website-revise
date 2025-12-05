import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow any HTTPS domain for production
      },
    ],
    unoptimized: true, // This helps with external images
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // disable in dev
})(nextConfig);