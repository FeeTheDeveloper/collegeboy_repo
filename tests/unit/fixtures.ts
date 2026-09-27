import type { Schedule, Stop } from '@/lib/schedule';

/** Fictional stops for tests only. Never copy these into content/schedule.json. */
export const now = Date.parse('2026-10-09T18:00:00-07:00');

export function stop(overrides: Partial<Stop> = {}): Stop {
  return {
    id: 'test-stop', date: '2026-10-09', venue: 'Test Venue', address: '100 Example Ave, Los Angeles, CA 90000',
    startsAt: '2026-10-09T17:00:00-07:00', endsAt: '2026-10-09T21:00:00-07:00', status: 'confirmed',
    approvedBy: 'owner-test', updatedAt: '2026-10-08T09:00:00-07:00', ...overrides
  };
}

export function schedule(stops: Stop[], lastUpdatedAt: string | null = '2026-10-08T09:00:00-07:00'): Schedule {
  return { timeZone: 'America/Los_Angeles', lastUpdatedAt, updatedBy: 'owner-test', stops };
}
