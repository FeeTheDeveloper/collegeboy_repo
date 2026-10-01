import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = { title: 'The Arrival', alternates: { canonical: '/opening' } };

export default function OpeningPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" className="cb-inner">
    <section className="cb-inner-hero"><span className="eyebrow">THE ARRIVAL</span><h1>Here comes College Boy.</h1><p>See the real red College Boy truck on the move.</p><Link className="button button-red" href="/catering">Bring College Boy to your event</Link></section>
    <section className="cb-inner-body"><div className="cb-inner-video"><video controls playsInline preload="metadata" poster="/media/client-truck-arrival-poster.jpg" width="1280" height="720" aria-label="Client footage of the College Boy truck"><source src="/media/client-truck-arrival.mp4" type="video/mp4" /><track kind="captions" src="/media/client-truck-arrival.vtt" srcLang="en" label="English captions" default />Your browser does not support video. <a href="/media/client-truck-arrival.mp4">Open the video</a>.</video><p>Real College Boy footage supplied by the client.</p></div></section>
  </main><SiteFooter /></>;
}
