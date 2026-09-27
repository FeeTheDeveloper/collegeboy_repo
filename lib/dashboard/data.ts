import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { toAccountRecord, type AccountRecord, type DashboardRole } from './authz';

/**
 * Reads the Fee The Developer portal database as the signed-in user. The
 * Clerk session token is passed through, so row-level security decides what
 * comes back; this code never uses a service-role key.
 */
export const portalConfigured = Boolean(process.env.FTD_PORTAL_SUPABASE_URL && process.env.FTD_PORTAL_SUPABASE_ANON_KEY);

function portal(getToken: () => Promise<string | null>) {
  return createClient(process.env.FTD_PORTAL_SUPABASE_URL!, process.env.FTD_PORTAL_SUPABASE_ANON_KEY!, {
    accessToken: getToken, auth: { persistSession: false, autoRefreshToken: false }
  });
}

type Row = Record<string, unknown>;
export type Workspace = {
  tenant: { id: string; slug: string; displayName: string };
  role: DashboardRole;
  siteLinks: Row[]; accounts: AccountRecord[]; scheduleQueue: Row[]; contentApprovals: Row[];
  assetRights: Row[]; tickets: Row[]; changeLog: Row[]; kpis: Row[]; decisions: Row[];
};

export async function listTenants(getToken: () => Promise<string | null>) {
  const { data } = await portal(getToken).from('tenants').select('slug, display_name').order('display_name');
  return (data ?? []).map(row => ({ slug: String(row.slug), displayName: String(row.display_name) }));
}

/** Returns null when the tenant does not exist or the user is not a member; callers show a 404 either way. */
export async function loadWorkspace(slug: string, userId: string, getToken: () => Promise<string | null>): Promise<Workspace | null> {
  const db = portal(getToken);
  const { data: tenant } = await db.from('tenants').select('id, slug, display_name').eq('slug', slug).maybeSingle();
  if (!tenant) return null;
  const { data: membership } = await db.from('tenant_memberships').select('role').eq('tenant_id', tenant.id).eq('user_id', userId).maybeSingle();
  if (!membership) return null;
  const read = async (table: string, columns: string, order: string) =>
    ((await db.from(table).select(columns).eq('tenant_id', tenant.id).order(order, { ascending: false }).limit(50)).data ?? []) as unknown as Row[];
  const [siteLinks, accounts, scheduleQueue, contentApprovals, assetRights, tickets, changeLog, kpis, decisions] = await Promise.all([
    read('site_links', 'label, url, status, verified_at', 'updated_at'),
    read('account_inventory', 'service, owner, role, status, renews_on, last_verified_on, notes', 'updated_at'),
    read('schedule_queue', 'stop_id, channel, state, approved_by, created_at', 'created_at'),
    read('content_approvals', 'package_id, pillar, state, approved_by, created_at', 'created_at'),
    read('asset_rights', 'asset_id, source, owner, status, subject_consent, placement', 'asset_id'),
    read('support_tickets', 'category, status, summary, updated_at', 'updated_at'),
    read('change_log', 'summary, reference, approved_by, created_at', 'created_at'),
    read('kpi_baselines', 'metric, baseline, measured_on, source', 'measured_on'),
    read('owner_decisions', 'question, state, decided_at', 'state'),
  ]);
  return {
    tenant: { id: String(tenant.id), slug: String(tenant.slug), displayName: String(tenant.display_name) },
    role: membership.role as DashboardRole,
    siteLinks, scheduleQueue, contentApprovals, assetRights, tickets, changeLog, kpis, decisions,
    accounts: accounts.map(row => toAccountRecord({ tenantId: String(tenant.id), service: row.service, owner: row.owner, role: row.role,
      status: row.status, renewsOn: row.renews_on, lastVerifiedOn: row.last_verified_on, notes: row.notes })),
  };
}
