# College Boy public-page rebuild

This local rebuild simplifies the public route layout: video and main actions first, then the official menu, truck location, approved story, and catering path. `/careers`, `/subscribe`, `/film`, `/opening`, and `/catering` remain direct routes with the same header and footer. Existing account, dashboard, and server endpoints were not repurposed.

The homepage uses the local `college-boy-opening.mp4` animation with captions and the supplied `college-boy-film-enhanced.mp4` footage with user-controlled playback. The six menu images and their names/descriptions are from the supplied official menu assets. The truck and film media are documented in `ASSET_MANIFEST.md`. The film includes family and third-party footage, so production use still needs the documented rights review. The arrival video is an animated concept, not documentary footage.

The Tropic Truck reference was requested for page layering and clarity only. The in-app Browser was unavailable during this implementation and the reference site did not load in the web reader, so no claim of exact visual matching is made. No reference-site assets, code, or copy were imported.

The catering form setup is in `docs/CATERING_HANDOFF.md`. Careers and mailing-list forms retain their existing configuration gates. This change is local only; the user said they will delete and reconstruct the Vercel project, so no deployment or provider mutation was performed.
