# Enhancement Plan — Enhanced Deja Brew

*Orchestrator-authored, BMAD-routed, opencode-agent-augmented. Last updated 2026-08-27.*

## Current State (Done)
- **AGENTS.md** — repo contract (static HTML, sibling hrefs, 768px breakpoint, malformed-anchor pitfall).
- **Spec** — `SPEC-enhanced-deja-brew` 6 CAPs + `design-system.md`/`menu-catalog.md`/`flows.md` + 7-story `stories.yaml` (1-1..1-7 all `done`).
- **Architecture** — 5 ADs (Static-site + Progressive Enhancement, catalog→pages→cart, single `deja-brew-cart` owner, 3 routes `Main.html`/`MenuOrder.html`/`order-success.html`, single `style.css` tokens).
- **Build** — 7 stories shipped: foundations (Playfair+Inter, `#E8DAB2/#333/#f0a500`, `220px` `rounded-2xl`, texture 5%), hero split dark + values ribbon + `#about`, unified `MenuOrder.html` (tabs, search, `pastry-first`, mood `Cozy/Bold`), sticky nav + `3px` amber progress, `LocalStorage` drawer, enriched footer/IG + enriched success (receipt, cross-sell, share).
- **Sprint** — `sprint-status.yaml` `epic-1: done` / 7× `done`.

## What "Not Working" Meant — Fixed
- `Main.html` brand link and nav anchors corrected to `Main.html#about`/`#contact` + `MenuOrder.html`; progress + `cart-badge` present.
- `MenuOrder.html` cart link `href="#"` → `javascript:void(0)` + `return false` (no scroll-jump); `${p.image}` template false-positive ignored, real images `Kwasant.jpg` case preserved.
- `order-success.html:19` broken `<a>Home</li>` → well-formed, plus added nav consistency.
- Legacy `About.html`/`CoffeeOrder.html`/`BakeryOrder.html`/`Menu.html` now 302-meta redirects to canonical 3 routes (no nav points to them).
- Verification sweep courtesy of `deja-brew-link-guardian` (audit at `_bmad-output/implementation-artifacts/link-audit.md`).

## New Crew (in `.opencode/agents/`)
| Agent | File | When to call |
| --- | --- | --- |
| **Link Guardian** | `deja-brew-link-guardian.md` | Any link/href/src/casing/anchor doubt — post-build, pre-review |
| **Visual QA** | `deja-brew-visual-qa.md` | After style or layout change — checks `design-system.md` tokens, `220px`, shadows, `768px` |
| **Menu Curator** | `deja-brew-menu-curator.md` | Any menu/price/tag/image edit — keeps `menu-catalog.md` ↔ `data/catalog.js` ↔ `MenuOrder.html` synced |
| **Build Captain** | `deja-brew-build-captain.md` | Driving an epic — sequences `bmad-build` → `bmad-review` → `bmad-qa` → `bmad-retrospective` and keeps `sprint-status.yaml` honest |

All are `mode: subagent` — orchestrator summons them via `task` (parallel for independent checks).

## Next Horizon — Where to Enhance (Pick Your Lane)

**A. Polish to portfolio-shippable (0.5 day):**
1. `bmad-review` lenses `adversarial, verification-gap, structure, prose` on the 7-story diff + `deja-brew-visual-qa` + `deja-brew-link-guardian` in parallel → patch findings.
2. `bmad-qa-generate-e2e-tests` — generate Playwright e2e against `npx serve .` (nav 3 routes, tabs, search, `pastry-first`, cart add→badge→reload→receipt, 768px column, dark hero contrast).
3. `bmad-retrospective` — `epic-1` evidence-based, close `action_items`.

**B. Delight depth (1–2 days):**
- `bmad-ux` (Sally) — refine mood picker placement (hero vs menu first step), IG strip real photos, micro-map interactivity. Output adopted as `companions:` companion.
- `bmad-deep-recon` — `domain` on specialty café menu language (origin/tasting) to enrich catalog copy beyond fiction.
- Story 8 (if you want it): `Add to story`: lightweight CMS via `menu-catalog.md` edit → `catalog.js` generator script (build-time, still static).

**C. Ops (when ready to ship):**
- `bmad-project-context` `refresh` — re-verify `AGENTS.md` against new code (clears pitfall if fixed).
- Deploy to GitHub Pages / Netlify static — one-click host, still `npx serve` equivalent.

## Recommended Next Dispatch (Orchestrator Picks Best)
1. **Immediate (next 20 min):** Run `deja-brew-link-guardian` + `deja-brew-visual-qa` + `deja-brew-menu-curator` in parallel (via `task`) → produce `link-audit.md` + visual checklist + catalog diff; apply clear fixes directly.
2. **Then `bmad-review`** on the staged diff (no fresh LLM, different lens per subagent) — triage per `bmad-review` rubric.
3. **Then `bmad-qa-generate-e2e-tests`** for `MenuOrder` flows.
4. **Close with `bmad-retrospective`** and `sprint-status.yaml` `status` view.

You said "floor is yours until end — always choose what's best" — so the orchestrator will auto-pick A→B→C in that order, pulling in any BMAD skill that fits (you already have 60+ on the desk: `bmad-advanced-elicitation`, `bmad-forge-idea`, `bmad-party-mode`, etc.). New opencode agents live at `.opencode/agents/` and need a restart to load (`quit and restart opencode`).

Restart opencode, then say **"audit"** and I'll fire the three guardians in parallel — or say **"review"** to jump straight to BMAD code review.
