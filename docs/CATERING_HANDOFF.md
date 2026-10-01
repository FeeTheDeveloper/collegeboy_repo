# College Boy catering page handoff

`/catering` is a direct inquiry page. The header, footer, homepage catering CTA, and legacy `/contact-8` redirect lead to it. It uses existing College Boy food and truck artwork. Service format and budget selectors are omitted until College Boy confirms real options.

## Submission setup

The form is **not yet connected**. No catering submission destination was configured in this checkout. The existing `RESEND_API_KEY` and `CAREERS_FROM_EMAIL` variables are also absent locally. The approved College Boy recipient in `lib/content/business.ts` is `catering@collegeboysteaks.com`, but the same file says inbox monitoring is unconfirmed.

To enable online submission:

1. Confirm College Boy monitors `catering@collegeboysteaks.com`. Then set `business.cateringInboxMonitored` to `true` with the confirmation recorded in the project.
2. Configure `RESEND_API_KEY` for College Boy's own Resend account and `CATERING_FROM_EMAIL` for a sender address on its verified domain. Put values in the server deployment environment only; do not prefix them `NEXT_PUBLIC_` or commit them.
3. Test a real submission from the rebuilt preview and verify receipt at the College Boy inbox before describing delivery as working. Also verify the deployment's `NEXT_PUBLIC_SITE_URL` matches its public origin so the origin check accepts browser requests.

The server route uses the fixed College Boy recipient, validates fields, rejects oversized bodies and a filled honeypot, checks request origin, and passes a retry idempotency key to Resend. A success message appears only after Resend accepts the request. There is no customer database or third-party form service. Email remains available as the alternative; the team should confirm inbox monitoring before production.

Client decisions: confirm inbox monitoring, approve a sender address, and provide any service-format or budget options if those fields should be added later. No pricing or packages are shown.
