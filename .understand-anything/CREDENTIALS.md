# Credentials Reference

> **Rule:** Credentials are never committed to the repository. This file documents where they live, what they control, and how to rotate them. Actual values exist only in CI secret stores, operator shells, or managed service dashboards.

## Cloudflare

| Credential | Controls | Stored In | Rotation |
|-----------|----------|-----------|----------|
| `CLOUDFLARE_API_TOKEN` | Pages deploy, DNS management, zone rules | CI secrets / operator shell | Cloudflare Dashboard → API Tokens → Roll |
| `CLOUDFLARE_ACCOUNT_ID` | Account-level scope for all Cloudflare operations | CI secrets / operator shell | Static — changes only if account migrated |
| `CLOUDFLARE_ZONE_ID` | Zone-level scope for `gamepointagent.com` | CI secrets / operator shell | Static — changes only if zone recreated |

## Supabase

| Credential | Controls | Stored In | Rotation |
|-----------|----------|-----------|----------|
| `SUPABASE_ANON_KEY` | Public API access, subject to RLS | Vite env (browser-safe), Edge Function env | Supabase Dashboard → Settings → API → Regenerate |
| `SUPABASE_SERVICE_ROLE_KEY` | **Full database bypass** — admin-level, no RLS | Edge Function env only | Supabase Dashboard → Settings → API → Regenerate |

## GitHub

| Credential | Controls | Stored In | Rotation |
|-----------|----------|-----------|----------|
| `GITHUB_TOKEN` | Repo operations, CI workflow triggers | CI secrets | GitHub → Settings → Developer Settings → PAT → Regenerate |

## Security Posture

1. `SUPABASE_SERVICE_ROLE_KEY` is the highest-privilege secret. It bypasses all RLS. Never expose in any client bundle.
2. `VITE_SUPABASE_ANON_KEY` is browser-safe by design — all access is RLS-gated.
3. `CLOUDFLARE_API_TOKEN` should be scoped to minimum required permissions (Pages deploy + DNS edit).
4. Rotate all tokens immediately if any credential leak is suspected.
5. CI secret values must be masked in logs (`***` replacement).
