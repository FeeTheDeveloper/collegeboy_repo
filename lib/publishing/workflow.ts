import { formatAsOf, formatStopDate, formatStopHours, isPublishable, mapsUrl, type Schedule, type Stop } from '@/lib/schedule';
import { channels, publishMode, type ChannelId } from './channels';

/**
 * Location publishing: the owner edits content/schedule.json once; this module
 * turns an approved stop into a website update plus draft captions, and gates
 * every publish on a named approval. It performs no network calls itself.
 */

export type Role = 'client-owner' | 'client-staff' | 'ftd-staff';
export type Actor = { id: string; role: Role };
export type DraftState = 'needs-review' | 'approved' | 'published' | 'withdrawn';

export type LocationDraft = {
  id: string;
  stopId: string;
  channel: ChannelId;
  caption: string;
  destination: string;
  asOf: string;
  state: DraftState;
  approvedBy: string | null;
  approvedAt: string | null;
  /** Set on a correction: the draft this one replaces. */
  supersedes: string | null;
};

export type AuditEvent = {
  at: string;
  actor: string;
  action: 'draft-created' | 'approved' | 'published' | 'withdrawn' | 'correction-drafted' | 'publish-blocked';
  draftId: string;
  stopId: string;
  channel: ChannelId;
  detail?: string;
};

const destinations: Record<ChannelId, (stop: Stop) => string> = {
  website: () => '/#find',
  'instagram-feed': () => 'link in bio → /#find',
  'instagram-story': stop => mapsUrl(stop.address),
  'facebook-page': stop => mapsUrl(stop.address),
  'google-business-profile': () => '/#find',
};

/** Each channel gets its own wording so the same caption is never pasted everywhere. */
function caption(channel: ChannelId, stop: Stop, schedule: Schedule, asOf: string) {
  const date = formatStopDate(stop, schedule.timeZone);
  const hours = formatStopHours(stop, schedule.timeZone);
  const stamp = `As of ${formatAsOf(asOf, schedule.timeZone)}.`;
  switch (channel) {
    case 'website': return `${date} · ${hours} · ${stop.venue}, ${stop.address}. ${stamp}`;
    case 'instagram-feed': return `The red truck rolls to ${stop.venue} ${date}.\n📍 ${stop.address}\n🕔 ${hours}\nReal Philly cheesesteaks — come hungry.\n${stamp}`;
    case 'instagram-story': return `TODAY: ${stop.venue}\n${stop.address}\n${hours}\n${stamp}`;
    case 'facebook-page': return `College Boy Cheesesteaks will be at ${stop.venue} on ${date}, ${hours}. Address: ${stop.address}. ${stamp}`;
    case 'google-business-profile': return `Find College Boy at ${stop.venue} on ${date} from ${hours}. ${stop.address}. ${stamp}`;
  }
}

export function draftLocationPosts(stop: Stop, schedule: Schedule, targets: ChannelId[], now: number, actor: Actor, supersedes: Record<string, string> = {}) {
  if (!isPublishable(stop, now)) {
    return { drafts: [] as LocationDraft[], audit: [] as AuditEvent[], error: 'Only confirmed, owner-approved, upcoming stops can be drafted.' };
  }
  const asOf = schedule.lastUpdatedAt ?? new Date(now).toISOString();
  const at = new Date(now).toISOString();
  const drafts = targets.map(channel => {
    const text = caption(channel, stop, schedule, asOf);
    if (text.length > channels[channel].captionLimit) throw new Error(`${channel} caption exceeds ${channels[channel].captionLimit} characters.`);
    return { id: `${stop.id}:${channel}:${stop.updatedAt}`, stopId: stop.id, channel, caption: text, destination: destinations[channel](stop), asOf,
      state: 'needs-review' as const, approvedBy: null, approvedAt: null, supersedes: supersedes[channel] ?? null };
  });
  const audit = drafts.map(draft => ({ at, actor: actor.id, action: draft.supersedes ? 'correction-drafted' as const : 'draft-created' as const, draftId: draft.id, stopId: stop.id, channel: draft.channel }));
  return { drafts, audit, error: null };
}

/** Only the client owner approves location posts; Fee The Developer staff prepare, they do not approve. */
export function approve(draft: LocationDraft, actor: Actor, now: number): { draft: LocationDraft; event: AuditEvent } {
  if (actor.role !== 'client-owner') throw new Error('Only the College Boy owner can approve a location post.');
  if (draft.state !== 'needs-review') throw new Error(`Cannot approve a ${draft.state} draft.`);
  const at = new Date(now).toISOString();
  return { draft: { ...draft, state: 'approved', approvedBy: actor.id, approvedAt: at },
    event: { at, actor: actor.id, action: 'approved', draftId: draft.id, stopId: draft.stopId, channel: draft.channel } };
}

/**
 * Checked immediately before anything is posted, manual or direct. The stop is
 * re-read from the current schedule so an edit or cancellation after approval
 * blocks the post rather than publishing stale details.
 */
export function publishCheck(draft: LocationDraft, schedule: Schedule, now: number): { ok: true; mode: 'manual' | 'direct' } | { ok: false; reason: string } {
  if (draft.state !== 'approved' || !draft.approvedBy) return { ok: false, reason: 'Draft is not approved.' };
  const stop = schedule.stops.find(item => item.id === draft.stopId);
  if (!stop) return { ok: false, reason: 'Stop no longer exists in the schedule.' };
  if (`${stop.id}:${draft.channel}:${stop.updatedAt}` !== draft.id) return { ok: false, reason: 'Stop changed after approval; draft a correction.' };
  if (!isPublishable(stop, now)) return { ok: false, reason: 'Stop is no longer confirmed or has ended.' };
  return { ok: true, mode: publishMode(channels[draft.channel]) };
}

/**
 * When a published stop changes or is canceled: withdraw the old posts (the
 * operator deletes or edits them on each platform) and draft corrections,
 * which go back through owner approval.
 */
export function correctStop(published: LocationDraft[], updated: Stop, schedule: Schedule, now: number, actor: Actor) {
  const at = new Date(now).toISOString();
  const affected = published.filter(draft => draft.stopId === updated.id && draft.state === 'published');
  const withdrawn = affected.map(draft => ({ ...draft, state: 'withdrawn' as const }));
  const audit: AuditEvent[] = affected.map(draft => ({ at, actor: actor.id, action: 'withdrawn', draftId: draft.id, stopId: draft.stopId, channel: draft.channel,
    detail: updated.status === 'canceled' ? 'Stop canceled' : 'Stop details changed' }));
  if (!isPublishable(updated, now)) return { withdrawn, drafts: [] as LocationDraft[], audit };
  const supersedes = Object.fromEntries(affected.map(draft => [draft.channel, draft.id]));
  const next = draftLocationPosts(updated, schedule, affected.map(draft => draft.channel), now, actor, supersedes);
  return { withdrawn, drafts: next.drafts, audit: [...audit, ...next.audit] };
}
