'use client';

import { useEffect, useRef, useState } from 'react';

export function HomeHeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduceMotion || connection?.saveData) return;
    void player.play().catch(() => { /* Poster remains visible if autoplay is blocked. */ });
  }, []);

  function toggle() {
    const player = video.current;
    if (!player) return;
    if (player.paused) void player.play().catch(() => { /* Keep the poster visible. */ });
    else player.pause();
  }

  return <>
    <video ref={video} className="cb-stage-video" muted loop playsInline preload="metadata"
      poster="/media/client-truck-arrival-poster.jpg" aria-hidden="true"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
      <source src="/media/client-truck-arrival.mp4" type="video/mp4" />
    </video>
    <button className="cb-video-toggle" type="button" onClick={toggle} aria-label={playing ? 'Pause College Boy footage' : 'Play College Boy footage'}>
      {playing ? 'Pause video' : 'Play video'}
    </button>
  </>;
}
