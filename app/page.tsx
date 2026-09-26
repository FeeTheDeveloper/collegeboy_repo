import Image from 'next/image';
import { TruckLogo } from '@/components/truck-logo';
import { BrandFilm } from '@/components/brand-film';
import Link from 'next/link';
import { FirstVisitInvite } from '@/components/first-visit-invite';
import { ReviewMarquee } from '@/components/review-marquee';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ShowtimeIntro } from '@/components/showtime-intro';
import { MenuShowcase } from '@/components/menu-showcase';

export default function Home() {
  return <>
    <ShowtimeIntro />
    <a className="skip-link" href="#main">Skip to content</a><SiteHeader />
    <main id="main">
      <section className="hero"><div className="hero-copy"><span className="eyebrow">PHILLY BORN · LOS ANGELES FED</span><h1>Not a sandwich.<br /><em>A whole degree.</em></h1><p>Real Philly cheesesteaks from real Philadelphians. Find the red truck, check the current menu, or order the jawn you came for.</p><div className="hero-actions"><a className="button button-cream" href="#find">Find the truck</a><a className="button button-outline" href="https://collegeboy-cheesesteaks.square.site/" target="_blank" rel="noreferrer">Order pickup ↗</a></div></div><div className="hero-photo"><Image src="/media/college-boy-cheesesteak-feast-enhanced.png" alt="Two cheesesteak halves and fries served in red-and-white checkered paper" fill priority sizes="(max-width: 760px) 100vw, 52vw" /></div><div className="hero-ticket"><strong>CHEESESTEAK + FRIES</strong><span>Fresh off the line</span></div></section>
      <section className="ticker" aria-label="College Boy services"><div>CHEESESTEAKS ✦ FRIES ✦ LEMONADES ✦ PICKUP ✦ DELIVERY ✦ CATERING ✦ CHEESESTEAKS ✦ FRIES ✦ LEMONADES ✦ PICKUP ✦ DELIVERY ✦ CATERING ✦</div></section>
      <section className="find section" id="find"><div className="section-intro"><span className="eyebrow">THE TRUCK MOVES</span><h2>Find the next stop.</h2><p>There is no confirmed dated stop in this review build. Check official Instagram before traveling.</p></div><div className="location-card"><div><span className="status-dot" />LIVE SCHEDULE FALLBACK</div><strong>No confirmed stop posted</strong><p>Old or undated Wix locations are intentionally not shown as today’s location.</p><a className="button button-red" href="https://www.instagram.com/collegeboycheesesteaks/" target="_blank" rel="noreferrer">Check Instagram ↗</a></div></section>
      <MenuShowcase />
      <ReviewMarquee />
      <BrandFilm />
      <section className="catering" id="catering"><div><span className="eyebrow">BRING THE TRUCK</span><h2>Big event.<br />Real Philly.</h2><p>Office lunches, celebrations, and community events. Send the date, location, and guest count by email.</p><a className="button button-cream" href="mailto:catering@collegeboysteaks.com?subject=College%20Boy%20catering%20inquiry">Ask about catering ↗</a><small>Inbox monitoring, availability, menu, and pricing require client confirmation before launch.</small></div><div className="catering-truck"><figure><TruckLogo large /><figcaption>REAL PHILLY. WHEREVER WE ROLL.</figcaption></figure></div></section>
      <section className="about" id="about" aria-labelledby="about-title">
        <div className="about-inspiration">
          <Image src="/media/college-boy-inspiration-silhouette.png" alt="A stylized graduation portrait representing the inspiration behind College Boy Cheesesteaks" fill sizes="100vw" />
          <div className="about-inspiration-copy"><span className="eyebrow">THE INSPIRATION</span><h2 id="about-title">Every degree starts with someone who showed the way.</h2><p>This portrait sets the tone for the family inspiration at the heart of College Boy. The complete names and personal story will be added only with the family’s approved wording.</p></div>
        </div>
        <div className="about-family">
          <div className="about-family-photo"><Image src="/media/college-boy-family-owners-enhanced.png" alt="The family owners of College Boy Cheesesteaks standing together in front of the red food truck" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
          <div className="about-family-copy"><span className="eyebrow">FAMILY OWNED · PHILLY ROOTED</span><h3>The family behind the red truck.</h3><p>College Boy is carried forward by family—serving Los Angeles with the pride, care, and unmistakable point of view that built the business.</p><p>This demo keeps the story focused and respectful while the family confirms the final names, history, and tribute language.</p><Link href="/subscribe" className="text-link">Follow the next chapter →</Link></div>
        </div>
      </section>
    </main><SiteFooter /><FirstVisitInvite />
  </>;
}
