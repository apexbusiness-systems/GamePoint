#!/usr/bin/env bash
# GamePoint Compliance Gate — Contract §1.1 (CI enforcement, WP-0/WP-6).
#
# Greps runtime code directories for banned API patterns. Any hit fails the
# build. This makes the Architecture Check (§1.1.1 — no memory reads, no
# process injection, no foreign-process hooks, no input automation, no kernel
# drivers) a build artifact, not a promise.
#
# Scope: code directories only (services/ apps/ packages/ supabase/).
# Governance scripts and docs/ may legitimately *name* these APIs.
#
# Exit codes: 0 = clean, 1 = banned pattern found, 2 = misconfiguration.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

SCAN_DIRS=()
for d in services apps packages supabase; do
  [[ -d "${ROOT}/${d}" ]] && SCAN_DIRS+=("${ROOT}/${d}")
done

if [[ ${#SCAN_DIRS[@]} -eq 0 ]]; then
  echo "compliance-gate: FATAL — no code directories found under ${ROOT}" >&2
  exit 2
fi

# Banned patterns per Contract §1.1 CI enforcement clause.
PATTERNS=(
  'ReadProcessMemory'            # memory reads of foreign processes
  'WriteProcessMemory'           # memory writes / injection staging
  'CreateRemoteThread'           # process injection
  'NtCreateThreadEx'             # process injection (native API)
  'SetWindowsHookEx'             # foreign-process hooks (banned outright)
  'MinHook'                      # inline hooking framework
  '[Dd]etours'                   # Microsoft Detours hooking
  '\\\\Device\\\\'               # raw device/driver opens
  'SendInput'                    # input automation (banned outright; overlay
                                 # interacts only with its own window via UI toolkit)
  'GetAsyncKeyState'             # global key-state polling outside RegisterHotKey
  'LoadLibrary[AW]?[[:space:]]*\(.*game' # DLL loading targeting game modules
)

FAIL=0
for pat in "${PATTERNS[@]}"; do
  # --binary-files=without-match: never match compiled artifacts;
  # -I equivalent. Exclude lockfiles and generated dirs defensively.
  if hits=$(grep -rEn --binary-files=without-match \
      --exclude-dir=target --exclude-dir=node_modules --exclude-dir=dist \
      --exclude='*.lock' \
      -e "${pat}" "${SCAN_DIRS[@]}" 2>/dev/null); then
    echo "compliance-gate: BANNED PATTERN '${pat}':" >&2
    echo "${hits}" >&2
    FAIL=1
  fi
done

if [[ ${FAIL} -ne 0 ]]; then
  echo "compliance-gate: FAIL — Contract §1.1 Architecture Check violated." >&2
  echo "Do not code around this gate. Log the hit in governance/compliance-matrix.md" >&2
  echo "and implement the compliant alternative (Contract §5)." >&2
  exit 1
fi

echo "compliance-gate: PASS — scanned: ${SCAN_DIRS[*]}"
