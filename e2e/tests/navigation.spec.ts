import { expect, test } from '@playwright/test';

test.describe('App Navigation', () => {
  test('does not continuously reload on home page', async ({ page }) => {
    let topLevelNavigations = 0;
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        topLevelNavigations += 1;
      }
    });

    await page.goto('/');
    await page.waitForTimeout(1500);

    expect(topLevelNavigations).toBeLessThanOrEqual(2);
    await expect(page.getByRole('heading', { name: 'Build production-ready web apps faster' })).toBeVisible();
  });

  test('renders home page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Template App')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Build production-ready web apps faster' })).toBeVisible();
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
