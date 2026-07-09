"""Storage boundary. Every write is an idempotent upsert keyed on a content hash,
so re-running any pipeline never duplicates rows (§1.2)."""
from __future__ import annotations

import json
import urllib.request
from dataclasses import dataclass, field
from typing import Protocol


@dataclass(frozen=True)
class SourceRecord:
    source_id: str
    canonical_url: str
    scrape_hash: str
    trust_tier: int


@dataclass(frozen=True)
class Claim:
    title_id: str
    attribute: str
    value: dict
    confidence: float
    content_hash: str
    status: str = "unverified"


@dataclass(frozen=True)
class EmbeddedChunk:
    title_id: str
    chunk: str
    chunk_checksum: str
    modality: str
    embedding: tuple[float, ...]


class Store(Protocol):
    def upsert_source_record(self, record: SourceRecord) -> bool: ...
    def upsert_claim(self, claim: Claim) -> bool: ...
    def upsert_embedding(self, chunk: EmbeddedChunk) -> bool: ...
    def has_scrape_hash(self, source_id: str, scrape_hash: str) -> bool: ...


@dataclass
class InMemoryStore:
    """Hermetic store for tests and dry runs. Mirrors the DB unique keys exactly."""

    source_records: dict[tuple[str, str], SourceRecord] = field(default_factory=dict)
    claims: dict[tuple[str, str], Claim] = field(default_factory=dict)
    embeddings: dict[str, EmbeddedChunk] = field(default_factory=dict)

    def upsert_source_record(self, record: SourceRecord) -> bool:
        key = (record.source_id, record.scrape_hash)
        inserted = key not in self.source_records
        self.source_records[key] = record
        return inserted

    def upsert_claim(self, claim: Claim) -> bool:
        key = (claim.title_id, claim.content_hash)
        inserted = key not in self.claims
        self.claims[key] = claim
        return inserted

    def upsert_embedding(self, chunk: EmbeddedChunk) -> bool:
        inserted = chunk.chunk_checksum not in self.embeddings
        self.embeddings[chunk.chunk_checksum] = chunk
        return inserted

    def has_scrape_hash(self, source_id: str, scrape_hash: str) -> bool:
        return (source_id, scrape_hash) in self.source_records

    def row_counts(self) -> dict[str, int]:
        return {
            "source_records": len(self.source_records),
            "claims": len(self.claims),
            "embeddings": len(self.embeddings),
        }


class SupabaseStore:
    """PostgREST-backed store (service role). Upserts use on_conflict resolution
    identical to InMemoryStore keys."""

    def __init__(self, base_url: str, service_role_key: str) -> None:
        self._base = base_url.rstrip("/") + "/rest/v1"
        self._key = service_role_key

    def _post(self, table: str, payload: dict, on_conflict: str) -> bool:
        req = urllib.request.Request(
            f"{self._base}/{table}?on_conflict={on_conflict}",
            data=json.dumps(payload).encode(),
            headers={
                "apikey": self._key,
                "authorization": f"Bearer {self._key}",
                "content-type": "application/json",
                "prefer": "resolution=merge-duplicates,return=minimal",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as res:
            return 200 <= res.status < 300

    def upsert_source_record(self, record: SourceRecord) -> bool:
        return self._post("source_records", record.__dict__, "source_id,scrape_hash")

    def upsert_claim(self, claim: Claim) -> bool:
        return self._post("claims", claim.__dict__, "title_id,content_hash")

    def upsert_embedding(self, chunk: EmbeddedChunk) -> bool:
        payload = dict(chunk.__dict__, embedding=list(chunk.embedding))
        return self._post("embeddings", payload, "chunk_checksum")

    def has_scrape_hash(self, source_id: str, scrape_hash: str) -> bool:
        req = urllib.request.Request(
            f"{self._base}/source_records?source_id=eq.{source_id}&scrape_hash=eq.{scrape_hash}&select=id",
            headers={"apikey": self._key, "authorization": f"Bearer {self._key}"},
        )
        with urllib.request.urlopen(req, timeout=30) as res:
            return bool(json.loads(res.read()))
