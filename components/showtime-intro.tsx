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
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
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
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => { if (motion.matches) dismiss(); };
    motion.addEventListener('change', motionChanged);
    return () => {
      modal.close();
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
