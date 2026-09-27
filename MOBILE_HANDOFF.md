# College Boy mobile and app surface

Everything in this document is about the phone experience: how the site behaves as an installed app, how it handles notches and keyboards, and how the two films play on real networks.

## Home-screen identity

`app/manifest.ts` is the web manifest. It declares `display: standalone`, the ink theme colour `#130f0f`, the cream launch background `#f8efdf`, three icons, and shortcuts to Find the truck, Order, the menu, and the film. Android uses it for installation and the adaptive icon; iOS pairs it with `appleWebApp` in `app/layout.tsx` for the home-screen name and a translucent status bar.

Icons are generated, not hand-drawn:

```sh
node scripts/generate-app-icons.mjs
```

That script renders the truck mark from SVG shapes (no font dependency) and writes `app/icon.png`, `app/apple-icon.png`, `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/icon-maskable-512.png`, and the 1200 x 630 share card `app/opengraph-image.jpg`. The maskable icon keeps its art inside the Android safe zone. Re-run the script after a brand change and commit the output.

Before this pass the site shipped no icons, no manifest, and no share image: Android offered a screenshot icon, iOS a page snapshot, and links pasted into a message showed nothing.

## Viewport and platform settings

`viewport` in `app/layout.tsx` sets `viewport-fit=cover`, `interactive-widget=resizes-content`, `theme-color: #130f0f`, and `color-scheme: light`. Pinch zoom is deliberately left enabled.

Because the viewport covers the notch, every fixed or full-bleed element pads itself with `env(safe-area-inset-*)`: the sticky header, the footer, the skip link, the mailing-list card, the film invitation, and both bands of the opening film. A single `--header-h` custom property (88px, 76px under 640px) drives the header height, the hero height, and `scroll-padding-top`, so anchor links land below the header instead of under it.

Also handled: iOS landscape text inflation (`text-size-adjust`), the Android tap flash (`-webkit-tap-highlight-color`), hover styles that used to stick after a tap (`@media (hover: none)`), 16px form inputs so iOS does not zoom on focus, and `overflow-x: clip` so nothing drifts sideways.

## Navigation

Below 1180px the desktop nav is hidden. It previously had no replacement, so phones and tablets reached the menu, catering, about, and mailing-list sections only by scrolling. `components/mobile-nav.tsx` adds a Menu button that opens a modal `<dialog>` sheet with the same links (`lib/nav-links.ts` is the shared source), the pickup CTA, Instagram, and the auth controls. Escape, the backdrop, and link selection close it; focus returns to the button; the page behind it cannot scroll.

## Video

Both players are hardened for phones rather than desktops:

- Autoplay refusal, a slow network, and a broken file are now three separate states. A phone holding autoplay says so and offers Play; a stalled download offers Try again; only a real media error says the film could not load. The previous fixed eight-second timer reported "could not load" for all three.
- Stall detection watches for silence (no `progress` for 12 seconds, or 4.5 seconds before it admits the connection is slow) instead of a deadline, so a slow phone keeps waiting.
- The opening film is muted through both the property and the attribute before first play, which is what iOS requires for an unattended start.
- The cinematic intro is skipped entirely on save-data, 2G, and offline devices.
- The brand film preloads metadata (duration and first frame) but downloads nothing more until play, and drops to `preload="none"` with a stated 31 MB weight on a save-data or slow connection.
- Both players allow AirPlay, so an iPhone can hand the film to a TV.
- `/media/*` is served with `public, max-age=604800, stale-while-revalidate=2592000`, so a repeat visit replays from the device. Media extensions are excluded from the proxy matcher in `proxy.ts` so range requests never pass through auth.

Codecs were checked and are already universal: H.264 High 3.1 with AAC and fast-start metadata in all four MP4s.

## Still open

The brand film is 31 MB per audio mix at 720 x 1064. That is the largest remaining risk to seamless mobile playback: on a slow 4G connection the first play can take 30 seconds or more. Two options, in order of preference:

1. Serve adaptive streaming (HLS) through a video host, so the phone picks its own rung.
2. Ship a mobile rendition beside the current file and select it on `connection.effectiveType`, for example
   `ffmpeg -i college-boy-film-enhanced.mp4 -vf scale=-2:720 -c:v libx264 -crf 27 -preset slow -c:a aac -b:a 96k -movflags +faststart college-boy-film-enhanced-mobile.mp4`,
   which should land near 8 MB.

Neither was done here: the only ffmpeg on this machine is a stripped Playwright build without H.264 support, and re-encoding brand footage is a client decision.

## Verification

Chromium via Playwright, production build (`next start`), iPhone 15 Pro, Pixel 7, 360 x 740, 320 x 568, and 844 x 390 landscape.

- No horizontal overflow at any of those widths; the header stays one row (76px) down to 320px.
- Menu sheet: opens, locks background scroll, closes on Escape, backdrop, and link selection, returns focus to the button, and `#menu` lands 86px down against a 76px header.
- Film dialog on a phone: opens, fits the viewport, reports its 1:35 duration from metadata, closes cleanly.
- Opening film failure paths, forced in the browser: blocked autoplay shows "Your phone is holding autoplay" with a Play button; an aborted source shows the error with Try again; Try again after the network returns resumes playback.
- Every interactive control measures at least 40px tall on a touch pointer.
- Range requests return 206 with the expected `Content-Range`; media and icons carry the long cache header.
- `npm run build`, `npx tsc --noEmit`, and `npx eslint .` are clean, with and without Clerk keys present.

Not verified here: real iOS Safari and real Android Chrome. Chromium emulation does not reproduce iOS Low Power Mode, Safari's dialog quirks, or true home-screen installation, so install the site on one iPhone and one Android handset during preview review.
