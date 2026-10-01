/**
 * Business details shown on the site. Contact details below came from the
 * original College Boy site screenshots supplied by the user on 2026-09-30.
 */
export type Field = { value: string | null; status: 'confirmed' | 'pending' };

export const business = {
  name: 'College Boy Cheesesteaks',
  /** Supplied by King Fee as the CBK catering inbox; monitoring still unconfirmed. */
  cateringEmail: { value: 'catering@collegeboysteaks.com', status: 'confirmed' } as Field,
  cateringInboxMonitored: false,
  generalEmail: { value: 'info@collegeboysteaks.com', status: 'confirmed' } as Field,
  officePhone: { value: '833-310-5296', status: 'confirmed' } as Field,
  mobilePhone: { value: '267-248-8904', status: 'confirmed' } as Field,
  serviceArea: { value: 'Los Angeles, California', status: 'confirmed' } as Field,
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
 * The supplied official screenshots now establish the six displayed menu
 * descriptions. Prices remain unconfirmed.
 */
export const menuPricesConfirmed = false;

/**
 * The user confirmed all approvals on September 30, 2026. The approved copy
 * stays within the established family and Philly-roots account; no new
 * biographical or memorial details were supplied for publication.
 */
export const story = {
  familyApprovedBy: 'User-confirmed approval' as string | null,
  familyApprovedAt: '2026-09-30' as string | null,
  approvedParagraphs: [
    'Built on family and Philly roots, College Boy carries its story forward through the red truck and the cheesesteaks it serves in Los Angeles.'
  ],
};

export const storyApproved = () => Boolean(story.familyApprovedBy && story.familyApprovedAt && story.approvedParagraphs.length);
