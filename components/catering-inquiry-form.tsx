'use client';

import { useRef, useState, type FormEvent } from 'react';
import type { CateringInquiry } from '@/lib/catering';

const fieldNames: (keyof CateringInquiry)[] = ['name', 'phone', 'email', 'location', 'date', 'startTime', 'endTime', 'guestCount', 'details'];
type Errors = Partial<Record<keyof CateringInquiry, string>>;

export function CateringInquiryForm({ available }: { available: boolean }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const submissionId = useRef<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || sending) return;
    setSending(true);
    setSent(false);
    setMessage('');
    setErrors({});
    const form = event.currentTarget;
    const formData = new FormData(form);
    submissionId.current ??= crypto.randomUUID();
    const data = Object.fromEntries(fieldNames.map(key => [key, String(formData.get(key) ?? '').trim()])) as CateringInquiry;
    try {
      const response = await fetch('/api/catering', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website: formData.get('website'), submissionId: submissionId.current }),
      });
      const result = await response.json() as { message?: string; errors?: Errors };
      if (response.ok) {
        form.reset(); submissionId.current = null; setSent(true);
        setMessage(result.message ?? 'Your catering request was sent to College Boy.');
      } else {
        setMessage(result.message ?? 'Your request could not be sent. Please try again.');
        if (result.errors) setErrors(result.errors);
      }
    } catch { setMessage('Your request could not be sent. Please try again or email College Boy.'); }
    finally { setSending(false); }
  }

  return <form className="catering-form" aria-label="Catering inquiry" onSubmit={submit} onChange={() => { submissionId.current = null; setSent(false); setMessage(''); setErrors({}); }}>
    <div className="catering-fields">
      <label>Name <span aria-hidden="true">*</span><input name="name" autoComplete="name" maxLength={120} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'catering-name-error' : undefined} />{errors.name && <small id="catering-name-error">{errors.name}</small>}</label>
      <label>Phone <span aria-hidden="true">*</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'catering-phone-error' : undefined} />{errors.phone && <small id="catering-phone-error">{errors.phone}</small>}</label>
      <label>Email <span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'catering-email-error' : undefined} />{errors.email && <small id="catering-email-error">{errors.email}</small>}</label>
      <label>Event location <span aria-hidden="true">*</span><input name="location" autoComplete="off" maxLength={200} required aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? 'catering-location-error' : undefined} />{errors.location && <small id="catering-location-error">{errors.location}</small>}</label>
      <label>Event date <span aria-hidden="true">*</span><input name="date" type="date" required aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'catering-date-error' : undefined} />{errors.date && <small id="catering-date-error">{errors.date}</small>}</label>
      <label>Estimated guest count <span aria-hidden="true">*</span><input name="guestCount" type="number" min="1" max="99999" inputMode="numeric" required aria-invalid={Boolean(errors.guestCount)} aria-describedby={errors.guestCount ? 'catering-guests-error' : undefined} />{errors.guestCount && <small id="catering-guests-error">{errors.guestCount}</small>}</label>
      <label>Event start time <span aria-hidden="true">*</span><input name="startTime" type="time" required aria-invalid={Boolean(errors.startTime)} aria-describedby={errors.startTime ? 'catering-start-error' : undefined} />{errors.startTime && <small id="catering-start-error">{errors.startTime}</small>}</label>
      <label>Event end time <span aria-hidden="true">*</span><input name="endTime" type="time" required aria-invalid={Boolean(errors.endTime)} aria-describedby={errors.endTime ? 'catering-end-error' : undefined} />{errors.endTime && <small id="catering-end-error">{errors.endTime}</small>}</label>
      <label className="catering-wide">Additional event details<textarea name="details" rows={4} maxLength={2000} placeholder="Tell us anything else College Boy should know." /></label>
    </div>
    <div className="catering-honey" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button className="button button-red" type="submit" disabled={!available || sending}>{sending ? 'Sending…' : 'Send catering request'}</button>
    {!available && <p className="catering-connection" role="status">Online form not yet connected. Please use the catering email above.</p>}
    {message && <p className={sent ? 'catering-success' : 'catering-error'} role={sent ? 'status' : 'alert'}>{message}</p>}
    <small>Required fields are marked *. Please do not include payment details.</small>
  </form>;
}
