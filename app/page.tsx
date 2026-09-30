import Image from 'next/image';
import Link from 'next/link';
import { BrandFilm } from '@/components/brand-film';
import { BrandStory } from '@/components/brand-story';
import { FindTheTruck } from '@/components/find-the-truck';
import { FirstVisitInvite } from '@/components/first-visit-invite';
import { MenuShowcase } from '@/components/menu-showcase';
import { ReviewMarquee } from '@/components/review-marquee';
import { ShowtimeIntro } from '@/components/showtime-intro';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { business, shown, story } from '@/lib/content/business';
import { parseSchedule, renderClock } from '@/lib/schedule';
import scheduleSource from '@/content/schedule.json';

/** Re-render at least every five minutes; the client also re-checks stops every minute. */
export const revalidate = 300;

export default function Home() {
  const { schedule } = parseSchedule(scheduleSource);
  const cateringEmail = shown(business.cateringEmail);

  return <>
    <ShowtimeIntro />
    <a className="skip-link" href="#main">Skip to content</a><SiteHeader />
    <main id="main">
      <section className="hero"><div className="hero-copy"><span className="eyebrow">PHILLY BORN · LOS ANGELES FED</span>
        <h1 className="hero-brand">Real Philly cheesesteaks.<br /><em>Wherever we roll.</em></h1>
        <p>Chopped steak and melted cheese on a plain hoagie roll, served from the red truck by real Philadelphians. Find the truck, see the menu, or order through a delivery partner.</p>
        <div className="hero-actions"><a className="button button-cream" href="#find">Find the truck</a><a className="button button-outline" href="#menu">See the menu</a></div></div>
        <div className="hero-photo"><Image src="/media/menu-masters.webp" alt="College Boy Master's cheesesteak with chopped steak, melted cheese and grilled onions in a plain roll" fill priority sizes="(max-width: 760px) 100vw, 52vw" /></div>
        <div className="hero-ticket"><strong>MASTER&apos;S CHEESESTEAK</strong><span>From the College Boy menu</span></div></section>
      <section className="ticker" aria-label="College Boy menu and services"><div>ALUMNI ✦ BACHELOR ✦ MASTER&apos;S ✦ DOCTORATE ✦ HOAGIE ✦ CHEESE FRIES ✦ DELIVERY ✦ CATERING ✦ ALUMNI ✦ BACHELOR ✦ MASTER&apos;S ✦ DOCTORATE ✦ HOAGIE ✦ CHEESE FRIES ✦ DELIVERY ✦ CATERING ✦</div></section>
      <BrandStory />
      <FindTheTruck schedule={schedule} renderedAt={renderClock()} />
      <MenuShowcase />
      <ReviewMarquee />
      <BrandFilm />
      <section className="catering" id="catering"><div><span className="eyebrow">BRING THE TRUCK</span><h2>Big event.<br />Real Philly.</h2>
        <p>Office lunches, celebrations, and community events. Email the date, location, and guest count and College Boy will follow up.</p>
        {cateringEmail ? <a className="button button-cream" href={`mailto:${cateringEmail}?subject=College%20Boy%20catering%20inquiry`}>Ask about catering ↗</a> : null}
        <small>Catering packages and pricing are quoted by College Boy directly.</small></div>
        <div className="catering-empty" aria-hidden="true" /></section>
      <section className="about" id="inspiration" aria-labelledby="about-title">
        <div className="about-inspiration">
          <div className="about-inspiration-photo"><Image src="/media/college-boy-inspiration-silhouette.png" alt="Graduation portrait honoring the inspiration behind College Boy Cheesesteaks" fill sizes="100vw" loading="eager" /></div>
          <div className="about-inspiration-copy"><span className="eyebrow">THE INSPIRATION</span>
            <h2 id="about-title">Every degree starts with someone who showed the way.</h2>
            {story.approvedParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div className="about-family">
          <div className="about-family-photo"><Image src="/media/college-boy-family-owners-enhanced.png" alt="The family owners of College Boy Cheesesteaks standing together in front of the red food truck" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
          <div className="about-family-copy"><span className="eyebrow">FAMILY OWNED · PHILLY ROOTED</span><h3>The family behind the red truck.</h3><p>College Boy is carried forward by family, serving Los Angeles real Philly cheesesteaks with pride and care.</p><Link href="/subscribe" className="text-link">Follow the next chapter →</Link></div>
        </div>
      </section>
    </main><SiteFooter /><FirstVisitInvite />
  </>;
}
