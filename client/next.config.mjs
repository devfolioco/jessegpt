/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/talk',
        destination: '/',
        permanent: false,
        missing: [
          {
            type: 'query',
            key: 'mood',
            value: 'excited',
          },
          {
            type: 'query',
            key: 'mood',
            value: 'critical',
          },
        ],
      },
    ];
  },

  webpack: config => {
    config.externals.push('pino-pretty');
    return config;
  },
};

export default nextConfig;
