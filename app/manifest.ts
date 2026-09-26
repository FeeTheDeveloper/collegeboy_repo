import type { MetadataRoute } from 'next';

/** Home-screen identity for Android and iOS: brand chrome instead of a browser screenshot. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'College Boy Cheesesteaks',
    short_name: 'College Boy',
    description: 'Real Philly cheesesteaks in Los Angeles. Find the truck, order pickup or delivery, and ask about catering.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f8efdf',
    theme_color: '#130f0f',
    lang: 'en-US',
    dir: 'ltr',
    categories: ['food', 'lifestyle'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    shortcuts: [
      { name: 'Order pickup', url: '/#order-options' },
      { name: 'See the menu', url: '/#menu' },
      { name: 'Watch the film', url: '/film' }
    ]
  };
}
