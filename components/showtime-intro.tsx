'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { OpeningPlayer } from './opening-player';

const storageKey = 'collegeboy-cinematic-opening-v3';

export function ShowtimeIntro() {
  const [visible, setVisible] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // A 3 MB gate is wrong on a metered or crawling connection: go straight to the site.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || (connection?.effectiveType && /^(slow-)?2g$/.test(connection.effectiveType))) return;
    if (navigator.onLine === false) return;
    try { if (sessionStorage.getItem(storageKey)) return; } catch { /* Optional storage. */ }
    const frame = requestAnimationFrame(() => {
      try { sessionStorage.setItem(storageKey, 'seen'); } catch { /* Optional storage. */ }
      setVisible(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!visible || !dialog.current) return;
    const modal = dialog.current;
    const root = document.documentElement;
    const previousRoot = root.style.overflow;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    // Locking both stops iOS Safari scrolling the page behind the open dialog.
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    modal.showModal();
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => { if (motion.matches) dismiss(); };
    motion.addEventListener('change', motionChanged);
    return () => {
      modal.close();
      root.style.overflow = previousRoot;
      document.body.style.overflow = previousOverflow;
      motion.removeEventListener('change', motionChanged);
      const target = previousFocus && previousFocus !== document.body && previousFocus.isConnected
        ? previousFocus : document.querySelector<HTMLElement>('.wordmark');
      target?.focus({ preventScroll: true });
    };
  }, [visible, dismiss]);

  return visible ? <dialog ref={dialog} className="cinema-dialog showtime-intro" aria-label="College Boy opening film" onCancel={dismiss}>
    <OpeningPlayer automatic onComplete={dismiss} onSkip={dismiss} />
  </dialog> : null;
}
