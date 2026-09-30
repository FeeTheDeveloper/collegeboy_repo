import { NextResponse } from 'next/server';
import { careersEmailReady } from '@/lib/careers';
import { isAllowedRequestOrigin } from '@/lib/site-config';

export const runtime = 'nodejs';

const maxResumeBytes = 4 * 1024 * 1024;
const maxBodyBytes = 4_400_000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const submissionPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function value(form: FormData, key: string, limit: number) {
  const field = form.get(key);
  return typeof field === 'string' ? field.trim().slice(0, limit) : '';
}

export async function POST(request: Request) {
  if (!isAllowedRequestOrigin(request.headers.get('origin'))) {
    return NextResponse.json({ message: 'Request origin is not allowed.' }, { status: 403 });
  }
  if (!careersEmailReady) return NextResponse.json({ message: 'Online applications are being connected. Please email College Boy directly.' }, { status: 503 });
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    return NextResponse.json({ message: 'The résumé is too large. Please upload a PDF under 4 MB.' }, { status: 413 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ message: 'The application could not be read.' }, { status: 400 });
  if (value(form, 'website', 80)) return NextResponse.json({ message: 'Unable to accept this request.' }, { status: 400 });
  const firstName = value(form, 'firstName', 80);
  const lastName = value(form, 'lastName', 80);
  const email = value(form, 'email', 254).toLowerCase();
  const phone = value(form, 'phone', 30);
  const role = value(form, 'role', 20);
  const why = value(form, 'why', 2000);
  const submissionId = value(form, 'submissionId', 64);
  const resume = form.get('resume');
  if (!firstName || !lastName || !emailPattern.test(email) || !['driver', 'cook'].includes(role) || !submissionPattern.test(submissionId) || value(form, 'consent', 10) !== 'yes') {
    return NextResponse.json({ message: 'Please complete the required fields and consent.' }, { status: 400 });
  }
  if (!(resume instanceof File) || resume.size === 0 || resume.size > maxResumeBytes || !resume.name.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json({ message: 'Upload a PDF résumé under 4 MB.' }, { status: 400 });
  }
  const bytes = Buffer.from(await resume.arrayBuffer());
  if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-') {
    return NextResponse.json({ message: 'The résumé must be a valid PDF.' }, { status: 400 });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `collegeboy-careers/${submissionId}`,
    },
    body: JSON.stringify({
      from: process.env.CAREERS_FROM_EMAIL,
      to: ['info@collegeboysteaks.com'],
      reply_to: email,
      subject: `College Boy ${role === 'driver' ? 'truck driver' : 'truck cook'} application`,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Role: ${role}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        '',
        'Why they want to work at College Boy:',
        why || 'Not provided',
      ].join('\n'),
      attachments: [{ filename: 'resume.pdf', content: bytes.toString('base64'), content_type: 'application/pdf' }],
    }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => null);
  if (!response?.ok) return NextResponse.json({ message: 'The application could not be sent. Please try again or email College Boy.' }, { status: 502 });
  return NextResponse.json({ message: 'Your application was sent to College Boy. Thank you.' });
}
