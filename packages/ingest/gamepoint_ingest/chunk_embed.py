"""Synthesis-first chunking + checksum-keyed embedding upserts (idempotent).

Paraphrase discipline: chunks store synthesized claim text plus a short attributed
fragment — never bulk verbatim reproduction (skill §IV.3)."""
from __future__ import annotations

import hashlib
import json
import re
import urllib.request
from dataclasses import dataclass
from typing import Callable, Protocol, Sequence

from .store import Claim, EmbeddedChunk, Store

MAX_VERBATIM_FRAGMENT = 240  # chars of attributed quotation allowed per chunk
EMBEDDING_DIM = 1536


@dataclass(frozen=True)
class SynthesizedClaim:
    """A single synthesized fact: our own words + citation."""

    attribute: str
    statement: str  # synthesized text (our words)
    fragment: str   # short attributed quotation, <= MAX_VERBATIM_FRAGMENT
    attribution: str
    confidence: float


class Embedder(Protocol):
    def embed(self, texts: Sequence[str]) -> list[list[float]]: ...


class DeterministicEmbedder:
    """Hermetic embedder for tests/dry-runs: hash-seeded unit-norm vectors."""

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        out: list[list[float]] = []
        for text in texts:
            seed = hashlib.sha256(text.encode()).digest()
            raw = [((seed[i % 32] + i * 31) % 251) / 251.0 - 0.5 for i in range(EMBEDDING_DIM)]
            norm = sum(v * v for v in raw) ** 0.5 or 1.0
            out.append([v / norm for v in raw])
        return out


class OpenAIEmbedder:
    """text-embedding-3-small (1536-dim) via HTTPS; model name env-overridable."""

    def __init__(self, api_key: str, model: str = "text-embedding-3-small",
                 base_url: str = "https://api.openai.com/v1") -> None:
        self._key, self._model, self._base = api_key, model, base_url

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        req = urllib.request.Request(
            f"{self._base}/embeddings",
            data=json.dumps({"model": self._model, "input": list(texts)}).encode(),
            headers={"authorization": f"Bearer {self._key}", "content-type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=120) as res:
            data = json.loads(res.read())["data"]
        return [item["embedding"] for item in sorted(data, key=lambda d: d["index"])]


def synthesize_claims(wikitext: str, attribution: str) -> list[SynthesizedClaim]:
    """Extract template/infobox-style facts into synthesized claims.

    Conservative by construction: only structured `| key = value` pairs become
    claims; prose is never bulk-copied. Yield is honest — sparse pages yield few
    or zero claims rather than invented ones.
    """
    claims: list[SynthesizedClaim] = []
    for match in re.finditer(r"^\|\s*([A-Za-z][\w ]{1,48}?)\s*=\s*(.{1,200}?)\s*$", wikitext, re.M):
        key = match.group(1).strip().lower().replace(" ", "_")
        value = re.sub(r"\[\[|\]\]|\{\{|\}\}|'''?", "", match.group(2)).strip()
        if not value or value.lower() in {"yes", "no", "true", "false", ""}:
            continue
        fragment = match.group(0)[:MAX_VERBATIM_FRAGMENT]
        claims.append(
            SynthesizedClaim(
                attribute=key,
                statement=f"The {key.replace('_', ' ')} is {value}.",
                fragment=fragment,
                attribution=attribution,
                confidence=0.7,  # single-source structured fact; confirmation raises it
            )
        )
    return claims


def _checksum(title_id: str, text: str) -> str:
    return hashlib.sha256(f"{title_id}\x00{text}".encode()).hexdigest()


def embed_claims(
    title_id: str,
    claims: Sequence[SynthesizedClaim],
    store: Store,
    embedder: Embedder,
    namespace: str,
) -> dict[str, int]:
    """Upsert claims + embeddings, keyed on content checksum. Re-runs are no-ops.
    Quarantined namespaces never produce runtime-visible confirmed claims."""
    inserted_claims = inserted_chunks = 0
    texts, metas = [], []
    for claim in claims:
        chunk_text = f"{claim.statement} ({claim.attribution})"
        checksum = _checksum(title_id, chunk_text)
        status = "unverified" if namespace == "runtime" else "quarantined"
        if store.upsert_claim(
            Claim(
                title_id=title_id,
                attribute=claim.attribute,
                value={"statement": claim.statement, "fragment": claim.fragment},
                confidence=claim.confidence,
                content_hash=checksum,
                status=status,
            )
        ):
            inserted_claims += 1
        if namespace == "runtime":
            texts.append(chunk_text)
            metas.append(checksum)
    if texts:
        for checksum, vector, text in zip(metas, embedder.embed(texts), texts):
            if store.upsert_embedding(
                EmbeddedChunk(
                    title_id=title_id,
                    chunk=text,
                    chunk_checksum=checksum,
                    modality="text",
                    embedding=tuple(vector),
                )
            ):
                inserted_chunks += 1
    return {"claims_inserted": inserted_claims, "embeddings_inserted": inserted_chunks}
