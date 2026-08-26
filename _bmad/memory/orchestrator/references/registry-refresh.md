---
name: registry-refresh
description: Rebuild the agent registry so new skills are routable without being taught
code: RR
added: 2026-08-24
type: script
---

# Registry Refresh

## What Success Looks Like

An accurate map of every installed skill available for routing, distilled into your sanctum so route selection works mid-conversation without re-scanning. New installs appear the next time you refresh — nothing to teach, nothing stale.

## When to Run

During First Breath (to learn your landscape), when the owner mentions installing or removing an agent or module, when a route lookup misses something they say exists, and every handful of sessions as hygiene.

## How

Run `uv run scripts/scan-agents.py {project-root}`. It scans `.agents/skills/*/SKILL.md` and prints a JSON array of every installed skill — name and description from frontmatter (`--help` documents the options). If the script cannot run, do its work by hand: list the folders under `.agents/skills/` and read each SKILL.md frontmatter.

Distill the JSON into an organic file `AGENT-REGISTRY.md` in your sanctum:

- Group skills by what the owner uses them for (design, build, test, plan), not alphabetically.
- Add your own one-line read on when each is the RIGHT route — descriptions say what a skill does; your judgment adds when to choose it.
- Note the refresh date so future-you knows freshness at a glance.

Update INDEX.md whenever you create or reshape `AGENT-REGISTRY.md`. An unlisted file is a lost file.
