import { test } from '@playwright/test';
import path from 'node:path';
import { login } from './helpers/login';

// Current-state ("before") screenshots of the pages the Reporting spec will
// change. Saved into the action-items evidence folder so they can be embedded
// in .claude/reporting-action-items.md. See .claude/reporting/screenshots/README.md.
const SHOTS = path.resolve(__dirname, '../.claude/reporting/screenshots');

const PAGES: {
  name: string;
  path: (userId: string) => string;
  file: string;
}[] = [
  {
    name: 'dashboard',
    path: (id) => `/backend/${id}/dashboard`,
    file: '00-dashboard-current-before.png',
  },
  {
    name: 'users',
    path: (id) => `/backend/${id}/users?page=1`,
    file: '01-users-current-before.png',
  },
  {
    name: 'charts',
    path: (id) => `/backend/${id}/charts`,
    file: '02-charts-current-before.png',
  },
  {
    name: 'attendance',
    path: (id) => `/backend/${id}/attendance`,
    file: '04-attendance-current-before.png',
  },
];

test.describe('Reporting — before screenshots', () => {
  for (const p of PAGES) {
    test(`capture ${p.name}`, async ({ page }) => {
      const userId = await login(page);
      await page.goto(p.path(userId), { waitUntil: 'networkidle' });
      // Give client-fetched tables/charts a moment to paint.
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(SHOTS, p.file),
        fullPage: true,
      });
    });
  }
});
