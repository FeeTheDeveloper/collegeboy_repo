import { SignIn } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import { clerkConfigured } from '@/lib/config';

export default function SignInPage() {
  if (!clerkConfigured) notFound();
  return <main className="auth-page"><SignIn path="/sign-in" signUpUrl="/sign-up" /></main>;
}
