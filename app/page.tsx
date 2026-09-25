import Image from 'next/image';
import Link from 'next/link';
import { FirstVisitInvite } from '@/components/first-visit-invite';
import { ReviewMarquee } from '@/components/review-marquee';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const orderLinks = [
  ['Pickup', 'https://collegeboy-cheesesteaks.square.site/'],
  ['Uber Eats', 'https://www.ubereats.com/store/collegeboy-cheesesteaks/jZXVoXzrW_6yjSc8As2DZw'],
  ['DoorDash', 'https://www.doordash.com/store/college-boy-cheesesteaks-los-angeles-23069053/']
] as const;

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a><SiteHeader />
    <main id="main">
      <section className="hero"><div className="hero-copy"><span className="eyebrow">PHILLY BORN · LOS ANGELES FED</span><h1>Not a sandwich.<br /><em>A whole degree.</em></h1><p>Real Philly cheesesteaks from real Philadelphians. Find the red truck, check the current menu, or order the jawn you came for.</p><div className="hero-actions"><a className="button button-cream" href="#find">Find the truck</a><a className="button button-outline" href="https://collegeboy-cheesesteaks.square.site/" target="_blank" rel="noreferrer">Order pickup ↗</a></div></div><div className="hero-photo"><Image src="/media/spicy-chicken-cheesesteak.png" alt="A spicy chicken cheesesteak hoagie cut open on a food preparation counter" fill priority sizes="(max-width: 760px) 100vw, 52vw" /></div><div className="hero-ticket"><strong>SPICY CHICKEN</strong><span>Fresh off the line</span></div></section>
      <section className="ticker" aria-label="College Boy services"><div>CHEESESTEAKS ✦ FRIES ✦ LEMONADES ✦ PICKUP ✦ DELIVERY ✦ CATERING ✦ CHEESESTEAKS ✦ FRIES ✦ LEMONADES ✦ PICKUP ✦ DELIVERY ✦ CATERING ✦</div></section>
      <section className="find section" id="find"><div className="section-intro"><span className="eyebrow">THE TRUCK MOVES</span><h2>Find the next stop.</h2><p>There is no confirmed dated stop in this review build. Check official Instagram before traveling.</p></div><div className="location-card"><div><span className="status-dot" />LIVE SCHEDULE FALLBACK</div><strong>No confirmed stop posted</strong><p>Old or undated Wix locations are intentionally not shown as today’s location.</p><a className="button button-red" href="https://www.instagram.com/collegeboycheesesteaks/" target="_blank" rel="noreferrer">Check Instagram ↗</a></div></section>
      <section className="degree-section" id="menu"><div className="section-intro light"><span className="eyebrow">THE CURRICULUM</span><h2>Earn your degree.</h2><p>Client-approved menu details and prices stay at checkout. This page keeps the path simple.</p></div><div className="degree-path"><article><span>01 · START HERE</span><h3>Cheesesteaks</h3><p>See current proteins, cheeses, toppings, and customization at checkout.</p></article><article><span>02 · SWITCH IT UP</span><h3>Chicken & veggie</h3><p>Availability and preparation details are confirmed on the live ordering menu.</p></article><article><span>03 · EXTRA CREDIT</span><h3>Fries & drinks</h3><p>Round out the order with whatever is available today.</p></article><article className="degree-final"><span>04 · TOP OF THE CLASS</span><h3>Your order</h3><p>No guessed prices. No stale menu. Build it with the provider handling today’s service.</p></article></div><div className="order-grid">{orderLinks.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer"><span>{label}</span><strong>Order now ↗</strong></a>)}</div></section>
      <ReviewMarquee />
      <section className="catering" id="catering"><div><span className="eyebrow">BRING THE TRUCK</span><h2>Big event.<br />Real Philly.</h2><p>Office lunches, celebrations, and community events. Send the date, location, and guest count by email.</p><a className="button button-cream" href="mailto:catering@collegeboysteaks.com?subject=College%20Boy%20catering%20inquiry">Ask about catering ↗</a><small>Inbox monitoring, availability, menu, and pricing require client confirmation before launch.</small></div><div className="catering-mark" aria-hidden="true">CB</div></section>
      <section className="story-safe section"><span className="eyebrow">ROOTED IN PHILLY</span><h2>The full story deserves approval.</h2><p>Founder names, family history, memorial language, and family photographs remain outside this public build until the family and client approve the final treatment.</p><Link href="/subscribe" className="text-link">Join for College Boy updates →</Link></section>
    </main><SiteFooter /><FirstVisitInvite />
  </>;
}
