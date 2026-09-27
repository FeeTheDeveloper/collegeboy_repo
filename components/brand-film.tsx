'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import './brand-film.css';

const dismissedKey = 'collegeboy-film-dismissed-v1';
const sources = {
  enhanced: '/media/college-boy-film-enhanced.mp4',
  original: '/media/college-boy-film-original.mp4',
};

export function FilmPlayer() {
  const video = useRef<HTMLVideoElement>(null);
  const resume = useRef<{ time: number; playing: boolean } | null>(null);
  const [mix, setMix] = useState<'enhanced' | 'original'>('enhanced');
  const [state, setState] = useState<'idle' | 'buffering' | 'playing' | 'failed'>('idle');
  const [metered, setMetered] = useState(false);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    // Let iPhones hand the film to an Apple TV instead of failing on the small screen.
    player.setAttribute('x-webkit-airplay', 'allow');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    setMetered(Boolean(connection?.saveData) || /^((slow-)?2g|3g)$/.test(connection?.effectiveType ?? ''));
  }, []);

  useEffect(() => {
    const player = video.current;
    if (!player || !resume.current) return;
    player.preload = 'metadata';
    player.load();
  }, [mix]);

  function changeMix(next: 'enhanced' | 'original') {
    if (next === mix) return;
    const player = video.current;
    if (player) {
      resume.current = { time: player.currentTime, playing: !player.paused };
      player.pause();
    }
    setState('idle');
    setMix(next);
  }

  return <div className="film-player">
    <video ref={video} src={sources[mix]} controls playsInline preload={metered ? 'none' : 'metadata'}
      poster="/media/college-boy-film-poster.jpg" width={720} height={1064}
      aria-label="College Boy Cheesesteaks brand film"
      onWaiting={() => setState(current => current === 'failed' ? current : 'buffering')}
      onPlaying={() => setState('playing')} onCanPlay={() => setState(current => current === 'buffering' ? 'playing' : current)}
      onError={() => setState('failed')}
      onLoadedMetadata={() => {
        const player = video.current;
        const previous = resume.current;
        if (!player || !previous) return;
        player.currentTime = Math.min(previous.time, player.duration || previous.time);
        resume.current = null;
        if (previous.playing) void player.play().catch(() => {});
      }}>
      Your browser does not support video. <a href={sources[mix]}>Open the film</a>.
    </video>
    <fieldset className="film-mix"><legend>Audio mix</legend>
      <button type="button" aria-pressed={mix === 'enhanced'} onClick={() => changeMix('enhanced')}>Enhanced dialogue</button>
      <button type="button" aria-pressed={mix === 'original'} onClick={() => changeMix('original')}>Original audio</button>
    </fieldset>
    <p className="film-player-note">Original voices. Captions appear within the film.{metered ? ' This connection looks slow or metered — the film is about 31 MB.' : ''}</p>
    {state === 'buffering' && <p className="film-player-status" role="status">Buffering the film…</p>}
    {state === 'failed' && <p className="film-player-status" role="alert">The video could not load. <button type="button" className="text-button" onClick={() => { const player = video.current; if (!player) return; setState('idle'); player.load(); }}>Try again</button>, <a href={sources[mix]}>open it directly</a>, or switch the audio mix.</p>}
  </div>;
}

export function BrandFilm() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const section = useRef<HTMLElement>(null);
  const dismissed = useRef(false);
  const [open, setOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    try { dismissed.current = sessionStorage.getItem(dismissedKey) === 'yes'; } catch { /* Session storage is optional. */ }
    const update = () => {
      const hero = document.querySelector('.hero');
      const film = section.current?.getBoundingClientRect();
      const filmVisible = film && film.top < innerHeight && film.bottom > 0;
      setShowPrompt(!dismissed.current && !filmVisible && !!hero && hero.getBoundingClientRect().bottom < 0 &&
        !document.querySelector('.first-visit, .showtime-intro'));
    };
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    if (!modal) return;
    const root = document.documentElement;
    const previousRoot = root.style.overflow;
    const previousOverflow = document.body.style.overflow;
    const fallbackOpener = section.current?.querySelector('button');
    modal.showModal();
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      modal.querySelector('video')?.pause();
      modal.close();
      root.style.overflow = previousRoot;
      document.body.style.overflow = previousOverflow;
      if (opener.current?.isConnected) opener.current.focus();
      else fallbackOpener?.focus();
    };
  }, [open]);

  function dismissPrompt() {
    dismissed.current = true;
    setShowPrompt(false);
    try { sessionStorage.setItem(dismissedKey, 'yes'); } catch { /* Keep in-memory dismissal. */ }
  }

  function launch(button: HTMLButtonElement) {
    opener.current = button;
    setOpen(true);
  }

  return <>
    <section className="brand-film" id="film" ref={section} aria-labelledby="film-title">
      <button className="film-cover" onClick={event => launch(event.currentTarget)} aria-label="Watch the College Boy film">
        <Image src="/media/college-boy-film-poster.jpg" alt="A customer with a cheesesteak beside the red College Boy truck" fill sizes="(max-width: 760px) 100vw, 45vw" />
        <span className="film-play" aria-hidden="true">▶</span><span className="film-duration">THE FILM · 1:36</span>
      </button>
      <div className="film-intro"><span className="eyebrow">FROM THE TRUCK. WITH LOVE.</span>
        <h2 id="film-title">Real people.<br /><em>Real Philly.</em></h2>
        <p>Step inside College Boy. Meet the people behind the counter, see the food come together, and hear the story in their own words.</p>
        <button className="button button-red" onClick={event => launch(event.currentTarget)}>Watch the film <span aria-hidden="true">↗</span></button>
        <Link className="text-link" href="/film">Explore the story</Link>
      </div>
    </section>
    {showPrompt && !open && <aside className="film-prompt" aria-label="College Boy film invitation">
      <button className="film-prompt-watch" onClick={event => launch(event.currentTarget)}><span aria-hidden="true">▶</span><span>Inside College Boy<small>Watch the 96-second film</small></span></button>
      <button className="film-prompt-dismiss" aria-label="Dismiss film invitation" onClick={dismissPrompt}>×</button>
    </aside>}
    <dialog ref={dialog} className="film-dialog" aria-labelledby="film-dialog-title" onCancel={() => setOpen(false)}
      onClick={event => { if (event.target === dialog.current) setOpen(false); }}>
      {open && <div className="film-dialog-body">
        <header><h2 id="film-dialog-title">Inside College Boy</h2><button autoFocus type="button" onClick={() => setOpen(false)} aria-label="Close film">×</button></header>
        <FilmPlayer />
        <div className="film-actions"><Link className="button button-red" href="/#order" onClick={() => setOpen(false)}>Order</Link><Link className="text-link" href="/#catering" onClick={() => setOpen(false)}>Bring the truck to your event</Link></div>
      </div>}
    </dialog>
  </>;
}
