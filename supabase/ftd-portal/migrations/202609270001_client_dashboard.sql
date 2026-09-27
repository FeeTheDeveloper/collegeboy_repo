-- Fee The Developer client dashboard. Apply ONLY to the Fee The Developer
-- portal Supabase project, never to a client's project (College Boy's
-- mailing-list project lives in supabase/migrations and stays separate).
--
-- Auth: Supabase third-party auth with Clerk. auth.jwt()->>'sub' is the Clerk
-- user id. Every table is tenant-scoped and readable only by members of that
-- tenant. There is no cross-tenant role. No table stores passwords, API keys
-- or tokens; secrets belong in the deployment secret store.

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,40}$'),
  display_name text not null,
  created_at timestamptz not null default now()
);

create table public.tenant_memberships (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id text not null,
  role text not null check (role in ('client-owner', 'client-staff', 'ftd-admin', 'ftd-staff')),
  invited_by text,
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email text not null,
  role text not null check (role in ('client-owner', 'client-staff', 'ftd-admin', 'ftd-staff')),
  invited_by text not null,
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.current_user_id() returns text
language sql stable as $$ select nullif(auth.jwt()->>'sub', '') $$;

create or replace function public.member_role(target uuid) returns text
language sql stable security definer set search_path = public as $$
  select role from public.tenant_memberships where tenant_id = target and user_id = public.current_user_id()
$$;

create or replace function public.has_role(target uuid, roles text[]) returns boolean
language sql stable as $$ select coalesce(public.member_role(target) = any(roles), false) $$;

-- Tenant-scoped content. Shared columns: tenant_id + timestamps.
create table public.site_links (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, label text not null, url text not null check (url ~ '^https://'), status text not null check (status in ('verified', 'pending-verification', 'retired')), verified_by text, verified_at timestamptz, updated_at timestamptz not null default now());
create table public.account_inventory (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, service text not null, owner text not null, role text not null, status text not null check (status in ('verified', 'needs-verification', 'renewal-due', 'retired')), renews_on date, last_verified_on date, notes text check (notes is null or char_length(notes) <= 500), updated_at timestamptz not null default now());
comment on table public.account_inventory is 'Metadata only: service, owner, role, renewal/verification. Never passwords, API keys, tokens or recovery codes.';
create table public.schedule_queue (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, stop_id text not null, channel text not null, caption text not null, state text not null check (state in ('needs-review', 'approved', 'published', 'withdrawn')), approved_by text, approved_at timestamptz, supersedes uuid references public.schedule_queue(id), created_at timestamptz not null default now());
create table public.content_approvals (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, package_id text not null, pillar text not null, state text not null check (state in ('draft', 'owner-approved', 'rejected')), approved_by text, approved_at timestamptz, family_approval_ref text, created_at timestamptz not null default now());
create table public.asset_rights (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, asset_id text not null, source text not null, owner text not null, status text not null check (status in ('client-owned', 'licensed', 'reference-only', 'unknown')), identifiable_people boolean not null default false, subject_consent boolean not null default false, placement text, approved_by text, approved_at timestamptz);
create table public.support_tickets (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, category text not null check (category in ('site-change', 'location-change', 'access-issue', 'campaign-approval', 'billing')), status text not null default 'new' check (status in ('new', 'acknowledged', 'in-progress', 'waiting-on-client', 'resolved', 'closed')), summary text not null, opened_by text not null, assigned_to text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.change_log (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, summary text not null, reference text, approved_by text, created_at timestamptz not null default now());
create table public.kpi_baselines (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, metric text not null, baseline numeric, measured_on date, source text not null);
create table public.owner_decisions (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, question text not null, state text not null default 'open' check (state in ('open', 'decided', 'withdrawn')), decided_by text, decided_at timestamptz, decision text);
create table public.audit_events (id bigint generated always as identity primary key, tenant_id uuid not null references public.tenants(id) on delete cascade, actor text not null, action text not null, subject text not null, detail jsonb, at timestamptz not null default now());

-- Row-level security everywhere; no anon access at all.
do $$
declare t text;
begin
  foreach t in array array['tenants','tenant_memberships','invitations','site_links','account_inventory','schedule_queue','content_approvals','asset_rights','support_tickets','change_log','kpi_baselines','owner_decisions','audit_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
  end loop;
end $$;

create policy tenants_read on public.tenants for select to authenticated using (public.member_role(id) is not null);
create policy memberships_read on public.tenant_memberships for select to authenticated using (public.member_role(tenant_id) is not null);
create policy invitations_admin on public.invitations for all to authenticated
  using (public.has_role(tenant_id, array['client-owner', 'ftd-admin']))
  with check (public.has_role(tenant_id, array['client-owner', 'ftd-admin']) and invited_by = public.current_user_id());

-- Members read their own tenant's rows.
do $$
declare t text;
begin
  foreach t in array array['site_links','schedule_queue','content_approvals','asset_rights','support_tickets','change_log','kpi_baselines','owner_decisions','audit_events'] loop
    execute format('create policy %I on public.%I for select to authenticated using (public.member_role(tenant_id) is not null)', t || '_read', t);
  end loop;
end $$;
-- Account inventory: owners and Fee The Developer staff only, not client staff.
create policy account_inventory_read on public.account_inventory for select to authenticated using (public.has_role(tenant_id, array['client-owner', 'ftd-admin', 'ftd-staff']));
create policy account_inventory_write on public.account_inventory for all to authenticated using (public.has_role(tenant_id, array['ftd-admin', 'ftd-staff'])) with check (public.has_role(tenant_id, array['ftd-admin', 'ftd-staff']));

-- Fee The Developer prepares; the client owner approves.
create policy schedule_queue_prepare on public.schedule_queue for insert to authenticated with check (public.has_role(tenant_id, array['ftd-admin', 'ftd-staff']) and state = 'needs-review' and approved_by is null);
create policy schedule_queue_approve on public.schedule_queue for update to authenticated using (public.has_role(tenant_id, array['client-owner'])) with check (public.has_role(tenant_id, array['client-owner']) and (state <> 'approved' or approved_by = public.current_user_id()));
create policy content_prepare on public.content_approvals for insert to authenticated with check (public.has_role(tenant_id, array['ftd-admin', 'ftd-staff']) and state = 'draft');
create policy content_approve on public.content_approvals for update to authenticated using (public.has_role(tenant_id, array['client-owner'])) with check (public.has_role(tenant_id, array['client-owner']) and (state <> 'owner-approved' or approved_by = public.current_user_id()));
create policy decisions_decide on public.owner_decisions for update to authenticated using (public.has_role(tenant_id, array['client-owner'])) with check (public.has_role(tenant_id, array['client-owner']));
create policy tickets_open on public.support_tickets for insert to authenticated with check (public.member_role(tenant_id) is not null and opened_by = public.current_user_id() and status = 'new');
create policy tickets_manage on public.support_tickets for update to authenticated using (public.has_role(tenant_id, array['ftd-admin', 'ftd-staff'])) with check (public.has_role(tenant_id, array['ftd-admin', 'ftd-staff']));
create policy audit_append on public.audit_events for insert to authenticated with check (public.member_role(tenant_id) is not null and actor = public.current_user_id());
-- audit_events: no update or delete policy, so rows are append-only for every signed-in role.

-- The College Boy tenant. No memberships are seeded; people join by invitation.
insert into public.tenants (slug, display_name) values ('college-boy', 'College Boy Cheesesteaks') on conflict (slug) do nothing;
