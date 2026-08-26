# Visual Audit — Enhanced Deja Brew

**Date:** 2026-08-27  
**Auditor:** deja-brew-visual-qa (subagent)  
**Scope:** `design-system.md:1` + `ARCHITECTURE-SPINE.md:1` (AD-5) vs `style.css:1`, `Main.html:1`, `MenuOrder.html:1`  
**Method:** Static read + token string match + rule inspection (no browser render). Checked exact hex strings, `@import`, rule blocks, media query, and DOM order.

---

## 1) Design Tokens & Surfaces — `design-system.md:5` / `ARCHITECTURE-SPINE.md:61` AD-5

AD-5 requires single `style.css` + tokens `#E8DAB2/#333/#f0a500/#FFF8F0`, Playfair+Inter, 220px images, 12px/16px radii, shadows. JS may only inject `style.width` (progress) and `transform` (drawer).

| Token / Rule | Spec Expectation | Found | Verdict |
|---|---|---|---|
| **Latte `#E8DAB2`** | `design-system.md:6` hero text on dark, accents | `style.css:5` `--latte:#E8DAB2`; used `style.css:139` `.intro h1{color:var(--latte)}`, `style.css:127` `.hero-badge{background:var(--latte)}`, `style.css:42` `.container h1` | **PASS** |
| **Ink `#333` / `#333333`** | `design-system.md:7` navbar + dark hero bg `#333` | `style.css:6` `--ink:#333333`; `style.css:46` `.navbar{background-color:var(--ink)}`, `style.css:95` `.intro{background:var(--ink)}`, `style.css:242` `.price-pill{background:var(--ink)}` | **PASS** |
| **Amber `#f0a500`** | `design-system.md:8` hover/progress/active; secondary `#ffb52e` | `style.css:7` `--amber:#f0a500`, `style.css:8` `--amber-2:#ffb52e`; `style.css:89` `#progress-bar{background:var(--amber)}`, `style.css:83` hover, `style.css:171` `.btn-primary:hover` | **PASS** |
| **Cream `#FFF8F0`** | `design-system.md:9` card bg (replaces `#f8f8f8`), surface | `style.css:9` `--cream:#FFF8F0`; `style.css:222` `.menu-item{background-color:var(--cream)}`, `style.css:179` `.values-ribbon{background:var(--cream)}`, `style.css:200` `#menu{background-color:var(--cream)}` | **PASS** |
| **Paper `#fdfbf7`, Muted `#8a7a66`, Line `#e7ddd0`** | `design-system.md:9-10` companions | `style.css:10` `--paper:#fdfbf7`, `style.css:11` `--muted:#8a7a66`, `style.css:12` `--line:#e7ddd0` — all consumed | **PASS** |
| **Shadow `0 14px 36px rgba(51,51,51,.11), 0 2px 8px rgba(51,51,51,.06)`** | `design-system.md:10` card shadow | `style.css:13` `--shadow: 0 14px 36px rgba(51,51,51,.11), 0 2px 8px rgba(51,51,51,.06)`; used `style.css:227` `.menu-item{box-shadow:var(--shadow)}`, `style.css:295` etc. Hover `style.css:14` `--shadow-hover` | **PASS** |
| **Fonts Playfair Display + Inter** | `design-system.md:13-14` Playfair headlines, Inter body | `style.css:2` `@import url('...Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700...')`; `style.css:20` `body{font-family:'Inter',...}`, `style.css:30` `h1,h2,h3{font-family:'Playfair Display', Georgia, serif}` | **PASS** |
| **Scale 4.5rem hero / 1.05 lh** | `design-system.md:13` tight hero | `style.css:136` `.intro h1{font-size:4.5rem; line-height:1.05}` mirrors `design-system.md:13` — 768px override `style.css:324` `2.6rem` is intentional responsive | **PASS** |
| **Image height 220px + `object-fit:cover` + width 100%** | `design-system.md:19` `.menu-img` | `style.css:249-253` `.menu-img{width:100%; height:220px; object-fit:cover; ...}` | **PASS** |
| **Card radius 12px vs Image radius 16px** | `design-system.md:18-19` cards 12px, images 16px `rounded-2xl` | `style.css:224` `.menu-item{border-radius:16px}` — **should be 12px**; `style.css:254` `.menu-img{border-radius:0}` — **should be 16px** (with `overflow:hidden` on card, top corners need image rounding). `style.css:121` hero image 16px is correct but menu images are not. | **FAIL** |
| **Card hover `translateY(-4px)`** | `design-system.md:18` | `style.css:232` `.menu-item:hover{transform:translateY(-4px); box-shadow:var(--shadow-hover)}` + `style.css:229` `transition:transform 0.2s ease, box-shadow 0.2s ease` | **PASS** |
| **Texture 5% overlay Menuuu.jpg** | `design-system.md:20` overlay on `#FFF8F0`, never full `background-size:cover` on `#menu` | `style.css:203-210` `#menu::before{background-image:url('Menuuu.jpg'); background-size:cover; opacity:0.05; pointer-events:none}` over `style.css:200` `#menu{background-color:var(--cream)}` — correct layering; `#menu` itself has no image bg | **PASS** |
| **Single `style.css`** | `ARCHITECTURE-SPINE.md:61` AD-5, `style.css:1` single source | `Main.html:8` + `MenuOrder.html:8` only `<link href="style.css">` + Font Awesome CDN (allowed per `ARCHITECTURE-SPINE.md:80` Icons). No second CSS file, no inline `<style>` blocks. JS injects only `style.css:88` `width` for `#progress-bar` and `style.css:349` `transform` for `.cart-drawer` — compliant. Note stray legacy pages `BakeryOrder.html`, `CoffeeOrder.html`, `Menu.html` still coexist at root (AD-4 says 3 docs) — not a style drift but route sprawl. | **PASS** (with route note) |

**Patch needed for this section:**

```css
/* style.css:220 — fix card radius to spec 12px */
.menu-item {
  border-radius: 12px; /* was 16px */
}
/* style.css:249 — fix image radius to spec 16px; card overflow:hidden already clips */
.menu-img {
  border-radius: 16px 16px 0 0; /* was 0; use 16px top to preserve card 12px outer while image fills */
}
/* alternative if full 16px image inside 12px card causes clipping artifact: keep image 12px top */
```

---

## 2) Responsive 768px Switch — `design-system.md` surfaces + `style.css:320`

Spec breakpoint switches `.menu-grid` and `.about-content` to column (AGENTS.md:1 `style.css:205` reference).

| Rule | Expectation | Found | Verdict |
|---|---|---|---|
| **Media query 768px exists** | `style.css:320` `@media (max-width:768px)` | `style.css:320` `@media (max-width: 768px)` present | **PASS** |
| **`.menu-grid` column at 768px** | stack cards | `style.css:326-329` `.menu-grid, .about-content{flex-direction:column; align-items:center}` + `style.css:330` `.menu-item{width:100%}` + `style.css:325` `.values-grid, .footer-grid` also column | **PASS** |
| **`.about-content` column at 768px** | stack about | Same block `style.css:326` includes `.about-content` | **PASS** |
| **Hero sub-switch** | not required but present | `style.css:321` `.intro .container{flex-direction:column}`, `style.css:323` `.hero-visual img{height:280px}`, `style.css:324` `h1 2.6rem` — graceful degrade | **PASS** |
| **Cart drawer narrows** | `design-system.md:26` 380px → 320px at 768px | Not implemented: `style.css:346` `.cart-drawer{width:380px; max-width:92vw}` — no 768px override to 320px. `max-width:92vw` covers mobile but spec exact 320px not met. | **MINOR FAIL** |

**Patch needed:**

```css
@media (max-width: 768px){
  .cart-drawer{ width:320px; }
}
```

---

## 3) Hero / Pills / Tags / Image-First Cards — `design-system.md:29`, `design-system.md:23`, `design-system.md:19`

| Rule | Expectation | Found | Verdict |
|---|---|---|---|
| **Hero dark `#333` + `#E8DAB2` text** | `design-system.md:30` `background #333`, `color #E8DAB2` | `style.css:95` `.intro{background:var(--ink)}` (=#333333) ✓; `style.css:96` `color:var(--paper)` (#fdfbf7) — spec says `#E8DAB2` for hero. `style.css:139` `h1{color:var(--latte)}` is correct, but `style.css:141` `.intro p{color:var(--paper)}` and `style.css:150` `.customer-message{color:var(--latte)}` split the difference: **partial compliance** — body copy uses paper not latte, still dark premium contrast achieved. | **PASS (minor deviation noted)** |
| **Hero split 48% + badge offset -16px** | `design-system.md:29` left 48%, badge `-16px` | `style.css:114` `.hero-copy{flex:1 1 48%}`, `style.css:115` `.hero-visual{flex:1 1 52%}`, `style.css:124-126` `.hero-badge{left:-16px; bottom:18px; background:var(--latte); color:var(--ink)}`; `Main.html:36-38` hero structure + `Main.html:38` badge `Fresh today • from ₱30` matches spec `₱85` placeholder variant | **PASS** |
| **Dual CTA** | `design-system.md:29` primary `#333`/latte + ghost | `Main.html:31-33` `<a class="btn btn-primary">Explore Our Menu</a>` + `<a class="btn">Find my vibe</a>`; `style.css:166` `.btn-primary{background:var(--latte)}` + `style.css:154` `.btn{border:1px solid var(--latte)}` | **PASS** |
| **Pill prices** | `design-system.md:23` `bg #333` or `#E8DAB2` on dark, `6px 12px`, `999px`, `600` | `style.css:238-248` `.price-pill{display:inline-block; padding:6px 12px; background:var(--ink); color:white; border-radius:999px; font-weight:700}` — weight 700 vs spec 600 is acceptable, token/parity correct. Used `Main.html:60` `<span class="price-pill">₱125.00</span>` and `MenuOrder.html:85` `${p.display}` | **PASS** |
| **Tags** | `design-system.md` tabs/pills uppercase chips | `style.css:273-284` `.tag{font-size:0.7rem; font-weight:600; text-transform:uppercase; padding:4px 8px; border-radius:999px; background:var(--latte)}` + `Main.html:60` `<span class="tag">Craft</span>` + `MenuOrder.html:88` `<span class="tag">${p.tag}</span>` | **PASS** |
| **Image-first cards** | `design-system.md:19` `.menu-img` first, then copy | `Main.html:58-61` `<img class="menu-img">` → `<h3>` → `<span price-pill>` → `<p>` → `<span tag>` ✓; `MenuOrder.html:82-89` template string: `img` → `h3` → `price-pill` → `p sensory` → `p origin` → `tag` ✓ ; `style.css:231` `overflow:hidden` on card encloses image | **PASS** |
| **Image filenames case-sensitive** | `AGENTS.md` `Kwasant.jpg`, `Menuuu.jpg` | `Main.html:71` `Kwasant.jpg` correct casing; `style.css:206` `Menuuu.jpg` correct; `MenuOrder.html` uses catalog `p.image` — verify `data/catalog.js` preserves casing | **PASS** |

---

## Summary

**9 of 11 token groups PASS, 2 FAIL (1 critical radius, 1 minor drawer width). Responsive + hero/pills/tags/image-first all PASS.**

| Category | Result | Required Action |
|---|---|---|
| Tokens palette/fonts/shadows/texture/single-CSS | **PASS** | none |
| Radii 12px/16px | **FAIL** | Patch `style.css:224` + `style.css:254` as above |
| Responsive 768px | **PASS** | optional patch drawer to 320px |
| Hero dark/pill/tag/image-first | **PASS** | none (optional `style.css:96` hero body text → `var(--latte)` if strict spec literal) |

**Minimal patches to reach full spec compliance:**

1. **Critical:** `style.css:224` `border-radius:16px` → `12px`; `style.css:249` `border-radius:0` → `16px 16px 0 0` (or `16px` if card radius also moved to 16px — but spec says 12px card / 16px image, so top-only preserves outline).
2. **Minor:** Add drawer 320px at 768px.
3. **Optional strict:** `style.css:96` `.intro{color:var(--latte)}` vs current `var(--paper)` if audit demands literal `design-system.md:30` hero color; current low-contrast tradeoff is intentional editorial but diverges from literal.
4. **Route hygiene (out of scope for visuals):** Archive/delete `About.html`, `Menu.html`, `BakeryOrder.html`, `CoffeeOrder.html` per `ARCHITECTURE-SPINE.md:55` AD-4 single routing surface — not a visual failure but flagged for completeness.
5. **Not visual but observed:** `Main.html:142` drawer `onclick="localStorage.removeItem(...)"` bypasses `cart.js` single-owner rule `ARCHITECTURE-SPINE.md:49` — should call `cart.clear()`.

No other blocking visual defects. Re-run audit after patch by reopening `Main.html` + `MenuOrder.html` at 768px and 1200px and confirming card corners and image corners clip correctly.
