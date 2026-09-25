---
version: alpha
colors:
  primary: "#e51b2b"
  ink: "#130f0f"
  coal: "#211919"
  truckRed: "#e51b2b"
  deepRed: "#a30c19"
  breadCream: "#f8efdf"
  cheeseGold: "#ffcc45"
  white: "#fffdf8"
  muted: "#766b65"
typography:
  display:
    fontFamily: "Anton, Impact, sans-serif"
  utility:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
  body:
    fontFamily: "Inter, Arial, sans-serif"
rounded:
  DEFAULT: "0px"
spacing:
  section: "clamp(5rem, 9vw, 9rem)"
components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.DEFAULT}"
  card:
    backgroundColor: "{colors.breadCream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
---

# College Boy Cheesesteaks design direction

## Overview

This is a hybrid brand and lightweight customer-account experience. It should feel like standing beside the red truck with a printed order ticket in hand: bold, direct, useful, and unmistakably College Boy. The memorable signature is the four-stage “Earn Your Degree” menu path. The About section extends that idea with a dignified graduation portrait and a documentary family-truck photograph. Restraint wins everywhere else.

Avoid generic startup gradients, rounded SaaS cards, luxury-steakhouse styling, fabricated social proof, and decorative academic motifs that do not help customers order.

## Colors

Runtime tokens live in `app/globals.css`. Truck red owns calls to action and large brand fields. Cheese gold is a sparing highlight for the hero thesis, focus states, and first-visit invitation. Bread cream is the reading surface; ink provides high-contrast structure.

## Typography

Anton carries short, oversized display lines. Barlow Condensed behaves like an order ticket for navigation, labels, and controls. Inter carries body copy and form text. Next.js font loading reserves metrics and prevents layout shifts.

## Layout

Desktop uses strong split frames and wide editorial sections. Mobile collapses to a single reading column with ordering actions kept visible. Square edges, dark rules, and offset shadows reinforce the truck graphics without imitating them literally.

## Elevation & Depth

Use hard offset shadows only for actionable or temporary surfaces: the location card, signup form, and first-visit invitation. Avoid soft ambient shadows.

## Shapes

Corners remain square. The single rotated ticket and slightly rotated CB seal provide controlled imperfection.

## Components

The global scrollbar, focus ring, buttons, cards, form states, and reduced-motion fallbacks are defined in `app/globals.css`. Clerk owns authentication controls when configured. The site-owned subscription form never claims success unless the server confirms a Supabase write.

## Do's and Don'ts

- Do preserve `noindex` until client-approved production cutover.
- Do use only approved, source-recorded media and verified review excerpts.
- Do keep order destinations explicit and external.
- Do keep stale schedule information out of the “current stop” surface.
- Don't publish family photographs, Kevin material, or memorial copy without documented family approval.
- Don't mix College Boy subscriber data into another Fee The Developer client or company project.
