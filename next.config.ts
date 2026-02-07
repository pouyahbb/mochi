import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images : {
    remotePatterns : [
      {
        protocol:"https",
        hostname : "**.convex.cloud"
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
};

export default nextConfig;
