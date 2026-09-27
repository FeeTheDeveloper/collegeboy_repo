'use client';

import { useEffect, useState } from 'react';
import { instagramUrl } from '@/lib/nav-links';
import { formatAsOf, formatStopDate, formatStopHours, mapsUrl, selectStops, type Schedule, type Stop } from '@/lib/schedule';

const reasons = {
  empty: 'College Boy has not posted a confirmed stop on this site yet.',
  stale: 'The posted schedule is out of date, so no stop is shown.',
  unreadable: 'The schedule could not be read, so no stop is shown.',
  'none-upcoming': 'No confirmed stop is coming up in the next two weeks.'
} as const;

function StopCard({ stop, timeZone, current }: { stop: Stop; timeZone: string; current: boolean }) {
  return <li className="stop-card" data-current={current || undefined}>
    <span className="stop-label">{current ? 'Serving now' : formatStopDate(stop, timeZone)}</span>
    <strong>{stop.venue}</strong>
    <a className="stop-address" href={mapsUrl(stop.address)} target="_blank" rel="noopener noreferrer">{stop.address}<span className="menu-visually-hidden"> (opens map in a new tab)</span></a>
    <span className="stop-hours">{current ? `${formatStopDate(stop, timeZone)} · ` : ''}{formatStopHours(stop, timeZone)}</span>
    {stop.note ? <small>{stop.note}</small> : null}
  </li>;
}

/**
 * Renders with the server's clock, then re-selects on the visitor's clock every
 * minute, so a stop that has ended disappears without waiting for a rebuild.
 */
export function FindTheTruck({ schedule, renderedAt }: { schedule: Schedule | null; renderedAt: number }) {
  const [now, setNow] = useState(renderedAt);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const view = selectStops(schedule, now);
  const timeZone = schedule?.timeZone ?? 'America/Los_Angeles';

  return <section className="find section" id="find" aria-labelledby="find-title">
    <div className="section-intro"><span className="eyebrow">THE TRUCK MOVES</span><h2 id="find-title">Find the truck.</h2>
      <p>Stops come from one schedule College Boy confirms. If a stop is not confirmed, it is not listed here.</p></div>
    {view.state === 'live'
      ? <div className="location-card location-live" data-schedule-state="live">
        <div><span className="status-dot" />CONFIRMED STOPS</div>
        <ul className="stop-list">
          {view.current ? <StopCard stop={view.current} timeZone={timeZone} current /> : null}
          {view.upcoming.map(stop => <StopCard key={stop.id} stop={stop} timeZone={timeZone} current={false} />)}
        </ul>
        <p className="schedule-asof">Schedule as of {formatAsOf(view.asOf, timeZone)}. Plans can change — check Instagram before you travel.</p>
      </div>
      : <div className="location-card" data-schedule-state="not-confirmed" data-reason={view.reason}>
        <div><span className="status-dot" />LOCATION NOT CONFIRMED</div>
        <strong>No confirmed stop posted</strong>
        <p>{reasons[view.reason]} Check College Boy’s official Instagram for today’s location.</p>
        {view.asOf ? <p className="schedule-asof">Schedule last updated {formatAsOf(view.asOf, timeZone)}.</p> : null}
        <a className="button button-red" href={instagramUrl} target="_blank" rel="noopener noreferrer">Check Instagram ↗</a>
      </div>}
  </section>;
}
