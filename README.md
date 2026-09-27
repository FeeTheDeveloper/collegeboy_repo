# College Boy Cheesesteaks website

Next.js review build for College Boy Cheesesteaks. It turns the original static handoff into a responsive marketing site with conditional Clerk authentication and a consent-based Supabase mailing-list route. Family history, review quotes, prices, and schedule data remain gated until verified.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run build
npm start
```

## Checks

```sh
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # Vitest: schedule, publishing gates, tenant RLS (PGlite), visual requirements
npm run build
npm run test:e2e    # Playwright against `next start` on :3100 (build first)
```

## Where things are

| Area | Code | Docs |
| --- | --- | --- |
| Josette's corrections | `app/page.tsx`, `components/menu-showcase.tsx`, `public/media/illustrations/` | `docs/JOSETTE_CHANGELOG.md` |
| Business details, brand line, story gate | `lib/content/business.ts` | — |
| Ordering links (verified-only) | `lib/order-options.ts` | — |
| Schedule | `content/schedule.json`, `lib/schedule.ts` | `docs/LOCATION_PUBLISHING.md` |
| Campaign system | `lib/publishing/`, `content/campaign/` | `docs/CAMPAIGN_90_DAY.md` |
| Client dashboard | `app/dashboard/`, `lib/dashboard/`, `supabase/ftd-portal/` | `docs/CLIENT_DASHBOARD.md`, `docs/SUPPORT_DESK.md` |
| Asset rights | — | `ASSET_MANIFEST.md` |

Copy `.env.example` to `.env.local` only after dedicated College Boy Clerk and Supabase resources exist. Never reuse another client or Fee The Developer service-role credential.

## Vercel deployment handoff

Current status: **IN CLIENT REVIEW — NOT DEPLOYED FROM THIS BRANCH.** A passing build is not launch approval.

The repository is a standard Next.js deployment. Vercel should use the repository root with:

- Framework preset: `Next.js`
- Install command: `npm ci`
- Build command: `npm run build`
- Node.js: `20.x` or newer; `package.json` requires `>=20.9`
- Output: automatic Next.js output; do not set a static output directory

Before linking or deploying, verify the intended Vercel team and project. This checkout currently has no `.vercel` project link, and the review branch is `claude/college-boy-cheesesteaks-review-0g58yn` (base `feat/collegeboy-site-rebuild`); Vercel will not receive these local changes until the reviewed branch is pushed and selected by the project.

```sh
vercel whoami
vercel link
vercel pull --environment=preview
vercel deploy
```

Use `vercel --prod` only after the preview URL, redirects, images, ordering links, `/subscribe` fallback, and Clerk behavior have been reviewed and an owner approves production publication. Do not pass tokens in command arguments; use the authenticated CLI or `VERCEL_TOKEN` in CI.

### Vercel environment variables

Configure values in the matching Vercel environment rather than committing them. Keep preview and production values separated.

| Variable | Preview | Production | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Approved preview/demo origin | Exact approved public origin | Must be an HTTP(S) origin; `https://cbkforever.com` is the safe fallback |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional | Only after dedicated College Boy Clerk setup | Pair with the matching secret key |
| `CLERK_SECRET_KEY` | Optional | Only after dedicated College Boy Clerk setup | Never expose or commit |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | `/sign-in` | Keep aligned with Clerk routes |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | `/sign-up` | Keep aligned with Clerk routes |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/account` | `/account` | Dedicated app only |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/account` | `/account` | Dedicated app only |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Only after dedicated College Boy project setup | Required with the service-role key for signup writes |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Only after dedicated College Boy project setup | Server-only; never use a Fee The Developer or another client key |

If Clerk variables are absent, public pages remain available and protected account/auth behavior stays intentionally unavailable. If Supabase variables are absent, the mailing-list endpoint returns a safe not-connected response. Configure these services only after the dedicated resources, migrations, origins, and owner approvals are verified.

### Preview acceptance checklist

- [ ] Preview deployment is from the reviewed commit and intended Vercel project.
- [ ] `/`, `/film`, `/opening`, `/subscribe`, `/account`, `/sign-in`, and `/sign-up` respond as expected.
- [ ] `/projects-2` redirects to `/#menu`; `/contact-8` redirects to `/#catering`.
- [ ] Generated menu imagery and all existing media return successfully; no missing placeholder `.webp` references remain.
- [ ] Uber Eats and DoorDash are marked verified in `lib/order-options.ts` only after Josette confirms them live; Instagram and catering links point to the approved destinations. No Square pickup link.
- [ ] No secrets appear in build logs, repository files, or client bundles.
- [ ] Preview remains `noindex`; no production DNS or domain cutover occurs during preview review.
- [ ] Installed on one iPhone and one Android handset: home-screen icon and name are the College Boy mark, not a screenshot.
- [ ] Opening film and brand film play on cellular on both handsets; a blocked or slow start shows the matching message rather than a load failure.
- [ ] Menu sheet opens, navigates, and closes on a phone; no section is reachable only by scrolling.
- [ ] A pasted link shows the share card in a message app.
- [ ] Rollback deployment/commit and owner are recorded before production approval.

## Mobile and installed-app behaviour

The phone experience, the web manifest, the generated icons, the safe-area handling, and the video playback states are documented in `MOBILE_HANDOFF.md`. Regenerate icons and the share card with `node scripts/generate-app-icons.mjs` after any brand change and commit the output.

Authentication chrome uses `useAuth()` from Clerk Core 3. `<SignedIn>`, `<SignedOut>`, and `<Protect>` were removed in `@clerk/nextjs@7` and throw at render; the server replacement is `<Show when="…">`, which awaits `auth()` and would make every page carrying the header dynamic.

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

`content/schedule.json` is the only schedule source. The website, draft captions and the dashboard queue all read it through `lib/schedule.ts`. Field reference, rules, corrections and rollback: `docs/LOCATION_PUBLISHING.md`.

The site shows a stop only when it is `confirmed`, has an `approvedBy`, has not ended, starts within 14 days, and the file's `lastUpdatedAt` is under 14 days old. Otherwise it shows “Location not confirmed” and points to Instagram. It never falls back to an old stop.

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
