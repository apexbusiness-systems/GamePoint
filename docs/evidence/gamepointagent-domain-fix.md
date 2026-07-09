# gamepointagent.com Domain Fix Evidence

## Fix

Added custom-domain route declarations to `wrangler.toml` for:

- `gamepointagent.com`
- `www.gamepointagent.com`

This targets the current Cloudflare dashboard compatibility path where deployment runs `npx wrangler deploy` from the repository root. If the dashboard is switched back to Cloudflare Pages Git deploys, attach both custom domains through the Pages dashboard instead.
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
[custom build] dist/index.html                   0.36 kB │ gzip:  0.26 kB
[custom build] dist/assets/index-CJopZniG.css    1.00 kB │ gzip:  0.57 kB
[custom build] dist/assets/index-BlZsJawZ.js   192.67 kB │ gzip: 60.82 kB
[custom build] 
[custom build] 
[custom build] ✓ built in 325ms
[custom build] 
✨ Read 6 files from the assets directory /workspace/GamePoint/apps/web/dist
Total Upload: 0.20 KiB / gzip: 0.16 KiB
Your Worker has access to the following bindings:
Binding            Resource      
env.ASSETS         Assets        

--dry-run: exiting now.
EXIT:0
$ pnpm --filter web build

> web@0.1.0 build /workspace/GamePoint/apps/web
> vite build

vite v8.1.3 building client environment for production...
[2Ktransforming...✓ 15 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.36 kB │ gzip:  0.26 kB
dist/assets/index-CJopZniG.css    1.00 kB │ gzip:  0.57 kB
dist/assets/index-BlZsJawZ.js   192.67 kB │ gzip: 60.82 kB

✓ built in 327ms
EXIT:0
$ bash governance/ci/compliance-gate.sh
COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found
EXIT:0
