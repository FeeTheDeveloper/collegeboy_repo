import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { clerkConfigured } from '@/lib/config';
import { listTenants, portalConfigured } from '@/lib/dashboard/data';
import '../dashboard.css';

export const metadata: Metadata = { title: 'Client dashboard', robots: { index: false, follow: false } };

export default async function DashboardHome() {
  if (!clerkConfigured) notFound();
  const { userId, getToken } = await auth();
  if (!userId) notFound();
  const tenants = portalConfigured ? await listTenants(() => getToken()) : [];
  return <main className="dash">
    <span className="eyebrow">FEE THE DEVELOPER · CLIENT DASHBOARD</span>
    <h1>Your workspaces</h1>
    {!portalConfigured ? <p className="dash-empty">The dashboard database is not connected yet. No client data is shown.</p>
      : tenants.length ? <ul className="dash-tenants">{tenants.map(t => <li key={t.slug}><Link href={`/dashboard/${t.slug}`}>{t.displayName} →</Link></li>)}</ul>
        : <p className="dash-empty">You have not been invited to a workspace yet.</p>}
  </main>;
}
