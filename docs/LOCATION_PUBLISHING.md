# Location publishing workflow

Status: **review queue and manual publishing only.** No channel is connected for direct posting.

## One edit, every surface

The owner (or a Fee The Developer operator acting on the owner's written instruction) edits `content/schedule.json` once. Everything else is derived:

| Surface | How it updates | Who publishes |
| --- | --- | --- |
| Website “Find the truck” | Schedule edits go live when the commit is deployed. Stop expiry is re-evaluated on the server every 5 minutes and in the browser every minute, so an ended stop disappears without a deploy | Automatic, but only for stops that pass `isPublishable` |
| Instagram feed / story | Draft caption in the review queue | Owner approves → a person posts |
| Facebook **Page** | Draft caption in the review queue | Owner approves → a person posts |
| Google Business Profile | Draft update in the review queue | Owner approves → a person posts |

## Schedule entry

```json
{
  "id": "2026-10-09-example",
  "date": "2026-10-09",
  "venue": "Venue name as it should appear",
  "address": "Exact street address, City, CA 90000",
  "startsAt": "2026-10-09T17:00:00-07:00",
  "endsAt": "2026-10-09T21:00:00-07:00",
  "status": "confirmed",
  "approvedBy": "Josette",
  "updatedAt": "2026-10-07T10:15:00-07:00",
  "note": "Optional short note"
}
```

Also update the file-level `lastUpdatedAt` and `updatedBy` on every change.

## Rules the code enforces (`lib/schedule.ts`, `lib/publishing/workflow.ts`)

- A stop appears anywhere only if `status` is `confirmed`, `approvedBy` is set, and it has not ended.
- Stops more than 14 days out are not advertised.
- If `lastUpdatedAt` is missing or older than 14 days, **no stop is shown**; the site says “Location not confirmed” and points to Instagram. It never shows the last known stop.
- Malformed entries (bad timestamps, missing address, end before start) are dropped, not guessed.
- Every draft caption carries the exact typed address, date, hours, and an “As of …” timestamp. Each channel gets different wording.
- Only a `client-owner` can approve a location draft. Fee The Developer staff prepare drafts; they do not approve them.
- `publishCheck` runs immediately before posting. If the stop changed after approval (`updatedAt` differs), was canceled, or has ended, publishing is blocked.

## Corrections and rollback

1. Edit the stop in `content/schedule.json` (or set `status` to `canceled`; do not delete it until the date passes). Bump `updatedAt` and `lastUpdatedAt`.
2. `correctStop` marks every published post for that stop `withdrawn` and, if the stop is still valid, drafts corrections that go back through owner approval.
3. The operator edits or removes the withdrawn posts on each platform and records it.
4. The website corrects itself on the next revalidation; to roll back the website immediately, revert the schedule commit and redeploy.

Every draft, approval, publish, block, withdrawal, and correction produces an `AuditEvent` (actor, time, stop, channel). The dashboard migration stores these in `audit_events`, append-only.

## Direct publishing (not enabled)

Direct upload may be added per channel only when all of these are true, and recorded in `channels[...].directPublish`:

- The platform offers an official API for that action (e.g. Instagram Graph API for a professional account, Facebook Pages API, Google Business Profile API).
- College Boy owns the business account and grants access through the platform's OAuth flow; tokens are stored in the deployment secret store, never in the repo, docs, or chat.
- The owner has authorized that specific channel in writing.

Never: store or scrape a password, automate a personal Facebook profile, post a stop that is not confirmed, or post or solicit fabricated reviews.
