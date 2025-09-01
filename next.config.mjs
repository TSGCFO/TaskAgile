/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: [],
  typescript: {
    // These warnings are false positives for client components
    ignoreBuildErrors: false,
  },
  eslint: {
    // These warnings are false positives for client components  
    ignoreDuringBuilds: false,
  },
  // Suppress false positive serialization warnings in development
  reactStrictMode: true,
  // Suppress hydration warnings for client components
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
