# 90-day content system

Data: `content/campaign/90-day-template.json` (reusable plan) and `content/campaign/sample-two-week.json` (sample). Validation: `lib/publishing/content-packages.ts`.

## Structure

Twelve weeks in three four-week cycles:

| Cycle | Weeks | Theme | Lead pillar |
| --- | --- | --- | --- |
| 1 | 1–4 | Find us, know the food | Today's stop + food/grill (mushroom cheesesteak) |
| 2 | 5–8 | Bring the truck | Event/catering |
| 3 | 9–12 | Why College Boy | Family story (only with written approval) + mailing list |

Weekly cadence: one stop post per confirmed stop (generated from the schedule), two food/grill packages, one event/catering package, and at most one legacy post per cycle if the family has approved it.

## Content packages

A package is built from an approved original and holds, per channel: caption variant, aspect ratio, alt text; plus CTA, approved destination link, owner approval state, and a source/rights record for every asset. `packageProblems()` blocks scheduling when:

- any variant lacks alt text, or two channels share an identical caption;
- the destination is not one of the site's approved paths;
- an asset is `reference-only` (e.g. a public social image) or has unknown rights, or shows an identifiable person without consent;
- a legacy package has no recorded written family approval.

Repurposing means a new crop, format, or angle with rewritten copy — not the same graphic and caption on every channel.

## Sample two weeks

`sample-two-week.json` lays out cycle 1, weeks 1–2, as publishing slots. It contains no invented stops or events: stop posts are marked “waiting on schedule” and every food/event slot names the approved asset it still needs from Josette. Copy it forward per cycle; do not generate dates for events College Boy has not confirmed.

## Approval states

`draft` → `owner-approved` (Josette) → scheduled/posted manually. `rejected` returns to draft. Legacy content additionally requires `familyApproval` with who, when, and a reference to the written approval.
