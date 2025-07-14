// next.config.js or next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true, // Enable stack traces in Vercel logs
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'], // Required for Prisma in Server Components
  },
};

module.exports = nextConfig;
