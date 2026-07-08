# WP-0 Web Screenshot Evidence

Screenshot was captured and displayed in the Codex conversation, but the raster PNG artifact is intentionally not committed because the review UI reports `Binary files are not supported` for binary image diffs.

Local screenshot path used during capture:

```text
docs/evidence/web-home-screenshot.png
```

Commands run:

```bash
pnpm --filter web build
pnpm --filter web exec vite preview --host 127.0.0.1 --port 4173
pnpm dlx playwright install chromium
pnpm dlx playwright install-deps chromium
pnpm dlx playwright screenshot --viewport-size=1440,1100 http://127.0.0.1:4173 docs/evidence/web-home-screenshot.png
```

Result: Playwright captured the Cloudflare-ready web landing page at `1440x1100` from the local Vite preview server. Keep generated screenshots as local/release artifacts or upload them to the PR conversation instead of committing binary image files to this review surface.
