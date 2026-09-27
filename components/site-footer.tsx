import Link from 'next/link';
import { brandLine, business, shown } from '@/lib/content/business';
import { instagramUrl } from '@/lib/nav-links';

export function SiteFooter() {
  const cateringEmail = shown(business.cateringEmail);
  return <footer className="site-footer"><div><strong>COLLEGE BOY<br />CHEESESTEAKS</strong><p>{brandLine.current}</p></div><div className="footer-links"><Link href="/subscribe">Join the mailing list</Link>{cateringEmail ? <a href={`mailto:${cateringEmail}`}>Catering by email</a> : null}<a href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a></div><small>Review build · Not the production website</small></footer>;
}
