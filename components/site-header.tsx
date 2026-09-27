import Link from 'next/link';
import { clerkConfigured } from '@/lib/config';
import { navLinks, orderHref } from '@/lib/nav-links';
import { AuthControls } from './auth-controls';
import { MobileNav } from './mobile-nav';
import { TruckLogo } from './truck-logo';

export function SiteHeader() {
  return <header className="site-header">
    <Link className="wordmark" href="/" aria-label="College Boy Cheesesteaks home"><TruckLogo /><span>COLLEGE BOY<small>CHEESESTEAKS</small></span></Link>
    <nav aria-label="Primary navigation">{navLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
    <div className="header-actions">{clerkConfigured ? <AuthControls /> : null}<Link className="order-link" href={orderHref}>Order</Link><MobileNav auth={clerkConfigured ? <AuthControls /> : null} /></div>
  </header>;
}
