"""MediaWiki Action API client: categorymembers + parse, etag/hash dedupe,
per-source rate limit, attribution metadata retained (CC-BY-SA requirement)."""
from __future__ import annotations

import hashlib
import json
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Callable, Iterator

USER_AGENT = "GamePointIngest/1.0 (compliance: licensed sources only)"

Fetcher = Callable[[str], bytes]


def _default_fetcher(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read()


@dataclass(frozen=True)
class WikiPage:
    title: str
    canonical_url: str
    text: str
    scrape_hash: str
    attribution: str


class MediaWikiClient:
    """Read-only Action API client. `fetcher` is injectable for hermetic tests."""

    def __init__(
        self,
        api_url: str,
        license_name: str,
        min_interval_s: float = 1.0,
        fetcher: Fetcher = _default_fetcher,
        clock: Callable[[], float] = time.monotonic,
        sleep: Callable[[float], None] = time.sleep,
    ) -> None:
        self._api = api_url
        self._license = license_name
        self._min_interval = min_interval_s
        self._fetch = fetcher
        self._clock = clock
        self._sleep = sleep
        self._last_call = 0.0

    def _call(self, params: dict[str, str]) -> dict:
        elapsed = self._clock() - self._last_call
        if elapsed < self._min_interval:
            self._sleep(self._min_interval - elapsed)  # per-source rate limit
        self._last_call = self._clock()
        query = urllib.parse.urlencode({**params, "format": "json"})
        return json.loads(self._fetch(f"{self._api}?{query}"))

    def category_members(self, category: str, limit: int = 200) -> list[str]:
        body = self._call(
            {
                "action": "query",
                "list": "categorymembers",
                "cmtitle": f"Category:{category}",
                "cmlimit": str(min(limit, 500)),
            }
        )
        members = body.get("query", {}).get("categorymembers", [])
        return [m["title"] for m in members if m.get("ns") == 0]

    def parse_page(self, title: str) -> WikiPage:
        body = self._call({"action": "parse", "page": title, "prop": "wikitext"})
        parse = body.get("parse", {})
        text = parse.get("wikitext", {}).get("*", "")
        scrape_hash = hashlib.sha256(text.encode()).hexdigest()
        canonical = f"{self._api.rsplit('/', 1)[0]}/index.php?title={urllib.parse.quote(title)}"
        return WikiPage(
            title=title,
            canonical_url=canonical,
            text=text,
            scrape_hash=scrape_hash,
            attribution=f"Source: {title} ({canonical}), license {self._license}",
        )

    def iter_category(self, category: str, known_hash: Callable[[str], bool]) -> Iterator[WikiPage]:
        """Yield pages whose content hash is new (etag/hash dedupe)."""
        for title in self.category_members(category):
            page = self.parse_page(title)
            if not known_hash(page.scrape_hash):
                yield page
