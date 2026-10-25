import { test, expect } from '@playwright/test';
import { login } from './helpers/login';

test.describe('Auth & key admin pages (smoke)', () => {
  test('admin logs in by username and lands on the dashboard', async ({
    page,
  }) => {
    const userId = await login(page);
    await expect(page).toHaveURL(new RegExp(`/backend/${userId}/dashboard`));
  });

  test('wrong credentials do not sign in', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await page.getByPlaceholder('username').fill('hrmis_admin');
    await page.getByPlaceholder('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Login' }).click();
    // Stays on the sign-in page (no redirect into the app).
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test('charts page renders its statistics tables', async ({ page }) => {
    const userId = await login(page);
    await page.goto(`/backend/${userId}/charts`);
    await expect(
      page.getByRole('heading', { name: /Gender Statistics/i }),
    ).toBeVisible();
  });
});
