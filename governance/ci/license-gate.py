#!/usr/bin/env python3
"""GamePoint License Gate — blocks non-commercial sources from runtime packs.

Contract §1.1.3 / WP-0: a knowledge source whose license is non-commercial
(CC-BY-NC, CC-BY-NC-SA, ...) must never be runtime-eligible. Such sources may
exist only in the quarantine namespace (handled by packages/ingest's
license_enforcer at ingest time); this gate is the build-time backstop.

Scanned inputs:
  1. supabase/seed/*.sql        — knowledge_sources seed rows (one row per line
                                  by repo style rule; enforced here).
  2. packages/ingest/**/*.yml|yaml|json — source manifests with `license` and
                                  `runtime_eligible` fields.

Exit codes: 0 = clean, 1 = violation, 2 = misconfiguration.
Run `license-gate.py --self-test` in CI to prove the gate detects violations
(embedded OSRS fixture) before scanning the real tree.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

NC_LICENSE = re.compile(r"CC[- ]BY[- ]NC", re.IGNORECASE)
TRUE_TOKEN = re.compile(r"\b(true|TRUE|True)\b")


def check_sql_line(line: str) -> bool:
    """Return True if this seed line pairs an NC license with runtime eligibility.

    Seed style rule: one knowledge_sources row per line, so a line containing
    both an NC license token and a boolean true is a violation. Lines that set
    runtime_eligible false (quarantine) pass.
    """
    if not NC_LICENSE.search(line):
        return False
    return bool(TRUE_TOKEN.search(line))


def check_manifest(data: object) -> list[str]:
    """Walk a parsed manifest; return violation descriptions."""
    violations: list[str] = []

    def walk(node: object, path: str) -> None:
        if isinstance(node, dict):
            lic = node.get("license")
            eligible = node.get("runtime_eligible")
            if isinstance(lic, str) and NC_LICENSE.search(lic) and eligible is True:
                violations.append(
                    f"{path}: license={lic!r} with runtime_eligible=true"
                )
            for k, v in node.items():
                walk(v, f"{path}.{k}")
        elif isinstance(node, list):
            for i, v in enumerate(node):
                walk(v, f"{path}[{i}]")

    walk(data, "$")
    return violations


def parse_manifest(path: Path) -> object:
    text = path.read_text(encoding="utf-8")
    if path.suffix == ".json":
        return json.loads(text)
    try:
        import yaml  # type: ignore[import-untyped]
    except ImportError:
        # Fallback: line-level scan mirrors the SQL rule so YAML manifests are
        # still gated even without PyYAML installed.
        return [
            {"license": "CC-BY-NC", "runtime_eligible": True}
            for line in text.splitlines()
            if check_sql_line(line)
        ]
    return yaml.safe_load(text)


def scan_repo(root: Path) -> list[str]:
    violations: list[str] = []
    for sql in sorted((root / "supabase" / "seed").glob("*.sql")) if (
        root / "supabase" / "seed"
    ).is_dir() else []:
        for lineno, line in enumerate(sql.read_text(encoding="utf-8").splitlines(), 1):
            if check_sql_line(line):
                violations.append(f"{sql.relative_to(root)}:{lineno}: {line.strip()}")
    ingest = root / "packages" / "ingest"
    if ingest.is_dir():
        for pattern in ("**/*.yml", "**/*.yaml", "**/*.json"):
            for manifest in sorted(ingest.glob(pattern)):
                try:
                    data = parse_manifest(manifest)
                except (json.JSONDecodeError, UnicodeDecodeError) as exc:
                    violations.append(
                        f"{manifest.relative_to(root)}: unparseable manifest ({exc})"
                    )
                    continue
                for v in check_manifest(data):
                    violations.append(f"{manifest.relative_to(root)}: {v}")
    return violations


def self_test() -> int:
    """Prove the gate detects violations, using an OSRS fixture (test data only)."""
    osrs_bad = {
        "sources": [
            {
                "title": "old-school-runescape",
                "url": "https://oldschool.runescape.wiki/api.php",
                "license": "CC-BY-NC-SA",
                "runtime_eligible": True,  # fixture violation
            }
        ]
    }
    osrs_quarantined = {
        "sources": [
            {
                "title": "old-school-runescape",
                "url": "https://oldschool.runescape.wiki/api.php",
                "license": "CC-BY-NC-SA",
                "runtime_eligible": False,
            }
        ]
    }
    bad_sql = (
        "insert into knowledge_sources (title_id, url, license, runtime_eligible) "
        "values (8, 'https://oldschool.runescape.wiki', 'CC-BY-NC-SA', true);"
    )
    good_sql = bad_sql.replace("true", "false")

    checks = [
        ("manifest violation detected", bool(check_manifest(osrs_bad))),
        ("quarantined manifest passes", not check_manifest(osrs_quarantined)),
        ("sql violation detected", check_sql_line(bad_sql)),
        ("quarantined sql passes", not check_sql_line(good_sql)),
    ]
    ok = True
    for name, result in checks:
        print(f"license-gate self-test: {'PASS' if result else 'FAIL'} — {name}")
        ok = ok and result
    return 0 if ok else 2


def main(argv: list[str]) -> int:
    if "--self-test" in argv:
        return self_test()
    root = Path(argv[argv.index("--root") + 1]) if "--root" in argv else Path(
        __file__
    ).resolve().parents[2]
    if not root.is_dir():
        print(f"license-gate: FATAL — root {root} not found", file=sys.stderr)
        return 2
    violations = scan_repo(root)
    if violations:
        print("license-gate: FAIL — non-commercial source(s) marked runtime-eligible:",
              file=sys.stderr)
        for v in violations:
            print(f"  {v}", file=sys.stderr)
        return 1
    print(f"license-gate: PASS — scanned {root}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
