#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Scan installed BMad skills and emit a routing registry as JSON.

Reads every SKILL.md under <project-root>/.agents/skills/ (or a directory
given via --skills-dir), extracts the frontmatter name and description from
each, and prints a JSON array sorted by name so an orchestrating agent can
route work without re-teaching itself after every install.

Output shape:
    [
      {
        "name": "gds-gdd",
        "path": "C:/.../.agents/skills/gds-gdd/SKILL.md",
        "description": "Create, update, or validate a Game Design Document..."
      }
    ]

Skills whose frontmatter lacks a name fall back to their folder basename;
missing descriptions come through as empty strings rather than failures.

Usage:
    uv run scan-agents.py <project-root> [--skills-dir DIR] [-o OUT.json] [--verbose]

Exit codes: 0 = skills found, 1 = no skills found, 2 = error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---", re.DOTALL)


def parse_frontmatter_fields(content: str) -> dict[str, str]:
    """Extract simple scalar frontmatter fields (name, description)."""
    match = FRONTMATTER_RE.match(content.strip())
    if not match:
        return {}
    fields: dict[str, str] = {}
    for line in match.group(1).splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or ":" not in stripped:
            continue
        key, _, value = stripped.partition(":")
        value = value.strip().strip("'\"")
        fields[key.strip()] = value
    return fields


def collect_skills(skills_dir: Path) -> list[dict]:
    """Scan one level of skill folders for SKILL.md files."""
    skills = []
    for skill_dir in sorted(p for p in skills_dir.iterdir() if p.is_dir()):
        skill_md = skill_dir / "SKILL.md"
        if not skill_md.is_file():
            continue
        try:
            content = skill_md.read_text(encoding="utf-8")
        except OSError as exc:
            print(f"warning: unreadable {skill_md}: {exc}", file=sys.stderr)
            continue
        fields = parse_frontmatter_fields(content)
        skills.append(
            {
                "name": fields.get("name") or skill_dir.name,
                "path": str(skill_md),
                "description": fields.get("description", ""),
            }
        )
    return skills


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="scan-agents.py",
        description=(
            "Scan installed skills (.agents/skills/*/SKILL.md) and print a JSON "
            "registry of names, paths, and descriptions for agent routing."
        ),
    )
    parser.add_argument("project_root", help="Project root containing .agents/skills/")
    parser.add_argument(
        "--skills-dir",
        default=".agents/skills",
        help="Skills directory relative to project root (default: .agents/skills)",
    )
    parser.add_argument("-o", "--output", help="Write JSON here instead of stdout")
    parser.add_argument("--verbose", action="store_true", help="Progress to stderr")
    args = parser.parse_args()

    root = Path(args.project_root).resolve()
    skills_dir = root / args.skills_dir
    if not skills_dir.is_dir():
        print(f"error: skills directory not found: {skills_dir}", file=sys.stderr)
        return 2

    if args.verbose:
        print(f"scanning {skills_dir}", file=sys.stderr)

    skills = collect_skills(skills_dir)
    payload = json.dumps(skills, indent=2, ensure_ascii=False) + "\n"

    if args.output:
        out_path = Path(args.output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(payload, encoding="utf-8")
        if args.verbose:
            print(f"wrote {len(skills)} entries to {out_path}", file=sys.stderr)
    else:
        sys.stdout.write(payload)

    if args.verbose:
        print(f"found {len(skills)} skills", file=sys.stderr)
    return 0 if skills else 1


if __name__ == "__main__":
    raise SystemExit(main())
