# College Boy Cheesesteaks — GitHub handoff

This is the source of the private review site published September 24, 2026. It is a static single-page site: `dist/index.html`, `dist/styles.css`, `dist/site.js`, and six optimized images in `dist/assets/`. `DESIGN.md` records the visual direction. The Sites manifest is at `.openai/hosting.json` and identifies the private review project; remove or isolate it if adopting another deployment platform. Do not replace the client's live domain until approved.

## Local preview

Serve `dist/` as the web root with any static server, for example `python3 -m http.server 8080 --directory dist`; visit `http://localhost:8080/`. The CSS and JS paths are rooted at `/`.

## Confirm before client launch

- Client approves public-site image usage rights, copy, and brand treatment.
- Owner confirms exact current menu and prices; current preview directs people to checkout for prices.
- Owner provides and maintains a verified schedule source; current preview links Instagram instead of inventing stops.
- Confirm Square, Uber Eats, DoorDash, Instagram, info@ and catering@ destinations; test actual ordering and inbox delivery.
- Confirm active phone and public address strategy; neither is shown in the preview because the audit found conflicting details.
- Agree on a catering lead form service or keep email inquiry; no backend form is in this static review version.
- Family approves any Kevin tribute and family photos before adding them. No private family photos are included here.
- Replace `noindex,nofollow` only after the production cutover and complete metadata/structured-data review.
- Create redirects from existing Wix routes, including `/projects-2` and `/contact-8`, after the destination pages are agreed.

Client accounts, content, repository, and deployment ownership stay separate from Fee The Developer and Happy Ice.
