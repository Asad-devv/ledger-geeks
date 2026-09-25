import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // keep the original static-site URLs working
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/consultation.html', destination: '/consultation', permanent: true },
    ];
  },
};

export default nextConfig;
