---
id: SPEC-enhanced-deja-brew
companions:
  - design-system.md
  - menu-catalog.md
  - flows.md
  - ../../planning-artifacts/ux-designs/ux-enhanced-deja-brew-2026-08-27/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-enhanced-deja-brew-2026-08-27/EXPERIENCE.md
  - ../../planning-artifacts/research/domain-specialty-cafe-philippines-2026-08-27/research.md
sources:
  - ../../brainstorming/brainstorm-enhanced-deja-brew-redesign-2026-08-27/brainstorm.html
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Enhanced Deja Brew — Warm Editorial, Story-Fused Redesign

## Why

**Vision to realize + pain to solve.** A first-year static site (`Main.html` → `Menu.html` → `CoffeeOrder.html`/`BakeryOrder.html` → `order-success.html`, `style.css` + Font Awesome, no build) reads as a school assignment — flat `#007bff` buttons, Arial, centered hero on `Background.jpeg`, underlined `<u>` prices, duplicated grids and a broken anchor at `order-success.html:19`. Kevz wants both: a customer experience that feels like a real specialty café and a codebase that earns a portfolio review. The win is a warm, editorial, story-fused site that still ships static (still opens via `Main.html` / `npx serve .`) but demonstrates taste, system thinking, and just-enough interactivity (tabs, LocalStorage cart demo) without a backend.

## Capabilities

- **CAP-1**
  - **intent:** Visitor can perceive a cohesive warm premium café identity rather than a template.
  - **success:** Side-by-side before/after at 768px and desktop passes a 5-second vibe test with 3 of 4 reviewers picking “specialty café over school project”; palette contrast meets WCAG AA for `#333` on `#E8DAB2`/`#FFF8F0`; hero type at 4.5rem, card images 220px cover, rounded-2xl, soft shadow and -4px hover are implemented per `design-system.md`.

- **CAP-2**
  - **intent:** Visitor can follow a single-scroll story journey without hunting across shallow pages.
  - **success:** Landing `Main.html` presents in order hero (split left story + CTA, right `Coffeeshop.jpeg` with floating badge) → values ribbon (Community/Quality/Craft) → featured 3 coffees + 3 pastries → `#about` anchor → contact; About no longer appears as a separate nav item; whole menu cards are clickable with one primary hero CTA.

- **CAP-3**
  - **intent:** Visitor can browse a unified filterable menu with scannable pricing and sensory copy.
  - **success:** One `MenuOrder` view consolidates Coffee + Bakery with tabs `All | Coffee | Pastry` and tag filters (values-as-tags, Gluten Free); prices render as pill `₱XXX`, descriptions are ≤8-word sensory lines, no `<u>` prices; “View Products” duplication removed; grid supports pastry-first ordering option.

- **CAP-4**
  - **intent:** Visitor can stay oriented and trial a cart interaction that remains static.
  - **success:** Sticky `.navbar` shows a thin `#f0a500` scroll-progress bar on long menu; slide-out mini-cart supports +/- quantities, persists to `LocalStorage`, and updates a navbar count — all with no backend and no change to the canonical `Order Now → order-success.html` link.

- **CAP-5**
  - **intent:** Visitor can evaluate menu items as crafted products, not just names and prices.
  - **success:** Each item in `menu-catalog.md` exposes origin, roast level, tasting notes (e.g., Benguet / Medium / chocolate-citrus) and a value tag (Craft/Community); footer exposes opening hours, micro-map dot, and an IG photo strip using real cafe imagery.

- **CAP-6**
  - **intent:** Visitor can get a mood-driven recommendation and land on a success state that extends discovery.
  - **success:** Mood picker (`Cozy & Creamy` / `Bold & Strong`) recommends items (pastry-first variant supported); `order-success.html` is well-formed HTML (fixed `Home` anchor), shows estimated 30-min copy, cross-sell mini-cards (“People also ordered”), and a shareable receipt card with Reorder action.

## Constraints

- Preserve static shipping until this spec replaces it — every `Order Now` remains a link to `order-success.html:1`; no payment, no auth, no server.
- Hosting stays static — vanilla HTML/CSS/JS + `LocalStorage` demo only; no build framework required; still runs by opening `Main.html` or `npx serve .` / Live Server.
- Design system locks to `#E8DAB2` / `#333` / `#f0a500` + warm `#FFF8F0` / `#fdfbf7`, `Playfair Display + Inter` pairing, `Menuuu.jpg` only as 5% texture overlay, and the `style.css:205` `@media (max-width: 768px)` column switch for `.menu-grid` / `.about-content`.
- Preserve image filename casing (`Kwasant.jpg`, `Menuuu.jpg`, etc.) and Font Awesome 6 CDN; fix `order-success.html:19` malformed anchor (`<a>Home</li>` missing `</a>`) without replicating the pattern.

## Non-goals

- Real checkout, payment processing, inventory, or user accounts — the cart is a `LocalStorage` demo only.
- CMS, admin panel, or dynamic content authoring.
- Native app or offline PWA with background sync.
- Full i18n or currency beyond `₱` PHP display.

## Success signal

A first-time reviewer can open `Main.html`, follow the story scroll, filter the unified menu by vibe/tag, add two items to the mini-cart (count persists after reload), pick a mood recommendation, place an order to a well-formed `order-success` with cross-sell and receipt, and at both desktop and 768px describe the site as a warm premium café — all without a backend and with zero HTML validation errors.

## Assumptions

- Hosting will remain static file hosting (GitHub Pages / Netlify static / Live Server) — no SSR required.
- “Pastry-first” is an optional default ordering toggle, not the permanent default; reviewers will compare both.
- Text content remains English; no translation is expected for this iteration.
- Reorder on success re-adds the same items to `LocalStorage` rather than creating a new order record.

## Open Questions

- ~~Is `Kringle Php 500.00` test data or real pricing to preserve verbatim?~~ Resolved — fictional; replaced with SRP `₱180.00` per menu-curator + domain tier (see `menu-catalog.md:14`)
- Should opening hours / map pin be fictional placeholder data or the shop’s actual hours/address? — UX decision: placeholder `Daily 7am–8pm / Community corner 3km` retained for portfolio (real address can swap without code change)
- ~~Should the mood picker live on `Main.html` hero or as the first step of the unified menu?~~ Resolved — UX `EXPERIENCE.md` keeps picker on `MenuOrder.html` as first step; hero `Find my vibe` deep-links via `Main.html#mood`
