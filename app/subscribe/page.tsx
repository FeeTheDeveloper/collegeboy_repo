import type { Metadata } from 'next';
import { SubscribeForm } from '@/components/subscribe-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { supabaseConfigured } from '@/lib/config';

export const metadata: Metadata = { title: 'Join the mailing list' };

export default function SubscribePage() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" className="cb-inner">
    <section className="cb-inner-hero"><span className="eyebrow">THE COLLEGE BOY LIST</span><h1>Keep up with the truck.</h1><p>College Boy location, menu, and event updates, when the dedicated signup system is ready.</p></section>
    <section className="cb-inner-body cb-inner-grid" aria-label="Mailing list signup"><div><h2>Join the list.</h2><p>The form remains closed until the College Boy database and unsubscribe process are configured.</p></div><SubscribeForm available={supabaseConfigured} /></section>
  </main><SiteFooter /></>;
}
