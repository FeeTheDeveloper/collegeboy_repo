# College Boy public-page rebuild

## Reference and College Boy mapping

The Tropic Truck homepage and catering page were inspected in Chrome on October 1, 2026. The structural reference is a single header, full-height video hero, three large image links, a direct action band, signup area, photo strip, and footer. Its catering flow starts with a truck-image hero and jumps directly to a form, followed by a brief reasons section and another inquiry link. No Tropic Truck media, text, code, colors, or brand assets were imported.

College Boy now has direct `/`, `/menu`, `/find`, `/order`, `/story`, and `/catering` pages with shared header and footer. The homepage uses the local `college-boy-opening.mp4` as a muted video background with poster and reduced-motion fallback. The red truck poster, official menu images, and existing family portrait fill the image spaces. The existing `/opening`, `/film`, `/careers`, and `/subscribe` routes remain available. Legacy `/projects-2` and `/contact-8` links redirect to `/menu` and `/catering`.

The arrival video is an eight-second generated College Boy concept, not documentary footage. The `/film` page contains separate supplied footage with family and third-party material; production rights review is still recorded in `ASSET_MANIFEST.md`. An ElevenLabs replacement was not generated because the local arrival video fills the requested hero space. If a more realistic film is commissioned, confirm a shot list and rights for any reference image before replacing it.

## Form and publishing gates

The catering form is **not connected**. See `docs/CATERING_HANDOFF.md` for the exact recipient confirmation, sender, and server environment setup. The shared newsletter section also remains disabled until a dedicated College Boy Supabase project and unsubscribe flow are configured. No inquiry or subscriber data is sent to another client project.

This is a local review build. No Vercel project, deployment, domain, or external provider was changed. Confirm inbox monitoring, media rights, and final client review before a production cutover.
