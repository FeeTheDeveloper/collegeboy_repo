import Image from 'next/image';
import Link from 'next/link';
import { brandLine, business, shown } from '@/lib/content/business';
import { supabaseConfigured } from '@/lib/config';
import { instagramUrl } from '@/lib/nav-links';
import { SubscribeForm } from './subscribe-form';
import './site-footer.css';

const gallery = [
  { src: '/media/menu-alumni.webp', alt: 'College Boy Alumni cheesesteak' },
  { src: '/media/menu-masters.webp', alt: "College Boy Master's cheesesteak" },
  { src: '/media/menu-cheese-fries.webp', alt: 'College Boy Cheese Fries' },
  { src: '/media/menu-doctorate.webp', alt: 'College Boy Doctorate cheesesteak' },
] as const;

export function SiteFooter() {
  const cateringEmail = shown(business.cateringEmail);
  const email = shown(business.generalEmail);
  const office = shown(business.officePhone);
  const mobile = shown(business.mobilePhone);
  const location = shown(business.serviceArea);

  return <>
    <section className="cb-footer-signup" aria-labelledby="footer-signup-title"><span className="eyebrow">STAY WITH THE TRUCK</span><h2 id="footer-signup-title">Keep up with College Boy.</h2><p>Get College Boy location, menu, and event updates when the mailing list opens.</p><SubscribeForm available={supabaseConfigured} compact /></section>
    <section className="cb-footer-gallery" aria-label="College Boy food photos">{gallery.map(item => <div key={item.src}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 600px) 50vw, 25vw" /></div>)}</section>
    <footer className="site-footer"><div><Link className="footer-wordmark" href="/">COLLEGE BOY<br />CHEESESTEAKS</Link><p>{brandLine.current}</p></div>
      <nav className="footer-links" aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/menu">Menu</Link><Link href="/find">Find the truck</Link><Link href="/story">Story</Link><Link href="/catering">Catering</Link><Link href="/careers">Careers</Link></nav>
      <div className="footer-contact"><strong>CONTACT</strong>{location ? <address>{location}</address> : null}{office ? <a href={`tel:${office.replace(/\D/g, '')}`}>Office: {office}</a> : null}{mobile ? <a href={`tel:${mobile.replace(/\D/g, '')}`}>Mobile: {mobile}</a> : null}{email ? <a href={`mailto:${email}`}>{email}</a> : null}{cateringEmail ? <a href={`mailto:${cateringEmail}`}>Catering: {cateringEmail}</a> : null}<a href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a></div>
      <small>Review build · Not the production website</small>
    </footer>
  </>;
}
