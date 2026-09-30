'use client';

import { useRef, useState, type FormEvent } from 'react';

export function CareerApplicationForm({ available }: { available: boolean }) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const submissionId = useRef<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !available) return;
    setSending(true);
    setMessage('');
    const form = event.currentTarget;
    const data = new FormData(form);
    submissionId.current ??= crypto.randomUUID();
    data.set('submissionId', submissionId.current);
    try {
      const response = await fetch('/api/careers/apply', { method: 'POST', body: data });
      const result = await response.json() as { message?: string };
      setMessage(result.message ?? 'We could not send your application. Please try again.');
      if (response.ok) { form.reset(); submissionId.current = null; }
    } catch {
      setMessage('We could not send your application. Please try again.');
    } finally { setSending(false); }
  }

  return <form className="career-form" onSubmit={submit} onChange={() => { submissionId.current = null; }} encType="multipart/form-data">
    <div className="career-form-row"><label>First name<input name="firstName" autoComplete="given-name" maxLength={80} required disabled={!available} /></label><label>Last name<input name="lastName" autoComplete="family-name" maxLength={80} required disabled={!available} /></label></div>
    <div className="career-form-row"><label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required disabled={!available} /></label><label>Phone<input name="phone" type="tel" autoComplete="tel" maxLength={30} disabled={!available} /></label></div>
    <label>Role<select name="role" required defaultValue="" disabled={!available}><option value="" disabled>Select a role</option><option value="driver">Truck driver</option><option value="cook">Truck cook</option></select></label>
    <label>Why would you like to work at College Boy?<textarea name="why" rows={5} maxLength={2000} disabled={!available} /></label>
    <label>Résumé (PDF, up to 4 MB)<input name="resume" type="file" accept="application/pdf,.pdf" required disabled={!available} /></label>
    <label className="career-form-consent"><input name="consent" type="checkbox" value="yes" required disabled={!available} /><span>I agree to send my application and résumé to College Boy for hiring review.</span></label>
    <div className="career-form-honey" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button type="submit" className="button button-red" disabled={!available || sending}>{sending ? 'Sending…' : 'Send application'}</button>
    {!available ? <p className="career-form-status">Online résumé delivery is being connected. Please use the email option above for now.</p> : null}
    {message ? <p className="career-form-status" role="status">{message}</p> : null}
    <small>Applications go to the College Boy hiring inbox. Do not include Social Security numbers or other sensitive documents.</small>
  </form>;
}
