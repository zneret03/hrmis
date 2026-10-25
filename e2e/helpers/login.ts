import { type Page, expect } from '@playwright/test';

export const ADMIN = { username: 'hrmis_admin', password: 'Password123!' };

/**
 * Logs in through the real sign-in form (login is by username, not email) and
 * returns the admin's userId parsed from the post-login URL
 * (/backend/{userId}/dashboard). Navigating within the returned page preserves
 * the sessionStorage auth state the app relies on.
 */
export async function login(
  page: Page,
  user: { username: string; password: string } = ADMIN,
): Promise<string> {
  await page.goto('/auth/sign-in');
  await page.getByPlaceholder('username').fill(user.username);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL(/\/(backend|staff|employee)\/[^/]+\//, {
    timeout: 30_000,
  });

  const segments = new URL(page.url()).pathname.split('/');
  const userId = segments[2];
  expect(userId, 'userId should be present in the post-login URL').toBeTruthy();
  return userId;
}
