import Link from 'next/link';
import { clerkConfigured } from '@/lib/config';
import { AuthControls } from './auth-controls';
import { TruckLogo } from './truck-logo';

export function SiteHeader() {
  return <header className="site-header">
    <Link className="wordmark" href="/" aria-label="College Boy Cheesesteaks home"><TruckLogo /><span>COLLEGE BOY<small>CHEESESTEAKS</small></span></Link>
    <nav aria-label="Primary navigation"><Link href="/#find">Find the truck</Link><Link href="/#menu">Menu</Link><Link href="/#about">About</Link><Link href="/#catering">Catering</Link><Link href="/subscribe">Join the list</Link></nav>
    <div className="header-actions">{clerkConfigured ? <AuthControls /> : null}<a className="order-link" href="https://collegeboy-cheesesteaks.square.site/" target="_blank" rel="noreferrer">Order pickup ↗</a></div>
  </header>;
}
