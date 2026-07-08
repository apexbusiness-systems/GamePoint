"""End-to-end pack build for one title: `python -m gamepoint_ingest.run_pack --title <slug>`.

Compliance order (§1.1): license gate first, then fetch, then synthesize, then embed.
Idempotent: re-running against unchanged sources inserts zero rows."""
from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass

from .chunk_embed import Embedder, embed_claims, synthesize_claims
from .license_enforcer import LicenseViolation, SourceLicense, enforce
from .mediawiki import MediaWikiClient
from .store import SourceRecord, Store


@dataclass(frozen=True)
class WikiSourceSpec:
    source_id: str
    title_id: str
    api_url: str
    license: str
    runtime_pack: bool
    categories: tuple[str, ...]
    trust_tier: int = 2


@dataclass(frozen=True)
class PackReport:
    title_id: str
    pages_fetched: int
    claims_inserted: int
    embeddings_inserted: int
    quarantined: bool


def build_wiki_pack(
    spec: WikiSourceSpec,
    store: Store,
    embedder: Embedder,
    client: MediaWikiClient,
) -> PackReport:
    namespace = enforce(
        SourceLicense(
            source_id=spec.source_id,
            license=spec.license,
            runtime_pack=spec.runtime_pack,
            attribution=f"license {spec.license}, api {spec.api_url}",
        )
    )
    pages = claims_total = chunks_total = 0
    for category in spec.categories:
        for page in client.iter_category(category, lambda h: store.has_scrape_hash(spec.source_id, h)):
            store.upsert_source_record(
                SourceRecord(
                    source_id=spec.source_id,
                    canonical_url=page.canonical_url,
                    scrape_hash=page.scrape_hash,
                    trust_tier=spec.trust_tier,
                )
            )
            result = embed_claims(
                spec.title_id,
                synthesize_claims(page.text, page.attribution),
                store,
                embedder,
                namespace,
            )
            pages += 1
            claims_total += result["claims_inserted"]
            chunks_total += result["embeddings_inserted"]
    return PackReport(
        title_id=spec.title_id,
        pages_fetched=pages,
        claims_inserted=claims_total,
        embeddings_inserted=chunks_total,
        quarantined=(namespace == "quarantine"),
    )


def _fetch_specs(base_url: str, key: str, slug: str) -> list[WikiSourceSpec]:
    """Read source specs for a title from the seeded registry (PostgREST)."""
    import json
    import urllib.parse
    import urllib.request

    query = urllib.parse.urlencode(
        {
            "select": "id,title_id,url,license,runtime_eligible,titles!inner(slug)",
            "titles.slug": f"eq.{slug}",
            "source_type": "eq.mediawiki_api",
        }
    )
    req = urllib.request.Request(
        f"{base_url.rstrip('/')}/rest/v1/knowledge_sources?{query}",
        headers={"apikey": key, "authorization": f"Bearer {key}"},
    )
    with urllib.request.urlopen(req, timeout=30) as res:
        rows = json.loads(res.read())
    default_categories = ("Gameplay_mechanics",)  # per-title overrides via --category
    return [
        WikiSourceSpec(
            source_id=row["id"],
            title_id=row["title_id"],
            api_url=row["url"],
            license=row["license"],
            runtime_pack=row["runtime_eligible"],
            categories=default_categories,
        )
        for row in rows
    ]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build a knowledge pack for one title.")
    parser.add_argument("--title", required=True, help="title slug, e.g. baldurs-gate-3")
    parser.add_argument("--category", action="append", help="wiki category to ingest (repeatable)")
    args = parser.parse_args(argv)

    import os

    supabase_url = os.environ.get("SUPABASE_URL", "")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    openai_key = os.environ.get("OPENAI_API_KEY", "")
    if not (supabase_url and service_key and openai_key):
        print(
            "UNCERTAIN: live pack build requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY "
            "and OPENAI_API_KEY (docs/runbooks/wp3-packs.md). Hermetic verification runs "
            "via the test suite.",
            file=sys.stderr,
        )
        return 1

    from .chunk_embed import OpenAIEmbedder
    from .store import SupabaseStore

    store = SupabaseStore(supabase_url, service_key)
    embedder = OpenAIEmbedder(openai_key)
    reports: list[PackReport] = []
    for spec in _fetch_specs(supabase_url, service_key, args.title):
        if args.category:
            spec = WikiSourceSpec(**{**spec.__dict__, "categories": tuple(args.category)})
        client = MediaWikiClient(spec.api_url, spec.license)
        try:
            reports.append(build_wiki_pack(spec, store, embedder, client))
        except LicenseViolation as exc:
            print(f"BLOCKED: {exc}", file=sys.stderr)
            return 1
    for report in reports:
        print(report)
    if not reports:
        print(f"UNCERTAIN: no mediawiki sources registered for '{args.title}'", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
