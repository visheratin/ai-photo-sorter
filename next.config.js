/** @type {import('next').NextConfig} */
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@visheratin/web-ai'],
  webpack: (config, { }) => {
    config.resolve.fallback = { 
      fs: false,
    };
    config.plugins.push(
      new NodePolyfillPlugin(),
    );
    config.experiments.asyncWebAssembly = true;
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
