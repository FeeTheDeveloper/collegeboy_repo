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

export default function CateringPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a><SiteHeader />
    <main id="main" className="catering-page">
      <section className="catering-hero" aria-labelledby="catering-title">
        <div className="catering-hero-copy"><span className="eyebrow">COLLEGE BOY CATERING</span>
          <h1 id="catering-title">Bring College Boy to Your Event.</h1>
          <p>Planning an office lunch, celebration, or community event? Tell College Boy where, when, and how many guests you expect.</p>
          <a className="button button-red" href="#inquiry">Request catering</a>
        </div>
        <div className="catering-hero-image"><Image src="/media/menu-masters.webp" alt="College Boy Master's cheesesteak from the official menu" fill priority sizes="(max-width: 800px) 100vw, 48vw" /></div>
      </section>
      <section className="catering-inquiry" id="inquiry" aria-labelledby="inquiry-title">
        <div className="catering-inquiry-copy"><span className="eyebrow">TELL US ABOUT YOUR EVENT</span><h2 id="inquiry-title">Request catering.</h2>
          <p>Share your event details and College Boy can review your request. Availability and pricing are confirmed directly with College Boy.</p>
          {cateringEmail && <p className="catering-email">Prefer email? <a href={`mailto:${cateringEmail}?subject=College%20Boy%20catering%20inquiry`}>{cateringEmail}</a></p>}
        </div>
        <CateringInquiryForm available={cateringFormReady} />
      </section>
      <section className="catering-why" aria-labelledby="why-title"><div><span className="eyebrow">WHY COLLEGE BOY</span><h2 id="why-title">Real Philly roots. The red truck.</h2><p>College Boy serves real Philly cheesesteaks in Los Angeles from its red truck. See the menu and story, then tell us about your event.</p><div className="catering-why-links"><Link href="/#menu">Explore the menu</Link><Link href="/#story">Our story</Link></div></div><Image src="/media/college-boy-truck-logo-v2.png" alt="College Boy red truck illustration" width={640} height={323} sizes="(max-width: 800px) 85vw, 38vw" /></section>
    </main><SiteFooter />
  </>;
}
