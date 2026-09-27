/**
 * Ordering destinations. A link is rendered as a live link only when its
 * status is 'verified' and it records who confirmed it and when. Anything else
 * is shown as "being confirmed" with no href, so an unconfirmed or dead listing
 * can never be clicked through from this site.
 *
 * Square pickup ordering is intentionally absent (Josette, preview review).
 * Grubhub is not listed until Josette confirms it is active.
 */
export type OrderLinkStatus = 'verified' | 'pending-verification';

export type OrderOption = {
  id: 'uber' | 'doordash';
  name: string;
  title: string;
  description: string;
  action: string;
  href: string;
  status: OrderLinkStatus;
  verifiedAt: string | null;
  verifiedBy: string | null;
  steps: readonly string[];
};

export const orderOptions: readonly OrderOption[] = [
  {
    id: 'uber', name: 'Uber Eats',
    title: 'A little Philly. Delivered.',
    description: 'Open the College Boy listing on Uber Eats and enter your address to see what is available right now.',
    action: 'Order on Uber Eats', href: 'https://www.ubereats.com/store/collegeboy-cheesesteaks/jZXVoXzrW_6yjSc8As2DZw',
    // Sept 25 check found every item out of stock; needs Josette's confirmation.
    status: 'pending-verification', verifiedAt: null, verifiedBy: null,
    steps: ['Open Uber Eats', 'Enter your address', 'Check current availability'],
  },
  {
    id: 'doordash', name: 'DoorDash',
    title: 'The red truck. To your door.',
    description: 'Open the College Boy listing on DoorDash and enter your address to see what is available right now.',
    action: 'Order on DoorDash', href: 'https://www.doordash.com/store/college-boy-cheesesteaks-los-angeles-23069053/',
    // Sept 25 check found the store inactive; needs Josette's confirmation.
    status: 'pending-verification', verifiedAt: null, verifiedBy: null,
    steps: ['Open DoorDash', 'Enter your address', 'Check current availability'],
  },
];

export function isLive(option: OrderOption) {
  return option.status === 'verified' && Boolean(option.verifiedAt && option.verifiedBy);
}

export const liveOrderOptions = () => orderOptions.filter(isLive);
