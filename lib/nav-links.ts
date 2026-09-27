/** One source for the header nav so desktop and the mobile sheet cannot drift apart. */
export const navLinks = [
  { href: '/#find', label: 'Find the truck' },
  { href: '/#menu', label: 'Menu' },
  { href: '/#order', label: 'Order' },
  { href: '/#catering', label: 'Catering' },
  { href: '/#story', label: 'Story' }
] as const;

/** Ordering happens on the verified provider listings in the Order section, not on this site. */
export const orderHref = '/#order';
export const instagramUrl = 'https://www.instagram.com/collegeboycheesesteaks/';
