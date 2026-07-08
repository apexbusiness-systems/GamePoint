# WP-0 Cloudflare Deploy Evidence

Deployment target: Cloudflare Pages project `gamepoint`.

Credentials were supplied by the operator and used only as transient environment variables. Secret values are intentionally redacted from this evidence file.

> web@0.1.0 build /workspace/GamePoint/apps/web
> vite build

sh: 1: vite: not found
/workspace/GamePoint/apps/web:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  web@0.1.0 build: `vite build`
spawn ENOENT
 WARN   Local package.json exists, but node_modules missing, did you mean to install?

> web@0.1.0 build /workspace/GamePoint/apps/web
> vite build

vite v8.1.3 building client environment for production...
[2K
transforming...✓ 15 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.36 kB │ gzip:  0.26 kB
dist/assets/index-CJopZniG.css    1.00 kB │ gzip:  0.57 kB
dist/assets/index-BlZsJawZ.js   192.67 kB │ gzip: 60.82 kB

✓ built in 310ms
$ pnpm dlx wrangler pages project create gamepoint --production-branch main
Progress: resolved 1, reused 0, downloaded 0, added 0
Progress: resolved 16, reused 0, downloaded 7, added 0
Progress: resolved 59, reused 1, downloaded 15, added 0
Packages: +37
+++++++++++++++++++++++++++++++++++++
Progress: resolved 89, reused 1, downloaded 34, added 34
Progress: resolved 89, reused 1, downloaded 37, added 36
Progress: resolved 89, reused 1, downloaded 38, added 36
Progress: resolved 89, reused 1, downloaded 38, added 37, done
╭ Warning ─────────────────────────────────────────────────────────────────────╮
│                                                                              │
│   Ignored build scripts: esbuild@0.28.1, sharp@0.34.5,                       │
│   workerd@1.20260706.1.                                                      │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
│   to run scripts.                                                            │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯
.../node_modules/wrangler                |  WARN  Unsupported engine: wanted: {"node":">=22.0.0"} (current: {"node":"v20.20.2","pnpm":"10.28.1"})
Wrangler requires at least Node.js v22.0.0. You are using v20.20.2. Please update your version of Node.js.

Consider using a Node.js version manager such as https://volta.sh/ or https://github.com/nvm-sh/nvm.
PROJECT_CREATE_EXIT:1
$ pnpm dlx wrangler pages deploy apps/web/dist --project-name gamepoint --branch main --commit-dirty=true
.../node_modules/wrangler                |  WARN  Unsupported engine: wanted: {"node":">=22.0.0"} (current: {"node":"v20.20.2","pnpm":"10.28.1"})
Wrangler requires at least Node.js v22.0.0. You are using v20.20.2. Please update your version of Node.js.

Consider using a Node.js version manager such as https://volta.sh/ or https://github.com/nvm-sh/nvm.
DEPLOY_EXIT:1
$ PATH=/usr/local/bin:$PATH pnpm dlx wrangler pages project create gamepoint --production-branch main
[33m▲ [43;33m[[43;30mWARNING[43;33m][0m [1mProxy environment variables detected. We'll use your proxy for fetch requests.[0m



 ⛅️ wrangler 4.108.0
────────────────────

[31m✘ [41;31m[[41;97mERROR[41;31m][0m [1mA request to the Cloudflare API (/accounts/[REDACTED_CLOUDFLARE_ACCOUNT_ID]/pages/projects) failed.[0m

  Authentication error [code: 10000]


📎 It looks like you are authenticating Wrangler via a custom API token set in an environment variable.
Please ensure it has the correct permissions for this operation.

Getting User settings...

[31m✘ [41;31m[[41;97mERROR[41;31m][0m [1mA request to the Cloudflare API (/accounts) failed.[0m

  Invalid access token [code: 9109]
  
  If you think this is a bug, please open an issue at: [4mhttps://github.com/cloudflare/workers-sdk/issues/new/choose[0m


🪵  Logs were written to "/root/.config/.wrangler/logs/wrangler-2026-07-08_05-08-12_440.log"
PROJECT_CREATE_EXIT:1
$ PATH=/usr/local/bin:$PATH pnpm dlx wrangler pages deploy apps/web/dist --project-name gamepoint --branch main --commit-dirty=true
[33m▲ [43;33m[[43;30mWARNING[43;33m][0m [1mProxy environment variables detected. We'll use your proxy for fetch requests.[0m



 ⛅️ wrangler 4.108.0
────────────────────

[31m✘ [41;31m[[41;97mERROR[41;31m][0m [1mA request to the Cloudflare API (/accounts/[REDACTED_CLOUDFLARE_ACCOUNT_ID]/pages/projects/gamepoint) failed.[0m

  Authentication error [code: 10000]


📎 It looks like you are authenticating Wrangler via a custom API token set in an environment variable.
Please ensure it has the correct permissions for this operation.

Getting User settings...

[31m✘ [41;31m[[41;97mERROR[41;31m][0m [1mA request to the Cloudflare API (/user/tokens/verify) failed.[0m

  Too many authentication failures. Please try again later. [code: 10502]
  
  If you think this is a bug, please open an issue at: [4mhttps://github.com/cloudflare/workers-sdk/issues/new/choose[0m


🪵  Logs were written to "/root/.config/.wrangler/logs/wrangler-2026-07-08_05-08-17_875.log"
DEPLOY_EXIT:1
