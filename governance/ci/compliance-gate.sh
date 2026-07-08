#!/usr/bin/env bash
set -eu

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
  if git grep -n "$pattern" -- ':(exclude)docs/**' ':(exclude)governance/**' ':(exclude)ENV.example' >/tmp/gamepoint-compliance-match 2>/dev/null; then
    echo "COMPLIANCE_GATE_FAIL pattern=$pattern"
    cat /tmp/gamepoint-compliance-match
    status=1
  fi
done

# ADR-003 structural check: the canonical contract must pin audio to null.
if ! git grep -q 'audio_opus_bytes: z\.null()' -- packages/contracts/src/index.ts; then
  echo "COMPLIANCE_GATE_FAIL contracts no longer pin audio_opus_bytes to null (ADR-003)"
  status=1
fi

if git grep -n 'SUPABASE_SERVICE_ROLE_KEY=.*[A-Za-z0-9_\-]\{12,\}' -- ':(exclude)governance/**' ':(exclude)ENV.example' >/tmp/gamepoint-secret-match 2>/dev/null; then
  echo "COMPLIANCE_GATE_FAIL service role key-like value found"
  cat /tmp/gamepoint-secret-match
  status=1
fi

if [ "$status" -eq 0 ]; then
  echo "COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found"
fi
exit "$status"