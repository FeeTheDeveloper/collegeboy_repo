'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TruckLogo } from './truck-logo';
import './opening-player.css';

export const openingSource = '/media/client-truck-arrival.mp4';

/**
 * Playback states are kept apart on purpose: a phone that refuses autoplay, a
 * slow connection, and a broken file all used to read as "could not load".
 */
type Status = 'ready' | 'loading' | 'playing' | 'paused' | 'blocked' | 'stalled' | 'ended' | 'error';

/** No data at all for this long means the file is not coming. */
const deadAir = 12000;
const slowAir = 4500;

export function OpeningPlayer({ automatic = false, onComplete, onSkip }: {
  automatic?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const progressAt = useRef(0);
  const [status, setStatus] = useState<Status>(automatic ? 'loading' : 'ready');
  const [muted, setMuted] = useState(true);
  const [slow, setSlow] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(9);
  const reveal = time >= 6 || status === 'ready' || status === 'ended' || status === 'error' || status === 'blocked';

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    // iOS only starts an unattended video that was already muted in the DOM, and
    // the attribute (not just the property) has to be there before the first play.
    player.defaultMuted = true;
    player.muted = true;
    player.setAttribute('x-webkit-airplay', 'allow');
  }, []);

  useEffect(() => {
    if (status !== 'ended' || !automatic) return;
    const timer = window.setTimeout(() => onComplete?.(), 2000);
    return () => clearTimeout(timer);
  }, [status, automatic, onComplete]);

  // Watch for silence rather than for a fixed deadline, so a slow phone keeps waiting.
  useEffect(() => {
    if (status !== 'loading') return;
    progressAt.current = Date.now();
    const check = window.setInterval(() => {
      const player = video.current;
      if (!player) return;
      if (player.error) { setStatus('error'); return; }
      const quiet = Date.now() - progressAt.current;
      if (quiet > deadAir) setStatus(player.buffered.length ? 'stalled' : 'error');
      else if (quiet > slowAir) setSlow(true);
    }, 1500);
    return () => window.clearInterval(check);
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

  function advanced() {
    progressAt.current = Date.now();
  }

  async function play(restart = false, withSound = !muted) {
    const player = video.current;
    if (!player) return;
    started.current = true;
    if ((restart || player.ended) && player.readyState) { player.currentTime = 0; setTime(0); }
    player.muted = !withSound;
    setMuted(!withSound);
    setSlow(false);
    advanced();
    setStatus('loading');
    try { await player.play(); } catch {
      // A rejected play() is a policy refusal (Low Power Mode, no gesture), not a failure.
      setStatus(player.error ? 'error' : withSound ? 'paused' : 'blocked');
    }
  }

  function retry() {
    const player = video.current;
    if (!player) return;
    player.load();
    void play(true, false);
  }

  const message = status === 'error' ? 'The film could not load. You can still enter the site.'
    : status === 'stalled' ? 'The connection stalled. Try again, or enter the site.'
      : status === 'blocked' ? 'Your phone is holding autoplay. Press play for the arrival.'
        : status === 'loading' ? (slow ? 'Slow connection — still bringing College Boy around…' : 'Bringing College Boy around…')
          : status === 'playing' ? (time < 2.5 ? 'The real College Boy truck.' : time < 5.6 ? 'Real Philly cheesesteaks.' : 'From real Philadelphians.')
            : status === 'paused' ? 'PAUSED — READY WHEN YOU ARE' : 'THE RED TRUCK. THE REAL THING.';

  return <section className="opening-cinema" data-reveal={reveal} data-status={status} aria-label="The red truck arrives">
    <video ref={video} className="opening-picture" src={openingSource}
      width={1280} height={720} playsInline muted={muted}
      preload={automatic ? 'auto' : 'metadata'} poster="/media/client-truck-arrival-poster.jpg"
      aria-label="Client footage of the red College Boy truck driving past and heading down the street"
      onCanPlay={() => { if (automatic && !started.current) void play(); }}
      onPlaying={() => { advanced(); setSlow(false); setStatus('playing'); }}
      onProgress={advanced} onLoadedData={advanced}
      onWaiting={() => { advanced(); setStatus(current => current === 'playing' ? 'loading' : current); }}
      onPause={() => setStatus(current => current === 'playing' ? 'paused' : current)}
      onTimeUpdate={event => { advanced(); setTime(event.currentTarget.currentTime); }}
      onLoadedMetadata={event => { advanced(); setDuration(event.currentTarget.duration || 9); }}
      onEnded={() => setStatus('ended')} onError={() => setStatus('error')}>
      <track kind="captions" src="/media/client-truck-arrival.vtt" srcLang="en" label="English" />
    </video>
    <div className="opening-shade" aria-hidden="true" />
    <div className="opening-topline"><span>PHILLY BORN. LOS ANGELES FED.</span><span>COLLEGE BOY / THE ARRIVAL</span></div>
    <div className="opening-lockup" aria-hidden={!reveal}>
      <TruckLogo />
      <h2>REAL PHILLY<br /><em>CHEESESTEAKS.</em></h2>
      <p>FROM REAL PHILADELPHIANS.</p>
    </div>
    <div className="opening-bottom">
      <p className="opening-status" role="status">{message}</p>
      <div className="opening-controls">
        {status === 'error' || status === 'stalled'
          ? <button type="button" onClick={retry}>Try again</button>
          : <>
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
