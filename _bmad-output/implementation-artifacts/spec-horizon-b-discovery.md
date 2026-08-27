---
title: 'Horizon B — Discovery & Delight (origin map + brew guide + smart filters + faves + reviews + 404)'
type: 'feature'
created: '2026-08-27'
status: 'done'
review_loop_iteration: 0
baseline_commit: '5aa67cdd7e010d822abd60eb27797b10d032f15c'
context:
  - '_bmad-output/planning-artifacts/architecture/architecture-enhanced-deja-brew-2026-08-27/ARCHITECTURE-SPINE.md'
  - '_bmad-output/specs/spec-enhanced-deja-brew/SPEC.md'
  - '_bmad-output/specs/spec-enhanced-deja-brew/design-system.md'
  - '_bmad-output/specs/spec-enhanced-deja-brew/menu-catalog.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** After Horizon A polish, browsing is still flat — origin story is text-only, filters are only type/tag, no price/roast/sort, no faves, no trust via reviews, and missing 404 breaks AD-4 completeness for portfolio.

**Approach:** Ship discovery as one cohesive menu-story: add origin map + brew guide to Main, upgrade MenuOrder to smart filters (price slider, roast, sort) using pure `filterCatalog`, add LocalStorage faves + seeded reviews, and add 404.html with AD-4 amendment to 4 routes — all static, single style.css.

## Boundaries & Constraints

**Always:** AD-1 static renders without JS; AD-2 catalog read-only → pages → cart/faves; AD-3 cart sole-owner + new faves key `deja-brew-faves:[id]` sole-owner via `js/faves.js`; AD-4 now 4 routes (Main, MenuOrder, order-success, 404) — amendment required; AD-5 single style.css tokens.

**Ask First:** Adding new origin IDs beyond catalog, changing price display, adding backend.

**Never:** Backend/auth, second CSS, payment, JS style injection beyond width/transform.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Origin map | Click Atok/Benguet pin | Filter applied on MenuOrder via `?origin=Atok` or scroll to guide, grid filtered | No JS: anchor still visible |
| Price slider | Move to 100-160 | Grid shows only items price in range (inclusive) | Empty → “No matches” with clear button |
| Roast filter | Select Medium | Only roast=Medium items (coffee only; pastry unaffected unless combined) | Reset to All restores 31 |
| Sort | Sort price low→high | Grid reorders ascending by `price` | Stable, pastry-first still applies after sort |
| Fave toggle | Heart on card, reload | Faves persisted, Faves pill filters to faves only | Bad id → warn, no throw, storage cleared if corrupted |
| 404 | GET /nope.html | Warm editorial 404, links to Menu, preserves navbar | Valid HTML, no redirect loop |
| Review | Card shows ★4.7 + quote | Review from catalog `review:{stars,quote}` seeded | No review → hide stars, layout stable |

</frozen-after-approval>

## Code Map

- `Main.html:105` #about section — **expand** with origin map (6 pins: Benguet/Atok/Sagada/Mt.Apo/Batangas/Cavite) + brew 3-step cards, link pins to `MenuOrder.html?origin=X`
- `MenuOrder.html:31` mood picker + filter-bar — **extend** with price range `input range`, roast chips, sort `<select>`, faves pill; wire to `js/filters.js`
- `data/catalog.js:1` 31 items — **add** `review:{stars:number, quote:string}` seeded, keep price/origin/roast shape
- `js/filters.js:1` pure `filterCatalog` — **extend** to handle `priceMin/Max, roast, sortBy`
- `js/faves.js` — **create** `deja-brew-faves` sole-owner like cart, `favorite:updated` event
- `404.html` — **create** new 4th route, warm editorial, navbar, AD-4 amendment
- `style.css:1` — **append** map pin, brew cards, fave heart, range styling — keep 768 switch
- `tests/e2e/deja-brew.spec.js:1` — **add** B tests: origin pin, price+roast+sort, fave persist, 404, review stars

## Tasks & Acceptance

**Execution:**
- [x] `data/catalog.js` — add `review` field to each item (e.g., `{stars:4.7, quote:"Tropical snap"}`) seeded from tasting notes
- [x] `js/filters.js` — extend `filterCatalog` to handle `priceMin, priceMax, roast, sortBy` (price/roast/sort)
- [x] `js/faves.js` — create `export const faves = {get,toggle,isFave,clear}` with safe JSON + `favorite:updated`
- [x] `Main.html` — add origin map grid + brew 3-step cards under #about, link with `?origin=` query, keep AD-1 fallback
- [x] `MenuOrder.html` — add price slider (`#price-min/#price-max` or single range + display), roast pills (All/Light/Medium/Dark), sort select, Faves pill + heart button on card, wire to extended filterCatalog + faves + query param origin
- [x] `style.css` — add map pins (latte dot), brew cards, heart active `color:var(--terracotta)`, range styling — keep 768 switch
- [x] `404.html` — create warm editorial 404 (hero 4.5rem “Lost your brew?” + Menu CTA + footer) with navbar + progress
- [x] `ARCHITECTURE-SPINE.md` — amend AD-4 rule text to list 4 routes and note 404 amendment
- [x] `tests/e2e/deja-brew.spec.js` — add tests for origin filter via query, price+roast+sort combo, fave heart persist after reload, 404 page, review stars visible

**Acceptance Criteria:**
- Given Main.html without JS, when viewing #about, then origin map pins + brew cards visible as static HTML
- Given MenuOrder.html?origin=Atok, when loaded, then grid shows only origin Atok items (via filterCatalog)
- Given price slider 100-160 + roast Medium, when applied, then count matches pure filter (manual check: filtered ≤31) and empty shows “No matches”
- Given heart toggle on 2 items + reload, when clicking Faves pill, then only 2 faved items show (persisted)
- Given sort Low→High, when applied, then first card price ≤ last card price (and pastry-first still toggles after)
- Given /nope.html, when requested, then 404.html warm editorial shown with Menu link, no infinite loop
- Given any card, when rendered, then star + quote visible and no layout shift if review missing

## Spec Change Log

## Design Notes

Pins use latte bg + ink text, hover amber. Heart is `♡` → `♥` when active, `aria-pressed`. Price slider dual-thumb simplified to single max slider (under 160) for static demo — keeps vanilla JS.

## Verification

**Commands:**
- `npx playwright test` -- expected: 8→13 pass (adds B tests)
- `python -m http.server 3000` open `MenuOrder.html?origin=Benguet` -- expected: filtered to Benguet items

**Manual checks (if no CLI):**
- 768px map stacks to single column, range still usable, heart hit area 32px
