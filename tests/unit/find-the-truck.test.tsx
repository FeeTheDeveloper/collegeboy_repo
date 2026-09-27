import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FindTheTruck } from '@/components/find-the-truck';
import { now, schedule, stop } from './fixtures';

describe('Find the truck rendering', () => {
  it('renders a confirmed stop with a map link, hours and as-of time', () => {
    const html = renderToStaticMarkup(<FindTheTruck schedule={schedule([stop()])} renderedAt={now} />);
    expect(html).toContain('data-schedule-state="live"');
    expect(html).toContain('href="https://www.google.com/maps/search/?api=1&amp;query=100%20Example%20Ave');
    expect(html).toContain('Serving now');
    expect(html).toMatch(/5:00\s?PM – 9:00\s?PM/);
    expect(html).toMatch(/Schedule as of Oct 8/);
  });

  it('shows "not confirmed" rather than a stale stop', () => {
    const html = renderToStaticMarkup(<FindTheTruck schedule={schedule([stop()], '2026-09-01T09:00:00-07:00')} renderedAt={now} />);
    expect(html).toContain('data-schedule-state="not-confirmed"');
    expect(html).toContain('data-reason="stale"');
    expect(html).not.toContain('Test Venue');
    expect(html).not.toContain('100 Example Ave');
  });
});
