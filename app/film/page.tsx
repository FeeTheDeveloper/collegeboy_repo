import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = { title: 'Inside College Boy', alternates: { canonical: '/film' } };

export default function FilmPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" className="cb-inner">
    <section className="cb-inner-hero"><span className="eyebrow">THE COLLEGE BOY FILM</span><h1>See the people behind the truck.</h1><p>Watch the College Boy film with its original voices and captions.</p><div className="cb-inner-actions"><Link className="button button-red" href="/catering">Request catering</Link><Link className="button button-outline" href="/#menu">See the menu</Link></div></section>
    <section className="cb-inner-body"><div className="cb-inner-video"><video controls playsInline preload="metadata" poster="/media/college-boy-film-poster.jpg" width="720" height="1064" aria-label="College Boy brand film"><source src="/media/college-boy-film-enhanced.mp4" type="video/mp4" />Your browser does not support video. <a href="/media/college-boy-film-enhanced.mp4">Open the film</a>.</video><p>College Boy film. Playback starts when you choose play.</p></div></section>
  </main><SiteFooter /></>;
}
