# Fee The Developer client dashboard

Status: **built behind access controls, not connected.** `/dashboard` returns 404 until Clerk is configured, and shows no client data until the portal database is connected.

## What a member sees (`/dashboard/college-boy`)

Pending owner decisions · site status and links · schedule approval queue · content approval queue · account inventory (service, owner, role, renewal/verification — never passwords or keys) · asset rights · support tickets · change log · KPI baselines.

## Access model

| Role | Sees | Can |
| --- | --- | --- |
| `client-owner` (Josette) | Her workspace only | Approve stops, content and decisions; open tickets; invite her staff |
| `client-staff` | Her workspace, no account inventory | Open tickets |
| `ftd-staff` | Only clients they are assigned to | Prepare drafts, manage tickets, maintain account inventory metadata |
| `ftd-admin` | Only clients they are assigned to | Staff rights plus invitations and billing view |

There is no cross-client role. A tenant you are not a member of returns the same 404 as a tenant that does not exist.

Enforcement is layered:

1. `proxy.ts` requires a Clerk session for `/dashboard(.*)`.
2. The page reads the database **as the user** (Clerk token → Supabase third-party auth, anon key). No service-role key is used.
3. Row-level security in `supabase/ftd-portal/migrations/202609270001_client_dashboard.sql` scopes every table by tenant membership, restricts account inventory to owners and assigned FTD staff, lets FTD staff insert drafts only in `needs-review`, lets only the client owner approve, and makes `audit_events` append-only.
4. `lib/dashboard/authz.ts` repeats the permission check in the UI and strips any non-allowlisted field from account rows.

`tests/unit/tenant-rls.test.ts` runs the real migration in an in-process Postgres (PGlite) and checks each role, including a fictional second tenant.

## Invitations and secrets

People join only by invitation (`invitations` table: tenant, email, role, inviter, 7-day expiry). No memberships are seeded. Credentials for client services are held in the relevant platform's own access controls or a secrets manager; the inventory records only that the account exists, who owns it, and when it was last verified.

## Setup (requires King Fee's approval — not done)

1. Create a Fee The Developer portal Supabase project (not College Boy's mailing-list project).
2. Enable Clerk as a third-party auth provider in that project; apply the migration.
3. Set `FTD_PORTAL_SUPABASE_URL` and `FTD_PORTAL_SUPABASE_ANON_KEY` in the deployment's secret store.
4. Invite Josette as `client-owner` of `college-boy`, and assign FTD staff individually.

## Recommendation

This dashboard is Fee The Developer's product, not College Boy's. It is scaffolded here so it can ship incrementally, but it should move to a Fee The Developer-owned repository and deployment before any second client is added, so College Boy's public repository and hosting never carry cross-client configuration. No Happy Ice workspace or records exist.
