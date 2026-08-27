---
title: 'Horizon A — Polish & Trust (modularize + a11y + SEO + perf + test repair)'
type: 'feature'
created: '2026-08-27'
status: 'done'
review_loop_iteration: 0
baseline_commit: '5aa67cdd7e010d822abd60eb27797b10d032f15c'
context:
  - '_bmad-output/planning-artifacts/architecture/architecture-enhanced-deja-brew-2026-08-27/ARCHITECTURE-SPINE.md'
  - '_bmad-output/specs/spec-enhanced-deja-brew/SPEC.md'
  - '_bmad-output/specs/spec-enhanced-deja-brew/design-system.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Inline JS duplication across Main.html/MenuOrder.html violates AD-2/AD-3, nav has no hamburger/a11y, SEO is empty, images lack srcset, and e2e asserts stale 10-item catalog vs actual 31 — reviewer trust erodes at 768px and on reload.

**Approach:** Harden the foundation without new routes (AD-4 stays 3): extract sole-owner JS modules, add mobile a11y, ship minimal SEO + perf, and repair tests to pass `npx playwright test` on the real catalog.

## Boundaries & Constraints

**Always:** AD-1 progressive enhancement — pages render without JS; AD-2 catalog→pages→interactions no cycles; AD-3 cart sole-owner via `js/cart.js` + `deja-brew-cart:[{id,qty}]` no direct localStorage elsewhere; AD-5 single `style.css` + tokens `#E8DAB2/#333/#f0a500/#FFF8F0` 220px 16px; preserve image casing `Kwasant.jpg`; keep `Order Now → order-success.html`.

**Ask First:** New route (`404.html`) — deferred to Horizon B; adding dependency or build tool beyond vanilla ES2020; changing catalog shape/IDs.

**Never:** Backend/payment/auth, second CSS file, JS-injected styles beyond `progress width` + `drawer transform`, altering price display beyond pill `₱` + `toFixed(2)`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Drawer a11y | User opens cart, presses ESC or backdrop, or tabs | Drawer closes, focus returns to Cart trigger, trap cycles | Silent no-throw; console warn only |
| Hamburger at 768px | Viewport 768px, tap hamburger | Nav links collapse to overlay menu, toggle `aria-expanded` | No JS: links still visible stacked |
| SEO head | Crawl Main.html/MenuOrder.html | `title`, `meta description`, `og:*`, `json-ld` Café present | Valid HTML, no duplicate tags |
| Perf srcset | Menu card image loads | `webp` srcset served where supported, fallback jpg, lazy + hero preload | `onerror` fallback to `Kape.jpg` |
| Stale cart JSON | `localStorage deja-brew-cart = "]]] "` corrupted | Cart reads as `[]`, badge 0, no throw | Remove bad key, warn |
| Tests stale count | `catalog` 31 items | `deja-brew.spec.js` asserts 31 not 10, coffee/pastry splits match catalog.js counts | Tests green |

</frozen-after-approval>

## Code Map

- `Main.html:1` — hero split + values ribbon + featured 6, inline `<script>` with progress/badge/magnetic/dust — **extract to modules**, add skip-link + hamburger markup + SEO head + hero preload
- `MenuOrder.html:1` — unified menu with `import {catalog} from './data/catalog.js'` + inline filter/cart/progress — **extract**, add drawer `role=dialog aria-modal` + hamburger + SEO
- `order-success.html:1` — success + receipt + cross-sell, small inline progress — **keep but wire to cart module** for receipt total
- `data/catalog.js:1` — 31 items `M-C-01..21` + `M-P-01..10` — **read-only source**, used for counts in tests
- `style.css:1` — tokens + hero + menu-grid + 768px switch `@media (max-width: 768px)` stacks `.menu-grid/.about-content` — **append hamburger + focus styles only**, no second file
- `tests/e2e/deja-brew.spec.js:1` — 7 tests assert 10 items / 5+5 splits — **update to 31, dynamic splits from catalog**
- `playwright.config.js:1` — `python -m http.server 3000` — reuse for verify
- To create: `js/cart.js` — sole owner `get/add/update/clear/getCount` + `cart:updated` event, safe JSON, warn on bad id, no throw — AD-3
- To create: `js/filters.js` — tabs/search state, pure `filterCatalog(list, {activeFilter,mood,query,pastryFirst})` export for testability
- To create: `js/progress.js` — `initProgress('#progress-bar')` scroll width handler
- To create: `js/nav.js` — hamburger toggle + scroll `nav.scrolled` + focus trap helper
- `_bmad-output/implementation-artifacts/sprint-status.yaml:1` — track story key `2-1` (next epic)
- Images: `Kwasant.jpg`, `Coffeeshop.jpeg`, etc — exact casing, add `*.webp` siblings, keep fallback

## Tasks & Acceptance

**Execution:**
- [x] `js/cart.js` — create sole-owner module `export const cart = {get,add(id),update(id,delta),clear,count}` with safe JSON + warn — AD-3
- [x] `js/progress.js` — create `export function initProgress(sel)` throttled scroll → `style.width`
- [x] `js/filters.js` — create `export function filterCatalog(...)` + DOM binder `initFilters(catalog, render)` no direct localStorage
- [x] `js/nav.js` — create hamburger + drawer a11y (ESC, backdrop, focus trap, `aria-expanded`, `aria-live` badge)
- [x] `Main.html` — add SEO head (`description`, `og:title/desc/image`, `json-ld` Café), preconnect already, hero `preload` + `fetchpriority=high`, skip-link `<a href="#hero">`, hamburger button, switch inline JS to `type="module"` imports from `js/*`, preserve watermark/magnetic
- [x] `MenuOrder.html` — mirror Main head SEO (Menu), add `role=dialog` drawer, `aria-live` badge, hamburger, wire to `js/*` modules, keep `onerror Kape.jpg`
- [x] `order-success.html` — SEO head, wire receipt to `js/cart.js` import, keep progress
- [x] `style.css` — append hamburger (hidden >768, visible ≤768 overlay), focus-visible outline `amber`, drawer backdrop polish — no second file, keep 768 switch
- [x] `sitemap.xml`+`robots.txt` + perf fallback — sitemap/robots shipped; `*.webp` siblings deferred to tooling (fallback `onerror Kape.jpg` + lazy preserved) — no layout break, meets Always Never (no second CSS)
- [x] `tests/e2e/deja-brew.spec.js` — update counts 10→31, coffee/pastry dynamic from catalog, hamburger/a11y + SEO assertions, corrupted localStorage edge

**Acceptance Criteria:**
- Given JS disabled, when opening Main.html/MenuOrder.html, then hero, ribbon, featured, grid, about, contact still render (AD-1) — no blank
- Given module load, when adding 2 items via Add to cart, then `localStorage deja-brew-cart` = `[{id,qty}]` shape, badge =2, total in drawer updates, persists after reload, ESC closes drawer and focus returns
- Given viewport 768px, when tapping hamburger, then nav overlay opens/closes, `aria-expanded` toggles, no layout break at 320px
- Given lighthouse/crawl, when reading `<head>`, then `meta description` + `og:*` + `application/ld+json` present and valid, sitemap/robots reachable
- Given corrupted `deja-brew-cart`, when loading page, then cart is empty, badge 0, no console error throw, bad key removed
- Given `npx playwright test`, then 7+ updated tests pass (31 items, pill ₱, no `<u>`, progress amber `rgb(240,165,0)`, sticky nav)

## Spec Change Log

## Design Notes

Reuse existing warm editorial tokens — no new palette. Hamburger uses ink bg + latte icon, overlay is paper with line border, focus ring `2px solid var(--amber)`. Drawer trap: keep linear, no third-party lib.

## Verification

**Commands:**
- `npx playwright test` -- expected: 7/7+ pass (update for 31-item catalog)
- `python -m http.server 3000` + open `Main.html` with JS disabled -- expected: hero/grid/about visible, no JS errors
- Manual axe check or `npx playwright test` a11y — ESC, Tab cycle, hamburger at 768px and 320px

**Manual checks (if no CLI):**
- 768px stacks `.menu-grid`/`.about-content` still, hamburger overlay not covering hero badge, drawer backdrop click closes
