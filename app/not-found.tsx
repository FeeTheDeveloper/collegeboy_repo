import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return <><SiteHeader /><main className="cb-inner"><section className="cb-inner-hero"><span className="eyebrow">404 · WRONG STOP</span><h1>That page isn&apos;t here.</h1><p>Head back to College Boy or go straight to catering.</p><div className="cb-inner-actions"><Link className="button button-red" href="/">Home</Link><Link className="button button-outline" href="/catering">Catering</Link></div></section></main><SiteFooter /></>;
}
