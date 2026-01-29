/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true, // ✅ IMPORTANT
  },
};

module.exports = nextConfig;
