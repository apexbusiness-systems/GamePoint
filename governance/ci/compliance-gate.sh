#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

banned_patterns=(
  'ReadProcessMemory'
  'WriteProcessMemory'
  'CreateRemoteThread'
  'SetWindowsHookEx'
  'MinHook'
  'detours'
  '\\Device\\'
  'SendInput'
  'WASAPI'
  'Opus'
)

status=0
for pattern in "${banned_patterns[@]}"; do
  if rg --hidden --glob '!.git/**' --glob '!node_modules/**' --glob '!docs/**' --glob '!governance/**' --glob '!ENV.example' -n "$pattern" . >/tmp/gamepoint-compliance-match 2>/dev/null; then
    echo "COMPLIANCE_GATE_FAIL pattern=$pattern"
    cat /tmp/gamepoint-compliance-match
    status=1
  fi
done

# ADR-003 structural check: the canonical contract must pin audio to null.
# (The old heuristic 'audio_opus_bytes.*[^n]null' matched the compliant lines
# themselves; replaced 2026-07-08 with a positive assertion on the schema.)
if ! rg -q 'audio_opus_bytes: z\.null\(\)' packages/contracts/src/index.ts; then
  echo "COMPLIANCE_GATE_FAIL contracts no longer pin audio_opus_bytes to null (ADR-003)"
  status=1
fi

if rg --hidden --glob '!.git/**' --glob '!node_modules/**' --glob '!governance/**' --glob '!ENV.example' -n 'SUPABASE_SERVICE_ROLE_KEY=.*[A-Za-z0-9_\-]{12,}' . >/tmp/gamepoint-secret-match 2>/dev/null; then
  echo "COMPLIANCE_GATE_FAIL service role key-like value found"
  cat /tmp/gamepoint-secret-match
  status=1
fi

if [ "$status" -eq 0 ]; then
  echo "COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found"
fi
exit "$status"
