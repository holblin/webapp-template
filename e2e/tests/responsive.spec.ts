import { expect, test } from '@playwright/test';

test.describe('Responsive Inventory UX', () => {
  test('uses mobile menu and collapses filters into dialog on phones', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/authors');

    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();

    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('heading', { name: 'Navigation' })).toBeVisible();

    await page.getByRole('tab', { name: 'Books' }).click();
    await expect(page).toHaveURL(/\/books/);
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Filters' })).toBeVisible();
    await expect(page.getByText('Title contains')).not.toBeVisible();

    await page.getByRole('button', { name: 'Filters' }).click();
    await expect(page.getByRole('heading', { name: 'Filters' })).toBeVisible();
    await expect(page.getByText('Title contains')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('heading', { name: 'Filters' })).not.toBeVisible();
  });
});
