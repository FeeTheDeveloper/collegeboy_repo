import Link from 'next/link';

export function SiteFooter() {
  return <footer className="site-footer"><div><strong>COLLEGE BOY<br />CHEESESTEAKS</strong><p>Real Philly, wherever we roll.</p></div><div className="footer-links"><Link href="/subscribe">Join the mailing list</Link><a href="mailto:catering@collegeboysteaks.com">Catering by email</a><a href="https://www.instagram.com/collegeboycheesesteaks/" target="_blank" rel="noreferrer">Instagram ↗</a></div><small>Review build · Not the production website</small></footer>;
}
