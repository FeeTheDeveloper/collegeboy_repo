# Careers handoff

The new `/careers` page presents truck driver and truck cook opportunities. The on-site form accepts a PDF résumé under 4 MB and emails the application to `info@collegeboysteaks.com` through Resend. There is no local file storage or applicant database. The source address, office phone, mobile phone and company address came from the user-supplied screenshots of the original College Boy website (`IMG_2584.PNG` through `IMG_2588.PNG`).

## Turn on résumé delivery

Set `RESEND_API_KEY` and `CAREERS_FROM_EMAIL` in the deployment environment. The sender must be on a domain verified in the College Boy Resend account. The form stays disabled without both values; applicants can open an email draft to the supplied company address and attach the résumé themselves. Verify that the company inbox is monitored before enabling the form.

The route `POST /api/careers/apply` checks origin, fields, consent, PDF signature and size. It sends the PDF as an email attachment with a submission idempotency key, then reports success only if Resend accepts the email. The 4 MB cap keeps multipart requests under Vercel's 4.5 MB Function request limit. The flow should receive a real end-to-end inbox test after credentials are configured.

## Job boards

Set the exact College Boy listing URLs in `INDEED_DRIVER_URL`, `INDEED_COOK_URL`, `ZIPRECRUITER_DRIVER_URL` and `ZIPRECRUITER_COOK_URL`. Only HTTPS URLs on the matching board's domain render as outbound application links. Until actual postings exist, the page says each listing is pending. The on-site form does not send applicant data to either board.

Indeed supports an employer's application URL when enabled for the account; ZipRecruiter also documents using an external application URL. Account setup, job posting, and any provider-side integration remain separate actions.
