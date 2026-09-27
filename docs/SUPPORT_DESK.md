# Fee The Developer service desk (proposal)

**Proposed address:** `support@feethedeveloper.com` — **not created.** Requires King Fee to confirm domain administration, mailbox ownership, licensing, DNS (MX/SPF/DKIM/DMARC) and routing before anything is set up.

**Separation:** College Boy customer addresses (`catering@collegeboysteaks.com` and any future CBK inbox) belong to College Boy and never route to Fee The Developer support. Customers contact College Boy; College Boy contacts Fee The Developer.

## Intake taxonomy (`lib/dashboard/support.ts`)

| Category | Examples | Owner | Approval |
| --- | --- | --- | --- |
| Website change | Copy, photo, menu, link updates | FTD staff | Client owner approves before publish |
| Location / schedule change | New stop, moved stop, cancellation | FTD staff | Client owner confirms the stop |
| Access issue | Login, invitation, lost access | FTD admin | Identity verified before any access change |
| Campaign approval | Content package ready for review | FTD staff | Client owner approves each package |
| Billing | Invoice question | FTD admin | King Fee for any adjustment |

## Lifecycle

`new → acknowledged → in-progress ⇄ waiting-on-client → resolved → closed` (a resolved ticket can reopen to in-progress). Tickets never skip acknowledgment.

- **Acknowledgment:** a person acknowledges during Fee The Developer business hours. Proposed target: next business day. Final hours and targets are King Fee's decision.
- **Ownership:** every ticket has one assignee from the category owner role.
- **Escalation:** anything touching security, access, payments, or a wrong public location goes to FTD admin immediately, then King Fee.
- **Not promised:** 24/7 or unattended support. A wrong location on the live site is corrected by reverting the schedule entry (see `LOCATION_PUBLISHING.md`) as soon as someone is available.
