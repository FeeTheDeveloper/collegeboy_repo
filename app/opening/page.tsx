import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = { title: 'The Arrival', alternates: { canonical: '/opening' } };

export default function OpeningPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" className="cb-inner">
    <section className="cb-inner-hero"><span className="eyebrow">THE ARRIVAL</span><h1>Here comes College Boy.</h1><p>Watch the red truck arrive in this short College Boy animation.</p><Link className="button button-red" href="/catering">Bring College Boy to your event</Link></section>
    <section className="cb-inner-body"><div className="cb-inner-video"><video controls playsInline preload="metadata" poster="/media/college-boy-opening-poster.jpg" width="1280" height="720" aria-label="Animated College Boy truck arrival"><source src="/media/college-boy-opening.mp4" type="video/mp4" /><track kind="captions" src="/media/college-boy-opening.vtt" srcLang="en" label="English captions" default />Your browser does not support video. <a href="/media/college-boy-opening.mp4">Open the video</a>.</video><p>This scene is an animated College Boy brand concept.</p></div></section>
  </main><SiteFooter /></>;
}
