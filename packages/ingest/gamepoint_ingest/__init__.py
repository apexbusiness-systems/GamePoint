"""GamePoint knowledge ingestion pipeline.

Stdlib-only by design (APEX no-lock-in): HTTP via urllib, storage behind the
Store protocol so tests run hermetically and the runtime store is swappable.
"""
