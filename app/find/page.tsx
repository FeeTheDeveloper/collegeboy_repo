import type { Metadata } from 'next';
import Link from 'next/link';
import { FindTheTruck } from '@/components/find-the-truck';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { parseSchedule, renderClock } from '@/lib/schedule';
import scheduleSource from '@/content/schedule.json';

export const metadata: Metadata = { title: 'Find the truck', description: 'See the confirmed College Boy truck schedule.', alternates: { canonical: '/find' } };
export const revalidate = 300;

export default function FindPage() {
  const { schedule } = parseSchedule(scheduleSource);
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" className="cb-inner cb-find-page">
    <section className="cb-inner-hero cb-find-hero"><span className="eyebrow">THE RED TRUCK</span><h1>Find College Boy.</h1><p>We show stops only when College Boy has confirmed them.</p><Link className="button button-red" href="/menu">See the menu</Link></section>
    <FindTheTruck schedule={schedule} renderedAt={renderClock()} />
  </main><SiteFooter /></>;
}
