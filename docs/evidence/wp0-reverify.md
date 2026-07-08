# WP-0 Reverification Evidence

$ bash governance/ci/compliance-gate.sh
COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found
EXIT:0

$ python governance/ci/license-gate.py --check
LICENSE_GATE_PASS no blocked runtime license manifests found
EXIT:0

$ pnpm lint
> gamepoint@0.1.0 lint /workspace/GamePoint
> bash governance/ci/compliance-gate.sh && python governance/ci/license-gate.py --check
COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found
LICENSE_GATE_PASS no blocked runtime license manifests found
EXIT:0

$ pnpm typecheck
> gamepoint@0.1.0 typecheck /workspace/GamePoint
> tsc -b apps/web apps/overlay packages/contracts packages/router
EXIT:0

$ pnpm --filter web build
vite v8.1.3 building client environment for production...
✓ 15 modules transformed.
dist/index.html                   0.36 kB │ gzip:  0.26 kB
dist/assets/index-CJopZniG.css    1.00 kB │ gzip:  0.57 kB
dist/assets/index-BlZsJawZ.js   192.67 kB │ gzip: 60.82 kB
✓ built in 280ms
EXIT:0

$ rg --hidden --glob '!.git/**' --glob '!node_modules/**' '<redacted-token-or-account-pattern>' .
No committed raw Cloudflare token or raw account id found. Redacted placeholders remain in evidence and runbooks.
EXIT:1
