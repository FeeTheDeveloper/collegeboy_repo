import Image from 'next/image';
import Link from 'next/link';
import { FindTheTruck } from '@/components/find-the-truck';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { menuCards } from '@/components/menu-showcase';
import { story } from '@/lib/content/business';
import { instagramUrl } from '@/lib/nav-links';
import { parseSchedule, renderClock } from '@/lib/schedule';
import scheduleSource from '@/content/schedule.json';

export const revalidate = 300;

export default function Home() {
  const { schedule } = parseSchedule(scheduleSource);
  return <>
    <a className="skip-link" href="#main">Skip to content</a><SiteHeader />
    <main id="main" className="cb-home">
      <section className="cb-hero" aria-labelledby="home-title">
        <div className="cb-hero-copy"><span className="eyebrow">PHILLY ROOTS · LOS ANGELES STREETS</span>
          <h1 id="home-title">Real Philly cheesesteaks.<br /><em>Wherever we roll.</em></h1>
          <p>College Boy serves real Philly cheesesteaks from the red truck in Los Angeles. Find us, explore the menu, or ask about catering.</p>
          <div className="cb-actions"><Link className="button button-red" href="/catering">Request catering</Link><a className="button button-outline" href="#menu">See the menu</a></div>
        </div>
        <div className="cb-hero-video"><video controls playsInline preload="metadata" poster="/media/college-boy-opening-poster.jpg" width="1280" height="720" aria-label="College Boy animated truck arrival video">
          <source src="/media/college-boy-opening.mp4" type="video/mp4" />
          <track kind="captions" src="/media/college-boy-opening.vtt" srcLang="en" label="English captions" default />
          Your browser does not support video. <a href="/media/college-boy-opening.mp4">Open the College Boy video</a>.
        </video><p>Watch the College Boy truck arrive.</p></div>
      </section>
      <div className="cb-paths" aria-label="Explore College Boy"><a href="#find">Find the truck <span aria-hidden="true">↗</span></a><a href="#menu">See the menu <span aria-hidden="true">↗</span></a><Link href="/catering">Plan an event <span aria-hidden="true">↗</span></Link></div>
      <section className="cb-menu" id="menu" aria-labelledby="menu-title"><div className="cb-section-heading"><span className="eyebrow">THE OFFICIAL MENU</span><h2 id="menu-title">What&apos;s on the menu.</h2><p>Six College Boy favorites from the supplied menu. Ask the truck for current pricing and availability.</p></div>
        <div className="cb-menu-grid">{menuCards.map(item => <article key={item.title} className="cb-menu-card"><div className="cb-menu-photo"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw" /></div><div><span>{item.category}</span><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}</div>
        <p className="cb-image-note">Images are enhanced from College Boy&apos;s supplied menu photos. Presentation may vary.</p>
      </section>
      <FindTheTruck schedule={schedule} renderedAt={renderClock()} />
      <section className="cb-order" id="order" aria-labelledby="order-title"><div><span className="eyebrow">READY TO EAT?</span><h2 id="order-title">Find us at the truck.</h2><p>Check the confirmed stop above or visit College Boy&apos;s Instagram for current updates. Delivery listings will appear here once College Boy verifies them.</p><a className="button button-cream" href={instagramUrl} target="_blank" rel="noopener noreferrer">Check Instagram ↗</a></div><Image src="/media/menu-bachelor.webp" alt="College Boy Bachelor cheesesteak" width={700} height={700} sizes="(max-width: 800px) 100vw, 42vw" /></section>
      <section className="cb-story" id="story" aria-labelledby="story-title"><div className="cb-story-image"><Image src="/media/college-boy-family-owners-enhanced.png" alt="The family owners of College Boy Cheesesteaks by the red truck" fill sizes="(max-width: 800px) 100vw, 48vw" /></div><div><span className="eyebrow">THE STORY</span><h2 id="story-title">Built on family and Philly roots.</h2>{story.approvedParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<Link className="text-link" href="/film">Watch the College Boy film →</Link></div></section>
      <section className="cb-film" aria-labelledby="home-film-title"><div><span className="eyebrow">INSIDE COLLEGE BOY</span><h2 id="home-film-title">See it for yourself.</h2><p>Watch the people, the food, and the red truck in College Boy&apos;s film.</p><Link className="text-link" href="/film">Open the film page →</Link></div><video controls playsInline preload="none" poster="/media/college-boy-film-poster.jpg" width="720" height="1064" aria-label="College Boy brand film"><source src="/media/college-boy-film-enhanced.mp4" type="video/mp4" />Your browser does not support video. <a href="/film">Open the film page</a>.</video></section>
      <section className="cb-catering" id="catering" aria-labelledby="home-catering-title"><span className="eyebrow">CATERING</span><h2 id="home-catering-title">Bring College Boy to your event.</h2><p>Office lunches, celebrations, and community events. Share the date, location, and guest count on our catering page.</p><Link className="button button-cream" href="/catering">Request catering →</Link></section>
    </main><SiteFooter />
  </>;
}
