/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for stable builds
  experimental: {
    turbo: false,
  },
};

module.exports = nextConfig;
