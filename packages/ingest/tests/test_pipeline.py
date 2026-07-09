"""WP-3 verification: license gate, idempotency, blast radius, dedupe, adapters."""
from __future__ import annotations

import json
import urllib.parse

import pytest

from gamepoint_ingest.chunk_embed import (
    MAX_VERBATIM_FRAGMENT,
    DeterministicEmbedder,
    synthesize_claims,
)
from gamepoint_ingest.license_enforcer import LicenseViolation, SourceLicense, enforce
from gamepoint_ingest.mediawiki import MediaWikiClient
from gamepoint_ingest.official_api import TermsNotVerifiedError, blizzard_adapter, bungie_adapter
from gamepoint_ingest.run_pack import WikiSourceSpec, build_wiki_pack
from gamepoint_ingest.store import InMemoryStore

POE2 = "11111111-1111-1111-1111-111111111111"
BG3 = "22222222-2222-2222-2222-222222222222"

WIKITEXT = """{{Infobox skill
| name = Fireball
| mana_cost = 32
| cast_time = 0.85s
| tags = Spell, Projectile, Fire
}}
Fireball hurls a fiery projectile that explodes on impact.
"""


def fake_wiki_fetcher(url: str) -> bytes:
    """Hermetic MediaWiki Action API: one category, two pages."""
    params = urllib.parse.parse_qs(urllib.parse.urlsplit(url).query)
    if params.get("list") == ["categorymembers"]:
        return json.dumps(
            {"query": {"categorymembers": [
                {"ns": 0, "title": "Fireball"},
                {"ns": 0, "title": "Ice Nova"},
                {"ns": 14, "title": "Category:Skills"},  # non-article: must be skipped
            ]}}
        ).encode()
    page = params["page"][0]
    return json.dumps({"parse": {"wikitext": {"*": WIKITEXT.replace("Fireball", page)}}}).encode()


def make_client() -> MediaWikiClient:
    return MediaWikiClient(
        "https://example.wiki/api.php", "CC-BY-SA",
        min_interval_s=0, fetcher=fake_wiki_fetcher, sleep=lambda _s: None,
    )


def spec(title_id: str, license_: str = "CC-BY-SA", runtime: bool = True) -> WikiSourceSpec:
    return WikiSourceSpec(
        source_id="33333333-3333-3333-3333-333333333333",
        title_id=title_id,
        api_url="https://example.wiki/api.php",
        license=license_,
        runtime_pack=runtime,
        categories=("Skills",),
    )


# --- License gate -------------------------------------------------------------

def test_osrs_cc_by_nc_source_is_rejected_for_runtime():
    osrs = SourceLicense("src-osrs", "CC-BY-NC-SA", runtime_pack=True, attribution="OSRS Wiki")
    with pytest.raises(LicenseViolation, match="blocked for"):
        enforce(osrs)


def test_unknown_license_never_defaults_to_runtime():
    with pytest.raises(LicenseViolation, match="UNCERTAIN"):
        enforce(SourceLicense("src-x", "GFDL-1.3", runtime_pack=True, attribution="x"))


def test_cc_by_sa_requires_attribution():
    with pytest.raises(LicenseViolation, match="attribution"):
        enforce(SourceLicense("src-y", "CC-BY-SA", runtime_pack=True, attribution="  "))


def test_nc_source_routes_to_quarantine_when_not_runtime():
    osrs = SourceLicense("src-osrs", "CC-BY-NC-SA", runtime_pack=False, attribution="OSRS Wiki")
    assert enforce(osrs) == "quarantine"


def test_quarantined_claims_are_never_confirmed_or_embedded():
    store = InMemoryStore()
    report = build_wiki_pack(spec(POE2, "CC-BY-NC-SA", runtime=False), store,
                             DeterministicEmbedder(), make_client())
    assert report.quarantined
    assert store.row_counts()["embeddings"] == 0
    assert all(c.status == "quarantined" for c in store.claims.values())


# --- Idempotency & blast radius ------------------------------------------------

def test_pack_build_is_idempotent_row_delta_zero():
    store = InMemoryStore()
    embedder = DeterministicEmbedder()
    first = build_wiki_pack(spec(POE2), store, embedder, make_client())
    counts_after_first = store.row_counts()
    assert first.claims_inserted > 0 and first.embeddings_inserted > 0
    second = build_wiki_pack(spec(POE2), store, embedder, make_client())
    assert store.row_counts() == counts_after_first  # row-count delta = 0
    assert second.claims_inserted == 0 and second.embeddings_inserted == 0


def test_blast_radius_poe2_build_leaves_bg3_scope_untouched():
    store = InMemoryStore()
    embedder = DeterministicEmbedder()
    build_wiki_pack(spec(BG3), store, embedder, make_client())
    bg3_rows = {k: v for k, v in store.claims.items() if v.title_id == BG3}
    build_wiki_pack(spec(POE2), store, embedder, make_client())
    assert {k: v for k, v in store.claims.items() if v.title_id == BG3} == bg3_rows
    assert all(e.title_id in (POE2, BG3) for e in store.embeddings.values())


# --- Synthesis discipline & dedupe ----------------------------------------------

def test_synthesis_paraphrases_and_caps_verbatim_fragments():
    claims = synthesize_claims(WIKITEXT, "Example Wiki (CC-BY-SA)")
    assert claims, "structured infobox must yield claims"
    for claim in claims:
        assert len(claim.fragment) <= MAX_VERBATIM_FRAGMENT
        assert claim.statement not in WIKITEXT  # synthesized, not copied
        assert claim.attribution


def test_hash_dedupe_skips_known_pages():
    client = make_client()
    seen: set[str] = set()
    pages = list(client.iter_category("Skills", known_hash=lambda h: h in seen))
    assert len(pages) == 2  # ns=14 category page skipped
    seen.update(p.scrape_hash for p in pages)
    assert list(client.iter_category("Skills", known_hash=lambda h: h in seen)) == []


def test_embedding_dimension_is_1536():
    [vec] = DeterministicEmbedder().embed(["x"])
    assert len(vec) == 1536


# --- verify_terms adapters -------------------------------------------------------

@pytest.mark.parametrize("adapter", [blizzard_adapter(), bungie_adapter()])
def test_verify_terms_adapters_refuse_and_name_the_flag(adapter):
    with pytest.raises(TermsNotVerifiedError, match="verify_terms:"):
        adapter.fetch_documents()
