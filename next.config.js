/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: [
      'the-movie-node.onrender.com',
      'the-movie-node-image.onrender.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    runtime: 'experimental-edge',
  },
};

module.exports = nextConfig;
