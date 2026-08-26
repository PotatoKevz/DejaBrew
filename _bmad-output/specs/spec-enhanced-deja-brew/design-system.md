# Design System — Enhanced Deja Brew

Spec-authored companion for SPEC-enhanced-deja-brew. Downstream MUST read this alongside SPEC.md.

## Palette
- Latte `#E8DAB2` — hero text on dark, card accents, not page background
- Ink `#333333` — navbar, dark hero background `#333`, primary text
- Amber `#f0a500` — hover, progress bar, active pill; `#ffb52e` secondary amber
- Cream `#FFF8F0` — card background (replaces `#f8f8f8`), paper `#fdfbf7` page base
- Muted `#8a7a66` — secondary text; line `#e7ddd0` — borders; shadow `0 14px 36px rgba(51,51,51,.11), 0 2px 8px rgba(51,51,51,.06)`

## Type
- Headlines: `Playfair Display` (fallback: Georgia, serif) — warm editorial, 4.5rem hero, tight `line-height: 1.05`
- Body/UI: `Inter` (fallback: system-ui, Helvetica) — prices, tags, nav, sensory lines
- Scale: hero 4.5rem → h2 2rem → card h3 1.15rem → body 1rem → pill 0.85rem

## Surfaces
- Cards: `background #FFF8F0`, `border-radius 12px`, `shadow` above, `hover: translateY(-4px)` + deeper shadow
- Images: `.menu-img` `height 220px`, `object-fit: cover`, `border-radius 16px (rounded-2xl)`, `width 100%`
- Texture: `Menuuu.jpg` at `opacity 0.05` as overlay on `#FFF8F0`, never as full `background-size: cover` on `#menu`

## Controls
- Pill price: `background #333` or `#E8DAB2` on dark, `color white` or `#333`, `padding 6px 12px`, `border-radius 999px`, `font-weight 600`
- Tabs: `All | Coffee | Pastry` pills, `active` = `#333` bg white text, `inactive` = `#e7ddd0` border
- Progress: sticky `.navbar` + `height 3px` top bar filling with `#f0a500` on scroll
- Mini-cart: slide-out `width 380px` (320px at 768px), `backdrop blur`, `+/-` buttons `32px`, `navbar count` badge `20px` amber

## Hero
- Split layout: left `48%` story + dual CTA (primary `Explore Menu` #333, secondary `Order Pickup` ghost), right `Coffeeshop.jpeg` with floating `Fresh today • ₱85` badge offset `-16px`
- Dark variant: `background #333`, `color #E8DAB2` for hero, light menu `#FFF8F0` below — premium contrast

## Motion
- `transition: all 0.2s ease` for hover lifts, `0.3s` for progress/cart; no large layout shifts
