import Image from 'next/image';
import './brand-story.css';

/** The founding narrative and brand lines are supplied from College Boy's original website. */
export function BrandStory() {
  return <section className="brand-story" id="story" aria-labelledby="brand-story-title">
    <div className="brand-story-lead">
      <span className="eyebrow">OUR PHILLY ROOTS</span>
      <h2 id="brand-story-title">Taste the<br /><em>authenticity.</em></h2>
      <p>Real Philly cheesesteaks, from real Philadelphians. That&apos;s who we are.</p>
      <Image src="/media/college-boy-truck-logo-v2.png" alt="" width={1600} height={807} sizes="(max-width: 800px) 80vw, 38vw" />
    </div>
    <div className="brand-story-detail">
      <p className="brand-story-intro">The founders of College Boy moved to Los Angeles in 2016. They missed the cheesesteaks they grew up with in Philadelphia, so they set out to bring that taste west.</p>
      <ol className="brand-story-timeline">
        <li><strong>2016</strong><p>Philly roots met Los Angeles. The search for a real hometown cheesesteak began.</p></li>
        <li><strong>2018</strong><p>They returned to Philadelphia to learn the craft on South Street and bring it back to California.</p></li>
        <li><strong>2021</strong><p>College Boy opened its first food truck in Los Angeles on September 23.</p></li>
      </ol>
      <p className="brand-story-close">Our purpose is to give California a real Philly cheesesteak experience.</p>
      <span className="brand-story-signoff">#CBKforever</span>
    </div>
  </section>;
}
