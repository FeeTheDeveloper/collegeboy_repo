import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { instagramUrl } from '@/lib/nav-links';

export const metadata: Metadata = { title: 'Order', description: 'Find College Boy Cheesesteaks and check current ordering options.', alternates: { canonical: '/order' } };

export default function OrderPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" className="cb-inner">
    <section className="cb-inner-hero cb-order-hero"><span className="eyebrow">READY TO EAT?</span><h1>Order at the truck.</h1><p>Find a confirmed stop, then check College Boy&apos;s official Instagram for current updates. Delivery listings will appear here after College Boy verifies them.</p><div className="cb-inner-actions"><Link className="button button-red" href="/find">Find the truck</Link><a className="button button-outline" href={instagramUrl} target="_blank" rel="noopener noreferrer">Check Instagram ↗</a></div></section>
    <section className="cb-order cb-order-page"><div><span className="eyebrow">THE MENU</span><h2>See what&apos;s cooking.</h2><p>Explore the official menu before you visit. College Boy confirms current prices and availability at the truck.</p><Link className="button button-cream" href="/menu">Explore the menu</Link></div><Image src="/media/menu-bachelor.webp" alt="College Boy Bachelor cheesesteak" width={700} height={700} sizes="(max-width: 800px) 100vw, 42vw" /></section>
  </main><SiteFooter /></>;
}
