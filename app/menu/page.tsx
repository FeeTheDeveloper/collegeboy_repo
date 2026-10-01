import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { menuCards } from '@/components/menu-showcase';

export const metadata: Metadata = { title: 'Menu', description: 'Explore the official College Boy Cheesesteaks menu.', alternates: { canonical: '/menu' } };

export default function MenuPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" className="cb-inner">
    <section className="cb-inner-hero cb-menu-hero"><span className="eyebrow">THE OFFICIAL MENU</span><h1>Pick your degree.</h1><p>Real Philly cheesesteaks and Cheese Fries from College Boy. Check with the truck for current pricing and availability.</p><Link className="button button-red" href="/find">Find the truck</Link></section>
    <section className="cb-menu" aria-labelledby="menu-list-title"><div className="cb-section-heading"><span className="eyebrow">COLLEGE BOY MENU</span><h2 id="menu-list-title">The lineup.</h2></div><div className="cb-menu-grid">{menuCards.map(item => <article key={item.title} className="cb-menu-card"><div className="cb-menu-photo"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw" /></div><div><span>{item.category}</span><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}</div><p className="cb-image-note">Images are enhanced from College Boy&apos;s supplied menu photos. Presentation may vary.</p></section>
    <section className="cb-action-band"><span className="eyebrow">PLANNING AN EVENT?</span><h2>Ask about College Boy catering.</h2><Link className="button button-cream" href="/catering">Request catering →</Link></section>
  </main><SiteFooter /></>;
}
