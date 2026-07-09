"""Official-API adapters behind one portable interface (APEX no-lock-in).
verify_terms publishers get refusing stubs that name the blocking flag."""
from __future__ import annotations

import hashlib
import json
import urllib.request
from dataclasses import dataclass
from typing import Callable, Protocol

Fetcher = Callable[[str], bytes]


def _default_fetcher(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "GamePointIngest/1.0"})
    with urllib.request.urlopen(req, timeout=60) as res:
        return res.read()


@dataclass(frozen=True)
class OfficialDocument:
    canonical_url: str
    payload: dict
    scrape_hash: str


class OfficialApiAdapter(Protocol):
    slug: str

    def fetch_documents(self) -> list[OfficialDocument]: ...


class TermsNotVerifiedError(Exception):
    """Adapter refused to run: publisher terms unverified."""


def _document(url: str, raw: bytes) -> OfficialDocument:
    return OfficialDocument(
        canonical_url=url,
        payload=json.loads(raw),
        scrape_hash=hashlib.sha256(raw).hexdigest(),
    )


class WarframePublicExportAdapter:
    """Digital Extremes Public Export: index of lzma manifests; we ingest the
    JSON manifests listed by the index endpoint."""

    slug = "warframe"
    INDEX_URL = "https://origin.warframe.com/PublicExport/index_en.txt.lzma"

    def __init__(self, manifest_urls: list[str], fetcher: Fetcher = _default_fetcher) -> None:
        self._urls = manifest_urls
        self._fetch = fetcher

    def fetch_documents(self) -> list[OfficialDocument]:
        return [_document(url, self._fetch(url)) for url in self._urls]


class PoeApiAdapter:
    """Path of Exile developer API (official-API-terms)."""

    slug = "path-of-exile-2"

    def __init__(self, endpoint_urls: list[str], fetcher: Fetcher = _default_fetcher) -> None:
        self._urls = endpoint_urls
        self._fetch = fetcher

    def fetch_documents(self) -> list[OfficialDocument]:
        return [_document(url, self._fetch(url)) for url in self._urls]


class _RefusingAdapter:
    """Publisher terms unverified: running this adapter is a build error that
    names the exact flag blocking it (contract WP-3)."""

    def __init__(self, slug: str, flag: str) -> None:
        self.slug = slug
        self._flag = flag

    def fetch_documents(self) -> list[OfficialDocument]:
        raise TermsNotVerifiedError(
            f"adapter '{self.slug}' is disabled: compliance flag {self._flag} is set. "
            f"Clear the flag in governance/compliance-matrix.md after terms review."
        )


def blizzard_adapter() -> OfficialApiAdapter:
    return _RefusingAdapter("diablo-iv", "verify_terms:blizzard")


def bungie_adapter() -> OfficialApiAdapter:
    return _RefusingAdapter("destiny-2", "verify_terms:bungie")
