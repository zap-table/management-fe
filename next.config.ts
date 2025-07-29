import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Localhost for S3 LocalStack
      new URL("http://localhost:4566/**"),
    ],
  },
};

export default nextConfig;
