import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Anton, Barlow_Condensed, Inter } from 'next/font/google';
import { clerkConfigured } from '@/lib/config';
import { siteUrl } from '@/lib/site-config';
import './globals.css';
import './about.css';
import './truck-brand.css';

const display = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const utility = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-utility' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: 'College Boy',
  title: { default: 'College Boy Cheesesteaks', template: '%s | College Boy Cheesesteaks' },
  description: 'Real Philly cheesesteaks in Los Angeles. Find the truck, order pickup or delivery, and ask about catering.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'College Boy Cheesesteaks',
    title: 'College Boy Cheesesteaks',
    description: 'Find the truck, check the current menu, order, and ask about catering.'
  },
  twitter: { card: 'summary_large_image' },
  // Home-screen launches keep the brand name; digits in copy stay plain text on iOS.
  appleWebApp: { capable: true, title: 'College Boy', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
  robots: { index: false, follow: false }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Full-bleed under the notch; every fixed element pads itself back with env(safe-area-inset-*).
  viewportFit: 'cover',
  // The soft keyboard shrinks the layout so sticky actions stay above it on Android.
  interactiveWidget: 'resizes-content',
  themeColor: '#130f0f',
  colorScheme: 'light'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const document = <html lang="en" className={`${display.variable} ${utility.variable} ${body.variable}`}><body>{children}</body></html>;
  return clerkConfigured ? <ClerkProvider>{document}</ClerkProvider> : document;
}
