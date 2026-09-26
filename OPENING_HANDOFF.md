# College Boy cinematic opening

## Deliverables

- `/opening`: replay page, paused by default; user-controlled sound.
- Homepage: same player in the existing first-visit dialog; muted automatically, once per session, 2-second final hold, immediate Enter and Escape dismissal.
- `public/media/college-boy-opening.mp4`: 8-second, 1280 × 720 H.264/AAC web movie, approximately 3.1 MB.
- `public/media/college-boy-opening-branded.mp4`: 10-second standalone movie with baked logo/slogan, approximately 2.8 MB.
- `public/media/college-boy-opening-headon.png`: generated source-inspired front-facing keyframe.
- `public/media/college-boy-opening-poster.jpg`: first-frame poster.
- `public/media/college-boy-opening.vtt`: English captions. The player also displays the short narration in its status line.

## Direction and provenance

The signature is the actual red step van approaching head-on, turning onto a fictional palm-lined strip, and lifting its service hatch. The final reveal reuses the existing Canva truck mark with “Real Philly Cheesesteaks. From Real Philadelphians.” Source photo remains untouched. The animated vehicle is a stylized interpretation, not an exact 3D scan or documentary event.

Frontend Design Premium and upstream frontend-design guided brand-specific motion, shared player ownership, readable type, keyboard controls, and reduced-motion handling. Mobbin was queried but returned a paid-plan requirement; no Mobbin reference was used.

Keyframe: built-in image-generation tool, not API/CLI fallback. Saved from generated image `01a0db38-4db5-7552-9f5c-c40dcf0ad017`.
Prompt direction: convert the supplied side-view photo into a straight head-on view of the same red food step van, central 28% of a 16:9 frame, warm headlights, palm-lined Los Angeles shopping strip at blue hour, clean enamel and silver details, empty street, no screenshot UI, no added title card.

Video/audio flow: https://elevenlabs.io/app/flows/CXDWWrVwhT2lvNjFxEYE
Final video generation: `3Ne3wp7oiv8HvV8CeEms`, Veo 3.1 Fast. The earlier side-on draft was rejected and is not shipped.
Narration generation: `BSEnHGS2oRq7zfTs3kjv`, ElevenLabs Multilingual v2, premade Brian voice `nPczCjzI2devNBz1zQrb`. No voice cloning.
Spoken text: “College Boy Cheesesteaks. Real Philly cheesesteaks. From real Philadelphians.”
Narration begins at 2.5 seconds; engine/music bed is attenuated, narration normalized, output limited. Alternate speech takes remain on the flow.

### Final video prompt

Animate this exact starting frame as an 8-second premium cinematic brand ident. Preserve the red COLLEGE BOY CHEESESTEAKS food step van and this beautiful palm-lined Los Angeles shopping street at blue hour. 0-2 seconds: the truck drives smoothly directly toward the low centered camera HEAD ON, tires rotating, headlights warm, growing larger but whole vehicle remains in frame. 2-4 seconds: truck makes a gentle turn to its right and parks alongside curb, camera smoothly arcs to show its long red passenger service side in three-quarter view. 4-6 seconds: once fully stopped the truck's rectangular side serving hatch swings upward on top hinges and a brushed-metal counter folds down; warmly lit kitchen opens for service. 6-8 seconds: camera settles, truck stationary with open hatch, headlights and kitchen light glowing, wide composition with clear negative space. Cinematic coherent mechanical motion, glossy red enamel, black underbody, silver exhaust, restrained 3D commercial finish, ivory College Boy lettering stays stable. Empty street, no people. Audio only: gentle engine then soft brake hiss, hatch click, subtle warm musical sting, NO speech. No title cards, no extra subtitles or floating lettering. This is an opening animation, NOT a static side-view pan.

## Reproduction

`powershell -NoProfile -File scripts/render-opening.ps1`

Requires Python imageio_ffmpeg already installed here, Windows Impact/Arial fonts, and the ignored source files `output/college-boy-opening/arrival-headon-master.mp4` and `narration.mp3`. The script encodes the web movie, extracts the poster, and makes the branded export. It does not regenerate provider media or spend credits.

## Behavior

- Native modal provides focus trapping and Escape; cleanup restores scrolling and prior focus.
- Reduced-motion and Save-Data visitors bypass the automatic opening. Replay is explicitly user initiated.
- Autoplay is muted. Sound starts only by clicking Restart with sound, which restarts the whole sequence.
- Pause, replay, tab-background pause, loading timeout, and media-error entry fallback are included.
- Mobile retains the complete widescreen truck rather than cutting off the turn.
- The original header/catering logo and ordering destinations remain unchanged.

## Verification

- Production build and TypeScript passed with the new `/opening` route.
- ESLint passed.
- Premium strict static audit: zero findings; JSON in ignored working output.
- DESIGN.md lint: zero errors, five existing orphan-token warnings.
- Browser: 390 × 844 layout has no horizontal overflow; playback completed at 8.009 seconds; opt-in sound and paused state observed.
- Homepage Escape closed the dialog, restored body overflow, and returned focus to the home link.
- Emulated reduced motion omitted both the opening dialog and its video.
- Generated contact sheets were inspected for approach, turn, and hatch opening; standalone final card inspected.

No production deployment was performed. Final subjective audio review and client sign-off remain appropriate before publication.
