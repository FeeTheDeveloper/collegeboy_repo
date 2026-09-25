'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const storageKey = 'collegeboy-mailing-list-invite-v1';

export function FirstVisitInvite() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setOpen(!window.localStorage.getItem(storageKey)));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  function dismiss() { window.localStorage.setItem(storageKey, 'seen'); setOpen(false); }
  if (!open) return null;
  return <aside className="first-visit" aria-labelledby="first-visit-title"><button className="close-invite" type="button" onClick={dismiss} aria-label="Dismiss mailing list invitation">×</button><span className="eyebrow">EXTRA CREDIT</span><h2 id="first-visit-title">Get truck updates.</h2><p>Join the mailing list for location and menu news after the College Boy subscriber database is connected.</p><div><Link className="button button-red" href="/subscribe" onClick={dismiss}>Join the list</Link><button className="text-button" type="button" onClick={dismiss}>Not now</button></div></aside>;
}
