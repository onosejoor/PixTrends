import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: { bodySizeLimit: "3mb" },
  },
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/dog3ihaqs/image/upload/**"),
      new URL("http://res.cloudinary.com/dog3ihaqs/image/upload/**"),
      new URL("https://lh3.googleusercontent.com/a/**"),
    ],
  },
};

export default nextConfig;
