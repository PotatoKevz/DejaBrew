---
status: final
updated: 2026-08-27
colors:
  latte: "#E8DAB2"
  ink: "#333333"
  amber: "#f0a500"
  amber2: "#ffb52e"
  cream: "#FFF8F0"
  paper: "#fdfbf7"
  muted: "#8a7a66"
  line: "#e7ddd0"
typography:
  heading: "Playfair Display"
  body: "Inter"
  hero: "4.5rem / 1.05"
rounded:
  card: "12px"
  image: "16px"
  pill: "999px"
spacing:
  heroGap: "48px"
  cardGap: "22px"
components:
  - navbar sticky + progress 3px #f0a500
  - menu-card 220px image-first + pill #333 + tag latte + shadow -4px hover
  - mood-card 260px + filter-pill active #333
---

# DESIGN.md — Enhanced Deja Brew

## Brand & Style
Warm editorial café, not template. Dark ink hero with latte text + radial latte wash, cream paper, latte badge, amber progress. Editorial headlines, human body, tactile surfaces.

## Colors
- **Latte #E8DAB2** hero h1, badge, tag, btn-primary
- **Ink #333/#333333** navbar, dark hero bg, price-pill, active tab
- **Amber #f0a500** progress, hover, secondary amber #ffb52e
- **Cream #FFF8F0** card bg (replaces #f8f8f8), **Paper #fdfbf7** page, **Muted #8a7a66**, **Line #e7ddd0**
- Shadows `0 14px 36px rgba(51,51,51,.11), 0 2px 8px rgba(51,51,51,.06)` hover `0 20px 42px...`

## Typography
- Headlines Playfair Display 600/700, 4.5rem tight (2.6rem at 768px), -0.02em
- Body Inter 400/500/600/700, 1.15rem hero p, 0.85rem pill/tag
- Preconnect `fonts.googleapis.com` + `fonts.gstatic.com` crossorigin, display=swap

## Layout & Spacing
- Hero split 48% copy / 52% visual (380px, 280px at 768px), gap 48px, badge -16px bottom 18px
- Values ribbon flex 3, card 12px, menu-grid flex wrap gap 22px, card 30% (100% at 768px)
- Footer grid 3-col → column at 768px, cart drawer 380px (320px at 768px)

## Elevation & Depth
- Cards `var(--shadow)` → `var(--shadow-hover)` on `-4px` lift, 0.2s ease; progress width 0.15s linear; drawer transform 0.25s ease

## Shapes
- Cards `12px`, images `16px 16px 0 0` (card overflow hidden), hero visual `16px`, pills `999px`, filter-pill `999px`

## Components
- **Navbar** sticky top 0 z10, latte icon, amber hover, progress 3px #f0a500 absolute bottom
- **Menu card** image-first 220px cover, price-pill ink 6/12 999 700, tag latte 4/8 uppercase 0.7rem, sensory ≤8w, origin/roast/tasting 0.75rem muted
- **Mood card** 260px 12px white border line shadow, hover -2px, role=button tabindex 0
- **Filter pill** white line → active ink white
- **Cart drawer** 380px fixed right translateX 100% → 0 open, backdrop rgba 0,0,0,.2 z19

## Do's and Don'ts
- Do use `Menuuu.jpg` only at 5% overlay on cream, not full cover
- Do pill prices, never `<u>`
- Do single `style.css` tokens, JS only width/transform
- Don't second stylesheet or inline colors
