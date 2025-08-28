/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  async rewrites() {
    return [
      {
        source: '/mocks/:path*',
        destination: '/api/mocks/:path*',
      },
    ];
  },
  output: 'standalone',
};

module.exports = nextConfig;