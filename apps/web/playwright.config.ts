import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for GamePoint web user-shoes E2E tests.
 *
 * The suite tests the *built* app served via `vite preview` so it exercises
 * the same bundle that Cloudflare Workers Builds produces.
 *
 * Environment variables (optional — tests accept auth-not-configured gate when absent):
 *   VITE_SUPABASE_URL            — baked into the Vite build
 *   VITE_SUPABASE_PUBLISHABLE_KEY — baked into the Vite build
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  // Start `vite preview` before running tests. The dist/ directory must exist
  // (built by the `browser-e2e` CI job step that precedes this one).
  webServer: {
    command: 'pnpm preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
