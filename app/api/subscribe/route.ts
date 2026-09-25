import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-admin';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const supabase = createSupabaseAdmin();
  if (!supabase) return NextResponse.json({ message: 'Signup is not connected yet.' }, { status: 503 });

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || body.website) return NextResponse.json({ message: 'Unable to accept this request.' }, { status: 400 });
  const email = String(body.email || '').trim().toLowerCase();
  const firstName = String(body.firstName || '').trim().slice(0, 80);
  const lastName = String(body.lastName || '').trim().slice(0, 80);
  if (!emailPattern.test(email) || email.length > 254) return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
  if (body.consent !== 'true') return NextResponse.json({ message: 'Consent is required to join the mailing list.' }, { status: 400 });

  const { error } = await supabase.from('mailing_list_subscribers').upsert({ email, first_name: firstName || null, last_name: lastName || null, consented_at: new Date().toISOString(), source: 'website' }, { onConflict: 'email' });
  if (error) return NextResponse.json({ message: 'Signup could not be saved. Try again later.' }, { status: 500 });
  return NextResponse.json({ message: 'You’re on the list.' });
}
