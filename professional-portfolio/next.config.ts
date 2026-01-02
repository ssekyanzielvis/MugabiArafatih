import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bqlvprmmtmobobyygnba.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Speed optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Build cache configuration
  cacheMaxMemorySize: 0, // Disable in-memory caching, rely on disk cache
  cacheHandler: undefined,
  // Experimental features for faster builds
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
};

export default nextConfig;
