import type { Metadata } from 'next';
import Link from 'next/link';
import { FilmPlayer } from '@/components/brand-film';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = { title: 'Inside College Boy', alternates: { canonical: '/film' } };

export default function FilmPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader />
    <main id="main" className="film-route"><div className="film-route-grid">
      <div className="film-route-copy"><Link className="text-link" href="/">← Back to the truck</Link>
        <h1>A little Philly.<br /><em>A lot of heart.</em></h1>
        <p>The people, the preparation, the first bite. Go inside College Boy in this 96-second film, told by the people who make it and the people who try it.</p>
        <div className="film-actions"><a className="button button-red" href="https://collegeboy-cheesesteaks.square.site/" target="_blank" rel="noreferrer">Order pickup ↗</a><Link className="text-link" href="/#catering">Plan an event</Link></div>
        <div className="film-route-chapters">
          <article><span>01 · THE PEOPLE</span><h2>Hear the story.</h2><p>Family roots, shared in their own words.</p></article>
          <article><span>02 · THE COUNTER</span><h2>See it come together.</h2><p>A look inside the truck, from the grill to the finished order.</p></article>
          <article><span>03 · THE FIRST BITE</span><h2>Let the food talk.</h2><p>Cheesesteaks, loaded fries, and a customer’s first impressions.</p></article>
        </div>
      </div><FilmPlayer />
    </div></main><SiteFooter /></>;
}
