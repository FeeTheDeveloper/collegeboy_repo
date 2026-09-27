/**
 * Tenant isolation and role-based access for the Fee The Developer client
 * dashboard. Access is always per tenant: there is no global "see every
 * client" role, Fee The Developer staff included. The database enforces the
 * same rules with row-level security (supabase/ftd-portal/migrations).
 */
export type DashboardRole = 'client-owner' | 'client-staff' | 'ftd-admin' | 'ftd-staff';

export type Membership = { userId: string; tenantId: string; role: DashboardRole };

export type Permission =
  | 'view:workspace' | 'view:accounts' | 'view:billing'
  | 'approve:schedule' | 'approve:content' | 'approve:decision'
  | 'prepare:drafts' | 'create:ticket' | 'manage:tickets' | 'invite:members';

const grants: Record<DashboardRole, readonly Permission[]> = {
  'client-owner': ['view:workspace', 'view:accounts', 'view:billing', 'approve:schedule', 'approve:content', 'approve:decision', 'create:ticket', 'invite:members'],
  'client-staff': ['view:workspace', 'create:ticket'],
  'ftd-admin': ['view:workspace', 'view:accounts', 'view:billing', 'prepare:drafts', 'create:ticket', 'manage:tickets', 'invite:members'],
  'ftd-staff': ['view:workspace', 'view:accounts', 'prepare:drafts', 'create:ticket', 'manage:tickets'],
};

export function tenantsFor(userId: string, memberships: readonly Membership[]) {
  return [...new Set(memberships.filter(m => m.userId === userId).map(m => m.tenantId))];
}

export function roleIn(userId: string, tenantId: string, memberships: readonly Membership[]): DashboardRole | null {
  return memberships.find(m => m.userId === userId && m.tenantId === tenantId)?.role ?? null;
}

export function can(userId: string, tenantId: string, permission: Permission, memberships: readonly Membership[]) {
  const role = roleIn(userId, tenantId, memberships);
  return role ? grants[role].includes(permission) : false;
}

/** Filters any tenant-scoped rows down to the tenants this user belongs to. */
export function scopeRows<T extends { tenantId: string }>(userId: string, rows: readonly T[], memberships: readonly Membership[]) {
  const allowed = new Set(tenantsFor(userId, memberships));
  return rows.filter(row => allowed.has(row.tenantId));
}

/**
 * Account inventory is metadata only. Anything outside this allowlist
 * (passwords, API keys, tokens, recovery codes) is dropped before it can reach
 * the UI, even if a row somehow carries it.
 */
export const accountFields = ['tenantId', 'service', 'owner', 'role', 'status', 'renewsOn', 'lastVerifiedOn', 'notes'] as const;
export type AccountRecord = { [K in (typeof accountFields)[number]]: K extends 'tenantId' | 'service' | 'owner' | 'role' | 'status' ? string : string | null };

export function toAccountRecord(row: Record<string, unknown>): AccountRecord {
  const record = Object.fromEntries(accountFields.map(key => [key, typeof row[key] === 'string' ? row[key] : null]));
  return record as AccountRecord;
}
