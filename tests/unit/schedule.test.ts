import { describe, expect, it } from 'vitest';
import { mapsUrl, parseSchedule, selectStops } from '@/lib/schedule';
import canonical from '@/content/schedule.json';
import { now, schedule, stop } from './fixtures';

describe('schedule freshness and fallback', () => {
  it('shows a confirmed, approved stop that is serving now, with its as-of time', () => {
    const view = selectStops(schedule([stop()]), now);
    expect(view.state).toBe('live');
    if (view.state === 'live') { expect(view.current?.id).toBe('test-stop'); expect(view.asOf).toBe('2026-10-08T09:00:00-07:00'); }
  });

  it('never shows a stop that has ended', () => {
    const ended = stop({ startsAt: '2026-10-08T17:00:00-07:00', endsAt: '2026-10-08T21:00:00-07:00', date: '2026-10-08' });
    expect(selectStops(schedule([ended]), now)).toMatchObject({ state: 'not-confirmed', reason: 'none-upcoming' });
  });

  it('treats a schedule untouched for more than 14 days as unconfirmed', () => {
    const view = selectStops(schedule([stop({ startsAt: '2026-10-10T17:00:00-07:00', endsAt: '2026-10-10T21:00:00-07:00' })], '2026-09-20T09:00:00-07:00'), now);
    expect(view).toMatchObject({ state: 'not-confirmed', reason: 'stale' });
  });

  it('hides tentative, canceled, and unapproved stops', () => {
    for (const bad of [stop({ status: 'tentative' }), stop({ status: 'canceled' }), stop({ approvedBy: null })]) {
      expect(selectStops(schedule([bad]), now).state).toBe('not-confirmed');
    }
  });

  it('falls back when the schedule is empty, missing a timestamp, or unreadable', () => {
    expect(selectStops(schedule([]), now)).toMatchObject({ reason: 'empty' });
    expect(selectStops(schedule([stop()], null), now)).toMatchObject({ reason: 'empty' });
    expect(selectStops(null, now)).toMatchObject({ reason: 'unreadable' });
  });

  it('does not advertise stops more than two weeks out', () => {
    const far = stop({ date: '2026-11-20', startsAt: '2026-11-20T17:00:00-08:00', endsAt: '2026-11-20T21:00:00-08:00' });
    expect(selectStops(schedule([far]), now).state).toBe('not-confirmed');
  });

  it('drops malformed entries instead of guessing', () => {
    const { schedule: parsed, errors } = parseSchedule({ timeZone: 'America/Los_Angeles', lastUpdatedAt: null, stops: [
      { ...stop(), startsAt: 'Friday 5pm' }, { ...stop(), address: '' }, { ...stop(), endsAt: '2026-10-09T16:00:00-07:00' }, stop()
    ] });
    expect(parsed?.stops).toHaveLength(1);
    expect(errors).toHaveLength(3);
  });

  it('builds map links from the exact address', () => {
    expect(mapsUrl('100 Example Ave, Los Angeles, CA')).toBe('https://www.google.com/maps/search/?api=1&query=100%20Example%20Ave%2C%20Los%20Angeles%2C%20CA');
  });

  it('ships with a valid canonical schedule that shows no stop', () => {
    const { schedule: parsed, errors } = parseSchedule(canonical);
    expect(errors).toEqual([]);
    expect(selectStops(parsed, Date.now()).state).toBe('not-confirmed');
  });
});
