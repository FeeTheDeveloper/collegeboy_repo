'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TruckLogo } from './truck-logo';
import './opening-player.css';

export const openingSource = '/media/college-boy-opening.mp4';

export function OpeningPlayer({ automatic = false, onComplete, onSkip }: {
  automatic?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const [status, setStatus] = useState<'ready' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'>(automatic ? 'loading' : 'ready');
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(8);
  const reveal = time >= 6 || status === 'ready' || status === 'ended' || status === 'error';

  useEffect(() => {
    if (status !== 'ended' || !automatic) return;
    const timer = window.setTimeout(() => onComplete?.(), 2000);
    return () => clearTimeout(timer);
  }, [status, automatic, onComplete]);

  useEffect(() => {
    if (status !== 'loading') return;
    const timer = window.setTimeout(() => {
      video.current?.pause();
      setStatus('error');
    }, 8000);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    const player = video.current;
    const visibility = () => { if (document.hidden) player?.pause(); };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      player?.pause();
    };
  }, []);

  async function play(restart = false, withSound = !muted) {
    const player = video.current;
    if (!player) return;
    started.current = true;
    if (restart || player.ended) { player.currentTime = 0; setTime(0); }
    player.muted = !withSound;
    setMuted(!withSound);
    setStatus('loading');
    try { await player.play(); } catch {
      setStatus(current => current === 'error' || player.error ? 'error' : 'paused');
    }
  }

  return <section className="opening-cinema" data-reveal={reveal} aria-label="The red truck arrives">
    <video ref={video} className="opening-picture" src={openingSource}
      width={1280} height={720} playsInline muted={muted}
      preload={automatic ? 'auto' : 'none'} poster="/media/college-boy-opening-poster.jpg"
      aria-label="Animated red College Boy truck arriving on a palm-lined street and opening its service hatch"
      onCanPlay={() => { if (automatic && !started.current) void play(); }}
      onPlaying={() => setStatus('playing')}
      onWaiting={() => setStatus(current => current === 'playing' ? 'loading' : current)}
      onPause={() => setStatus(current => current === 'playing' ? 'paused' : current)}
      onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
      onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
      onEnded={() => setStatus('ended')} onError={() => setStatus('error')}>
      <track kind="captions" src="/media/college-boy-opening.vtt" srcLang="en" label="English" />
    </video>
    <div className="opening-shade" aria-hidden="true" />
    <div className="opening-topline"><span>PHILLY BORN. LOS ANGELES FED.</span><span>COLLEGE BOY / THE ARRIVAL</span></div>
    <div className="opening-lockup" aria-hidden={!reveal}>
      <TruckLogo />
      <h2>REAL PHILLY<br /><em>CHEESESTEAKS.</em></h2>
      <p>FROM REAL PHILADELPHIANS.</p>
    </div>
    <div className="opening-bottom">
      <p className="opening-status" role="status">{status === 'error' ? 'The film could not load. You can still enter the site.' : status === 'loading' ? 'Bringing the truck around…' : status === 'playing' ? (time < 2.5 ? '[Truck approaches; engine hum]' : time < 4.1 ? 'College Boy Cheesesteaks.' : time < 5.6 ? 'Real Philly cheesesteaks.' : 'From real Philadelphians.') : status === 'paused' ? 'PAUSED — READY WHEN YOU ARE' : 'THE RED TRUCK. THE REAL THING.'}</p>
      <div className="opening-controls">
        {status !== 'error' && <>
          <button type="button" onClick={() => status === 'playing' ? video.current?.pause() : void play(status === 'ended')}>
            {status === 'playing' ? 'Pause' : status === 'ended' ? 'Replay intro' : 'Play intro'}
          </button>
          <button type="button" aria-pressed={!muted} onClick={() => {
            if (muted) void play(true, true);
            else { if (video.current) video.current.muted = true; setMuted(true); }
          }}>{muted ? 'Restart with sound' : 'Mute sound'}</button>
        </>}
        {onSkip ? <button autoFocus type="button" className="opening-enter" onClick={onSkip}>Enter the site <span aria-hidden="true">↗</span></button>
          : <Link className="opening-enter" href="/">Enter the site <span aria-hidden="true">↗</span></Link>}
      </div>
      <div className="opening-progress" aria-hidden="true"><span style={{ width: `${Math.min(100, (time / duration) * 100)}%` }} /></div>
    </div>
  </section>;
}
