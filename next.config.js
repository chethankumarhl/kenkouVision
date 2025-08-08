/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove deprecated swcMinify (it's enabled by default in modern Next.js)
    
    experimental: {
      optimizePackageImports: [
        'lucide-react', 
        'framer-motion'
      ],
    },
  
    // Updated Turbopack configuration (no longer experimental)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
          ignored: /node_modules/
        };
      }
      return config;
    }
  };
  
  module.exports = nextConfig;
  