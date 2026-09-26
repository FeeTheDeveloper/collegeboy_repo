/** Existing merchant destinations. Availability is owned by each provider, not this site. */
export const orderOptions = [
  {
    id: 'pickup', name: 'Pickup', provider: 'College Boy', label: 'FROM THE TRUCK',
    title: 'Your order. Your way.',
    description: 'Build your order on our Square menu. Confirm the pickup location and collection time before checking out.',
    action: 'View pickup menu', href: 'https://collegeboy-cheesesteaks.square.site/',
    detail: 'Menu, prices and pickup details are confirmed on Square.',
    steps: ['Explore the menu', 'Choose your favorites', 'Confirm pickup details'],
  },
  {
    id: 'uber', name: 'Uber Eats', provider: 'Uber Eats', label: 'DELIVERY PARTNER',
    title: 'A little Philly. Delivered.',
    description: 'Check the College Boy listing on Uber Eats. Enter your address there to see current menu availability and delivery options.',
    action: 'Check Uber Eats availability', href: 'https://www.ubereats.com/store/collegeboy-cheesesteaks/jZXVoXzrW_6yjSc8As2DZw',
    detail: 'Availability, delivery fees and arrival estimates are set by Uber Eats.',
    steps: ['Open Uber Eats', 'Enter your address', 'Check current availability'],
  },
  {
    id: 'doordash', name: 'DoorDash', provider: 'DoorDash', label: 'DELIVERY PARTNER',
    title: 'The red truck. To your door.',
    description: 'Visit the College Boy listing on DoorDash to check whether ordering is available for your address. Your order stays with DoorDash.',
    action: 'Check DoorDash availability', href: 'https://www.doordash.com/store/college-boy-cheesesteaks-los-angeles-23069053/',
    detail: 'Availability, delivery fees and arrival estimates are set by DoorDash.',
    steps: ['Open DoorDash', 'Enter your address', 'Check current availability'],
  },
] as const;
