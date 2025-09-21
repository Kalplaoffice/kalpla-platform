/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for stable builds
  experimental: {
    turbo: false,
  },
  // Disable ESLint during builds to prevent deployment failures
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
