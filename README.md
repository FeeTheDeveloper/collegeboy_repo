# College Boy Cheesesteaks website

Static review build for College Boy Cheesesteaks. It preserves the handoff's red/black, food-truck editorial direction while withholding photography, family history, unverified prices, and unverified schedule data until the client approves them.

## Run locally

Requires Node.js 18 or newer.

```sh
npm run build
npx --yes serve build
```

The build validates every local stylesheet/script reference and the schedule schema, then copies `dist/` to the ignored `build/` directory. The source remains `dist/`.

## Schedule ownership

The single schedule source is `dist/data/schedule.json`. The designated College Boy schedule owner must:

1. Use ISO 8601 timestamps with offsets for `startsAt` and `endsAt`.
2. Include `stopName`, `streetAddress`, `status`, and the IANA `timeZone` on every stop.
3. Set `status` to `confirmed` only after the stop is verified.
4. Set canceled stops to `canceled`; do not delete them until the date has passed.
5. Update `lastUpdatedAt` and `updatedBy` with every change.
6. Run `npm run build` before submitting the update.

The page selects the earliest non-expired confirmed stop. If none exists or schedule loading fails, it displays a no-confirmed-stop state and directs customers to official Instagram.

Example entry:

```json
{
  "stopName": "Example only - do not publish",
  "streetAddress": "123 Example Street, Los Angeles, CA",
  "startsAt": "2026-10-01T17:00:00-07:00",
  "endsAt": "2026-10-01T21:00:00-07:00",
  "status": "canceled",
  "timeZone": "America/Los_Angeles"
}
```

## Review controls

- `noindex,nofollow` stays enabled until an owner-approved production cutover.
- The ZIP, `.openai/hosting.json`, private preview identity, and all unapproved images are excluded.
- Current item availability and prices remain with the ordering providers.
- Catering is a visible email action; the inbox must be confirmed as monitored before launch.
- Kevin's story, `#CBKForever`, family names, and family photographs are not included.
- No production host, DNS, Wix site, analytics, or third-party listing has been changed.

## Before production

- Approve copy, imagery, menu, prices, contact details, catering inbox, service area, and schedule owner.
- Validate pickup and delivery availability with the client.
- Record asset rights in `ASSET_MANIFEST.md` before committing photography.
- Plan redirects for legacy Wix routes, including `/projects-2` and `/contact-8`.
- Record DNS ownership, rollback owner, analytics baseline, and launch approval.
- Remove `noindex,nofollow` only as part of the separately approved cutover.

## Import provenance

Imported from `College_Boy_Site_GitHub_Handoff_2026-09-24.zip`, supplied for review on September 24, 2026. The archive itself is intentionally not committed. `GITHUB_HANDOFF.md` and `DESIGN.md` preserve the original handoff context; repository changes and safeguards are documented here.
