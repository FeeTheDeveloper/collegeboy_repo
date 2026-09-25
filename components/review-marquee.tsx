const reviews = [
  { source: 'Google', label: 'Approved review quote pending', detail: 'Reviewer name and rating will be added after source verification.' },
  { source: 'Yelp', label: 'Approved review quote pending', detail: 'No review text or star rating is fabricated in this preview.' },
  { source: 'Google', label: 'Customer proof, properly sourced', detail: 'Final cards will link to the original public review.' },
  { source: 'Yelp', label: 'Rights-aware social proof', detail: 'Only verified, client-approved excerpts will appear here.' }
];

export function ReviewMarquee() {
  return <section className="reviews" aria-labelledby="reviews-title"><div className="section-intro"><span className="eyebrow">WORD ON THE STREET</span><h2 id="reviews-title">Reviews with receipts.</h2><p>Scrolling placeholders reserve the final layout without inventing ratings or customer quotes.</p></div><div className="marquee" role="region" aria-label="Review placeholders"><div className="marquee-track">{[...reviews, ...reviews].map((review, index) => <article className="review-card" key={`${review.source}-${index}`} aria-hidden={index >= reviews.length}><span>{review.source}</span><strong>{review.label}</strong><p>{review.detail}</p></article>)}</div></div></section>;
}
