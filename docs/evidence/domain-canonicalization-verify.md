$ pnpm --filter web test

> web@0.1.0 test /workspace/GamePoint/apps/web
> node --test src/*.test.mjs

TAP version 13
# Subtest: web metadata declares canonical production domain
ok 1 - web metadata declares canonical production domain
  ---
  duration_ms: 2.519174
  ...
# Subtest: Cloudflare redirects canonicalize defensive domains
ok 2 - Cloudflare redirects canonicalize defensive domains
  ---
  duration_ms: 0.571454
  ...
# Subtest: web copy states privacy boundary
ok 3 - web copy states privacy boundary
  ---
  duration_ms: 3.824609
  ...
1..3
# tests 3
# suites 0
# pass 3
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 241.31883
EXIT:0
$ pnpm --filter web build

> web@0.1.0 build /workspace/GamePoint/apps/web
> vite build

vite v8.1.3 building client environment for production...
[2Ktransforming...✓ 15 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.42 kB │ gzip:  0.29 kB
dist/assets/index-CJopZniG.css    1.00 kB │ gzip:  0.57 kB
dist/assets/index-BlZsJawZ.js   192.67 kB │ gzip: 60.82 kB

✓ built in 308ms
EXIT:0
$ pnpm typecheck

> gamepoint@0.1.0 typecheck /workspace/GamePoint
> tsc -b apps/web apps/overlay packages/contracts packages/router

EXIT:0
$ npm exec --package node@22.16.0 --package wrangler@4.108.0 -- wrangler deploy --dry-run
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
[33m▲ [43;33m[[43;30mWARNING[43;33m][0m [1mProxy environment variables detected. We'll use your proxy for fetch requests.[0m



 ⛅️ wrangler 4.108.0
────────────────────
[custom build] Running: pnpm --filter web build
[custom build] 
[custom build] > web@0.1.0 build /workspace/GamePoint/apps/web
[custom build] > vite build
[custom build] 
[custom build] 
[custom build] vite v8.1.3 building client environment for production...
[custom build] 
[custom build] [2Ktransforming...
[custom build] ✓ 15 modules transformed.
[custom build] 
[custom build] rendering chunks...
[custom build] 
[custom build] computing gzip size...
[custom build] 
[custom build] dist/index.html                   0.42 kB │ gzip:  0.29 kB
[custom build] dist/assets/index-CJopZniG.css    1.00 kB │ gzip:  0.57 kB
[custom build] dist/assets/index-BlZsJawZ.js   192.67 kB │ gzip: 60.82 kB
[custom build] 
[custom build] 
[custom build] ✓ built in 340ms
[custom build] 
✨ Read 6 files from the assets directory /workspace/GamePoint/apps/web/dist
Total Upload: 1.01 KiB / gzip: 0.49 KiB
Your Worker has access to the following bindings:
Binding            Resource      
env.ASSETS         Assets        

--dry-run: exiting now.
EXIT:0
$ bash governance/ci/compliance-gate.sh
COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found
EXIT:0
$ python governance/ci/license-gate.py --check
LICENSE_GATE_PASS no blocked runtime license manifests found
EXIT:0
