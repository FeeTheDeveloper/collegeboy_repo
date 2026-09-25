import { SignUp } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import { clerkConfigured } from '@/lib/config';

export default function SignUpPage() {
  if (!clerkConfigured) notFound();
  return <main className="auth-page"><SignUp path="/sign-up" signInUrl="/sign-in" /></main>;
}
