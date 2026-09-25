'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const storageKey = 'collegeboy-showtime-intro-v1';

export function ShowtimeIntro() {
  const [visible, setVisible] = useState(false);
  const skipButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || window.sessionStorage.getItem(storageKey)) return;

    window.sessionStorage.setItem(storageKey, 'seen');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const reveal = window.requestAnimationFrame(() => {
      setVisible(true);
      window.requestAnimationFrame(() => skipButton.current?.focus());
    });
    const close = window.setTimeout(() => setVisible(false), 5200);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVisible(false);
      if (event.key === 'Tab') {
        event.preventDefault();
        skipButton.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(reveal);
      window.clearTimeout(close);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="showtime-intro" role="dialog" aria-modal="true" aria-label="College Boy Cheesesteaks opening">
      <div className="showtime-road" aria-hidden="true"><span /></div>
      <div className="showtime-truck" aria-hidden="true">
        <Image
          src="/media/college-boy-truck-showtime.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="showtime-copy">
        <span className="showtime-kicker">College Boy Cheesesteaks presents</span>
        <p>This is an event.</p>
        <strong>It&rsquo;s showtime.</strong>
      </div>
      <button ref={skipButton} className="showtime-skip" type="button" onClick={() => setVisible(false)}>
        Enter the site <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
