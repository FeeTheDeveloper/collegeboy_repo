/**
 * The truck schedule has one source: content/schedule.json. Every surface that
 * shows a location (website, draft captions, dashboard queue) goes through
 * selectStops() so none of them can show a stop the others would refuse.
 */

export type StopStatus = 'confirmed' | 'tentative' | 'canceled';

export type Stop = {
  id: string;
  /** Local calendar date of the stop, YYYY-MM-DD, in the schedule time zone. */
  date: string;
  venue: string;
  /** Exact street address as it should be typed in captions and map links. */
  address: string;
  /** ISO 8601 with offset, e.g. 2026-10-01T17:00:00-07:00. */
  startsAt: string;
  endsAt: string;
  status: StopStatus;
  /** Who at College Boy confirmed this stop. Required for it to be shown. */
  approvedBy: string | null;
  updatedAt: string;
  note?: string;
};

export type Schedule = {
  timeZone: string;
  lastUpdatedAt: string | null;
  updatedBy: string | null;
  stops: Stop[];
};

export type ScheduleView =
  | { state: 'live'; current: Stop | null; upcoming: Stop[]; asOf: string }
  | { state: 'not-confirmed'; reason: 'empty' | 'stale' | 'unreadable' | 'none-upcoming'; asOf: string | null };

/** A schedule nobody has touched in this long is treated as unconfirmed, whatever it says. */
export const maxScheduleAgeMs = 14 * 24 * 60 * 60 * 1000;
/** Only stops starting within this window are advertised. */
export const lookaheadMs = 14 * 24 * 60 * 60 * 1000;

const statuses: StopStatus[] = ['confirmed', 'tentative', 'canceled'];
const isoWithOffset = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function validTime(value: unknown) {
  const raw = text(value);
  return isoWithOffset.test(raw) && !Number.isNaN(Date.parse(raw)) ? raw : null;
}

/** Returns only well-formed stops; anything malformed is dropped, never guessed at. */
export function parseSchedule(raw: unknown): { schedule: Schedule | null; errors: string[] } {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object') return { schedule: null, errors: ['Schedule is not an object.'] };
  const source = raw as Record<string, unknown>;
  const timeZone = text(source.timeZone);
  try { new Intl.DateTimeFormat('en-US', { timeZone }); } catch { return { schedule: null, errors: [`Unknown time zone "${timeZone}".`] }; }
  const lastUpdatedAt = source.lastUpdatedAt == null ? null : validTime(source.lastUpdatedAt);
  if (source.lastUpdatedAt != null && !lastUpdatedAt) errors.push('lastUpdatedAt must be ISO 8601 with an offset.');

  const stops: Stop[] = [];
  const list = Array.isArray(source.stops) ? source.stops : [];
  list.forEach((entry, index) => {
    const stop = (entry ?? {}) as Record<string, unknown>;
    const label = `stops[${index}]`;
    const startsAt = validTime(stop.startsAt);
    const endsAt = validTime(stop.endsAt);
    const updatedAt = validTime(stop.updatedAt);
    const status = text(stop.status) as StopStatus;
    const problems = [
      !text(stop.id) && 'id', !/^\d{4}-\d{2}-\d{2}$/.test(text(stop.date)) && 'date',
      !text(stop.venue) && 'venue', !text(stop.address) && 'address',
      !startsAt && 'startsAt', !endsAt && 'endsAt', !updatedAt && 'updatedAt',
      !statuses.includes(status) && 'status'
    ].filter(Boolean);
    if (problems.length) { errors.push(`${label}: invalid ${problems.join(', ')}.`); return; }
    if (Date.parse(endsAt!) <= Date.parse(startsAt!)) { errors.push(`${label}: endsAt must be after startsAt.`); return; }
    stops.push({
      id: text(stop.id), date: text(stop.date), venue: text(stop.venue), address: text(stop.address),
      startsAt: startsAt!, endsAt: endsAt!, status, approvedBy: text(stop.approvedBy) || null,
      updatedAt: updatedAt!, ...(text(stop.note) ? { note: text(stop.note) } : {})
    });
  });
  return { schedule: { timeZone, lastUpdatedAt, updatedBy: text(source.updatedBy) || null, stops }, errors };
}

/** A stop is publishable only when it is confirmed, owner-approved, and not over. */
export function isPublishable(stop: Stop, now: number) {
  return stop.status === 'confirmed' && Boolean(stop.approvedBy) && Date.parse(stop.endsAt) > now;
}

export function selectStops(schedule: Schedule | null, now: number): ScheduleView {
  if (!schedule) return { state: 'not-confirmed', reason: 'unreadable', asOf: null };
  const asOf = schedule.lastUpdatedAt;
  if (!asOf || !schedule.stops.length) return { state: 'not-confirmed', reason: 'empty', asOf };
  if (now - Date.parse(asOf) > maxScheduleAgeMs) return { state: 'not-confirmed', reason: 'stale', asOf };

  const open = schedule.stops
    .filter(stop => isPublishable(stop, now) && Date.parse(stop.startsAt) - now <= lookaheadMs)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  if (!open.length) return { state: 'not-confirmed', reason: 'none-upcoming', asOf };
  const current = open.find(stop => Date.parse(stop.startsAt) <= now) ?? null;
  return { state: 'live', current, upcoming: open.filter(stop => stop !== current), asOf };
}

export function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function formatStopDate(stop: Stop, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(stop.startsAt));
}

export function formatStopHours(stop: Stop, timeZone: string) {
  const time = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' });
  return `${time.format(new Date(stop.startsAt))} – ${time.format(new Date(stop.endsAt))}`;
}

export function formatAsOf(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', { timeZone, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(iso));
}

/**
 * The server's clock at render time. The home page is revalidated every few
 * minutes, and FindTheTruck re-selects on the visitor's clock after mount, so
 * this value only seeds the first paint and is never trusted on its own.
 */
export function renderClock() {
  return Date.now();
}
