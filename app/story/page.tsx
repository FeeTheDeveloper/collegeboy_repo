import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { story } from '@/lib/content/business';

export const metadata: Metadata = { title: 'Our story', description: 'The family and Philly roots behind College Boy Cheesesteaks.', alternates: { canonical: '/story' } };

export default function StoryPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" className="cb-inner">
    <section className="cb-inner-hero"><span className="eyebrow">THE COLLEGE BOY STORY</span><h1>Built on family and Philly roots.</h1><p>Meet the people behind the red truck.</p></section>
    <section className="cb-story cb-story-page" aria-labelledby="story-title"><div className="cb-story-image"><Image src="/media/college-boy-family-owners-enhanced.png" alt="The College Boy family owners by the red truck" fill sizes="(max-width: 800px) 100vw, 48vw" /></div><div><span className="eyebrow">FAMILY · PHILLY · LOS ANGELES</span><h2 id="story-title">The story keeps rolling.</h2>{story.approvedParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<Link className="text-link" href="/film">Watch the College Boy film →</Link></div></section>
    <section className="cb-action-band"><span className="eyebrow">BRING COLLEGE BOY</span><h2>Make the truck part of your event.</h2><Link className="button button-cream" href="/catering">Request catering →</Link></section>
  </main><SiteFooter /></>;
}
