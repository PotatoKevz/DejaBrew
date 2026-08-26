# Link Guardian Audit — Enhanced Deja Brew

**Date:** 2026-08-27
**Root:** `C:\Users\John Kevin M. Tamayo\Enhanced Deja Brew`
**Scope:** 7 HTML files at root — `Main.html`, `MenuOrder.html`, `order-success.html`, `About.html`, `CoffeeOrder.html`, `BakeryOrder.html`, `Menu.html`
**Method:** regex `href\s*=\s*["']([^"']*)["']` and `src\s*=\s*["']([^"']*)["']` (case-insensitive), then classification `external` (`https:`, `//`, `javascript:`, `mailto:`) vs `sibling` (`File.html`, `style.css`, `*.jpg` etc) vs `anchor` (`#id`, `File.html#id`). Sibling exact-case check against `os.listdir(root)`. Anchor `id` check against `id\s*=\s*["']([^"']*)["']` extraction per target file. Banned-pattern scans for `<u>`, malformed `Home</li>`, `href="#"` without `return false`.
**Tool:** `C:\Users\John Kevin M. Tamayo\AppData\Local\Temp\opencode\audit.py` (executed; output captured below)

## Verdict: PASS — 0 broken links, 0 banned patterns

---

## 1. AD-4 — Exactly 3 Navigable Docs

**PASS.** Navigable (full) documents: `Main.html`, `MenuOrder.html`, `order-success.html` = 3.
Legacy redirects (meta-refresh + fallback `<a>`) are not counted as navigable docs: `Menu.html`, `About.html`, `CoffeeOrder.html`, `BakeryOrder.html` = 4 redirects.

| Doc | Kind | Exists |
|-----|------|--------|
| `Main.html` | navigable | YES |
| `MenuOrder.html` | navigable | YES |
| `order-success.html` | navigable | YES |

---

## 2. Legacy Redirects — Correctness

| Redirect File | `http-equiv="refresh"` | `content="0; url=…"` | Fallback `<a href>` | Target Exists (exact case) | Anchor Valid | Status |
|---------------|------------------------|----------------------|---------------------|----------------------------|--------------|--------|
| `Menu.html` | YES | `MenuOrder.html` | `MenuOrder.html` | YES (`MenuOrder.html` in `os.listdir`) | N/A — file-level redirect | PASS |
| `About.html` | YES | `Main.html#about` | `Main.html#about` | YES (`Main.html` exists) | YES — `id="about"` in `Main.html:86` | PASS |
| `CoffeeOrder.html` | YES | `MenuOrder.html` | `MenuOrder.html` | YES | N/A | PASS |
| `BakeryOrder.html` | YES | `MenuOrder.html` | `MenuOrder.html` | YES | N/A | PASS |

All 4 redirects use `content="0; url=…"` and include a visible fallback anchor — correct pattern.

---

## 3. Banned Patterns

| Check | Rule | Result |
|-------|------|--------|
| `<u>` tag | regex `<\s*u(\s\|>)` case-insensitive — banned everywhere | **PASS** — 0 occurrences across all 7 files |
| Malformed Home | literal `<a href="Main.html">Home</li>` missing `</a>` (`order-success.html:19` historic pitfall per `AGENTS.md`) | **PASS** — not found in any file; current `order-success.html:17-20` uses `<li><a href="Main.html">Home</a></li>` correctly |
| `href="#"` without `return false` | any `href="#"` must be accompanied by `return false` or `javascript:void(0)` on same element | **PASS** — 0 occurrences of `href="#"`; `MenuOrder.html:18` uses `href="javascript:void(0)" onclick="…; return false;"` — compliant |
| Navigation hrefs as sibling files | must remain `Main.html`, `MenuOrder.html`, `Main.html#contact` etc — no routed paths | **PASS** — all nav hrefs are sibling-relative |
| Case-sensitive images | `Kwasant.jpg`, `Menuuu.jpg`, etc must preserve casing | **PASS** — see §5 |

---

## 4. href Audit — Full Table

`Status`: `PASS` = sibling exists exact case + anchor id exists if present; `EXTERNAL` = CDN/social — not checked for file existence; `PASS (js)` = intentional `javascript:void(0)` with `return false`.

| File | Link | Type | Status | Fix |
|------|------|------|--------|-----|
| `Main.html` | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css` | external (CDN) | EXTERNAL — allowed | — |
| `Main.html` | `style.css` | sibling (stylesheet) | PASS — `style.css:1` exists | — |
| `Main.html` | `Main.html` | sibling (self-brand) | PASS — exact case match | — |
| `Main.html` | `MenuOrder.html` | sibling | PASS — exists; case exact | — |
| `Main.html` | `#about` | anchor (intra-page) | PASS — `id="about"` at `Main.html:86` | — |
| `Main.html` | `#contact` | anchor (intra-page) | PASS — `id="contact"` at `Main.html:105` | — |
| `Main.html` | `MenuOrder.html` | sibling (hero CTA) | PASS | — |
| `Main.html` | `MenuOrder.html#mood` | sibling+anchor | PASS — `MenuOrder.html` exists; `id="mood"` at `MenuOrder.html:29` | — |
| `Main.html` | `MenuOrder.html` | sibling (featured card ×6) | PASS — all 6 cards point to `MenuOrder.html` | — |
| `Main.html` | `MenuOrder.html` | sibling | PASS | — |
| `Main.html` | `MenuOrder.html` | sibling | PASS | — |
| `Main.html` | `MenuOrder.html` | sibling | PASS | — |
| `Main.html` | `MenuOrder.html` | sibling | PASS | — |
| `Main.html` | `MenuOrder.html` | sibling | PASS | — |
| `Main.html` | `https://www.facebook.com/profile.php?id=100088182587477` | external | EXTERNAL | — |
| `Main.html` | `https://www.instagram.com/cafedejabrew/` | external | EXTERNAL | — |
| `Main.html` | `order-success.html` | sibling (cart drawer Order Now) | PASS — exists exact case | — |
| `MenuOrder.html` | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css` | external | EXTERNAL | — |
| `MenuOrder.html` | `style.css` | sibling | PASS | — |
| `MenuOrder.html` | `Main.html` | sibling (brand) | PASS — `Main.html:13` self | — |
| `MenuOrder.html` | `Main.html` | sibling (Home nav) | PASS | — |
| `MenuOrder.html` | `Main.html#about` | sibling+anchor | PASS — `id="about"` in `Main.html` | — |
| `MenuOrder.html` | `Main.html#contact` | sibling+anchor | PASS — `id="contact"` in `Main.html` | — |
| `MenuOrder.html` | `javascript:void(0)` | js (Cart drawer trigger) | PASS (js) — has `return false` | — |
| `MenuOrder.html` | `https://www.facebook.com/profile.php?id=100088182587477` | external | EXTERNAL | — |
| `MenuOrder.html` | `https://www.instagram.com/cafedejabrew/` | external | EXTERNAL | — |
| `MenuOrder.html` | `order-success.html` | sibling (cart drawer Order Now) | PASS | — |
| `MenuOrder.html` | `order-success.html` | sibling (JS template: Add to cart `onclick` — static fallback) | PASS | — |
| `MenuOrder.html` | `order-success.html` | sibling (JS template: Order Now button) | PASS | — |
| `order-success.html` | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css` | external | EXTERNAL | — |
| `order-success.html` | `style.css` | sibling | PASS | — |
| `order-success.html` | `Main.html` | sibling (brand) | PASS | — |
| `order-success.html` | `Main.html` | sibling (Home) | PASS | — |
| `order-success.html` | `MenuOrder.html` | sibling | PASS | — |
| `order-success.html` | `Main.html#about` | sibling+anchor | PASS — `id="about"` exists | — |
| `order-success.html` | `Main.html#contact` | sibling+anchor | PASS — `id="contact"` exists | — |
| `order-success.html` | `MenuOrder.html` | sibling (Order Again) | PASS | — |
| `order-success.html` | `MenuOrder.html` | sibling (cross-sell View ×3) | PASS | — |
| `order-success.html` | `MenuOrder.html` | sibling | PASS | — |
| `order-success.html` | `MenuOrder.html` | sibling | PASS | — |
| `order-success.html` | `https://www.facebook.com/profile.php?id=100088182587477` | external | EXTERNAL | — |
| `order-success.html` | `https://www.instagram.com/cafedejabrew/` | external | EXTERNAL | — |
| `order-success.html` | `MenuOrder.html` | sibling (JS `reorder` target) | PASS | — |
| `About.html` | `style.css` | sibling | PASS | — |
| `About.html` | `Main.html#about` | sibling+anchor | PASS — anchor valid | — |
| `CoffeeOrder.html` | `style.css` | sibling | PASS | — |
| `CoffeeOrder.html` | `MenuOrder.html` | sibling | PASS | — |
| `BakeryOrder.html` | `style.css` | sibling | PASS | — |
| `BakeryOrder.html` | `MenuOrder.html` | sibling | PASS | — |
| `Menu.html` | `style.css` | sibling | PASS | — |
| `Menu.html` | `MenuOrder.html` | sibling | PASS | — |

**Anchor inventory used for validation:** `Main.html` ids: `cart-badge`, `progress-bar`, `featured`, `about`, `contact`, `cart-drawer`, `cart-count`, `cart-items`; `MenuOrder.html` ids: `cart-badge`, `progress-bar`, `mood`, `pastry-first`, `search`, `menu-grid`, `cart-drawer`, `cart-count`, `cart-items`; `order-success.html` ids: `progress-bar`, `receipt`. All `#about`/`#contact`/`#mood` anchors resolve.

---

## 5. src Audit — Full Table

| File | src | Type | Status | Fix |
|------|-----|------|--------|-----|
| `Main.html` | `Coffeeshop.jpeg` | sibling image (hero) | PASS — `Coffeeshop.jpeg` exists exact case `style.css:249` not relevant | — |
| `Main.html` | `espresso-coffee.png` | sibling image | PASS — exists | — |
| `Main.html` | `Latte.jpeg` | sibling image | PASS — case exact (`Latte.jpeg` not `latte.jpeg`) | — |
| `Main.html` | `Cappuccino.jpg` | sibling image | PASS | — |
| `Main.html` | `Kwasant.jpg` | sibling image | PASS — case-sensitive preserved (`Kwasant.jpg` not `kwasant.jpg`) | — |
| `Main.html` | `Muffin.jpg` | sibling image | PASS | — |
| `Main.html` | `Macaron.jpg` | sibling image | PASS | — |
| `Main.html` | `Coffeeshop.jpeg` | sibling image (About section `Main.html:100`) | PASS | — |
| `Main.html` | `Kape.jpg` | sibling image (footer ig-strip) | PASS | — |
| `Main.html` | `Latte.jpeg` | sibling image | PASS | — |
| `Main.html` | `Donut.jpg` | sibling image | PASS | — |
| `Main.html` | `Muffin.jpg` | sibling image | PASS | — |
| `MenuOrder.html` | `${p.image}` | template (dynamic from `data/catalog.js:1`) | SKIP — runtime value; validated via catalog image audit below | — |
| `order-success.html` | `Donut.jpg` | sibling image (cross-sell) | PASS | — |
| `order-success.html` | `Americano-coffee.jpg` | sibling image | PASS — `Americano-coffee.jpg` exact case | — |
| `order-success.html` | `Macaron.jpg` | sibling image | PASS | — |
| `style.css` (indirect) | `Menuuu.jpg` | css `url('Menuuu.jpg')` at `style.css:206` | PASS — `Menuuu.jpg` exists; `Menu.jpg`/`Menuu.jpg` variants co-located preserved | — |
| `data/catalog.js` | `espresso-coffee.png` | catalog image `M-C-01` | PASS — exists | — |
| `data/catalog.js` | `Americano-coffee.jpg` | catalog `M-C-02` | PASS | — |
| `data/catalog.js` | `Latte.jpeg` | catalog `M-C-03` | PASS | — |
| `data/catalog.js` | `Cappuccino.jpg` | catalog `M-C-04` | PASS | — |
| `data/catalog.js` | `Frappuccino.jpg` | catalog `M-C-05` | PASS | — |
| `data/catalog.js` | `Kwasant.jpg` | catalog `M-P-01` | PASS | — |
| `data/catalog.js` | `Muffin.jpg` | catalog `M-P-02` | PASS | — |
| `data/catalog.js` | `Kringle.jpg` | catalog `M-P-03` | PASS | — |
| `data/catalog.js` | `Donut.jpg` | catalog `M-P-04` | PASS | — |
| `data/catalog.js` | `Macaron.jpg` | catalog `M-P-05` | PASS | — |

No broken `src` — 0 case-mismatch candidates. Note: `About.jpg`, `Background.jpeg`, `Menu.jpg`, `Menuu.jpg`, `Kape.jpg`, `Frappuccino.jpg`, `Kringle.jpg` present on disk but not all referenced — not an error.

---

## 6. Ordering Flow Preservation

All `Order Now` links point directly to `order-success.html:1` (static, no cart/backend) — consistent with `AGENTS.md` convention. `Main.html:131` and `MenuOrder.html:56` cart drawers use `href="order-success.html"` with `localStorage.removeItem('deja-brew-cart')` or `addToCart(); return false` — flow preserved.

---

## 7. Summary Table (by file)

| File | href count | src count | Broken | Banned | Verdict |
|------|-----------|-----------|--------|--------|---------|
| `Main.html` | 17 | 12 | 0 | 0 | PASS |
| `MenuOrder.html` | 12 | 1 (template) | 0 | 0 | PASS |
| `order-success.html` | 14 | 3 | 0 | 0 | PASS |
| `About.html` | 2 | 0 | 0 | 0 | PASS |
| `CoffeeOrder.html` | 2 | 0 | 0 | 0 | PASS |
| `BakeryOrder.html` | 2 | 0 | 0 | 0 | PASS |
| `Menu.html` | 2 | 0 | 0 | 0 | PASS |

**Total: 51 href, 16 src scanned — 0 broken, 0 banned, AD-4 satisfied, all 4 legacy redirects valid.**

*Generated by link-guardian subagent via regex extraction + `os.listdir` exact-case + `id` anchor verification; script: `C:\Users\John Kevin M. Tamayo\AppData\Local\Temp\opencode\audit.py`.*
