import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Enable strict mode for better development experience */
  reactStrictMode: true,

  /** Image domains for agency logos and property photos */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
  },
};

export default nextConfig;
