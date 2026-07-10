-- 008: session lifecycle + request correlation (plan A4). Idempotent — every
-- statement is re-runnable without duplicate columns, constraints, or indexes.

-- Session lifecycle: explicit status transitions instead of an implicit open row.
alter table public.sessions add column if not exists status text not null default 'active';
do $$ begin
  alter table public.sessions
    add constraint sessions_status_check check (status in ('active', 'ended'));
exception when duplicate_object then null; end $$;
alter table public.sessions add column if not exists ended_at timestamptz;
alter table public.sessions add column if not exists client_version text;

-- Request correlation: one request_id spans service -> edge -> telemetry -> HUD.
alter table public.advice_events add column if not exists request_id uuid;
alter table public.advice_events add column if not exists client_version text;
create index if not exists advice_events_request_idx on public.advice_events (request_id);
-- Supports the per-user sliding-window rate limit (join sessions on user_id).
create index if not exists advice_events_created_idx on public.advice_events (created_at);

alter table public.coaching_responses add column if not exists request_id uuid;

-- Latent defect repair: the assist function inserts latency_ms (an optional
-- CoachingResponse contract field) into coaching_responses, but 007 never
-- created the column — the insert would fail at runtime. Structural fix here.
alter table public.coaching_responses add column if not exists latency_ms integer;
