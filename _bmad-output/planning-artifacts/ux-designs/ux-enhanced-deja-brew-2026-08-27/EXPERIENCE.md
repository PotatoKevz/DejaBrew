---
status: final
updated: 2026-08-27
---

# EXPERIENCE.md — Enhanced Deja Brew

## Foundation
- Form-factor: web responsive (desktop + 768px mobile), no app
- UI system: none — vanilla HTML/CSS/JS + LocalStorage demo; DESIGN.md is visual identity reference
- Tokens reference via `{colors.latte}`, `{typography.hero}`, `{rounded.card}`, etc.

## Information Architecture
- **Main.html** — hero split (`hero-copy` + `hero-visual`) → `values-ribbon` (Community/Quality/Craft) → `#featured` 6 clickable → `#about` (story) → `#contact` → `footer` (hours/map/IG)
- **MenuOrder.html** — `#mood` picker (Cozy/Bold/All, pastry-first checkbox) → `filter-bar` (All/Coffee/Pastry + Gluten Free/Craft, search citrus/chocolate) → `#menu-grid` 10 → cart drawer
- **order-success.html** — receipt `#receipt` (LocalStorage `deja-brew-cart`) → cross-sell 3 → share/reorder
- Legacy `Menu.html`/`About.html`/`CoffeeOrder.html`/`BakeryOrder.html` are 302 redirects per AD-4 (not IA surfaces)

## Voice and Tone
- Warm, concise, sensory (≤8w): `Dark roast, brown sugar snap`, `Flaky, buttery, fresh-baked`
- Prices pill `₱XXX.00` / `₱330.00 /box` — no `<u>`
- Microcopy: `Fresh today • from ₱30`, `Contactless pickup`, `People also ordered`

## Component Patterns
- **Mood picker** — 3 cards `role=button tabindex=0` onkeydown Enter/Space → `applyMood()`; Cozy checks `pastry-first` and shows all, Bold filters `M-C-01/M-C-02/M-P-03`, All resets; deep-link `Main.html#mood` via hero `Find my vibe`
- **Filter bar** — single active `filter-pill.active` (`{colors.ink}`), `setFilter()` toggles type `===` or tag `===`, search over `name+sensory+tasting+origin` lowercased, `pastry-first` reorders via stable sort `Number(b.type==='pastry')-Number(a.type==='pastry')`, empty → `No matches` branch
- **Cart drawer** — `safeCart()` try/catch, `LocalStorage` `[{id,qty}]`, `cart-badge` sum, `renderCart` with null guard + `esc()`, `changeQty` with `Number.isFinite` + trunc, progress `d>0 ? pct : 0`, backdrop `display:block/none` + `translateX`
- **Success receipt** — `safeCart` + `esc` + `Number(price)` guard, total `₱.toFixed(2)`, Reorder re-sets same cart → `MenuOrder.html`, Share `navigator.share` → `clipboard.writeText` → `prompt` cascade

## State Patterns
- Empty cart: badge hidden, drawer `Cart empty`, success `No items… direct Order Now` tip
- Filter empty: grid `No matches — try All or clear search.`
- Malformed storage: `safeCart` catches, removes bad value, returns []
- No tasting array: `Array.isArray` guard before `join`

## Interaction Primitives
- Click `Add to cart` → `addToCart(id)` → `LocalStorage` → `updateBadge` + `renderCart` + open drawer + backdrop
- Scroll → `progress-bar` width `pct%` background `{colors.amber}` sticky
- Keyboard: mood cards reachable via Tab + Enter/Space; drawer Continue `esc` not required but backdrop click closes

## Accessibility Floor
- Mood cards `role=button tabindex=0` + keydown, filter buttons native `<button>`, cart `Continue browsing` focusable, social links `rel="noopener noreferrer"`, `alt` on all `menu-img`; contrast ink on latte meets AA per SPEC

## Key Flows
### 1. Maya the Monday Starter (Cozy)
Maya lands `Main.html` hero, vibe `Cozy & Creamy` via `Find my vibe` → `MenuOrder.html#mood` Cozy checks `pastry-first` → sees `Croissant`/`Macaron` first, adds `Latte` → badge 1 → adds `Macaron` → badge 2 → reload persists 2 → Order Now → `order-success.html` receipt `₱465.00` + cross-sell Donut → Reorder → back to menu cart re-filled → climax: cozy ritual completed without backend

### 2. Raj the Bold Commuter
Raj `MenuOrder.html` Bold → filters to `Espresso/Americano/Kringle`, search `citrus` → `Americano` alone (tasting `citrus`), add → badge 1 → drawer +/- → close via backdrop → Order Now → receipt `₱101.00` → Share → `navigator.share` fallback to clipboard → climax: bold choice in 3 clicks

## Responsive & Platform
- `768px` column: `#featured` hero stack, `values-grid`/`footer-grid` column, `.menu-grid`/`.about-content` column 100% width, drawer 320px, hero img 280px + h1 2.6rem
