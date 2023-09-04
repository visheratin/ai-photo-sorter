/** @type {import('next').NextConfig} */
const million = require('million/compiler');

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
  async rewrites() {
    return [
      {
        source: '/en/:path*',
        destination: '/en',
      },
      {
        source: '/ru/:path*',
        destination: '/ru',
      },
    ];
  },
}

const millionConfig = {
  auto: true,
}

module.exports = million.next(withPWA(nextConfig), millionConfig);
