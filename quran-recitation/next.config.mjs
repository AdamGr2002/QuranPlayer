/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('ws');
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/ws',
        destination: 'http://localhost:3000/ws',
      },
    ];
  },
};

export default nextConfig;