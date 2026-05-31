import type { NextConfig } from "next";

const LARAVEL_API_URL = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: require("path").resolve(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
      { protocol: "http",  hostname: "localhost", port: "8000" },
      { protocol: "http",  hostname: "127.0.0.1", port: "8000" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${LARAVEL_API_URL}/api/:path*`,
      },
      {
        source: "/storage/:path*",
        destination: `${LARAVEL_API_URL}/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
