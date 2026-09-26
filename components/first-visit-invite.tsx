'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const storageKey = 'collegeboy-mailing-list-invite-v1';

export function FirstVisitInvite() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { if (window.localStorage.getItem(storageKey)) return; } catch { return; }
    // On a phone this card covers the hero, so it waits until the hero is behind them.
    const reveal = () => {
      if (window.scrollY < window.innerHeight * 0.85) return;
      setOpen(true);
      window.removeEventListener('scroll', reveal);
    };
    window.addEventListener('scroll', reveal, { passive: true });
    reveal();
    return () => window.removeEventListener('scroll', reveal);
  }, []);

  function dismiss() {
    try { window.localStorage.setItem(storageKey, 'seen'); } catch { /* Keep the in-memory dismissal. */ }
    setOpen(false);
  }

  if (!open) return null;
  return <aside className="first-visit" aria-labelledby="first-visit-title"><button className="close-invite" type="button" onClick={dismiss} aria-label="Dismiss mailing list invitation">×</button><span className="eyebrow">EXTRA CREDIT</span><h2 id="first-visit-title">Get truck updates.</h2><p>Join the mailing list for location and menu news after the College Boy subscriber database is connected.</p><div><Link className="button button-red" href="/subscribe" onClick={dismiss}>Join the list</Link><button className="text-button" type="button" onClick={dismiss}>Not now</button></div></aside>;
}
