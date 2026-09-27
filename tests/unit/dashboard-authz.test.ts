import { describe, expect, it } from 'vitest';
import { can, scopeRows, tenantsFor, toAccountRecord, type Membership } from '@/lib/dashboard/authz';
import { canMove, ticketCategories } from '@/lib/dashboard/support';

const memberships: Membership[] = [
  { userId: 'josette', tenantId: 'college-boy', role: 'client-owner' },
  { userId: 'ftd-1', tenantId: 'college-boy', role: 'ftd-staff' },
  { userId: 'ftd-2', tenantId: 'tenant-b-test', role: 'ftd-staff' },
];

describe('dashboard authorization', () => {
  it('scopes users to their own tenants', () => {
    expect(tenantsFor('josette', memberships)).toEqual(['college-boy']);
    expect(tenantsFor('ftd-2', memberships)).toEqual(['tenant-b-test']);
    expect(scopeRows('ftd-1', [{ tenantId: 'college-boy' }, { tenantId: 'tenant-b-test' }], memberships)).toEqual([{ tenantId: 'college-boy' }]);
  });

  it('only the client owner approves; staff prepare', () => {
    expect(can('josette', 'college-boy', 'approve:schedule', memberships)).toBe(true);
    expect(can('ftd-1', 'college-boy', 'approve:schedule', memberships)).toBe(false);
    expect(can('ftd-1', 'college-boy', 'prepare:drafts', memberships)).toBe(true);
    expect(can('ftd-2', 'college-boy', 'view:workspace', memberships)).toBe(false);
  });

  it('strips any secret-looking field from account inventory rows', () => {
    const record = toAccountRecord({ tenantId: 'college-boy', service: 'Instagram', owner: 'College Boy', role: 'Admin', status: 'verified', password: 'x', apiKey: 'y', token: 'z' });
    expect(Object.keys(record)).not.toContain('password');
    expect(JSON.stringify(record)).not.toMatch(/"x"|"y"|"z"/);
  });

  it('support tickets follow the intake taxonomy and never skip acknowledgment', () => {
    expect(Object.keys(ticketCategories).sort()).toEqual(['access-issue', 'billing', 'campaign-approval', 'location-change', 'site-change']);
    expect(canMove('new', 'resolved')).toBe(false);
    expect(canMove('new', 'acknowledged')).toBe(true);
  });
});
