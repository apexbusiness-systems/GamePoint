"""License enforcer (§1.1.5 / WP-3): non-commercial sources never reach runtime packs.
Quarantined content is written to a separate namespace and is structurally
unreachable at retrieval time (claims.status stays 'quarantined')."""
from __future__ import annotations

from dataclasses import dataclass

RUNTIME_ELIGIBLE_LICENSES = frozenset({"CC-BY-SA", "official-API-terms", "proprietary"})
BLOCKED_FOR_RUNTIME = frozenset({"CC-BY-NC-SA", "CC-BY-NC", "unknown"})


class LicenseViolation(Exception):
    """Raised when a blocked-license source is aimed at a runtime pack."""


@dataclass(frozen=True)
class SourceLicense:
    source_id: str
    license: str
    runtime_pack: bool
    attribution: str  # CC-BY-SA requires retained attribution metadata


def enforce(source: SourceLicense) -> str:
    """Return the claim namespace ('runtime' | 'quarantine') or raise.

    - Runtime pack + blocked license  -> LicenseViolation (build fails loudly).
    - Runtime pack + eligible license -> 'runtime', attribution required.
    - Non-runtime target              -> 'quarantine' (research-only namespace).
    """
    if source.runtime_pack:
        if source.license in BLOCKED_FOR_RUNTIME:
            raise LicenseViolation(
                f"source {source.source_id}: license {source.license} is blocked for "
                f"runtime packs; write to quarantine namespace instead"
            )
        if source.license not in RUNTIME_ELIGIBLE_LICENSES:
            raise LicenseViolation(
                f"source {source.source_id}: unrecognized license {source.license!r} — "
                f"UNCERTAIN licenses never default to runtime"
            )
        if source.license == "CC-BY-SA" and not source.attribution.strip():
            raise LicenseViolation(
                f"source {source.source_id}: CC-BY-SA requires attribution metadata"
            )
        return "runtime"
    return "quarantine"
