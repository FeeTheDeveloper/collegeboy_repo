import type { NextConfig } from 'next';

/* Brand media is replaced by filename, so phones may keep it for a week. */
const mediaCache = 'public, max-age=604800, stale-while-revalidate=2592000';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [
      { source: '/projects-2', destination: '/menu', permanent: true },
      { source: '/contact-8', destination: '/catering', permanent: true }
    ];
  },
  async headers() {
    return [
      { source: '/(.*)', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
      ] },
      // Repeat plays of the films should come off the device, not the network.
      { source: '/media/:path*', headers: [{ key: 'Cache-Control', value: mediaCache }] },
      { source: '/icons/:path*', headers: [{ key: 'Cache-Control', value: mediaCache }] }
    ];
  }
};

export default nextConfig;
