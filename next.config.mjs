/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    serverComponentsExternalPackages: ['openai'],
  },
};

export default nextConfig;
