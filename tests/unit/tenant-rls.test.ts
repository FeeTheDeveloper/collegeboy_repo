import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Runs the real dashboard migration in an in-process Postgres and checks the
 * row-level security as each role. "tenant-b-test" is a fictional second
 * client that exists only in this test.
 */
const db = new PGlite();
let cb = '';
let other = '';

async function as<T>(userId: string | null, run: () => Promise<T>) {
  await db.exec(`reset role; select set_config('request.jwt.claims', '${JSON.stringify(userId ? { sub: userId } : {})}', false); set role ${userId ? 'authenticated' : 'anon'};`);
  try { return await run(); } finally { await db.exec('reset role;'); }
}
const rows = async (sql: string) => (await db.query<Record<string, unknown>>(sql)).rows;

beforeAll(async () => {
  await db.exec(`create role anon nologin; create role authenticated nologin; create schema auth;
    create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    grant usage on schema public, auth to anon, authenticated; grant execute on all functions in schema auth to anon, authenticated;`);
  await db.exec(readFileSync('supabase/ftd-portal/migrations/202609270001_client_dashboard.sql', 'utf8'));
  // Mirror Supabase's default table grants so only RLS decides access.
  await db.exec(`grant select, insert, update, delete on all tables in schema public to authenticated; grant usage on all sequences in schema public to authenticated;`);
  await db.exec(`insert into tenants (slug, display_name) values ('tenant-b-test', 'Fictional test tenant');`);
  cb = String((await rows(`select id from tenants where slug = 'college-boy'`))[0].id);
  other = String((await rows(`select id from tenants where slug = 'tenant-b-test'`))[0].id);
  await db.exec(`insert into tenant_memberships (tenant_id, user_id, role) values
    ('${cb}', 'user_owner', 'client-owner'), ('${cb}', 'user_cstaff', 'client-staff'), ('${cb}', 'user_ftd', 'ftd-staff'),
    ('${other}', 'user_other_owner', 'client-owner');
    insert into support_tickets (tenant_id, category, summary, opened_by) values ('${cb}', 'site-change', 'CB ticket', 'user_owner'), ('${other}', 'billing', 'Other ticket', 'user_other_owner');
    insert into account_inventory (tenant_id, service, owner, role, status) values ('${cb}', 'Instagram', 'College Boy', 'Admin', 'needs-verification'), ('${other}', 'Domain', 'Other', 'Owner', 'verified');`);
});

describe('dashboard tenant isolation (row-level security)', () => {
  it('the College Boy owner sees only the College Boy workspace', async () => {
    const [tenants, tickets] = await as('user_owner', async () => [await rows('select slug from tenants'), await rows('select summary from support_tickets')]);
    expect(tenants.map(t => t.slug)).toEqual(['college-boy']);
    expect(tickets.map(t => t.summary)).toEqual(['CB ticket']);
  });

  it('Fee The Developer staff see only clients they are assigned to', async () => {
    const tenants = await as('user_ftd', () => rows('select slug from tenants'));
    expect(tenants.map(t => t.slug)).toEqual(['college-boy']);
    await expect(as('user_ftd', () => db.exec(`insert into schedule_queue (tenant_id, stop_id, channel, caption, state) values ('${other}', 's', 'website', 'x', 'needs-review')`))).rejects.toThrow();
  });

  it('client staff cannot read the account inventory; owners and assigned FTD staff can', async () => {
    expect(await as('user_cstaff', () => rows('select service from account_inventory'))).toEqual([]);
    expect((await as('user_owner', () => rows('select service from account_inventory'))).map(r => r.service)).toEqual(['Instagram']);
    expect((await as('user_ftd', () => rows('select service from account_inventory'))).map(r => r.service)).toEqual(['Instagram']);
  });

  it('signed-out and unassigned users see nothing', async () => {
    await expect(as(null, () => rows('select * from tenants'))).rejects.toThrow();
    expect(await as('user_stranger', () => rows('select * from support_tickets'))).toEqual([]);
  });

  it('FTD staff prepare location drafts; only the client owner approves them', async () => {
    await as('user_ftd', () => db.exec(`insert into schedule_queue (tenant_id, stop_id, channel, caption, state) values ('${cb}', 'stop-1', 'website', 'caption', 'needs-review')`));
    await expect(as('user_owner', () => db.exec(`insert into schedule_queue (tenant_id, stop_id, channel, caption, state) values ('${cb}', 'stop-2', 'website', 'c', 'needs-review')`))).rejects.toThrow();
    await as('user_ftd', () => db.exec(`update schedule_queue set state = 'approved', approved_by = 'user_ftd' where stop_id = 'stop-1'`));
    expect((await rows(`select state from schedule_queue where stop_id = 'stop-1'`))[0].state).toBe('needs-review');
    await as('user_owner', () => db.exec(`update schedule_queue set state = 'approved', approved_by = 'user_owner', approved_at = now() where stop_id = 'stop-1'`));
    expect((await rows(`select state, approved_by from schedule_queue where stop_id = 'stop-1'`))[0]).toEqual({ state: 'approved', approved_by: 'user_owner' });
  });

  it('the audit log is append-only', async () => {
    await as('user_ftd', () => db.exec(`insert into audit_events (tenant_id, actor, action, subject) values ('${cb}', 'user_ftd', 'draft-created', 'stop-1')`));
    await as('user_owner', () => db.exec(`delete from audit_events; update audit_events set action = 'x'`));
    expect(await rows('select action from audit_events')).toEqual([{ action: 'draft-created' }]);
  });
});
