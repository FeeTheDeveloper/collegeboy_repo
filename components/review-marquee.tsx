'use client';

import { useEffect, useMemo, useState } from 'react';

type Review = { reviewer: string; rating: number; age: string; summary: string };

const reviews: Review[] = [
  { reviewer: 'Ben Silver', rating: 5, age: '4 mo', summary: 'A Philly native who searched the West Coast for years for the best cheesesteak says the search is over.' },
  { reviewer: 'Andrew Bernardin', rating: 4, age: '1 yr', summary: 'Loved the crisp fries, chicken cheesesteak, Philly-style bread, and strawberry lemonade; price was the only complaint.' },
  { reviewer: "Yelo's Tacos FoodKing", rating: 5, age: '2 mo', summary: 'Called it the best cheesesteak they have had in California, praising the fresh bread, options, mango lemonade, and warm service.' },
  { reviewer: 'Sabrina La Blanc', rating: 5, age: '10 mo', summary: 'Found the truck outside a theater and called the face-sized cheesesteak the best of her life.' },
  { reviewer: 'Chris T.', rating: 5, age: '11 mo', summary: 'A first truck visit won them over with a hot mushroom, onion, Whiz, and provolone cheesesteak that was not too bready.' },
  { reviewer: 'Maiya C', rating: 5, age: '2 yr', summary: 'Said an Alumni with extra provolone was excellent even cold the next day, and enjoyed chatting with the Philly-native owner.' },
  { reviewer: 'Danny Harper', rating: 5, age: '1 yr', summary: 'Called the Alumni the best cheesesteak ever and praised Josette as kind and friendly.' },
  { reviewer: 'elizabeth ogbomon', rating: 5, age: '1 yr', summary: 'Thanked Josette for her generosity in Burbank and recommended the Alumni.' },
  { reviewer: 'Rasheed Barbee', rating: 5, age: '1 yr', summary: 'Called it the best cheesesteak ever and praised the packaging, lemonade, fries, and overall experience.' },
  { reviewer: 'Maria Morgan', rating: 5, age: '2 yr', summary: 'Noted the warm greeting, careful cooking, spotless truck, and clean tables on Sunset.' },
  { reviewer: 'Dwana B', rating: 5, age: '10 mo', summary: 'Found fresh-to-order food, great service, and big portions at a venue stop, then became a fan.' },
  { reviewer: 'Denise Cullins', rating: 5, age: '11 mo', summary: 'As a first-time cheesesteak customer, she highlighted the warm owners and wished for a weekly restaurant.' },
  { reviewer: 'Craig Hollabaugh', rating: 5, age: '2 yr', summary: 'Enjoyed chatting with Josette while an Alumni with American cheese and grilled onions was prepared.' },
  { reviewer: 'Elijah', rating: 5, age: '1 yr', summary: 'Said the Alumni was delicious, with the family hospitality standing out most.' },
  { reviewer: 'JM2 Generator Repair', rating: 5, age: '11 mo', summary: 'Praised the sweet husband-and-wife team, fresh food, and a meal that satisfied the whole family.' },
  { reviewer: 'Caleb', rating: 5, age: '1 yr', summary: 'Was impressed by how good the gluten-free rolls tasted.' },
  { reviewer: 'Stephanie Dionne', rating: 5, age: '10 mo', summary: 'Enjoyed a veggie meal with mango lemonade at a music festival.' },
  { reviewer: 'Casey D', rating: 5, age: '2 yr', summary: 'Described an authentic Philly experience across the food, staff, and vibe.' },
  { reviewer: 'Darryl Coleman', rating: 5, age: '9 mo', summary: 'Highlighted the sandwich, family atmosphere, and customer service.' },
  { reviewer: 'Cameron Douglas', rating: 5, age: '1 yr', summary: 'Called it the best cheesesteak in California.' }
];

function nextRandomIndex(current: number) {
  let next = current;
  while (next === current) next = Math.floor(Math.random() * reviews.length);
  return next;
}

export function ReviewMarquee() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const review = reviews[index];
  const stars = useMemo(() => '★'.repeat(review.rating), [review.rating]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(mediaQuery.matches);
    updateMotion();
    mediaQuery.addEventListener('change', updateMotion);
    return () => mediaQuery.removeEventListener('change', updateMotion);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setIndex(current => nextRandomIndex(current)), 8500);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  return <section className="reviews" aria-labelledby="reviews-title">
    <div className="section-intro"><span className="eyebrow">WORD ON THE STREET</span><h2 id="reviews-title">Reviews with receipts.</h2><p>20 paraphrased Google reviews, rotating one at a time so the good word stays easy to read.</p></div>
    <div className="review-rotator" role="region" aria-label="Rotating Google review summaries">
      <article key={index} className="review-card review-card-active" aria-live="polite">
        <div className="review-card-meta"><span>Google review</span><span className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{stars}</span></div>
        <strong>{review.summary}</strong><p>{review.reviewer} · {review.age}</p>
      </article>
      <div className="review-controls"><span aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}</span><div className="review-dots" aria-label={`Showing review ${index + 1} of ${reviews.length}`}>{reviews.slice(0, 5).map((_, dotIndex) => <button key={dotIndex} type="button" aria-label={`Show review group ${dotIndex + 1}`} aria-pressed={Math.floor(index / 4) === dotIndex} onClick={() => setIndex(dotIndex * 4)} />)}</div><button className="review-pause" type="button" onClick={() => setPaused(current => !current)}>{paused ? 'Resume' : 'Pause'}</button></div>
    </div>
    <p className="review-source-note">Paraphrased from the College Boy Cheesesteaks Google Maps listing, retrieved September 25, 2026. No Yelp reviews were collected.</p>
  </section>;
}
