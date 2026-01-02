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
  // Experimental features for faster builds
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
};

export default nextConfig;
