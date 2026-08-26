# Enhanced Deja Brew

Warm editorial, story-fused redesign of a first-year static coffeeshop site — now with a cohesive café identity and just-enough interactivity, still static.

**Live:** `Main.html` → `MenuOrder.html` → `order-success.html` (3 routes) — deploy `Main.html` to GitHub Pages / Netlify static.

## Run

- Open `Main.html` directly, or `npx serve .` / `python -m http.server 3000` and visit `http://localhost:3000/Main.html`
- Verify at `768px` — hero stacks, `.menu-grid`/`values-grid` column, pill `₱`, `220px` `16px` images, amber `3px` progress

## Test

```bash
npm install
npx playwright test # 7/7 — CAP-1..6 across Main/MenuOrder/order-success
```

Config: `playwright.config.js` (`python -m http.server 3000`)

## Where Things Are

- App: `Main.html:1` → `MenuOrder.html:1` → `order-success.html:1` (legacy `Menu.html`/`About.html`/`CoffeeOrder.html`/`BakeryOrder.html` are 302 redirects per AD-4)
- Catalog + tokens: `data/catalog.js:1`, `style.css:1`, `menu-catalog.md` companion
- Architecture: `_bmad-output/planning-artifacts/architecture/architecture-enhanced-deja-brew-2026-08-27/ARCHITECTURE-SPINE.md:1` (5 ADs, Static-site + Progressive Enhancement)
- Spec: `_bmad-output/specs/spec-enhanced-deja-brew/SPEC.md:1` (6 CAPs, 7 stories)
- UX: `_bmad-output/planning-artifacts/ux-designs/ux-enhanced-deja-brew-2026-08-27/DESIGN.md` + `EXPERIENCE.md`
- Research: `_bmad-output/planning-artifacts/research/domain-specialty-cafe-philippines-2026-08-27/research.md`

## Stack

HTML5 + CSS3 (single `style.css`) + Vanilla JS ES2020 + `LocalStorage` `deja-brew-cart: [{id,qty}]`, Font Awesome 6 CDN, static host, no build.

## Deploy

GitHub Pages: *Settings → Pages → Source: main / root* → `https://<user>.github.io/DejaBrew/Main.html`
Netlify: drag project root.

## Agents

`.opencode/agents/` — `deja-brew-link-guardian`, `deja-brew-visual-qa`, `deja-brew-menu-curator`, `deja-brew-build-captain` (restart opencode to load).

