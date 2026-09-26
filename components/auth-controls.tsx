'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';

/**
 * Clerk Core 3 removed <SignedIn>/<SignedOut>. The server replacement is <Show>,
 * but it awaits auth() and would make every page with a header dynamic, so the
 * header resolves its own state on the client and the marketing pages stay static.
 */
export function AuthControls() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="auth-controls" />;
  return <div className="auth-controls">{isSignedIn
    ? <><Link href="/account">Account</Link><UserButton /></>
    : <Link href="/sign-in">Sign in</Link>}</div>;
}
