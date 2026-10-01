import type { Metadata } from 'next';
import { CareerApplicationForm } from '@/components/career-application-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { careersEmailReady } from '@/lib/careers';
import './careers.css';

export const metadata: Metadata = { title: 'Careers', description: 'Ask about driver and cook opportunities with College Boy Cheesesteaks.' };

export default function CareersPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" className="cb-inner">
    <section className="cb-inner-hero"><span className="eyebrow">JOIN COLLEGE BOY</span><h1>Work with the red truck.</h1><p>Interested in driving or cooking with College Boy? Tell us about yourself. Openings and schedules are confirmed by College Boy directly.</p><a className="button button-red" href="#apply">Ask about a role</a></section>
    <section className="cb-inner-body cb-inner-grid" id="apply" aria-labelledby="apply-title"><div><span className="eyebrow">CAREERS</span><h2 id="apply-title">Send your details.</h2><p>Choose a role and attach a PDF résumé. Online applications become available after the College Boy hiring inbox is connected.</p><p>For now, email <a className="text-link" href="mailto:info@collegeboysteaks.com?subject=College%20Boy%20employment%20inquiry">info@collegeboysteaks.com</a> directly and attach your résumé in your email app.</p></div><CareerApplicationForm available={careersEmailReady} /></section>
  </main><SiteFooter /></>;
}
