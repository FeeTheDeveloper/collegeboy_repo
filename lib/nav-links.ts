/** One source for the header nav so desktop and the mobile sheet cannot drift apart. */
export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/find', label: 'Find the truck' },
  { href: '/story', label: 'Story' },
  { href: '/catering', label: 'Catering' },
  { href: '/careers', label: 'Careers' }
] as const;

/** Ordering happens on the verified provider listings in the Order section, not on this site. */
export const orderHref = '/order';
export const instagramUrl = 'https://www.instagram.com/collegeboycheesesteaks/';
