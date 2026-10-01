import { NextResponse } from 'next/server';
import { cateringEmail, cateringFormReady, validateCateringInquiry, type CateringInquiry } from '@/lib/catering';
import { isAllowedRequestOrigin } from '@/lib/site-config';

export const runtime = 'nodejs';

const fields: (keyof CateringInquiry)[] = ['name', 'phone', 'email', 'location', 'date', 'startTime', 'endTime', 'guestCount', 'details'];
const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!isAllowedRequestOrigin(request.headers.get('origin'))) return NextResponse.json({ message: 'Request origin is not allowed.' }, { status: 403 });
  if (!cateringFormReady || !cateringEmail) return NextResponse.json({ message: 'Online catering requests are not yet connected. Please email College Boy directly.' }, { status: 503 });
  const length = Number(request.headers.get('content-length'));
  if (Number.isFinite(length) && length > 16_000) return NextResponse.json({ message: 'Request is too large.' }, { status: 413 });
  const body = await request.text().catch(() => '');
  if (body.length > 16_000) return NextResponse.json({ message: 'Request is too large.' }, { status: 413 });
  let input: Record<string, unknown>;
  try { input = JSON.parse(body); } catch { return NextResponse.json({ message: 'The request could not be read.' }, { status: 400 }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return NextResponse.json({ message: 'The request could not be read.' }, { status: 400 });
  // Hidden field catches basic bots without accepting a customer inquiry.
  if (input.website) return NextResponse.json({ message: 'Unable to accept this request.' }, { status: 400 });
  if (typeof input.submissionId !== 'string' || !idPattern.test(input.submissionId)) return NextResponse.json({ message: 'Please retry the request.' }, { status: 400 });
  const data = Object.fromEntries(fields.map(key => [key, typeof input[key] === 'string' ? input[key].trim() : ''])) as CateringInquiry;
  const errors = validateCateringInquiry(data);
  if (Object.keys(errors).length) return NextResponse.json({ message: 'Please correct the highlighted fields.', errors }, { status: 400 });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `collegeboy-catering/${input.submissionId}` },
    body: JSON.stringify({
      from: process.env.CATERING_FROM_EMAIL,
      to: [cateringEmail],
      reply_to: data.email,
      subject: 'College Boy catering inquiry',
      text: [
        `Name: ${data.name}`, `Phone: ${data.phone}`, `Email: ${data.email}`,
        `Event location: ${data.location}`, `Event date: ${data.date}`,
        `Event time: ${data.startTime}–${data.endTime}`, `Estimated guests: ${data.guestCount}`,
        '', 'Additional event details:', data.details || 'Not provided',
      ].join('\n'),
    }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => null);
  if (!response?.ok) return NextResponse.json({ message: 'Your request could not be sent. Please try again or email College Boy.' }, { status: 502 });
  return NextResponse.json({ message: 'Your catering request was sent to College Boy.' });
}
