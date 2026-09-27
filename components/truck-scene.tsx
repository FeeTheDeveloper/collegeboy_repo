/**
 * Review illustration of the truck at service. Exactly two people by design
 * (tests/visual-requirements.test.ts). It is a stylized representation, not a
 * photograph or likeness of any named person. The SVG pauses its steam under
 * prefers-reduced-motion, so the static frame is the fallback.
 */
export function TruckScene() {
  return <figure className="truck-scene">
    {/* A plain <img> keeps the SVG's own reduced-motion rule and costs no JS. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/media/illustrations/truck-scene.svg" width={1200} height={700} loading="lazy" decoding="async"
      alt="Illustration of the red College Boy Cheesesteaks truck open for service at dusk: a woman in a red head wrap leads at the window with a wrapped cheesesteak while a Black man works the grill behind her." />
    <figcaption>Illustration for review — not a photograph of a specific event or staff member.</figcaption>
  </figure>;
}
