import { test, expect } from '@playwright/test';
import { differenceInYears } from 'date-fns';
import { login } from './helpers/login';

// Employee Service Record and the Personnel Leave Card are edited in place:
// employee picker → per-employee page → add / edit / delete directly in the
// table rows (no dialog boxes). Relies on the sample_data seed
// (Rosum, Jan = 10-023; Santos, Maria = Elected).
const ROSUM_ID = 'e0000000-0000-0000-0000-000000000001';

test('service record: picker → add, edit, delete in the table → back', async ({
  page,
}) => {
  const userId = await login(page);
  // A future-dated Casual entry never affects loyalty counts; deleted below.
  const position = `E2E Clerk ${Date.now()}`;

  await page.goto(`/backend/${userId}/service-record`);
  await page.getByPlaceholder('Search employees...').fill('rosum');
  await page.getByText('Rosum, Jan').click();
  await page.waitForURL(`**/service-record/${ROSUM_ID}`);
  await expect(page.getByText('jan.rosum@example.com')).toBeVisible();

  // Add: Save shows once the row is dirty; From after To is blocked.
  await page.getByRole('button', { name: 'Add Entry' }).click();
  await page.getByLabel('Position', { exact: true }).fill(position);
  await page.getByLabel('Status', { exact: true }).selectOption('Casual');
  await page.getByLabel('From', { exact: true }).fill('2031-01-01');
  await page.getByLabel('To', { exact: true }).fill('2030-12-31');
  await expect(
    page.getByText('From date must be on or before the To date.'),
  ).toBeVisible();
  await expect(page.getByTitle('Save entry')).toBeDisabled();
  await page.screenshot({ path: test.info().outputPath('1-sr-add.png') });

  await page.getByLabel('To', { exact: true }).fill('2031-12-31');
  await page.getByTitle('Save entry').click();
  const row = page.getByRole('row', { name: new RegExp(position) });
  await expect(row).toContainText('2031-12-31');

  // Edit: ✎ turns the row into inputs prefilled with its values.
  await row.getByRole('button', { name: 'Edit entry' }).click();
  await expect(page.getByLabel('Position', { exact: true })).toHaveValue(
    position,
  );
  await page.getByLabel('To', { exact: true }).fill('2032-06-30');
  await page.screenshot({ path: test.info().outputPath('2-sr-edit.png') });
  await page.getByTitle('Save entry').click();
  await expect(row).toContainText('2032-06-30');

  // Delete: 🗑 asks "Delete?" inline, ✓ confirms.
  await row.getByRole('button', { name: 'Delete entry' }).click();
  await expect(row.getByText('Delete?')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('3-sr-delete.png') });
  await row.getByRole('button', { name: 'Confirm delete' }).click();
  await expect(row).toHaveCount(0);

  // Never a dialog box.
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // Back returns to the employee picker.
  await page.getByRole('button', { name: 'Back' }).click();
  await page.waitForURL(`**/backend/${userId}/service-record`);
  await expect(page.getByPlaceholder('Search employees...')).toBeVisible();
});

test('leave card: add, edit, delete in the table → back', async ({ page }) => {
  const userId = await login(page);
  const remark = `E2E ${Date.now()}`;
  const currentYear = new Date().getFullYear();

  await page.goto(`/backend/${userId}/leave-card/${ROSUM_ID}`);

  // Add: an out-of-range year is blocked.
  await page.getByRole('button', { name: 'Add Entry' }).click();
  await page.getByLabel('Year', { exact: true }).fill(String(currentYear + 1));
  await page.getByLabel('Remarks', { exact: true }).fill(remark);
  await expect(
    page.getByText(`Year must be between 1900 and ${currentYear}.`),
  ).toBeVisible();
  await expect(page.getByTitle('Save entry')).toBeDisabled();

  await page.getByLabel('Year', { exact: true }).fill('2025');
  await page.getByLabel('Month', { exact: true }).selectOption('March');
  await page.getByLabel('Leave earned, vacation').fill('1.25');
  await page.getByTitle('Save entry').click();
  const row = page.getByRole('row', { name: new RegExp(remark) });
  await expect(row).toContainText('March');
  await expect(row).toContainText('1.25');

  // Edit in place; Escape cancels without saving.
  const savedText = (await row.textContent()) ?? '';
  await row.getByRole('button', { name: 'Edit entry' }).click();
  await page.getByLabel('Balance, vacation').fill('99');
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Balance, vacation')).toHaveCount(0);
  await expect(row).toHaveText(savedText);

  await row.getByRole('button', { name: 'Edit entry' }).click();
  await expect(page.getByLabel('Remarks', { exact: true })).toHaveValue(remark);
  await page.getByLabel('Balance, vacation').fill('10.5');
  await page.screenshot({ path: test.info().outputPath('4-lc-edit.png') });
  await page.getByTitle('Save entry').click();
  await expect(row).toContainText('10.5');

  // Delete with the inline confirmation.
  await row.getByRole('button', { name: 'Delete entry' }).click();
  await row.getByRole('button', { name: 'Confirm delete' }).click();
  await expect(row).toHaveCount(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('button', { name: 'Back' }).click();
  await page.waitForURL(`**/backend/${userId}/leave-card`);
});

test('loyalty list counts years from the Permanent date only', async ({
  page,
}) => {
  const userId = await login(page);
  await page.goto(`/backend/${userId}/charts`);
  await page
    .getByRole('heading', { name: 'Loyalty Award Statistics' })
    .locator('xpath=following-sibling::div[1]')
    .getByRole('button', { name: 'View' })
    .click();

  const dialog = page.getByRole('dialog');
  // Rosum has been Permanent since 2016-05-01 (first Permanent entry).
  await expect(dialog.getByRole('row', { name: /Rosum/ })).toContainText(
    String(differenceInYears(new Date(), new Date('2016-05-01'))),
  );
  // Santos is Elected only → not counted for loyalty.
  await expect(dialog.getByRole('row', { name: /Santos/ })).toHaveCount(0);
});
