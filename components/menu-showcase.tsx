import Image from 'next/image';
import { DeliveryTabs } from './delivery-tabs';
import './menu-showcase.css';

/** Official item names and descriptions transcribed from the six client-supplied menu screenshots. */
export const menuCards = [
  {
    title: 'Alumni', category: 'Cheesesteak', image: '/media/menu-alumni.webp',
    alt: 'College Boy Alumni cheesesteak with chopped steak and grilled onions in a plain roll',
    copy: 'Mayonnaise, American cheese, grilled onions, salt and pepper.',
  },
  {
    title: 'Bachelor', category: 'Cheesesteak', image: '/media/menu-bachelor.webp',
    alt: 'College Boy Bachelor cheesesteak with chopped steak, melted cheese and grilled onions in a plain roll',
    copy: 'Mayonnaise, American and whiz cheese, grilled onions, salt and pepper.',
  },
  {
    title: "Master's", category: 'Cheesesteak', image: '/media/menu-masters.webp',
    alt: "College Boy Master's cheesesteak with chopped steak, melted cheese and grilled onions in a plain roll",
    copy: 'Mayonnaise, American, provolone and whiz cheese, grilled onions, salt and pepper. Choice of mild or spicy Frat sauce.',
  },
  {
    title: 'Doctorate', category: 'Cheesesteak', image: '/media/menu-doctorate.webp',
    alt: 'College Boy Doctorate cheesesteak with chopped steak, cheese, peppers and pickles in a plain roll',
    copy: 'Mayonnaise, American, provolone and whiz cheese, mushrooms, grilled onions, sweet or hot peppers and pickles.',
  },
  {
    title: 'Hoagie', category: 'Cheesesteak', image: '/media/menu-hoagie.webp',
    alt: 'College Boy Hoagie cheesesteak with chopped steak, lettuce, tomato and raw onions in a plain roll',
    copy: 'Mayonnaise, American cheese, raw onions, lettuce, tomato, salt and pepper.',
  },
  {
    title: 'Cheese Fries', category: 'Side', image: '/media/menu-cheese-fries.webp',
    alt: 'College Boy Cheese Fries with melted cheese in a branded white cup against a red background',
    copy: 'Fries topped with melted cheese.',
  },
] as const;

export function MenuShowcase() {
  return <section className="degree-section menu-showcase" id="menu" aria-labelledby="menu-title">
    <div className="section-intro light"><span className="eyebrow">THE OFFICIAL MENU</span><h2 id="menu-title">Pick your degree.</h2><p>College Boy favorites, straight from the menu. Ask at the truck or check the delivery partner for current prices and availability.</p></div>
    <div className="menu-cards">{menuCards.map((item, index) => <article key={item.title} className="menu-card">
      <div className="menu-card-photo">
        <Image src={item.image} alt={item.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw" />
        <span className="menu-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="menu-card-copy"><span className="menu-card-tag">{item.category}</span><h3>{item.title}</h3><p>{item.copy}</p></div>
    </article>)}</div>
    <p className="menu-image-note">Images are enhanced from College Boy&apos;s supplied menu photos. Presentation may vary.</p>
    <DeliveryTabs />
  </section>;
}
