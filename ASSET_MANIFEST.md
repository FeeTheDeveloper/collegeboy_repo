# Asset permission manifest

> **Repository visibility:** this repository is **public**. Anything committed here is published. Do not commit an asset until its rights and subject consent are recorded below.

> **September 30, 2026 approval update:** The user confirmed all approvals for the requested home-page changes. The existing inspiration portrait is retained and shown without the draft marker; its mobile presentation now shows the full image above the copy. The catering review illustration is removed from the page. No new asset was added.

## Rights register — September 27, 2026 (current site)

| Asset | Placement | Source | Rights status | Subject approval |
| --- | --- | --- | --- | --- |
| `college-boy-cheesesteak-feast-enhanced.png` | Hero, order panel, app icon source | AI-enhanced from a College Boy Instagram export | Reference until College Boy confirms reuse | No people |
| `menu-cheesesteak.webp` | Menu card 01 | AI-styled from the supplied cheesesteak photo | Pending College Boy confirmation | No people |
| `menu-chicken.webp` | Menu card 03 | AI-styled from `spicy-chicken-cheesesteak.png` (College Boy post, supplied via Dropbox) | Pending College Boy confirmation | No people |
| `illustrations/mushroom-cheesesteak.svg` | Menu card 02 | Drawn for this build (Fee The Developer) | Fee The Developer original; replace with Josette's photo | No people |
| `illustrations/fries-bottled-lemonade.svg` | Menu card 04 | Drawn for this build | Fee The Developer original; replace with Josette's photo | No people |
| `illustrations/truck-scene.svg` | Unused; removed from Catering | Drawn for this build | Fee The Developer original | Two stylized, unnamed figures; not likenesses |
| `illustrations/graduation-cap-2015.svg` | Unused; removed from Story | Drawn for this build at Josette's request | Fee The Developer original | Decorative; implied Kevin's 2015 graduation |
| `college-boy-inspiration-silhouette.png` | Story | AI-edited from the supplied headshot of Kevin | Supplied by King Fee; user confirmed approvals September 30, 2026 | Approval confirmed by user September 30, 2026 |
| `college-boy-family-owners-enhanced.png` | Story | AI-enhanced from supplied family photo | Supplied by King Fee for demo | **Each pictured person's consent pending** |
| `college-boy-film-*.mp4`, `college-boy-film-poster.jpg` | Film | Supplied `College Boy Media.MP4` | Supplied for local build | **Family footage and third-party creator footage (poster shows “grubbingwithmagno”) need permission** |
| `college-boy-truck-logo-v2.png` | Header, icons | Canva interpretation of the truck | Local build; trademark review not done | No people |
| `college-boy-opening*.mp4/png/jpg` | Opening film | Generated from the truck photo | Local build | No people |

Retired September 27 (Josette): `college-boy-menu-chicken-veggie.png` (seeded rolls), `college-boy-menu-fries-drinks.png` (lemonade in a cup), `college-boy-menu-cheesesteak.png` (fully generated). Deleted from the working tree; they remain in Git history.

Unused files still in the tree (not shown on the site): `college-boy-cheesesteak-feast-source.jpg`, `college-boy-opening-headon.png`, `college-boy-truck-showtime.png` (its truck wrap shows the out-of-service phone number), `menu-fries.webp`, `menu-takeaway.webp`, `spicy-chicken-cheesesteak.png`.

## Earlier records


## Truck identity — September 25, 2026

### Cinematic opening

The user requested a head-on arrival, curbside setup, slogan, and ElevenLabs intro. `college-boy-opening-headon.png` is a built-in image-generation interpretation of the supplied truck, not documentary photography. ElevenLabs Veo 3.1 Fast animates that keyframe into the approved local-build concept; original source files are unchanged. The animated vehicle is a stylized approximation rather than a mechanically exact reconstruction.

| Asset | Use | Source |
| --- | --- | --- |
| `college-boy-opening-headon.png` | Head-on keyframe | Built-in image generation, source truck reference |
| `college-boy-opening.mp4` | Homepage and `/opening` player | 8-second generated scene with mixed narration; 1280 × 720 H.264/AAC |
| `college-boy-opening-branded.mp4` | Standalone download | 10-second export with baked logo and slogan |
| `college-boy-opening-poster.jpg` | Video placeholder | First frame of final animation |
| `college-boy-opening.vtt` | Caption track | Short narration script and approach sound cue |

ElevenLabs flow: https://elevenlabs.io/app/flows/CXDWWrVwhT2lvNjFxEYE . Final video generation `3Ne3wp7oiv8HvV8CeEms`; narration `BSEnHGS2oRq7zfTs3kjv`, premade Brian voice. No voice cloning. Source masters and unused draft remain in ignored `output/college-boy-opening/`. See `OPENING_HANDOFF.md` for prompts, reproduction, and verification. Production publication still requires approval.

- Source: user-supplied `public/media/college-boy-truck-showtime.png`, unchanged.
- Website asset: `public/media/college-boy-truck-logo-v2.png`, transparent 1600 × 807 PNG. Canva-generated interpretation of the supplied truck, refined to simplified red, ivory, charcoal, and silver shapes; this is raster artwork, not an editable vector.
- Final Canva media: `MAHWQum5KR8`, derived from generated master `MAHWQuFL174` with background removal. https://www.canva.com/M/MAHWQum5KR8
- Placement: shared `TruckLogo` component in navigation, catering, and first-visit opening. Opening can be skipped, dismissed with Escape, and is omitted for reduced-motion visitors.
- Authorized for this local implementation by the user's explicit logo request. No production deployment or trademark clearance is implied.

The food photograph supplied directly for this build is committed below. Family and memorial material remains excluded pending the specific approval required by the project handoff. Large video originals remain outside Git until an approved delivery/transcoding plan is chosen.

| Handoff file | Intended placement | Source stated in handoff | Permission status | Approver |
| --- | --- | --- | --- | --- |
| `hero.webp` | Hero | Wix-origin image | Pending | Pending |
| `doctorate.webp` | Menu feature | Wix-origin image; zero-byte handoff file | Pending | Pending |
| `fries.webp` | Menu support | Wix-origin image | Pending | Pending |
| `lineup.webp` | Catering | Wix-origin image; zero-byte handoff file | Pending | Pending |
| `lifestyle.webp` | Story | Wix-origin image | Pending | Pending |
| `hoagie.webp` | Unassigned | Wix-origin image | Pending | Pending |
| `spicy_chicken_cheesteak_.png` | Home hero | User-supplied Dropbox upload | Supplied for this site build | King Fee/client confirmation before production |
| `college-boy-cheesesteak-feast-source.jpg` | Source for food-photo enhancement | User-supplied Instagram export `ig_purplppleatr69_DdHQsD5mwrN_001_image.jpg` | Supplied for local site build; production rights confirmation pending | King Fee/client confirmation before production |
| `college-boy-cheesesteak-feast-enhanced.png` | Home hero / food showcase | AI-enhanced derivative of the supplied Instagram export above | Local demo asset; production rights and final approval pending | King Fee/client confirmation before production |
| `collegeboy_headshot.png` | About-section inspiration portrait | User-supplied Dropbox upload | Authorized by user for local demo transformation | Final family wording/production approval pending |
| `family_shot.png` | About-section family owners portrait | User-supplied Dropbox upload | Authorized by user for local demo enhancement | Final production approval pending |
| `college-boy-inspiration-silhouette.png` | About-section background | AI-edited from supplied headshot | Local demo approved; identity preserved | Final production approval pending |
| `college-boy-family-owners-enhanced.png` | About-section owners image | AI-edited from supplied family photo | Local demo approved; identities preserved | Final production approval pending |
| `College Boy Media.MP4` | Possible brand video | User-supplied Dropbox upload, 135 MB | Editorial/rights review pending | Pending |
| `promo_.mov` | Possible brand video | User-supplied Dropbox upload, 323 MB | Editorial/rights review pending | Pending |

Before adding an asset, record its original source URL or family source, intended placement, ownership/photographer permission, identifiable-person consent where applicable, approval date, and approver.

## Menu placeholder replacement — September 25, 2026

The menu showcase now uses generated local-demo food photography for the three category cards. The fourth order card and provider panel use the existing supplied cheesesteak feast image. These visuals are illustrative and do not establish current availability, ingredients, pricing, or production publication approval.

| Asset | Intended placement | Source | Permission status |
| --- | --- | --- | --- |
| `college-boy-menu-cheesesteak.png` | Cheesesteaks menu card | Built-in image generation from the College Boy visual direction | Local demo asset; client approval before production |
| `college-boy-menu-chicken-veggie.png` | Chicken & veggie menu card | Built-in image generation from the College Boy visual direction | Local demo asset; client approval before production |
| `college-boy-menu-fries-drinks.png` | Fries & drinks menu card; updated with melted cheese on fries | Built-in image generation from the College Boy visual direction | Local demo asset; client approval before production |

## Film integration — September 25, 2026

User supplied `C:\Users\uveav\Dropbox\Fee The Developer\Decals\College Boy\College Boy Media.MP4` and requested an ElevenLabs narration enhancement and scrolling popup experience. This authorizes the local film implementation and provider processing for this task. The source master remains unchanged in Dropbox.

| Asset | Placement | Processing |
| --- | --- | --- |
| `public/media/college-boy-film-enhanced.mp4` | Home film popup and `/film` | 720 x 1064 H.264; ElevenLabs dialogue isolation, 70 Hz high-pass and loudness normalization; original speakers and picture timing retained |
| `public/media/college-boy-film-original.mp4` | Selectable original audio comparison | Same H.264 picture; source audio encoded to AAC |
| `public/media/college-boy-film-poster.jpg` | Film preview and player poster | Still at 01:32 from supplied footage |

ElevenLabs workflow: https://elevenlabs.io/app/flows/jVibkF26RQPTt29uugY8

The footage includes family history and a third-party customer review. The user's current request permits local integration; the existing production approval requirement remains. The burned-in captions and source attribution remain in the picture. Machine transcription is a working reference, not approved marketing copy. Intermediate audio and video are ignored under `output/college-boy-film/`.

Kevin-related photographs and story material require explicit written family approval and client approval before they are added here or published.

## Source-inspired menu previews

## Official menu photos — September 30, 2026

The six menu images below were supplied by the user as official College Boy menu screenshots from `Dropbox/Fee The Developer/Decals/College Boy/`. Each website image is an AI-enhanced crop of its corresponding screenshot: the screenshot caption and floating site controls were removed, the food was reframed, and lighting was polished. The originals remain in Dropbox. These derivatives are for this local site reconstruction; the user identified the source as official but no deployment was requested.

| Menu item | Source screenshot | Local website image |
| --- | --- | --- |
| Cheese Fries | `IMG_2573.jpg` | `public/media/menu-cheese-fries.webp` |
| Hoagie | `IMG_2574.jpg` | `public/media/menu-hoagie.webp` |
| Doctorate | `IMG_2575.jpg` | `public/media/menu-doctorate.webp` |
| Master's | `IMG_2576.jpg` | `public/media/menu-masters.webp` |
| Bachelor | `IMG_2577.jpg` | `public/media/menu-bachelor.webp` |
| Alumni | `IMG_2578.jpg` | `public/media/menu-alumni.webp` |

The earlier generated category previews listed below are historical and no longer appear in the menu.

## Truck mascot icon — September 30, 2026

`public/media/college-boy-truck-logo-v2.png` is the existing full truck mark and remains unchanged. The app and home-screen icons (`app/icon.png`, `app/apple-icon.png`, `public/icons/icon-192.png`, `icon-512.png`, and `icon-maskable-512.png`) are sized derivatives of a polished square edit of that mark. The full red truck, cream lettering and two-wheel profile are preserved. The user confirmed this is a visual identity request, with no audio.

`menu-cheesesteak.webp`, `menu-chicken.webp`, `menu-fries.webp` and `menu-takeaway.webp` were earlier generated editorial previews, not documentary menu photography. They are absent from the current working tree. Full prompts and historical ordering caveats are recorded in `MENU_HANDOFF.md`.
