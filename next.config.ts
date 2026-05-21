import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@studio-freight/react-lenis", "@studio-freight/hamo"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
