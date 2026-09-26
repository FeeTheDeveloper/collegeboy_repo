import type { Metadata } from 'next';
import { OpeningPlayer } from '@/components/opening-player';

export const metadata: Metadata = { title: 'The Arrival', alternates: { canonical: '/opening' } };

export default function OpeningPage() {
  return <main><h1 className="opening-visually-hidden">College Boy — The Arrival</h1><OpeningPlayer />
    <p className="opening-review-note">An animated College Boy brand film. Narration: “College Boy Cheesesteaks. Real Philly cheesesteaks. From real Philadelphians.” <a href="/media/college-boy-opening-branded.mp4" download>Download branded video</a>.</p>
  </main>;
}
