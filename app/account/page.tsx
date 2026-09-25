import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { clerkConfigured } from '@/lib/config';

export default async function AccountPage() {
  if (!clerkConfigured) notFound();
  const { userId } = await auth();
  if (!userId) notFound();
  return <><SiteHeader /><main className="account-page"><span className="eyebrow">COLLEGE BOY ACCOUNT</span><h1>You’re signed in.</h1><p>This protected route is ready for future customer features. It does not expose subscriber data or imply an active loyalty program.</p></main></>;
}
