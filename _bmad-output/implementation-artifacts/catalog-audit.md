# Catalog Audit — Enhanced Deja Brew

**Date:** 2026-08-27  
**Auditor:** deja-brew-menu-curator (subagent)  
**Root:** `C:\Users\John Kevin M. Tamayo\Enhanced Deja Brew`  
**Scope:** `menu-catalog.md:1` (spec table) ↔ `data/catalog.js:1` (export) ↔ `MenuOrder.html:1` (render) + `style.css:238` (price-pill)  
**Method:** Static read + exact string diff. Compared every spec row (10) against `catalog.js` object fields (`id`, `name`, `type`, `price`/`display`, `image`, `sensory`, `tag`). Verified image casing via `Get-ChildItem` exact-case listing. Counted sensory words via `re.findall(r'\S+', sensory)`. Searched `MenuOrder.html` for `filter-pill`, `pastry-first`, `mood`, `localStorage`, `price-pill`, and `<u>`; verified `style.css:238` `.price-pill` block.

**Verdict: FAIL — 3 load-bearing mismatches (price, sensory text, tag cardinality); 4 PASS groups clean; render pipeline PASS.**

---

## 1) 3-Way Diff Table (10 items)

`Spec` = `_bmad-output/specs/spec-enhanced-deja-brew/menu-catalog.md:5` table. `Catalog` = `data/catalog.js:1` export. `Render` = `MenuOrder.html:60` template (imports `catalog`, renders `p.image`/`p.display`/`p.sensory`/`p.tag`).

| ID | Name | Field | Spec (`menu-catalog.md`) | Catalog (`data/catalog.js`) | Render (`MenuOrder.html` template) | Status |
|---|---|---|---|---|---|---|
| **M-C-01** | Espresso | price | `₱125.00` (`menu-catalog.md:7`) | `price:125` `display:'₱125.00'` (`catalog.js:2`) | `<span class="price-pill">${p.display}</span>` (`MenuOrder.html:85`) | **PASS** |
| | | image | `espresso-coffee.png` (`menu-catalog.md:7`) | `espresso-coffee.png` (`catalog.js:2`) | `src="${p.image}"` → `espresso-coffee.png` exact | **PASS** — `espresso-coffee.png:1408257` exists lower-first |
| | | sensory | `Dark roast, brown sugar snap` 5w (`menu-catalog.md:7`) | `Dark roast, brown sugar snap` 5w (`catalog.js:2`) | `<p>${p.sensory}</p>` (`MenuOrder.html:86`) | **PASS** ≤8w |
| | | tag | `Craft` | `Craft` | `<span class="tag">${p.tag}</span>` | **PASS** |
| **M-C-02** | Americano | price | `₱101.00` (`menu-catalog.md:8`) | `101` `₱101.00` (`catalog.js:3`) | `price-pill` | **PASS** |
| | | image | `Americano-coffee.jpg` | `Americano-coffee.jpg` | `p.image` | **PASS** — file `Americano-coffee.jpg` exists case-exact |
| | | sensory | `Smooth, clean, just right` 4w | `Smooth, clean, just right` 4w | `p.sensory` | **PASS** |
| | | tag | `Quality` | `Quality` | `p.tag` | **PASS** |
| **M-C-03** | Latte | price | `₱135.00` | `135` `₱135.00` (`catalog.js:4`) | `price-pill` | **PASS** |
| | | image | `Latte.jpeg` (`.jpeg` not `.jpg`) | `Latte.jpeg` | `p.image` | **PASS** — `Latte.jpeg` exists; extension preserved |
| | | sensory | `Creamy, steamed milk cradle` 4w | `Creamy, steamed milk cradle` 4w | `p.sensory` | **PASS** |
| | | tag | `Community` | `Community` | `p.tag` | **PASS** |
| **M-C-04** | Cappuccino | price | `₱143.73` | `143.73` `₱143.73` (`catalog.js:5`) | `price-pill` | **PASS** |
| | | image | `Cappuccino.jpg` | `Cappuccino.jpg` | `p.image` | **PASS** |
| | | sensory | `Rich, foamy classic` 3w | `Rich, foamy classic` 3w | `p.sensory` | **PASS** |
| | | tag | `Craft` | `Craft` | `p.tag` | **PASS** |
| **M-C-05** | Frappuccino | price | `₱143.73` | `143.73` `₱143.73` (`catalog.js:6`) | `price-pill` | **PASS** |
| | | image | `Frappuccino.jpg` | `Frappuccino.jpg` | `p.image` | **PASS** — `Frappuccino.jpg` exists |
| | | sensory | `Cool, creamy refreshment` 3w | `Cool, creamy refreshment` 3w | `p.sensory` | **PASS** |
| | | tag | `Quality` | `Quality` | `p.tag` | **PASS** |
| | | origin/roast | `— (blend)` / `Light` (`menu-catalog.md:11`) | `Blend` / `Light` (`catalog.js:6`) | `${p.origin} • ${p.roast}` (`MenuOrder.html:87`) | **MINOR** — spec `— (blend)` normalized to `Blend`; semantically equal |
| **M-P-01** | Croissant | price | `₱85.00` | `85` `₱85.00` (`catalog.js:7`) | `price-pill` | **PASS** |
| | | image | `Kwasant.jpg` canonical (`menu-catalog.md:12` + rule `menu-catalog.md:21`) | `Kwasant.jpg` (`catalog.js:7`) | `p.image` | **PASS** — `Kwasant.jpg` exists exact case |
| | | sensory | `Flaky, buttery, fresh-baked` 3w (`menu-catalog.md:12`) | `Flaky, buttery, fresh` 3w (`catalog.js:7`) | `p.sensory` | **FAIL** — missing `-baked`; both ≤8w but text drifts from spec |
| | | tag | `Craft` | `Craft` | `p.tag` | **PASS** |
| **M-P-02** | Muffin | price | `₱35.00` | `35` `₱35.00` (`catalog.js:8`) | `price-pill` | **PASS** |
| | | image | `Muffin.jpg` | `Muffin.jpg` | `p.image` | **PASS** |
| | | sensory | `Soft, moist, flavor burst` 4w | `Soft, moist, flavor burst` 4w | `p.sensory` | **PASS** |
| | | tag | `Community` | `Community` | `p.tag` | **PASS** |
| **M-P-03** | Kringle | price | `₱500.00` (`menu-catalog.md:14`) | `180` `₱180.00` (`catalog.js:9`) | `price-pill ₱180.00` | **FAIL** — numeric mismatch 500→180. **Catalog is CORRECT per SRP realism task; spec stale** (see §7) |
| | | image | `Kringle.jpg` | `Kringle.jpg` | `p.image` | **PASS** — `Kringle.jpg:141900` exists |
| | | sensory | `Oval Danish, delicate layers` 4w | `Oval Danish, delicate layers` 4w | `p.sensory` | **PASS** |
| | | tag | `Craft` | `Craft` | `p.tag` | **PASS** |
| **M-P-04** | Donut | price | `₱30.00` | `30` `₱30.00` (`catalog.js:10`) | `price-pill` | **PASS** |
| | | image | `Donut.jpg` | `Donut.jpg` | `p.image` | **PASS** |
| | | sensory | `Sweet, soft, coffee pair` 4w | `Sweet, soft, coffee pair` 4w | `p.sensory` | **PASS** |
| | | tag | `Quality` | `Quality` | `p.tag` | **PASS** |
| **M-P-05** | Macaron | price | `₱330.00/box` (`menu-catalog.md:16`) | `330` `₱330.00 /box` (`catalog.js:11`) | `price-pill ₱330.00 /box` | **MINOR FAIL** — suffix drift ` /box` vs `/box` (space before slash); value identical, display spacing off spec `menu-catalog.md:22` rule ` /box` canonical vs `catalog.js:11` |
| | | image | `Macaron.jpg` | `Macaron.jpg` | `p.image` | **PASS** |
| | | sensory | `Delicate, colorful sweet` 3w | `Delicate, colorful sweet` 3w | `p.sensory` | **PASS** |
| | | tag | `Gluten Free, Community` (`menu-catalog.md:16`) | `Gluten Free` (`catalog.js:11`) | `p.tag` single | **FAIL** — missing `Community` second tag; `Gluten Free` exclusivity still holds but cardinality wrong |

**Counts:** IDs 10/10 match. Prices 9/10 exact (1 SRP-correct drift). Images 10/10 casing exact. Sensory 9/10 text exact (1 `-baked` drift). Tags 9/10 cardinality exact (1 drift).

---

## 2) Image Casing — Exact

| Image (spec exact) | `data/catalog.js` value | File on disk (exact case) | Verdict |
|---|---|---|---|
| `espresso-coffee.png` (`menu-catalog.md:7`) | `espresso-coffee.png` (`catalog.js:2`) | `espresso-coffee.png` lower-e, 1,408,257B | **PASS** |
| `Americano-coffee.jpg` | `Americano-coffee.jpg` | `Americano-coffee.jpg` capital A | **PASS** |
| `Latte.jpeg` (`.jpeg`) | `Latte.jpeg` | `Latte.jpeg` | **PASS** — not `Latte.jpg` |
| `Cappuccino.jpg` | `Cappuccino.jpg` | `Cappuccino.jpg` | **PASS** |
| `Frappuccino.jpg` | `Frappuccino.jpg` | `Frappuccino.jpg` | **PASS** |
| `Kwasant.jpg` (canonical per `menu-catalog.md:21`) | `Kwasant.jpg` | `Kwasant.jpg` | **PASS** |
| `Muffin.jpg` | `Muffin.jpg` | `Muffin.jpg` | **PASS** |
| `Kringle.jpg` | `Kringle.jpg` | `Kringle.jpg` | **PASS** |
| `Donut.jpg` | `Donut.jpg` | `Donut.jpg` | **PASS** |
| `Macaron.jpg` | `Macaron.jpg` | `Macaron.jpg` | **PASS** |

`MenuOrder.html:83` uses `<img src="${p.image}" … class="menu-img">` — preserves casing via runtime catalog value, no hardcoded lowercasing. No `toLowerCase()` on image.

---

## 3) Price Pill Format

| Rule | Spec (`menu-catalog.md:19`) | Found | Verdict |
|---|---|---|---|
| Display as pill badge, never `<u>` | `Prices display as pill badge, never <u>` | `style.css:238-248` `.price-pill{display:inline-block; padding:6px 12px; background:var(--ink); color:white; border-radius:999px; font-weight:700}` + `MenuOrder.html:85` `<span class="price-pill">${p.display}</span>` — **0 `<u>` tags** in `catalog.js`/`MenuOrder.html`/`style.css` | **PASS** |
| Currency `₱` | `currency ₱` | All `display` strings prefix `₱` (`catalog.js:2-11`); `MenuOrder.html:30-31` mood cards `₱` not used but catalog-sourced pills carry `₱` | **PASS** |
| Macaron suffix ` /box` | `its price suffix is ' /box'` (`menu-catalog.md:22`) | `catalog.js:11` `₱330.00 /box` matches; spec table writes `₱330.00/box` without space — catalog canonical with space is correct per rule text | **PASS** (spec table typo noted) |

---

## 4) Sensory ≤8 Words

| ID | Sensory | Words | Verdict |
|---|---|---|---|
| M-C-01 | `Dark roast, brown sugar snap` | 5 | **PASS** |
| M-C-02 | `Smooth, clean, just right` | 4 | **PASS** |
| M-C-03 | `Creamy, steamed milk cradle` | 4 | **PASS** |
| M-C-04 | `Rich, foamy classic` | 3 | **PASS** |
| M-C-05 | `Cool, creamy refreshment` | 3 | **PASS** |
| M-P-01 | spec `Flaky, buttery, fresh-baked` 3 / catalog `Flaky, buttery, fresh` 3 | 3 | **PASS** (both ≤8 but mismatch flagged above) |
| M-P-02 | `Soft, moist, flavor burst` | 4 | **PASS** |
| M-P-03 | `Oval Danish, delicate layers` | 4 | **PASS** |
| M-P-04 | `Sweet, soft, coffee pair` | 4 | **PASS** |
| M-P-05 | `Delicate, colorful sweet` | 3 | **PASS** |

All ≤8. No violation.

---

## 5) Gluten Free Only on Macaron

| Check | Spec (`menu-catalog.md:22`) | Catalog | Render filter | Verdict |
|---|---|---|---|---|
| `Gluten Free` appears only on Macaron | `Gluten Free appears only on Macaron` | `catalog.js:11` M-P-05 `tag:'Gluten Free'` — sole occurrence; other 9 tags `Craft`/`Quality`/`Community` | `MenuOrder.html:39` `<button data-filter="Gluten Free">Gluten Free</button>` + `render(): list.filter(x=> x.type===activeFilter \|\| x.tag===activeFilter)` (`MenuOrder.html:76`) correctly isolates Macaron for that chip | **PASS** |

*Tag cardinality note:* Spec expects Macaron `Gluten Free, Community` two tags (`menu-catalog.md:16`). Catalog stores single `Gluten Free` (`catalog.js:11`). If model is single-tag, catalog is intentionally simplified; if multi-tag intended, needs `tags:['Gluten Free','Community']` or comma string. Flagged as FAIL in §1 but does not violate exclusivity.

---

## 6) SRP Realism — Kringle 180

| Item | Spec price | Catalog price | Realism | Verdict |
|---|---|---|---|---|
| Kringle M-P-03 | `₱500.00` (`menu-catalog.md:14`) | `₱180.00` (`catalog.js:9`) | `₱500` for Kringle is unrealistic in PH bakery context (≈2.8× pastry anchor `Croissant ₱85`, `Macaron/box ₱330`); `₱180` aligns with premium Danish tier | **CATALOG PASS / SPEC STALE** — task explicitly says `SRP realism (Kringle 180)`; keep `180`, update spec to `₱180.00` |

---

## 7) MenuOrder.html Renders from Catalog

| Requirement | Spec/Task | Found in `MenuOrder.html:1` | Verdict |
|---|---|---|---|
| **Tabs All\|Coffee\|Pastry** | Task §2 | `MenuOrder.html:36-38` `<button data-filter="all">All</button>` active default, `data-filter="coffee">Coffee`, `data-filter="pastry">Pastries` (+ extras: `Gluten Free` `Craft` at `MenuOrder.html:39-40`) — required 3 present | **PASS** |
| **Craft / Gluten Free chips** | Task §2 | `MenuOrder.html:39` `Gluten Free`, `MenuOrder.html:40` `Craft` — `setFilter()` at `MenuOrder.html:63` toggles `active` class and calls `render()` filtering `x.type===activeFilter \|\| x.tag===activeFilter` (`MenuOrder.html:76`) | **PASS** |
| **Pastry-first toggle** | `menu-catalog.md:20` `default Coffee-first; alternate Pastry-first` | `MenuOrder.html:41` `<input type="checkbox" id="pastry-first"> Pastry first` unchecked default → `catalog` order is coffee-first (`catalog.js:2-6` coffee before `catalog.js:7-11` pastry). Checked path `MenuOrder.html:80` `list.sort((a,b)=> (a.type==='pastry'? -1:1) - (b.type==='pastry'? -1:1))` + listener `MenuOrder.html:65` | **PASS** |
| **Mood Cozy / Bold** | Task §2 | `MenuOrder.html:29-33` `mood` picker: `applyMood('cozy')` `Cozy & Creamy → Latte, Muffin, Macaron`, `applyMood('bold')` `Bold & Strong → Espresso, Americano, Kringle`, `applyMood('all')` show all. Logic `MenuOrder.html:64` Cozy checks `pastry-first`, Bold unchecks + filters; `MenuOrder.html:77-78` cozy sorts `Gluten Free` up, bold filters ids `M-C-01,M-C-02,M-P-03` | **PASS** |
| **LocalStorage cart** | Task §2 | `MenuOrder.html:61` `import {catalog}`; `MenuOrder.html:68` `addToCart(id)` → `localStorage.getItem('deja-brew-cart')` / `setItem` with `{id,qty}` array, `changeQty` `MenuOrder.html:72`, `updateBadge`/`renderCart` `MenuOrder.html:70-71`, persisted across `render()`; drawer `MenuOrder.html:53` | **PASS** |
| **Catalog-sourced render** | Architecture invariant | `MenuOrder.html:60` `import {catalog} from './data/catalog.js'` ; grid `MenuOrder.html:81-91` maps `list` (filtered `catalog`) to `menu-item` with `price-pill`, `sensory`, `tag` — no hardcoded menu copy | **PASS** |
| **Search** | Bonus | `MenuOrder.html:42` `<input id="search" placeholder="Search citrus, chocolate...">` + `MenuOrder.html:79` `tasting/origin/sensory` filter | **PASS** (out of scope but preserved) |

**Style hooks:** `style.css:337-342` `.filter-pill` + `.active`; `style.css:345-358` `.cart-drawer`/`.cart-badge`; `style.css:238` `.price-pill` — all consumed.

---

## 8) Overall PASS/FAIL

| Group | Check | Result | Fix if FAIL |
|---|---|---|---|
| IDs | 10/10 sync | **PASS** | — |
| Prices numeric | 9/10 exact, 1 realistic drift (Kringle) | **FAIL** (spec stale) | Update `menu-catalog.md:14` `₱500.00` → `₱180.00` |
| Images casing | 10/10 exact, 10/10 files exist | **PASS** | — |
| Sensory text | 9/10 exact (M-P-01 drift) | **FAIL** | Either `catalog.js:7` `Flaky, buttery, fresh` → `Flaky, buttery, fresh-baked` or spec → `fresh` (pick one; both 3w) |
| Sensory ≤8w | 10/10 ≤8 | **PASS** | — |
| Price pill format | pill, `₱`, no `<u>` | **PASS** | — |
| Gluten Free exclusivity | only Macaron | **PASS** | — |
| Gluten Free cardinality | spec 2 tags vs catalog 1 | **FAIL** | If multi-tag model: `catalog.js:11` → `tag:'Gluten Free, Community'` or `tags:['Gluten Free','Community']` + `MenuOrder.html:76` split; else update spec to `Gluten Free` single |
| SRP realism Kringle | 180 correct | **PASS** (catalog) / **FAIL** (spec) | Update spec |
| Render pipeline tabs/chips/pastry-first/mood/cart | all present | **PASS** | — |

**Overall: FAIL — 3 sync drifts to reconcile.** Pipeline itself is healthy; MenuOrder correctly derives from `data/catalog.js` with pastry-first, mood, and LocalStorage.

### Patches (minimal, load-bearing)

```diff
# 1. menu-catalog.md:12 sensory
- | M-P-01 | Croissant | pastry | ₱85.00 | Kwasant.jpg | Flaky, buttery, fresh-baked | ...
+ | M-P-01 | Croissant | pastry | ₱85.00 | Kwasant.jpg | Flaky, buttery, fresh | ...
# OR catalog.js:7
- sensory:'Flaky, buttery, fresh',
+ sensory:'Flaky, buttery, fresh-baked',

# 2. menu-catalog.md:14 Kringle price
- | M-P-03 | Kringle | pastry | ₱500.00 | Kringle.jpg | Oval Danish, delicate layers | ...
+ | M-P-03 | Kringle | pastry | ₱180.00 | Kringle.jpg | Oval Danish, delicate layers | ...

# 3a. menu-catalog.md:16 tags (if single-tag model)
- | M-P-05 | Macaron | pastry | ₱330.00/box | Macaron.jpg | Delicate, colorful sweet | ... | Gluten Free, Community |
+ | M-P-05 | Macaron | pastry | ₱330.00/box | Macaron.jpg | Delicate, colorful sweet | ... | Gluten Free |

# 3b. OR catalog.js:11 (if multi-tag model) + MenuOrder filter tweak
- { id:'M-P-05', ... tag:'Gluten Free' },
+ { id:'M-P-05', ... tag:'Gluten Free', tags:['Gluten Free','Community'] },
# and MenuOrder.html:76
- list.filter(x=> x.type===activeFilter || x.tag===activeFilter)
+ list.filter(x=> x.type===activeFilter || x.tag===activeFilter || (x.tags && x.tags.includes(activeFilter)))

# 4. (cosmetic) menu-catalog.md:16 price spacing to match rule text
- | M-P-05 | Macaron | pastry | ₱330.00/box | ...
+ | M-P-05 | Macaron | pastry | ₱330.00 /box | ...
```

Re-run after patch: reopen `MenuOrder.html`, verify tabs `All|Coffee|Pastry|Craft|Gluten Free` filter, toggle `Pastry first` reverses grid, `Cozy` checks it, `Bold` filters to Espresso/Americano/Kringle, add-to-cart persists `deja-brew-cart` in DevTools → Application → Local Storage.

*Audited via static reads: `menu-catalog.md:1`, `data/catalog.js:1`, `MenuOrder.html:1`, `style.css:1`; disk check `Get-ChildItem` exact-case.*
