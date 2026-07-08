#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

BLOCKED_LICENSE_MARKERS = {"cc-by-nc", "non-commercial", "nc-only", "unknown-commercial-use-blocked"}


def scan_license_manifests(root: Path) -> list[str]:
    findings: list[str] = []
    for manifest in root.rglob("license-manifest.csv"):
        if ".git" in manifest.parts or "node_modules" in manifest.parts:
            continue
        with manifest.open(newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                runtime = row.get("runtime_pack", "").strip().lower() == "true"
                license_id = row.get("license", "").strip().lower()
                if runtime and license_id in BLOCKED_LICENSE_MARKERS:
                    findings.append(f"{manifest}: runtime source uses blocked license {license_id}")
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Block non-commercial or unknown licenses from runtime packs.")
    parser.add_argument("--check", action="store_true", help="Run the license gate.")
    args = parser.parse_args()
    if not args.check:
        parser.error("expected --check")
    findings = scan_license_manifests(Path.cwd())
    if findings:
        print("LICENSE_GATE_FAIL")
        for finding in findings:
            print(finding)
        return 1
    print("LICENSE_GATE_PASS no blocked runtime license manifests found")
    return 0


if __name__ == "__main__":
    sys.exit(main())
