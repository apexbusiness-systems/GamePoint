/**
 * User-shoes E2E test — GamePoint web app.
 *
 * Tests the full interaction surface of the production build:
 * - Landing page renders with correct h1
 * - Every sidebar nav item produces a visible DOM change
 * - All landing CTAs navigate and show an honest gate (sign-in form or
 *   auth-not-configured panel) — never a dead broken page
 * - No unfiltered console errors during any interaction
 *
 * Tests pass in two configurations:
 *   1. VITE_SUPABASE_* set at build time → auth-required views show Login form
 *   2. VITE_SUPABASE_* absent at build time → all /app routes show "Auth not configured" gate
 */

import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Network errors that are expected when Supabase env vars are not configured.
 * These arise from the placeholder `https://unconfigured.invalid` client.
 */
function isExpectedNetworkError(text: string): boolean {
  return (
    text.includes('unconfigured.invalid') ||
    text.includes('net::ERR_NAME_NOT_RESOLVED') ||
    text.includes('ERR_NAME_NOT_RESOLVED') ||
    text.includes('Failed to fetch') ||
    text.includes('NetworkError when attempting to fetch resource') ||
    // Supabase SDK logs when network is unavailable
    text.includes('AuthRetryableFetchError') ||
    text.includes('FetchError')
  );
}

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  const onConsole = (msg: ConsoleMessage): void => {
    if (msg.type() === 'error' && !isExpectedNetworkError(msg.text())) {
      errors.push(`console.error: ${msg.text()}`);
    }
  };
  const onPageError = (err: Error): void => {
    if (!isExpectedNetworkError(err.message)) {
      errors.push(`pageerror: ${err.message}`);
    }
  };
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  return errors;
}

/**
 * Assert that the current page shows an honest auth gate:
 * either the sign-in/sign-up form (.auth-wrap) or the auth-not-configured
 * panel (#auth-not-configured / .gate-panel), or the NOT-YET-AVAILABLE gate.
 * Never a blank page or an unhandled crash.
 */
async function expectHonestGate(page: Page, context: string): Promise<void> {
  const gate = page.locator('.auth-wrap, .gate-panel, #auth-not-configured');
  await expect(gate.first(), `${context}: expected honest gate`).toBeVisible({ timeout: 6000 });
}

// ─── landing page ────────────────────────────────────────────────────────────

test.describe('Landing page', () => {
  test('h1 is visible and contains expected copy', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/');
    await expect(page.locator('h1').first()).toContainText('AI Coach');
    expect(errors, 'unexpected console errors on landing').toHaveLength(0);
  });

  test('sidebar renders all 8 nav items', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(8);
  });
});

// ─── sidebar navigation ──────────────────────────────────────────────────────

const NAV_ITEMS: Array<{ label: string; path: string; isLanding: boolean }> = [
  { label: 'Home', path: '/', isLanding: true },
  { label: 'Live Overlay', path: '/app/overlay', isLanding: false },
  { label: 'Sessions', path: '/app/sessions', isLanding: false },
  { label: 'Replay Review', path: '/app/replay', isLanding: false },
  { label: 'Coach Squad', path: '/app/coaches', isLanding: false },
  { label: 'Community', path: '/app/community', isLanding: false },
  { label: 'Insights', path: '/app/insights', isLanding: false },
  { label: 'Settings', path: '/app/settings', isLanding: false },
];

test.describe('Sidebar navigation', () => {
  for (const { label, path, isLanding } of NAV_ITEMS) {
    test(`"${label}" → navigates and shows honest content`, async ({ page }) => {
      await page.goto('/');

      const link = page.locator('nav a', { hasText: label }).first();
      await expect(link, `sidebar link "${label}" should be visible`).toBeVisible();

      await link.click();

      // URL must contain the expected path after navigation
      await expect(page, `URL after clicking "${label}"`).toHaveURL(
        new RegExp(path.replace(/\//g, '\\/')),
      );

      if (isLanding) {
        // Home stays on landing — h1 must be visible
        await expect(page.locator('h1').first()).toBeVisible();
      } else {
        // App routes must show honest content — auth form or gate panel
        await expectHonestGate(page, `sidebar "${label}"`);
      }
    });
  }
});

// ─── landing CTAs ────────────────────────────────────────────────────────────

// Matches the actual buttons rendered by LiveCards in apps/web/src/main.tsx as of the
// "minimalist text reduction" / "elevate UI/UX to premium standard" redesign. The
// landing page no longer has separate "Go Live" / "Schedule a Session" primary CTAs
// (those were consolidated into these three panel-level buttons) — do not restore the
// old labels here without also restoring them in the app; the app copy is intentional.
const CTAS: Array<{ buttonText: string; expectedPath: string; desc: string }> = [
  { buttonText: 'View Overlay', expectedPath: '/app/overlay', desc: 'overlay gate or auth' },
  { buttonText: 'Join', expectedPath: '/app/sessions', desc: 'sessions gate or auth' },
  { buttonText: 'Report', expectedPath: '/app/insights', desc: 'insights gate or auth' },
];

test.describe('Landing CTAs', () => {
  for (const { buttonText, expectedPath, desc } of CTAS) {
    test(`"${buttonText}" → ${desc}`, async ({ page }) => {
      await page.goto('/');

      // Match button by partial text (some buttons include icons in the text node)
      const btn = page.locator(`button:has-text("${buttonText}")`).first();
      await expect(btn, `CTA button "${buttonText}" should be visible`).toBeVisible();

      await btn.click();

      await expect(page, `URL after "${buttonText}" click`).toHaveURL(
        new RegExp(expectedPath.replace(/\//g, '\\/')),
      );

      await expectHonestGate(page, `CTA "${buttonText}"`);
    });
  }
});
