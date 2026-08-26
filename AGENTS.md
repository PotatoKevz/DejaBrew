<!-- bmad:context -->
<!-- Verified 2026-08-27 against no-git. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## Enhanced Deja Brew

Static coffeeshop site — HTML + `style.css:1`, `data/catalog.js:1`, Font Awesome CDN, no build framework, vanilla JS `LocalStorage` demo cart. First-year college project enhanced via spec `spec-enhanced-deja-brew` (6 CAPs, 7 stories). Planning in `_bmad-output/planning-artifacts/` + `specs/`, verification in `tests/e2e/`, opencode agents in `.opencode/agents/`.

## Where things are

- App: `Main.html:1` → `MenuOrder.html:1` → `order-success.html:1` (3 routes per AD-4; `Menu.html`/`About.html`/`CoffeeOrder.html`/`BakeryOrder.html` are 302 redirects)
- Catalog + tokens: `data/catalog.js:1`, `style.css:1`, `menu-catalog.md` companion; images co-located at root (`*.jpg`/`*.jpeg`/`*.png` exact casing `Kwasant.jpg`)
- Tests: `tests/e2e/deja-brew.spec.js:1` + `playwright.config.js:1` (`python -m http.server 3000`)
- Architecture: `_bmad-output/planning-artifacts/architecture/architecture-enhanced-deja-brew-2026-08-27/ARCHITECTURE-SPINE.md:1`

## Running and verifying

- Install once: `npm install` — then `npx playwright test` (7/7) or `npx serve .` and open `Main.html`
- Verify at `768px` — `style.css:320` breakpoint stacks `.menu-grid`/`.about-content`/`.values-grid` and hero; check pill `₱`, `220px` `16px` image, amber `3px` progress

## Conventions that differ from defaults

- Ordering is `LocalStorage` demo `deja-brew-cart: [{id,qty}]` via `cart` module — every `Order Now` still links directly to `order-success.html:1`; no payment/auth/backend
- Keep navigation hrefs as sibling HTML (`MenuOrder.html`, `Main.html#about`, `Main.html#contact`); do not convert to routed paths

## Known pitfalls

- Image filenames are case-sensitive (`Kwasant.jpg`, `Menuuu.jpg`) — preserve casing on all `src` references

<!-- /bmad:context -->
