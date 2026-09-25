'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export function AuthControls() {
  return <div className="auth-controls"><SignedOut><Link href="/sign-in">Sign in</Link></SignedOut><SignedIn><Link href="/account">Account</Link><UserButton /></SignedIn></div>;
}
