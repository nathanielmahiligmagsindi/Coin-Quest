/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // During builds, Next.js will type check your project
    ignoreBuildErrors: false,
  },
  eslint: {
    // Run ESLint during builds
    ignoreDuringBuilds: false,
  },
  // Ensure proper handling of external packages
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Optimize images
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
  // Webpack configuration to suppress optional dependency warnings
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Suppress warnings for optional dependencies
    config.ignoreWarnings = [
      { module: /node_modules\/@metamask\/sdk/ },
      { module: /node_modules\/pino/ },
      /Critical dependency: the request of a dependency is an expression/,
    ];
    
    return config;
  },
};

export default nextConfig;
