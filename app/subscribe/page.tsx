import type { Metadata } from 'next';
import { SubscribeForm } from '@/components/subscribe-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { supabaseConfigured } from '@/lib/config';

export const metadata: Metadata = { title: 'Join the mailing list' };

export default function SubscribePage() {
  return <><SiteHeader /><main className="subscribe-page"><section><span className="eyebrow">JOIN THE ROLL CALL</span><h1>Know where the red truck lands next.</h1><p>Sign up for College Boy location, menu, and event updates. The form stays disabled until the dedicated client database and unsubscribe process are configured.</p></section><SubscribeForm available={supabaseConfigured} /></main><SiteFooter /></>;
}
