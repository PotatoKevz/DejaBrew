---
title: 'Horizon C — Scale & Maintainability (build sync + casing guard + CI + manifest)'
type: 'feature'
created: '2026-08-27'
status: 'done'
review_loop_iteration: 0
baseline_commit: '5aa67cdd7e010d822abd60eb27797b10d032f15c'
context:
  - '_bmad-output/planning-artifacts/architecture/architecture-enhanced-deja-brew-2026-08-27/ARCHITECTURE-SPINE.md'
  - 'data/catalog.js'
  - 'package.json'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Hand-synced catalog + no casing guard + no CI means drift (31 vs 10) and broken `Kwasant.jpg` cases slip to deploy.

**Approach:** Add vanilla build-scale layer staying static: catalog sync validator, casing guard, npm verify scripts, minimal CI, manifest for install — no backend, no build framework.

## Boundaries & Constraints

**Always:** AD-1 static renders, AD-2 read-only catalog, AD-5 one style.css, no backend.

**Ask First:** Adding node build dep beyond vanilla.

**Never:** SSR, payment, second CSS, JS style injection.

## I/O & Edge-Case Matrix

| Scenario | Input | Expected | Error |
|----------|-------|----------|-------|
| Sync check | catalog.js vs menu-catalog.md | `npm run check:catalog` warns if counts differ | No throw |
| Casing guard | `Kwasant.jpg` vs `kwasant.jpg` | `check:casing` fails on mismatch | Report |
| CI | push | `npx playwright test` runs | Fail blocks merge |
| Manifest | Load Main.html | `manifest.json` reachable, install prompt possible | No offline sync |

</frozen-after-approval>

## Code Map

- `tools/check-casing.js` — validate image casing against catalog.js + HTML
- `tools/check-catalog.js` — compare menu-catalog.md counts to data/catalog.js
- `package.json` — add scripts `check:catalog`, `check:casing`, `verify`
- `.github/workflows/ci.yml` — run `npm ci` + `npx playwright test`
- `manifest.json` + `sw.js` lite (optional offline toast, no bg sync)
- `tests/e2e/deja-brew.spec.js` — add manifest reachable check

## Tasks & Acceptance

**Execution:**
- [x] `tools/check-catalog.js` — node script reads menu-catalog.md + data/catalog.js counts
- [x] `tools/check-casing.js` — scan HTML + catalog.js vs filesystem casing
- [x] `package.json` — add scripts
- [x] `manifest.json` — warm editorial manifest
- [x] `.github/workflows/ci.yml` — CI for playwright
- [x] `tests/e2e/deja-brew.spec.js` — add manifest test

**Acceptance:**
- Given `npm run verify`, then both checks pass
- Given CI, then playwright runs
- Given load, then manifest.json 200

## Spec Change Log

## Verification

**Commands:**
- `npm run verify` -- pass
- `npx playwright test` -- 12+ pass

