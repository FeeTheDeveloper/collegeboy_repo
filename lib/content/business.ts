/**
 * Business details that appear on the site. A field is shown only when its
 * status is 'confirmed'. Never fill a value from an old listing, the truck
 * wrap, or a guess: the phone printed on the truck is no longer in service.
 */
export type Field = { value: string | null; status: 'confirmed' | 'pending' };

export const business = {
  name: 'College Boy Cheesesteaks',
  /** Supplied by King Fee as the CBK catering inbox; monitoring still unconfirmed. */
  cateringEmail: { value: 'catering@collegeboysteaks.com', status: 'confirmed' } as Field,
  cateringInboxMonitored: false,
  generalEmail: { value: null, status: 'pending' } as Field,
  phone: { value: null, status: 'pending' } as Field,
  mailingAddress: { value: null, status: 'pending' } as Field,
  serviceArea: { value: 'Los Angeles', status: 'confirmed' } as Field,
} as const;

export function shown(field: Field) {
  return field.status === 'confirmed' && field.value ? field.value : null;
}

/**
 * Brand line options for Josette. The site shows `current` until she picks one;
 * record her choice and the date in docs/JOSETTE_CHANGELOG.md.
 */
export const brandLine = {
  current: 'Real Philly cheesesteaks. Wherever we roll.',
  optionsForApproval: [
    'Real Philly cheesesteaks. Wherever we roll.',
    'Real Philly cheesesteaks, wherever we roll.',
    'Real Philly. Real cheesesteaks. Wherever we roll.'
  ],
  approvedBy: null as string | null,
  approvedAt: null as string | null,
};

/**
 * Menu content. Prices and full ingredient lists are owner-confirmed fields;
 * until Josette supplies them the site says "see today's menu" instead.
 */
export const menuPricesConfirmed = false;

/**
 * The inspiration story is draft-only until the family signs off in writing.
 * While `familyApprovedAt` is null the site shows a visible draft marker and
 * no names, memorial wording, or biography beyond what is already approved.
 */
export const story = {
  familyApprovedBy: null as string | null,
  familyApprovedAt: null as string | null,
  /** Final copy from Josette goes here verbatim once approved. */
  approvedParagraphs: [] as string[],
};

export const storyApproved = () => Boolean(story.familyApprovedBy && story.familyApprovedAt && story.approvedParagraphs.length);
