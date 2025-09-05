import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tile.openstreetmap.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@ui"] = path.resolve(
      __dirname,
      "../../packages/ui/src"
    );

    // Ensure .web.tsx is prioritized
    config.resolve.extensions = [
      ".web.tsx",
      ".tsx",
      ".web.ts",
      ".ts",
      ".js",
      ".json",
    ];

    return config;
  },
};

export default nextConfig;
