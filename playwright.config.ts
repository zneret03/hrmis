import { defineConfig, devices } from '@playwright/test';

// End-to-end / browser tests live in ./e2e. All generated output (reports,
// traces, screenshots-on-failure) goes under ./e2e/artifacts (gitignored).
// The app must be running on NEXT_PUBLIC_APP_URL (default http://localhost:3000);
// see e2e/README.md.
const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/artifacts/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Generous timeouts: Turbopack compiles each route on first navigation in dev.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    [
      'html',
      { outputFolder: 'e2e/artifacts/playwright-report', open: 'never' },
    ],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 60_000,
    actionTimeout: 20_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Reuse an already-running dev server locally; only start one if nothing is up.
  webServer: {
    command: 'yarn dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
