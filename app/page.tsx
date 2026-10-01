import Image from 'next/image';
import Link from 'next/link';
import { HomeHeroVideo } from '@/components/home-hero-video';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const paths = [
  { href: '/catering', label: 'Catering', image: '/media/client-truck-arrival-poster.jpg', alt: 'The real red College Boy truck' },
  { href: '/menu', label: 'Menu', image: '/media/menu-masters.webp', alt: "College Boy Master's cheesesteak" },
  { href: '/story', label: 'Our story', image: '/media/college-boy-family-owners-enhanced.png', alt: 'College Boy family owners with the red truck' },
] as const;

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a><SiteHeader />
    <main id="main" className="cb-home cb-home-v2">
      <section className="cb-stage" aria-labelledby="home-title">
        <HomeHeroVideo />
        <div className="cb-stage-shade" aria-hidden="true" />
        <div className="cb-stage-copy"><span className="eyebrow">COLLEGE BOY CHEESESTEAKS</span><h1 id="home-title">Real Philly cheesesteaks.<br />Wherever we roll.</h1><p>The red truck. The official menu. Your next event.</p><p className="cb-stage-tagline">COME GET ONE OF THESE JAWNS!</p><Link className="button button-red" href="/catering">Request catering</Link></div>
      </section>
      <section className="cb-feature-links" aria-label="Explore College Boy">
        {paths.map(path => <Link className="cb-feature-link" href={path.href} key={path.href}><Image src={path.image} alt={path.alt} fill sizes="(max-width: 700px) 100vw, 33vw" /><span className="cb-feature-shade" aria-hidden="true" /><strong>{path.label}</strong><span className="cb-feature-arrow" aria-hidden="true">↗</span></Link>)}
      </section>
      <section className="cb-action-band" aria-labelledby="action-title"><span className="eyebrow">COLLEGE BOY CATERING</span><h2 id="action-title">Bring the truck to your event.</h2><p>Office lunches, celebrations, and community events start with a few details.</p><Link className="button button-cream" href="/catering#inquiry">Start a catering request →</Link></section>
    </main><SiteFooter />
  </>;
}
