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

✓ built in 305ms
EXIT:0
$ pnpm typecheck

> gamepoint@0.1.0 typecheck /workspace/GamePoint
> tsc -b apps/web apps/overlay packages/contracts packages/router

EXIT:0
$ npm exec --package wrangler@4.108.0 -- wrangler deploy --dry-run
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
npm warn exec The following package was not found and will be installed: wrangler@4.108.0
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'wrangler@4.108.0',
npm warn EBADENGINE   required: { node: '>=22.0.0' },
npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '11.4.2' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@cloudflare/kv-asset-handler@0.5.0',
npm warn EBADENGINE   required: { node: '>=22.0.0' },
npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '11.4.2' }
npm warn EBADENGINE }
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'miniflare@4.20260706.0',
npm warn EBADENGINE   required: { node: '>=22.0.0' },
npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '11.4.2' }
npm warn EBADENGINE }
Wrangler requires at least Node.js v22.0.0. You are using v20.20.2. Please update your version of Node.js.

Consider using a Node.js version manager such as https://volta.sh/ or https://github.com/nvm-sh/nvm.
EXIT:1
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
[custom build] [2K
[custom build] transforming...
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
[custom build] ✓ built in 329ms
[custom build] 
✨ Read 6 files from the assets directory /workspace/GamePoint/apps/web/dist
Total Upload: 0.20 KiB / gzip: 0.16 KiB
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
$ pnpm lint

> gamepoint@0.1.0 lint /workspace/GamePoint
> bash governance/ci/compliance-gate.sh && python governance/ci/license-gate.py --check

COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found
LICENSE_GATE_PASS no blocked runtime license manifests found
EXIT:0
