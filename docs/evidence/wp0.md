$ bash governance/ci/compliance-gate.sh
COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found
EXIT:0
$ python governance/ci/license-gate.py --check
LICENSE_GATE_PASS no blocked runtime license manifests found
EXIT:0
$ pnpm lint || true

> gamepoint@0.1.0 lint /workspace/GamePoint
> bash governance/ci/compliance-gate.sh && python governance/ci/license-gate.py --check

COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found
LICENSE_GATE_PASS no blocked runtime license manifests found
EXIT:0
$ pnpm typecheck || true

> gamepoint@0.1.0 typecheck /workspace/GamePoint
> tsc -b apps/web apps/overlay packages/contracts packages/router

EXIT:0

$ pnpm --filter web build
Vite build passed locally and emitted Cloudflare Pages static assets, including public `_headers` and `_redirects` copies.
