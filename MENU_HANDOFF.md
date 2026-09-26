# Menu imagery and delivery handoff

Four source-inspired AI menu previews are installed in `public/media/`: `menu-cheesesteak.webp`, `menu-chicken.webp`, `menu-fries.webp`, and `menu-takeaway.webp`. Each is 1000 × 1000 WebP (approximately 182–225 KiB). Originals and other existing artwork remain untouched.

The imagery is conceptual styling, not proof of exact portions or current ingredients. A visible preview disclosure accompanies the cards. The chicken photo represents that category without inventing a vegetarian dish; fries represent the sides category without inventing a drink.

## Ordering

`components/delivery-tabs.tsx` implements Pickup, Uber Eats and DoorDash with roving keyboard focus, arrow/Home/End navigation, associated panels and explicit external checkout links. Existing provider destinations are preserved. Uber Eats returned all items out of stock and DoorDash returned inactive on the September 25, 2026 check; these are not live app statuses. The interface says check availability and never fabricates times, fees or prices. Square checkout availability was not confirmed.

Mobbin discovery returned a paid-plan requirement; no Mobbin reference was used. Fee The Developer and Frontend Design Premium guided source tracking and the existing visual system. No publication was performed.

## Verification

- Production build passed with the menu components integrated.
- ESLint and TypeScript passed.
- Frontend Design Premium strict static audit: zero findings.
- Browser confirmed all four card images loaded and exactly one delivery panel is visible.
- ArrowRight moved focus and selection from Uber Eats to DoorDash; Home returned both to Pickup.
- Mobile viewport 390 × 844 had document width 390, with no horizontal overflow; desktop also had no horizontal overflow.
- Selected DoorDash panel retained the existing brand-specific external destination.

## Reproduction prompts

Generated with the built-in image tool using the source photo indicated below; converted with sharp to WebP quality 85, without further creative editing.

### menuSteak

Source: `C:/Users/uveav/OneDrive/Documents/GitHub/collegeboy_repo/public/media/college-boy-cheesesteak-feast-enhanced.png`

Use case: ads-marketing. Create a premium editorial restaurant menu-card photograph, square 1:1, no words, no logos, no typography, no app controls, no people. Coordinated College Boy food photography: charcoal tabletop, red-and-ivory checker deli paper, warm side light, natural appetizing texture, restrained shallow depth of field, clean commercial composition with food entirely within central 85% for responsive crops. Preserve realistic portion size and the character of the supplied food rather than inventing extravagant ingredients. Reference is the actual supplied beef cheesesteak meal. Recompose its two beef cheesesteak halves as the central hero, cross sections facing viewer, soft golden hoagie, chopped steak and melted cheese as pictured; a few of its thick golden fries at edge. Remove ketchup packets and clutter. Close three-quarter camera angle. Do not add peppers or extra sauces.

### menuChicken

Source: `C:/Users/uveav/OneDrive/Documents/GitHub/collegeboy_repo/public/media/spicy-chicken-cheesesteak.png`

Use case: ads-marketing. Create a premium editorial restaurant menu-card photograph, square 1:1, no words, no logos, no typography, no app controls, no people. Coordinated College Boy food photography: charcoal tabletop, red-and-ivory checker deli paper, warm side light, natural appetizing texture, restrained shallow depth of field, clean commercial composition with food entirely within central 85% for responsive crops. Preserve realistic portion size and the character of the supplied food rather than inventing extravagant ingredients. Reference is the supplied chicken cheesesteak hoagie. Recompose the same two cut halves with chicken chunks, grilled onions, lettuce, tomato and light sauce as pictured. Remove the hand, face inset, all captions, condiment bottles and kitchen clutter. Put the halves on checker deli paper over charcoal counter. Match food proportions, visible fillings and warm appetizing bread. Three-quarter product photo. No other sandwich or fabricated vegetarian dish.

### menuFries

Source: `C:/Users/uveav/OneDrive/Documents/GitHub/collegeboy_repo/public/media/college-boy-cheesesteak-feast-enhanced.png`

Use case: ads-marketing. Create a premium editorial restaurant menu-card photograph, square 1:1, no words, no logos, no typography, no app controls, no people. Coordinated College Boy food photography: charcoal tabletop, red-and-ivory checker deli paper, warm side light, natural appetizing texture, restrained shallow depth of field, clean commercial composition with food entirely within central 85% for responsive crops. Preserve realistic portion size and the character of the supplied food rather than inventing extravagant ingredients. Use only the thick-cut golden fries from the reference as the featured food: a generously filled shallow paper food tray lined with red and ivory checker paper. Crisp golden edges and natural salt crystals, realistic thick fry shape matching source. No sandwich, no sauces, no toppings, no drink. Low three-quarter macro editorial food photo. This image represents the sides category.

### menuPickup

Source: `C:/Users/uveav/OneDrive/Documents/GitHub/collegeboy_repo/public/media/college-boy-cheesesteak-feast-enhanced.png`

Use case: ads-marketing. Create a premium editorial restaurant menu-card photograph, square 1:1, no words, no logos, no typography, no app controls, no people. Coordinated College Boy food photography: charcoal tabletop, red-and-ivory checker deli paper, warm side light, natural appetizing texture, restrained shallow depth of field, clean commercial composition with food entirely within central 85% for responsive crops. Preserve realistic portion size and the character of the supplied food rather than inventing extravagant ingredients. A tasteful takeaway meal arrangement inspired by the reference: an open cream paper food box with the same beef cheesesteak halves and thick golden fries in checker paper, alongside a small plain folded kraft takeaway bag. A little pulled-back three-quarter view. No branding printed on bag, no text, no stickers or utensils or drinks. The food should be attractive and believable, not oversized. This conceptual category image represents building a pickup order.
