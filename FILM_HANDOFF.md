# College Boy film experience

The homepage has an editorial film section and a dismissible invitation that appears after the hero scrolls out of view. The invitation waits until existing welcome overlays have cleared, stays hidden while the film section is visible, and respects session dismissal. It never starts audio automatically.

The invitation and film cover open a native modal dialog. Escape and the close button dismiss it, playback stops, scrolling is restored, and focus returns to the opener or the film cover. `/film` provides a directly accessible story page with the same player, pickup ordering, and catering navigation.

## Media

Source: user-supplied `College Boy Media.MP4`, 1080 x 1596 HEVC, approximately 95.57 seconds and 135 MB. The master is unchanged.

Both web versions use a 720 x 1064 H.264 picture with fast-start metadata and AAC audio. The enhanced mix uses ElevenLabs `audio_isolation` followed by `highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11`. Original speaker identities, timing, burned-in captions, and source attribution are retained. No cloned or substitute narrator was created. The player allows comparison with the original audio and preserves playback position when changing mixes.

Processing flow: https://elevenlabs.io/app/flows/jVibkF26RQPTt29uugY8

Exact isolation instruction: "Isolate the original spoken dialogue from background noise and music while preserving each speaker and timing."

The video source is only loaded after playback is requested; the homepage loads a poster rather than downloading the full clip. The films are local assets under `public/media/`. Before eventual production publication, listen to both mixes end-to-end and confirm family and third-party footage approval. Burned-in captions cannot be switched off or read by assistive technology; a separately verified WebVTT track remains a potential accessibility improvement. The automatic transcript has recognition errors and is not used as website copy.

## Verification

- Production build and TypeScript passed; the new player and route passed ESLint.
- Browser playback confirmed for the enhanced film; duration is 95.566667 seconds.
- Modal opening, Escape dismissal, focus return, scroll restoration, scroll invitation, and dismissal verified in Chrome.
- Mobile modal checked at 390 x 844; it fits the viewport and begins paused. Original-audio switching was exercised during playback.
- Encoded enhanced audio measured -16.25 LUFS integrated and -1.28 dBTP. Enhanced video is 32,240,021 bytes; original-audio comparison is 32,199,398 bytes.
- An end-to-end subjective listening review is still needed before describing the narration as final.
