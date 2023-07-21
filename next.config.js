/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  runtimeCaching: [
    {
      urlPattern: ({ url }) => {
        return url.origin === 'https://web-ai-models.org';
      },
      handler: "CacheFirst",
      options: {
        cacheName: "web-ai-models",
      },
    },
  ]
});

const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { }) => {
    config.resolve.fallback = { 
      fs: false,
    };
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

module.exports = withPWA(nextConfig)
