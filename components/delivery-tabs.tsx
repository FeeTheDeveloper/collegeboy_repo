'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { isLive, orderOptions } from '@/lib/order-options';
import { instagramUrl } from '@/lib/nav-links';

function DeliverySymbol() {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M6 9h16l2 15H4L6 9Z" /><path d="M10 10V7a4 4 0 0 1 8 0v3M10 17h8M15 14l3 3-3 3" />
  </svg>;
}

export function DeliveryTabs() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? orderOptions.length - 1
      : (index + (event.key === 'ArrowRight' ? 1 : -1) + orderOptions.length) % orderOptions.length;
    setSelected(next);
    buttons.current[next]?.focus();
  }

  return <div className="delivery-selector" id="order">
    <div className="delivery-heading"><div><span className="eyebrow">ORDER</span><h3>Come get your cheesesteak.</h3></div><p>Order at the truck,<br /> or through a delivery partner.</p></div>
    <div className="delivery-tablist" role="tablist" aria-label="Delivery partners">
      {orderOptions.map((option, index) => <button key={option.id} type="button" role="tab"
        id={`order-tab-${option.id}`} aria-controls={`order-panel-${option.id}`} aria-selected={selected === index}
        tabIndex={selected === index ? 0 : -1} className={`delivery-tab delivery-${option.id}`}
        ref={element => { buttons.current[index] = element; }}
        onClick={() => setSelected(index)} onKeyDown={event => navigate(event, index)}>
        <DeliverySymbol />
        <span className="delivery-tab-name">{option.id === 'uber' ? <>Uber <em>Eats</em></> : option.name}</span>
        <span className="delivery-tab-type">{isLive(option) ? 'DELIVERY' : 'CONFIRMING'}</span>
      </button>)}
    </div>
    {orderOptions.map((option, index) => <section key={option.id} role="tabpanel" tabIndex={0}
      id={`order-panel-${option.id}`} aria-labelledby={`order-tab-${option.id}`} hidden={selected !== index}
      className={`delivery-panel delivery-${option.id}`}>
      <div className="delivery-panel-copy"><span className="delivery-kicker">DELIVERY PARTNER</span>
        <h4>{option.title}</h4>
        {isLive(option) ? <>
          <p>{option.description}</p>
          <ol className="delivery-steps">{option.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <a className="delivery-action" href={option.href} target="_blank" rel="noopener noreferrer" data-order-provider={option.id}>{option.action}<span aria-hidden="true">↗</span><span className="menu-visually-hidden"> (opens in a new tab)</span></a>
          <small>Availability, delivery fees and arrival times are set by {option.name}.</small>
        </> : <>
          <p>College Boy is confirming its {option.name} listing. The link will appear here once it is verified as live.</p>
          <span className="delivery-action delivery-action-pending" aria-disabled="true" data-order-pending={option.id}>{option.name} link being confirmed</span>
          <small>Until then, order at the truck — <a className="text-link" href="#find">find today’s stop</a> or check <a className="text-link" href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a>.</small>
        </>}
      </div>
      <div className="delivery-art"><Image src="/media/college-boy-cheesesteak-feast-enhanced.png" alt="Cheesesteak halves and fries served in red-and-white checkered paper" fill sizes="(max-width: 720px) 100vw, 40vw" />
        <div className="delivery-receipt"><span>COLLEGE BOY</span><strong>DELIVERY</strong><span>{option.name}</span></div>
      </div>
    </section>)}
    <p className="delivery-disclaimer">Orders placed through a delivery partner are completed on that partner’s website. This site does not take payment.</p>
  </div>;
}
