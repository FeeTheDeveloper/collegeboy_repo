import Link from 'next/link';
import { brandLine, business, shown } from '@/lib/content/business';
import { instagramUrl } from '@/lib/nav-links';
import './site-footer.css';

export function SiteFooter() {
  const cateringEmail = shown(business.cateringEmail);
  const email = shown(business.generalEmail);
  const office = shown(business.officePhone);
  const mobile = shown(business.mobilePhone);
  const address = shown(business.mailingAddress);
  return <footer className="site-footer"><div><strong>COLLEGE BOY<br />CHEESESTEAKS</strong><p>{brandLine.current}</p></div><div className="footer-links"><Link href="/subscribe">Join the mailing list</Link><Link href="/careers">Careers</Link>{cateringEmail ? <a href={`mailto:${cateringEmail}`}>Catering by email</a> : null}<a href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a></div><div className="footer-contact"><strong>CONTACT</strong>{address ? <address>{address}</address> : null}{office ? <a href={`tel:${office.replace(/\D/g, '')}`}>Office: {office}</a> : null}{mobile ? <a href={`tel:${mobile.replace(/\D/g, '')}`}>Mobile: {mobile}</a> : null}{email ? <a href={`mailto:${email}`}>{email}</a> : null}</div><small>Review build · Not the production website</small></footer>;
}
