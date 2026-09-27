'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { instagramUrl, navLinks, orderHref } from '@/lib/nav-links';
import './mobile-nav.css';

/**
 * Narrow screens hide the desktop nav, so the same links live here in a sheet.
 * A modal <dialog> gives Escape, focus containment, and top-layer stacking for free.
 */
export function MobileNav({ auth }: { auth?: ReactNode }) {
  const sheet = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const modal = sheet.current;
    if (!open || !modal) return;
    const opener = trigger.current;
    const root = document.documentElement;
    const previousRoot = root.style.overflow;
    const previousBody = document.body.style.overflow;
    modal.showModal();
    // iOS Safari scrolls the page behind an open dialog unless both are locked.
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const closeWide = window.matchMedia('(min-width: 1181px)');
    const widened = () => { if (closeWide.matches) setOpen(false); };
    closeWide.addEventListener('change', widened);
    return () => {
      modal.close();
      root.style.overflow = previousRoot;
      document.body.style.overflow = previousBody;
      closeWide.removeEventListener('change', widened);
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  return <>
    <button ref={trigger} type="button" className="mobile-nav-button" aria-expanded={open} aria-haspopup="dialog"
      onClick={() => setOpen(true)}>
      <span className="mobile-nav-bars" aria-hidden="true"><span /><span /><span /></span>Menu
    </button>
    <dialog ref={sheet} className="mobile-nav-sheet" aria-label="Site menu" onCancel={() => setOpen(false)}
      onClick={event => { if (event.target === sheet.current) setOpen(false); }}>
      {open && <div className="mobile-nav-panel">
        <div className="mobile-nav-top"><span className="eyebrow">COLLEGE BOY</span>
          <button autoFocus type="button" className="mobile-nav-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
        </div>
        <nav aria-label="Primary navigation">
          {navLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link href="/subscribe" onClick={() => setOpen(false)}>Join the list</Link>
        </nav>
        <div className="mobile-nav-actions">
          <Link className="button button-red" href={orderHref} onClick={() => setOpen(false)}>Order</Link>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Instagram ↗</a>
          {auth}
        </div>
      </div>}
    </dialog>
  </>;
}
