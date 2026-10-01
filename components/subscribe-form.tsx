'use client';

import { FormEvent, useId, useState } from 'react';

type State = 'idle' | 'submitting' | 'success' | 'error';

export function SubscribeForm({ available, compact = false }: { available: boolean; compact?: boolean }) {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');
  const emailHelpId = useId();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || state === 'submitting') return;
    setState('submitting'); setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
      const result = await response.json().catch(() => ({ message: 'The request could not be completed.' }));
      setState(response.ok ? 'success' : 'error'); setMessage(result.message);
      if (response.ok) event.currentTarget.reset();
    } catch { setState('error'); setMessage('The request could not be completed. Please try again.'); }
  }

  return <form className={`subscribe-form${compact ? ' subscribe-form-compact' : ''}`} aria-label={compact ? 'Footer mailing list signup' : 'Mailing list signup'} onSubmit={submit}>
    {!compact && <div className="field-row"><label>First name<input name="firstName" autoComplete="given-name" maxLength={80} /></label><label>Last name<input name="lastName" autoComplete="family-name" maxLength={80} /></label></div>}
    <label>Email address<input name="email" type="email" autoComplete="email" required aria-describedby={emailHelpId} disabled={!available} placeholder="Your email address" /></label><small id={emailHelpId}>Used only for College Boy updates. Unsubscribe handling must be configured before launch.</small>
    <label className="honeypot" aria-hidden="true">Company website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="consent"><input name="consent" type="checkbox" value="true" required disabled={!available} /><span>I agree to receive College Boy Cheesesteaks email updates.</span></label>
    <button className="button button-red" type="submit" disabled={!available || state === 'submitting'}>{state === 'submitting' ? 'Joining…' : available ? 'Join the mailing list' : 'Database connection pending'}</button>
    <p className={`form-status ${state}`} role="status">{message || (!available ? 'A dedicated College Boy Supabase project must be connected before signup can accept personal information.' : '')}</p>
  </form>;
}
