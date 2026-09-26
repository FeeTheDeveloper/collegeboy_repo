import Image from 'next/image';
import { DeliveryTabs } from './delivery-tabs';
import './menu-showcase.css';

const categories = [
  { title: 'Cheesesteaks', tag: '01 · START HERE', image: 'college-boy-menu-cheesesteak.png', alt: 'A loaded Philly cheesesteak with melted cheese and onions on red-and-white checkered paper', copy: 'The Philly favorite. Choose your proteins, cheese and toppings on the current menu.' },
  { title: 'Chicken & veggie', tag: '02 · SWITCH IT UP', image: 'college-boy-menu-chicken-veggie.png', alt: 'Chicken and veggie cheesesteaks with peppers, onions, mushrooms, and melted cheese', copy: 'Take another route. Check the live menu for chicken, veggie options and customizations.' },
  { title: 'Fries & drinks', tag: '03 · EXTRA CREDIT', image: 'college-boy-menu-fries-drinks.png', alt: 'Melted-cheese-covered seasoned fries beside a cold lemonade on red-and-white checkered paper', copy: 'Finish the order with cheesy fries and something to sip. See what’s available today.' },
  { title: 'Your order', tag: '04 · TOP OF THE CLASS', image: 'college-boy-cheesesteak-feast-enhanced.png', alt: 'Cheesesteak halves and fries served in red-and-white checkered paper', copy: 'Your favorites, together. Choose pickup or check a delivery partner below.' },
] as const;

export function MenuShowcase() {
  return <section className="degree-section menu-showcase" id="menu" aria-labelledby="menu-title">
    <div className="section-intro light"><span className="eyebrow">THE CURRICULUM</span><h2 id="menu-title">Earn your degree.</h2><p>Find your favorite. Current options, availability and prices are confirmed at checkout.</p></div>
    <div className="menu-cards">{categories.map((item, index) => <article key={item.title} className={index === 3 ? 'menu-card menu-card-final' : 'menu-card'}>
      <div className="menu-card-photo"><Image src={`/media/${item.image}`} alt={item.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw" /><span className="menu-card-number" aria-hidden="true">0{index + 1}</span></div>
      <div className="menu-card-copy"><span className="menu-card-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.copy}</p></div>
    </article>)}</div>
    <p className="menu-image-note">AI-styled menu previews based on supplied food photos. Items and presentation may vary.</p>
    <DeliveryTabs />
  </section>;
}
