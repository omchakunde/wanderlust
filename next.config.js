/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },

  typescript: {
    // Ignore type errors in production build (for libraries)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
