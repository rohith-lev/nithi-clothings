import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "nodemailer", "xlsx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "10.181.252.67",
    "10.181.252.67:3000",
    "*.local",
  ],
};

export default nextConfig;
