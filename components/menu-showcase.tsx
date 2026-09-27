import Image from 'next/image';
import { DeliveryTabs } from './delivery-tabs';
import './menu-showcase.css';

/**
 * Every visual here must match what College Boy serves: plain (unseeded) rolls,
 * lemonade in a bottle, no invented ingredients or prices. `kind` is shown on
 * the card so a preview or illustration is never mistaken for a product photo.
 */
export const menuCards = [
  { title: 'Cheesesteaks', tag: '01 · START HERE', image: '/media/menu-cheesesteak.webp', kind: 'Photo preview',
    alt: 'Two halves of a College Boy cheesesteak, chopped steak and melted cheese in a plain roll, with thick-cut fries on checkered paper',
    copy: 'Chopped steak and melted cheese on a plain hoagie roll. Build yours from today’s menu.' },
  { title: 'Mushroom cheesesteak', tag: '02 · A TOP SELLER', image: '/media/illustrations/mushroom-cheesesteak.svg', kind: 'Illustration',
    alt: 'Illustration of a cheesesteak with sliced mushrooms and melted cheese on a plain hoagie roll',
    copy: 'One of College Boy’s biggest sellers: the cheesesteak with mushrooms. Ask for it at the window.' },
  { title: 'Chicken cheesesteak', tag: '03 · SWITCH IT UP', image: '/media/menu-chicken.webp', kind: 'Photo preview',
    alt: 'Two halves of a College Boy chicken cheesesteak in a plain roll on checkered paper',
    copy: 'Chicken instead of steak. Check today’s menu for how it’s built.' },
  { title: 'Fries & lemonade', tag: '04 · EXTRA CREDIT', image: '/media/illustrations/fries-bottled-lemonade.svg', kind: 'Illustration',
    alt: 'Illustration of a tray of fries beside a sealed bottle of lemonade',
    copy: 'Fries on the side and lemonade by the bottle. Ask which flavors are cold today.' },
] as const;

export function MenuShowcase() {
  return <section className="degree-section menu-showcase" id="menu" aria-labelledby="menu-title">
    <div className="section-intro light"><span className="eyebrow">THE MENU</span><h2 id="menu-title">Earn your degree.</h2><p>Current options, availability and prices are confirmed at the truck or by the delivery partner.</p></div>
    <div className="menu-cards">{menuCards.map((item, index) => <article key={item.title} className="menu-card">
      <div className="menu-card-photo">
        <Image src={item.image} alt={item.alt} fill unoptimized={item.image.endsWith('.svg')} sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw" />
        <span className="menu-card-number" aria-hidden="true">0{index + 1}</span>
        <span className="menu-card-kind">{item.kind}</span>
      </div>
      <div className="menu-card-copy"><span className="menu-card-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.copy}</p></div>
    </article>)}</div>
    <p className="menu-image-note">Photo previews are AI-styled from College Boy’s own food photos. Illustrations stand in until College Boy supplies photos. Items and presentation may vary.</p>
    <DeliveryTabs />
  </section>;
}
