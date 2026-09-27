import type { ChannelId } from './channels';

/** The four reusable content pillars from the 90-day plan. */
export type Pillar = 'food-grill' | 'todays-stop' | 'event-catering' | 'kevin-legacy';

export type RightsRecord = {
  assetId: string;
  source: string;
  owner: string;
  /** 'client-owned' and 'licensed' may be posted; 'reference-only' (e.g. a public social image) may not. */
  status: 'client-owned' | 'licensed' | 'reference-only' | 'unknown';
  identifiablePeople: boolean;
  subjectConsent: boolean;
};

export type Variant = { channel: ChannelId; caption: string; aspectRatio: string; altText: string };

export type ContentPackage = {
  id: string;
  pillar: Pillar;
  week: number;
  variants: Variant[];
  cta: string;
  destination: string;
  rights: RightsRecord[];
  approval: { state: 'draft' | 'owner-approved' | 'rejected'; by: string | null; at: string | null };
  /** Legacy (Kevin) content only: the family's written approval. */
  familyApproval?: { by: string; at: string; reference: string } | null;
};

export const approvedDestinations = ['/#find', '/#menu', '/#order', '/#catering', '/#story', '/subscribe'] as const;

/** Returns every reason a package cannot be scheduled. An empty list means it may go to the owner for approval. */
export function packageProblems(pkg: ContentPackage): string[] {
  const problems: string[] = [];
  if (!pkg.variants.length) problems.push('No channel variants.');
  pkg.variants.forEach(variant => { if (!variant.altText.trim()) problems.push(`${variant.channel}: missing alt text.`); });
  const captions = pkg.variants.map(variant => variant.caption.trim().toLowerCase());
  if (new Set(captions).size !== captions.length) problems.push('Two channels share an identical caption; adapt each variant.');
  if (!(approvedDestinations as readonly string[]).includes(pkg.destination)) problems.push(`Destination ${pkg.destination} is not an approved link.`);
  if (!pkg.rights.length) problems.push('No source/rights record.');
  pkg.rights.forEach(right => {
    if (right.status === 'reference-only' || right.status === 'unknown') problems.push(`${right.assetId}: reuse permission not confirmed.`);
    if (right.identifiablePeople && !right.subjectConsent) problems.push(`${right.assetId}: identifiable person without consent.`);
  });
  if (pkg.pillar === 'kevin-legacy' && !pkg.familyApproval) problems.push('Legacy content requires the family’s written approval.');
  if (pkg.pillar === 'todays-stop' && pkg.destination !== '/#find') problems.push('Stop posts must point to the live schedule (/#find); captions come from lib/publishing/workflow.ts.');
  return problems;
}

export function schedulable(pkg: ContentPackage) {
  return pkg.approval.state === 'owner-approved' && Boolean(pkg.approval.by) && packageProblems(pkg).length === 0;
}
