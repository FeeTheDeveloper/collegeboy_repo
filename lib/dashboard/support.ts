/**
 * Fee The Developer service-desk intake. Proposed address:
 * support@feethedeveloper.com (not created; pending King Fee's confirmation of
 * domain administration, mailbox ownership, licensing, DNS and routing).
 * College Boy customer mail (catering@collegeboysteaks.com) never routes here.
 */
export const ticketCategories = {
  'site-change': { label: 'Website change', owner: 'ftd-staff', approval: 'client-owner approves before publish' },
  'location-change': { label: 'Location / schedule change', owner: 'ftd-staff', approval: 'client-owner confirms the stop' },
  'access-issue': { label: 'Access or login problem', owner: 'ftd-admin', approval: 'identity verified before any access change' },
  'campaign-approval': { label: 'Campaign / content approval', owner: 'ftd-staff', approval: 'client-owner approves each package' },
  billing: { label: 'Billing question', owner: 'ftd-admin', approval: 'King Fee for any adjustment' },
} as const;

export type TicketCategory = keyof typeof ticketCategories;
export const ticketStatuses = ['new', 'acknowledged', 'in-progress', 'waiting-on-client', 'resolved', 'closed'] as const;
export type TicketStatus = (typeof ticketStatuses)[number];

/** Allowed status moves. Tickets never skip acknowledgment. */
const transitions: Record<TicketStatus, readonly TicketStatus[]> = {
  new: ['acknowledged'],
  acknowledged: ['in-progress', 'waiting-on-client', 'resolved'],
  'in-progress': ['waiting-on-client', 'resolved'],
  'waiting-on-client': ['in-progress', 'resolved', 'closed'],
  resolved: ['closed', 'in-progress'],
  closed: [],
};

export function canMove(from: TicketStatus, to: TicketStatus) {
  return transitions[from].includes(to);
}
