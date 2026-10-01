import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CateringInquiryForm } from '@/components/catering-inquiry-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { cateringEmail, cateringFormReady } from '@/lib/catering';
import './catering.css';

export const metadata: Metadata = {
  title: 'Catering',
  description: 'Ask College Boy Cheesesteaks about catering your office lunch, celebration, or community event.',
  alternates: { canonical: '/catering' },
};

export const dynamic = 'force-dynamic';

const images = [
  { src: '/media/client-truck-arrival-poster.jpg', alt: 'The real red College Boy truck' },
  { src: '/media/menu-masters.webp', alt: "College Boy Master's cheesesteak" },
  { src: '/media/college-boy-family-owners-enhanced.png', alt: 'College Boy family owners by the red truck' },
  { src: '/media/menu-cheese-fries.webp', alt: 'College Boy Cheese Fries' },
] as const;

export default function CateringPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a><SiteHeader />
    <main id="main" className="catering-page">
      <section className="catering-hero" aria-labelledby="catering-title"><div className="catering-hero-content"><span className="eyebrow">COLLEGE BOY CATERING</span><h1 id="catering-title">Bring College Boy to Your Event.</h1><p>Office lunches, celebrations, and community events start here. Tell us where, when, and how many guests you expect.</p><a className="button button-red" href="#inquiry">Request catering</a></div></section>
      <section className="catering-inquiry" id="inquiry" aria-labelledby="inquiry-title"><div className="catering-inquiry-copy"><span className="eyebrow">TELL US ABOUT YOUR EVENT</span><h2 id="inquiry-title">Request catering.</h2><p>Share the basics below. College Boy confirms availability and pricing directly.</p>{cateringEmail && <p className="catering-email">Prefer email? <a href={`mailto:${cateringEmail}?subject=College%20Boy%20catering%20inquiry`}>{cateringEmail}</a></p>}</div><CateringInquiryForm available={cateringFormReady} /></section>
      <section className="catering-why" aria-labelledby="why-title"><span className="eyebrow">WHY COLLEGE BOY</span><h2 id="why-title">College Boy, at a glance.</h2><div className="catering-why-grid"><article><span>01</span><h3>Philly roots.</h3><p>College Boy is built on family and Philly roots.</p></article><article><span>02</span><h3>The official menu.</h3><p>Explore the College Boy cheesesteaks and Cheese Fries before you ask about your event.</p><Link href="/menu">See the menu →</Link></article><article><span>03</span><h3>The red truck.</h3><p>College Boy serves Los Angeles from its red truck. Tell us about the event you have in mind.</p></article></div></section>
      <section className="catering-photo-strip" aria-label="College Boy truck and food photos">{images.map(item => <div key={item.src}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 600px) 50vw, 25vw" /></div>)}</section>
      <section className="cb-action-band" aria-labelledby="catering-action-title"><span className="eyebrow">READY TO ASK?</span><h2 id="catering-action-title">Tell us about your event.</h2><a className="button button-cream" href="#inquiry">Go to the inquiry form ↑</a></section>
    </main><SiteFooter />
  </>;
}
