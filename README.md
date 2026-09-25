# College Boy Cheesesteaks website

Next.js review build for College Boy Cheesesteaks. It turns the original static handoff into a responsive marketing site with conditional Clerk authentication and a consent-based Supabase mailing-list route. Family history, review quotes, prices, and schedule data remain gated until verified.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm run build
npm start
```

Copy `.env.example` to `.env.local` only after dedicated College Boy Clerk and Supabase resources exist. Never reuse another client or Fee The Developer service-role credential.

## Demo domain and routes

`https://cbkforever.com` is the intended demo origin and the fallback canonical URL. Set `NEXT_PUBLIC_SITE_URL` to the exact approved origin in each environment. Empty, malformed, or non-HTTP(S) values fall back safely to the demo origin.

You retain control of the external setup:

1. Create the `cbkforever.com` domain and choose the hosting project.
2. Point DNS only after the review deployment is healthy and its rollback target is recorded.
3. Add `https://cbkforever.com/sign-in` and `https://cbkforever.com/sign-up` to the dedicated College Boy Clerk application.
4. Add `cbkforever.com` and `www.cbkforever.com` as authorized Clerk origins only if both hostnames are routed intentionally.
5. Configure the dedicated College Boy Supabase project and apply the tracked migration.
6. Keep preview and demo pages `noindex`; production search indexing remains a separate approval.

Legacy route redirects are implemented as `/projects-2` → `/#menu` and `/contact-8` → `/#catering`. Authentication routes are `/sign-in`, `/sign-up`, and `/account`; the mailing-list route is `/subscribe` with its server endpoint at `/api/subscribe`.

## Schedule ownership

The earlier static schedule source is preserved under `legacy-static/data/schedule.json`. A production schedule backend has not been selected. The designated College Boy schedule owner must:

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
- The ZIP, `.openai/hosting.json`, private preview identity, family images, and unreviewed video originals are excluded.
- Current item availability and prices remain with the ordering providers.
- Catering is a visible email action; the inbox must be confirmed as monitored before launch.
- Kevin's story, `#CBKForever`, family names, and family photographs are not included without documented family approval.
- Google and Yelp cards are labeled placeholders; no rating or quote is fabricated.
- The mailing-list form stays disabled until a dedicated College Boy Supabase project is configured.
- Clerk routes return 404 until a dedicated Clerk application is configured.
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
