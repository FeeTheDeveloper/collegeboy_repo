import { describe, expect, it } from 'vitest';
import { channels } from '@/lib/publishing/channels';
import { approve, correctStop, draftLocationPosts, publishCheck, type Actor } from '@/lib/publishing/workflow';
import { packageProblems, schedulable, type ContentPackage } from '@/lib/publishing/content-packages';
import { now, schedule, stop } from './fixtures';

const owner: Actor = { id: 'owner-test', role: 'client-owner' };
const staff: Actor = { id: 'ftd-staff-test', role: 'ftd-staff' };
const targets = ['website', 'instagram-story', 'facebook-page'] as const;

describe('approval-gated location publishing', () => {
  it('drafts one distinct caption per channel with the exact address, hours and as-of time', () => {
    const { drafts, audit } = draftLocationPosts(stop(), schedule([stop()]), [...targets], now, staff);
    expect(drafts).toHaveLength(3);
    expect(new Set(drafts.map(d => d.caption)).size).toBe(3);
    for (const d of drafts) {
      expect(d.caption).toContain('100 Example Ave, Los Angeles, CA 90000');
      expect(d.caption).toContain('5:00');
      expect(d.caption).toMatch(/As of Oct 8/);
      expect(d.state).toBe('needs-review');
    }
    expect(audit.every(e => e.action === 'draft-created')).toBe(true);
  });

  it('refuses to draft an unconfirmed or ended stop', () => {
    expect(draftLocationPosts(stop({ status: 'tentative' }), schedule([]), ['website'], now, staff).drafts).toEqual([]);
    expect(draftLocationPosts(stop({ endsAt: '2026-10-09T17:30:00-07:00' }), schedule([]), ['website'], now, staff).error).toBeTruthy();
  });

  it('only the client owner can approve', () => {
    const [draft] = draftLocationPosts(stop(), schedule([stop()]), ['website'], now, staff).drafts;
    expect(() => approve(draft, staff, now)).toThrow(/owner/);
    expect(approve(draft, owner, now).draft.state).toBe('approved');
  });

  it('blocks publishing unapproved drafts and drafts whose stop changed or was canceled', () => {
    const sched = schedule([stop()]);
    const [draft] = draftLocationPosts(stop(), sched, ['instagram-story'], now, staff).drafts;
    expect(publishCheck(draft, sched, now)).toMatchObject({ ok: false });
    const approved = approve(draft, owner, now).draft;
    expect(publishCheck(approved, sched, now)).toEqual({ ok: true, mode: 'manual' });
    const moved = schedule([stop({ address: '200 Other St, Los Angeles, CA', updatedAt: '2026-10-09T12:00:00-07:00' })]);
    expect(publishCheck(approved, moved, now)).toMatchObject({ ok: false, reason: expect.stringMatching(/changed/) });
    expect(publishCheck(approved, schedule([stop({ status: 'canceled' })]), now)).toMatchObject({ ok: false });
  });

  it('every channel starts in manual mode', () => {
    expect(Object.values(channels).every(channel => channel.directPublish === null)).toBe(true);
  });

  it('a correction withdraws published posts and re-drafts for owner approval with an audit trail', () => {
    const [draft] = draftLocationPosts(stop(), schedule([stop()]), ['facebook-page'], now, staff).drafts;
    const published = { ...approve(draft, owner, now).draft, state: 'published' as const };
    const updated = stop({ address: '200 Other St, Los Angeles, CA', updatedAt: '2026-10-09T12:00:00-07:00' });
    const result = correctStop([published], updated, schedule([updated]), now, staff);
    expect(result.withdrawn[0].state).toBe('withdrawn');
    expect(result.drafts[0]).toMatchObject({ state: 'needs-review', supersedes: published.id });
    expect(result.drafts[0].caption).toContain('200 Other St');
    expect(result.audit.map(e => e.action)).toEqual(['withdrawn', 'correction-drafted']);
    const canceled = correctStop([published], stop({ status: 'canceled' }), schedule([]), now, staff);
    expect(canceled.drafts).toEqual([]);
  });
});

describe('content packages', () => {
  const base: ContentPackage = {
    id: 'FG-01', pillar: 'food-grill', week: 1, cta: 'See the menu', destination: '/#menu',
    variants: [
      { channel: 'instagram-feed', caption: 'Mushrooms on the flat-top.', aspectRatio: '4:5', altText: 'Mushroom cheesesteak on a plain roll' },
      { channel: 'facebook-page', caption: 'A top seller: the mushroom cheesesteak.', aspectRatio: '4:5', altText: 'Mushroom cheesesteak on a plain roll' }
    ],
    rights: [{ assetId: 'photo-1', source: 'Josette upload', owner: 'College Boy', status: 'client-owned', identifiablePeople: false, subjectConsent: false }],
    approval: { state: 'owner-approved', by: 'owner-test', at: '2026-10-01T10:00:00-07:00' }
  };

  it('accepts a complete, approved package', () => {
    expect(packageProblems(base)).toEqual([]);
    expect(schedulable(base)).toBe(true);
  });

  it('rejects reference-only assets, missing alt text, duplicate captions and unapproved links', () => {
    const bad: ContentPackage = { ...base, destination: 'https://example.com',
      variants: base.variants.map(v => ({ ...v, caption: 'Same text', altText: '' })),
      rights: [{ ...base.rights[0], status: 'reference-only' }] };
    const problems = packageProblems(bad).join(' ');
    expect(problems).toMatch(/alt text/);
    expect(problems).toMatch(/identical caption/);
    expect(problems).toMatch(/approved link/);
    expect(problems).toMatch(/permission not confirmed/);
    expect(schedulable(bad)).toBe(false);
  });

  it('blocks legacy posts without written family approval', () => {
    const legacy: ContentPackage = { ...base, pillar: 'kevin-legacy', destination: '/#story' };
    expect(packageProblems(legacy)).toContain('Legacy content requires the family’s written approval.');
    expect(schedulable({ ...legacy, familyApproval: { by: 'Family', at: '2026-10-01', reference: 'signed letter' } })).toBe(true);
  });
});
