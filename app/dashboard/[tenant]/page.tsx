import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { clerkConfigured } from '@/lib/config';
import { can } from '@/lib/dashboard/authz';
import { loadWorkspace, portalConfigured } from '@/lib/dashboard/data';
import '../../dashboard.css';

export const metadata: Metadata = { title: 'Client workspace', robots: { index: false, follow: false } };

type Row = Record<string, unknown>;

function Table({ title, rows, columns, empty }: { title: string; rows: Row[]; columns: [string, string][]; empty: string }) {
  const headingId = `dash-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return <section className="dash-panel" aria-labelledby={headingId}>
    <h2 id={headingId}>{title}</h2>
    {rows.length ? <div className="dash-scroll"><table><thead><tr>{columns.map(([, label]) => <th key={label} scope="col">{label}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={index}>{columns.map(([key]) => <td key={key}>{row[key] == null ? '—' : String(row[key])}</td>)}</tr>)}</tbody></table></div>
      : <p className="dash-empty">{empty}</p>}
  </section>;
}

export default async function Workspace({ params }: { params: Promise<{ tenant: string }> }) {
  if (!clerkConfigured) notFound();
  const { userId, getToken } = await auth();
  if (!userId) notFound();
  const { tenant } = await params;
  if (!portalConfigured) return <main className="dash"><h1>Workspace</h1><p className="dash-empty">The dashboard database is not connected yet. No client data is shown.</p></main>;

  const workspace = await loadWorkspace(tenant, userId, () => getToken());
  // A missing tenant and a tenant you are not a member of look the same from outside.
  if (!workspace) notFound();
  const membership = [{ userId, tenantId: workspace.tenant.id, role: workspace.role }];
  const allowed = (permission: Parameters<typeof can>[2]) => can(userId, workspace.tenant.id, permission, membership);

  return <main className="dash">
    <Link className="text-link" href="/dashboard">← Workspaces</Link>
    <span className="eyebrow">CLIENT WORKSPACE · {workspace.role.replace('-', ' ').toUpperCase()}</span>
    <h1>{workspace.tenant.displayName}</h1>
    <p className="dash-note">Credentials are never stored or shown here. Approvals are recorded against your account.</p>
    <div className="dash-grid">
      <Table title="Pending owner decisions" rows={workspace.decisions} columns={[['question', 'Question'], ['state', 'State'], ['decided_at', 'Decided']]} empty="No open decisions." />
      <Table title="Site status and links" rows={workspace.siteLinks} columns={[['label', 'Link'], ['url', 'Destination'], ['status', 'Status'], ['verified_at', 'Verified']]} empty="No links recorded." />
      <Table title="Schedule approval queue" rows={workspace.scheduleQueue} columns={[['stop_id', 'Stop'], ['channel', 'Channel'], ['state', 'State'], ['approved_by', 'Approved by']]} empty="Nothing waiting for approval." />
      <Table title="Content approval queue" rows={workspace.contentApprovals} columns={[['package_id', 'Package'], ['pillar', 'Pillar'], ['state', 'State'], ['approved_by', 'Approved by']]} empty="Nothing waiting for approval." />
      {allowed('view:accounts') ? <Table title="Account inventory" rows={workspace.accounts as unknown as Row[]} columns={[['service', 'Service'], ['owner', 'Owner'], ['role', 'Role'], ['status', 'Status'], ['renewsOn', 'Renews'], ['lastVerifiedOn', 'Verified']]} empty="No accounts recorded." /> : null}
      <Table title="Asset rights" rows={workspace.assetRights} columns={[['asset_id', 'Asset'], ['source', 'Source'], ['status', 'Rights'], ['subject_consent', 'Consent'], ['placement', 'Placement']]} empty="No assets recorded." />
      <Table title="Support tickets" rows={workspace.tickets} columns={[['category', 'Type'], ['summary', 'Summary'], ['status', 'Status'], ['updated_at', 'Updated']]} empty="No tickets." />
      <Table title="Change log" rows={workspace.changeLog} columns={[['summary', 'Change'], ['reference', 'Reference'], ['approved_by', 'Approved by'], ['created_at', 'Date']]} empty="No changes recorded." />
      <Table title="KPI baselines" rows={workspace.kpis} columns={[['metric', 'Metric'], ['baseline', 'Baseline'], ['measured_on', 'Measured'], ['source', 'Source']]} empty="No baselines recorded yet." />
    </div>
  </main>;
}
