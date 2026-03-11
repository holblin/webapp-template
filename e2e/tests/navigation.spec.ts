import { expect, test } from '@playwright/test';

test.describe('App Navigation', () => {
  test('renders home page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Template App')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Vite + React' })).toBeVisible();
  });

  test('navigates to authors page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Authors' }).click();

    await expect(page).toHaveURL(/\/authors/);
    await expect(page.getByRole('heading', { name: 'Authors' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New author' })).toBeVisible();
  });

  test('navigates to books page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Books' }).click();

    await expect(page).toHaveURL(/\/books/);
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New book' })).toBeVisible();
  });

  test('navigates to tags page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Tags' }).click();

    await expect(page).toHaveURL(/\/tags/);
    await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New tag' })).toBeVisible();
  });
});
