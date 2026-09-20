/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disable all image optimization to avoid errors
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'three']
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    }
    // Performance optimization
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three\/fiber|@react-three\/drei)[\\/]/,
            name: 'three-vendor',
            priority: 10,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
            name: 'ui-vendor',
            priority: 9,
          },
        },
      },
    }
    return config
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
